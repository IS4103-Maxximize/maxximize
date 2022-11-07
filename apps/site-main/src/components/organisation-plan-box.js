import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { Box, Link, Skeleton, Stack, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { apiHost, requestOptionsHelper } from '../helpers/constants';
import { SeverityPill } from './severity-pill';


export const OrganisationPlanBox = (props) => {
  const {
    user,
    ...rest
  } = props;

  const [sessionUrl, setSessionUrl] = useState();
  const [plan, setPlan] = useState()
  // const user = JSON.parse(localStorage.getItem('user'));

  // Set color and text for plan
  const getPlan = () => {
    let plan = null;
    if (user.organisation?.membership?.status === 'active') {
      switch(user.organisation?.membership?.plan) {
        case 'pro':
          plan = ['pro', 'primary'];
          break;
        case 'basic':
          plan = ['basic', 'secondary'];
          break;
        default:
          plan = ['none', 'draft'];
          break;
      }
    }
    setPlan(plan);
  }

  // Get Customer Portal Session URL
  const getSessionUrl = async () => {
    const body = JSON.stringify({
      customerId: user.organisation?.membership?.customerId,
      returnUrl: 'http://127.0.0.1:4200/'
    });
  
    const requestOptions = requestOptionsHelper('POST', body);
  
    await fetch(`${apiHost}/stripe/create-customer-portal-session`, requestOptions)
      .then(response => response.json())
      .then(result => setSessionUrl(result.url))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    if (user.organisation?.membership) {
      getPlan();
      getSessionUrl();
    }
  }, [user])

  return (
    <Box
      sx={{
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        // cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        px: 2,
        py: '11px',
        borderRadius: 1,
      }}
    >
      <Stack direction="row" spacing={1}>
        <Typography color="inherit" variant="subtitle1">
          {user?.organisation?.name}
        </Typography>
        {plan ? <SeverityPill color={plan[1]}>{plan[0]}</SeverityPill> : <Skeleton />}
      </Stack>
      
      {sessionUrl ? 
        <Link
          href={sessionUrl}
        >
          <Tooltip title="Customer Portal" placement='right'>
            <ManageAccountsIcon
              sx={{
                color: 'neutral.500',
                width: 20,
                height: 20,
              }}
            />
          </Tooltip>
        </Link>
        : <Skeleton sx={{ bgcolor: "grey.500" }} variant="circular" width={20} height={20}/>
      }
    </Box>
  )
}