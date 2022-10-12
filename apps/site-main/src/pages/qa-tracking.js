import {
  Box,
  Card,
  CardContent,
  Container,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { DashboardLayout } from '../components/dashboard-layout'
import { NotificationAlert } from '../components/notification-alert';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import { QATrackingToolbar } from '../components/quality-assurance/qa-tracking-toolbar';


export const QATracking = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user ? user.organisation.id : null;
  const name = 'Batch Tracking';

  const [loading, setLoading] = useState(true); // loading upon entering page


  // Alert Helpers
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('error'); // success || error
  const [alertText, setAlertText] = useState('');
  const handleAlertOpen = (text, severity) => {
    setAlertSeverity(severity);
    setAlertText(text);
    setAlertOpen(true);
  };
  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  // Tree View Helpers
  const [batch, setBatch] = useState(null);


  // Toolbar Helpers
  // Searchbar
  const [search, setSearch] = useState('');
  const handleSearch = (event) => {
    setSearch(event.target.value.trim());
    // fetch batch based on search
    // setLoading(true)
    // setBatch(batch)
  };

  const clearSearch = () => {
    setBatch(null);
    setSearch('');
  }


  // Create Dialog Helpers
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const handleCreateDialogOpen = () => {
    setCreateDialogOpen(true);
  };
  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
  };


  // ConfirmDialog Helpers
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const handleConfirmDialogOpen = () => {
    setConfirmDialogOpen(true);
  };
  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`${name} | ${user?.organisation?.name}`}</title>
        </Helmet>
      </HelmetProvider>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 4,
          pb: 4,
        }}
      >
        <Container maxWidth={false}>
          <NotificationAlert
            key="notification-alert"
            open={alertOpen}
            severity={alertSeverity}
            text={alertText}
            handleClose={handleAlertClose}
          />
          <QATrackingToolbar
            key="toolbar"
            name={name}
            search={search}
            setSearch={setSearch}
            handleSearch={handleSearch}
            clearSearch={clearSearch}
            handleConfirmDialogOpen={handleConfirmDialogOpen}
          />
          <Box
            sx={{
              mt: 3,
            }}
          >
            {batch ? (
              // <TreeView
              //   aria-label="controlled"
              //   defaultCollapseIcon={<ExpandMoreIcon />}
              //   defaultExpandIcon={<ChevronRightIcon />}
              //   expanded={expanded}
              //   selected={selected}
              //   onNodeToggle={handleToggle}
              //   onNodeSelect={handleSelect}
              //   multiSelect
              // >
              // </TreeView>
              <Typography>There is a batch</Typography>
            ) : (
              <Card
                variant="outlined"
                sx={{
                  textAlign: 'center',
                }}
              >
                <CardContent>
                  <Typography>{`No Batch Selected`}</Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

QATracking.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default QATracking;
