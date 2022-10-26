import { Grid } from '@mui/material';
import { Budget } from '../../components/dashboard/budget';
import { TasksProgress } from '../../components/dashboard/tasks-progress';
import { TotalCustomers } from '../../components/dashboard/total-customers';
import { TotalProfit } from '../../components/dashboard/total-profit';
import { TrafficByDevice } from '../../components/dashboard/traffic-by-device';
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
