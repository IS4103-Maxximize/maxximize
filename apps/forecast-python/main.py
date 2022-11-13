from flask import Flask, request
from pmdarima import model_selection
import pandas as pd
from dateutil import parser
import pmdarima as pm

app = Flask(__name__)


@app.route("/demand-forecast", methods = ['POST'])
def get_demand_forecast():
    # Process json
    json = request.json
    num_of_months = int(json['numOfMonths'])
    df_data = pd.DataFrame(json['data'])
    seasonality = json['seasonality']

    # Convert data into pandas series with index of date
    data = pd.Series(df_data['value'].to_numpy(), index=df_data['date'])

    # Split data into train test period with 8/2 split
    train, test = model_selection.train_test_split(data, test_size=0.2)

    data_json = []

    # Add train data into array to be return
    for index, entry in train.items():
        date_obj = parser.isoparse(index)
        data_json.append({
            "date": str(date_obj.month) + "/" + str(date_obj.year),
            "val": int(entry),
        })

    # Auto arima modelling
    if seasonality:
        model = pm.auto_arima(train, start_p=1, start_q=1,
                               test='adf',  # use adftest to find optimal 'd'
                               m=12,  # frequency of series
                               d=None,  # let model determine 'd'
                               seasonal=True,  # No Seasonality
                               D=0,
                               trace=True,
                               error_action='ignore',
                               suppress_warnings=True)
    else:
        model = pm.auto_arima(train,
                              test='adf',  # use adftest to find optimal 'd'
                              d=None,  # let model determine 'd'
                              seasonal=False,  # No Seasonality
                              trace=True,
                              error_action='ignore',
                              suppress_warnings=True)

    # Predict using model with test data and number of months into future
    outcome, confidence_interval = model.predict(n_periods=test.shape[0] + num_of_months, return_conf_int=True)

    # Convert confidence interval to dataframe
    df_test = pd.DataFrame(confidence_interval, outcome.index)

    # Add predicted values and date into dataframe
    df_test['Prediction'] = outcome.values
    df_test['Date'] = outcome.index

    # Convert dataframe to list
    data_list = df_test.values.tolist()

    # Convert test data from series to list
    test_arr = test.values.tolist()

    # Add test value and predicted value into return array
    counter = 0
    for idx in range(len(test_arr)):
        arr = data_list[idx]
        date_obj = arr[3].date()
        data_json.append({
            "date": str(date_obj.month) + "/" + str(date_obj.year),
            "val": round(arr[2]),
            "bound": [round(arr[0]), round(arr[1])],
            "test": test_arr[idx]
        })
        counter += 1

    # Add remaining data (rest of months for prediction) into return array
    for idx in range(counter, len(data_list)):
        arr = data_list[idx]
        date_obj = arr[3].date()
        data_json.append({
            "date": str(date_obj.month) + "/" + str(date_obj.year),
            "val": round(arr[2]),
            "bound": [round(arr[0]), round(arr[1])],
        })

    return data_json
