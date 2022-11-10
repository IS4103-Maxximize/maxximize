import { Grid } from '@mui/material';
import { Budget } from '../../components/financeDashboard/throughput';
import { TasksProgress } from '../../components/financeDashboard/tasks-progress';
import { TotalCustomers } from '../../components/financeDashboard/yield';
import { TotalProfit } from '../../components/financeDashboard/total-profit';
import { TrafficByDevice } from '../../components/financeDashboard/traffic-by-device';
import { BatchItemsDay } from '../../components/dashboards/batch-items-day';

const WorkerDashboard = (props) => {
  const {
    user,
    handleAlertOpen,
    ...rest
  } = props;

  return (
    <>
      <Grid item lg={3} sm={6} xl={3} xs={12}>
        <Budget />
      </Grid>
      <Grid item xl={3} lg={3} sm={6} xs={12}>
        <TotalCustomers />
      </Grid>
      <Grid item xl={3} lg={3} sm={6} xs={12}>
        <TasksProgress />
      </Grid>
      <Grid item xl={3} lg={3} sm={6} xs={12}>
        <TotalProfit sx={{ height: '100%' }} />
      </Grid>

      <Grid item lg={8} md={12} xl={9} xs={12}>
        <BatchItemsDay 
          user={user}
          handleAlertOpen={handleAlertOpen}
        />
      </Grid>

      <Grid item lg={4} md={6} xl={3} xs={12}>
        <TrafficByDevice sx={{ height: '100%' }} />
      </Grid>
      
      {/* <Grid item lg={4} md={6} xl={3} xs={12}>
        <LatestProducts sx={{ height: '100%' }} />
      </Grid>
      <Grid item lg={8} md={12} xl={9} xs={12}>
        <LatestOrders />
      </Grid> */}
    </>
  );
};

export default WorkerDashboard;
