import { Box, Button, Container, Typography } from '@mui/material';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { NotificationAlert } from '../components/notification-alert';
import { OnboardClientDialog } from '../components/onboarding/onboard-client-dialog';

const Onboarding = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  // NotificationAlert helpers
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertText, setAlertText] = useState();
  const [alertSeverity, setAlertSeverity] = useState('success');
  const handleAlertOpen = (text, severity) => {
    setAlertText(text);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };
  const handleAlertClose = () => {
    setAlertOpen(false);
    setAlertText(null);
    setAlertSeverity('success');
  };

  // Dialog helpers
  const [action, setAction] = useState();

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  //Handling onboarding of client
  const onboardClient = (client) => {
    handleAlertOpen(`Added Client ${client.id} successfully!`, 'success');
  };

  //Onboard client button
  const handleOnboardClientClick = () => {
    setAction('POST');
  };

  return (
    <>
      <Helmet>
        <title>{`Onboarding | ${user?.organisation?.name}`}</title>
      </Helmet>
      <NotificationAlert
        open={alertOpen}
        severity={alertSeverity}
        text={alertText}
        handleClose={handleAlertClose}
      />
      <OnboardClientDialog
        action={action}
        open={open}
        handleClose={handleClose}
        onboardClient={onboardClient}
        handleAlertOpen={handleAlertOpen}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 4,
          pb: 4,
        }}
      >
        <Container maxWidth={false}>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              m: -1,
            }}
          >
            <Typography sx={{ m: 1 }} variant="h4">
              Onboarding
            </Typography>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Button
              color="success"
              variant="contained"
              onClick={() => {
                handleOnboardClientClick();
                handleClickOpen();
              }}
            >
              Onboard New Organisation
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Onboarding;
