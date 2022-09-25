import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import {
  updateProductionLine,
  fetchFinalGood,
} from '../../helpers/assetManagement';
import { DateTimePicker } from '@mui/x-date-pickers';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export const ProductionLineManagementDialog = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  const {
    action, 
    open,
    handleClose,
    productionLine,
    addProductionLine,
    handleAlertOpen,
    selectedRow,
  } = props;

  const [error, setError] = useState('');

  const initialValues = {
    id: productionLine ? productionLine.id : null,
    name: productionLine ? productionLine.name : null,
    description: productionLine ? productionLine.description : null,
    isAvailable: productionLine ? productionLine.isAvailable : false,
    finalGood: productionLine ? productionLine.finalGood : null,
    lastStopped: productionLine ? productionLine.lastStopped : "",
    changeOverTime: productionLine ? productionLine.changeOverTime : null,
    nextAvailableDateTime: productionLine ? productionLine.nextAvailableDateTime : null,
    productionCostPerLot: productionLine ? productionLine.productionCostPerLot : null,
  };

  let schema = {
    name: Yup.string().max(255, "Production Line Name should be less than 255 characters").required('Name is required'),
    description: Yup.string(),
    // lastStopped:Yup.date().required('Date and Time is required'),
    // finalGood: Yup.string().required('Final Good Produced is required'),
    changeOverTime: Yup.number().required('Changeover time is required').positive('Change Over Time Cost has to be more than 0'),
    productionCostPerLot: Yup.number().required('Production Cost Per Lot is required').positive('Production Cost has to be more than 0'),
  };

  const handleOnSubmit = async () => {
    console.log("Submit")
    if (action === 'POST') {
      console.log("Create")
      const response = await fetch('http://localhost:3000/api/production-lines', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formik.values.name,
          description: formik.values.description,
          changeOverTime: formik.values.changeOverTime,
          productionCostPerLot: formik.values.productionCostPerLot,
          finalGoodId: selectedFinalGood,
          // lastStopped: selectedDate.toJSON()
        }),
      });
  
      if (response.status === 200 || response.status === 201) {
        const result = await response.json();
  
        addProductionLine(result);
        handleAlertOpen(`Production Line ${result.id} successfully`);
        setError('');
        onClose();
      }
      else {
        const result = await response.json();
        setError(result.message);
      }
    } else if (action === 'PATCH') {
      console.log(selectedRow)
        const response = await fetch(`http://localhost:3000/api/production-lines/${selectedRow.id}`, {
            method: 'PATCH',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                  name: formik.values.name,
                  description: formik.values.description,
                  changeOverTime: formik.values.changeOverTime,
                  productionCostPerLot: formik.values.productionCostPerLot,
                  finalGoodId: selectedFinalGood,
                }),
              });
              if (response.status === 200 || response.status === 201) {
                const result = await response.json();
                console.log(result)
                updateProductionLine(result)
                handleAlertOpen(`Updated Production Line ${result.id} successfully`);
                setError('');
                onClose();
              }
              else {
                const result = await response.json();
                setError(result.message);
              } 
    };
  
      
    };
    

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object(schema),
    onSubmit: handleOnSubmit,
  });

  const onClose = () => {
    console.log("Close Dialog")
    formik.resetForm();
    handleClose();
  };

  const [selectedDate, handleDateChange] = useState(new Date());
  const [selectedFinalGood, setSelectedFinalGood] = useState([]);
  const [finalGoodOptions, setFinalGoodOptions] = useState([]);

  const fetchData = async () => {
    const finalGoods = await fetchFinalGood(user.organisation.id);
    console.log(finalGoods)
    setFinalGoodOptions(finalGoods);
  };

  useEffect(() => {
    if (action === 'POST') {
      fetchData();
    }
  },[open]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedFinalGood(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>
          {action === 'POST' && 'Add '}
          {action === 'PATCH' && 'Edit '}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter Production Line Details
          </DialogContentText>
          <TextField
            required
            error={Boolean(formik.touched.name && formik.errors.name)}
            fullWidth
            helperText={formik.touched.name && formik.errors.name}
            label="Name"
            margin="normal"
            name="name"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.name}
            variant="outlined"
            disabled={action === 'PATCH'}
          />
          <TextField
            error={Boolean(
              formik.touched.description && formik.errors.description
            )}
            fullWidth
            helperText={formik.touched.description && formik.errors.description}
            label="Description"
            margin="normal"
            name="description"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.description}
            variant="outlined"
          />
          <Stack direction="row" spacing={1} alignItems="center">
              <Typography>Last Stopped :</Typography>
            <DateTimePicker
            label="Last Stopped"
            inputVariant="outlined"
            value={selectedDate}
            renderInput={(props) => <TextField {...props} />}
            onChange={handleDateChange}
            />
            </Stack>
           <Stack direction="row" spacing={1} alignItems="center">
            <Typography>Final Good Produced :</Typography>
            <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="finalGoodLabel">Final Good Id</InputLabel>
            <Select
              labelId="finalGoodLabel"
              id="finalGood"
              value={selectedFinalGood}
              onChange={handleChange}
              input={<OutlinedInput label="Final Good" />}
              MenuProps={MenuProps}
            >
              {finalGoodOptions.map(option => (
                <MenuItem
                  key={option.id}
                  value={option.id}
                >
                  {option.name}
                </MenuItem>
              ))}
          </Select>
          </FormControl>
          </Stack> 

          <TextField
            required
            error={Boolean(formik.touched.changeOverTime && formik.errors.changeOverTime)}
            fullWidth
            helperText={formik.touched.changeOverTime && formik.errors.changeOverTime}
            label="Change Over Time in Milliseconds"
            margin="normal"
            name="changeOverTime"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="number"
            value={formik.values.changeOverTime}
            variant="outlined"
          />
          <TextField
            required
            error={Boolean(formik.touched.productionCostPerLot && formik.errors.productionCostPerLot)}
            fullWidth
            helperText={formik.touched.productionCostPerLot && formik.errors.productionCostPerLot}
            label="Production Cost Per Lot"
            margin="normal"
            name="productionCostPerLot"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="number"
            value={formik.values.productionCostPerLot}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button
            disabled={!formik.isValid || formik.isSubmitting}
            variant="contained"
            onClick={formik.handleSubmit}
          >
            Submit
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};
