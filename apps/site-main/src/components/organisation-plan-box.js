import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Box, Link, Skeleton, Stack, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getSessionUrl } from '../helpers/stripe';
import { SeverityPill } from './severity-pill';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';


export const OrganisationPlanBox = (props) => {
  const [sessionUrl, setSessionUrl] = useState();
  const [plan, setPlan] = useState()
  const user = JSON.parse(localStorage.getItem('user'));

  // Set color and text for plan
  const getPlan = () => {
    let plan
    if (user.organisation?.membership?.status === 'active') {
      switch(user.organisation?.membership?.plan) {
        case 'pro':
          plan = ['pro', 'primary'];
          break;
        case 'basic':
          plan = ['basic', 'draft'];
          break;
        default:
          plan = ['none', 'error'];
          break;
      }
    } else {
      plan = ['none', 'error']
    }
    setPlan(plan);
  }

  useEffect(() => {
    getSessionUrl(user, setSessionUrl);
    getPlan();
  }, [])

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
          target='_blank'
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