import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Box, Link, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { apiHost, requestOptionsHelper } from "../helpers/constants";

export const OrganisationPlanBox = (props) => {
  const {
    user,
    ...rest
  } = props;

  const [sessionUrl, setSessionUrl] = useState();

  const getSessionUrl = async () => {
    const body = JSON.stringify({
      customerId: 'cus_MiefpdVXlVIEwa',
      returnUrl: 'http://127.0.0.1:4200/'
    });

    const requestOptions = requestOptionsHelper('POST', body);

    const customerPortalSession = await
      fetch(`${apiHost}/stripe/create-customer-portal-session`, requestOptions).then(response => response.json());
    // console.log(customerPortalSession.url);
    setSessionUrl(customerPortalSession.url);
  }

  useEffect(() => {
    getSessionUrl();
  }, [])

  return (
    <Box
      sx={{
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        // cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        px: 3,
        py: '11px',
        borderRadius: 1,
      }}
    >
      <div>
        <Typography color="inherit" variant="subtitle1">
          {user?.organisation?.name}
        </Typography>
        <Typography color="neutral.400" variant="body2">
          Your tier : Premium
        </Typography>
      </div>
      {/* <SelectorIcon
        sx={{
          color: 'neutral.500',
          width: 14,
          height: 14,
        }}
      /> */}
      {sessionUrl ? 
        <Link
          href={sessionUrl}
        >
          <OpenInNewIcon
            sx={{
              color: 'neutral.500',
              width: 20,
              height: 20,
            }}
          />
        </Link>
      : <Skeleton sx={{ bgcolor: "grey.500" }} variant="circular" width={20} height={20}/>
      }
    </Box>
  )
}