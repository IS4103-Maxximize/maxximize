import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import * as Yup from 'yup';
// import { BOMCreateDialog } from '../components/bom/bom-create-dialog';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import EditIcon from '@mui/icons-material/Edit';
import { ConfirmDialog } from '../components/confirm-dialog';
import { DashboardLayout } from '../components/dashboard-layout';
import { NotificationAlert } from '../components/notification-alert';
import { SimpleToolbar } from '../components/simple-toolbar';
import { apiHost, requestOptionsHelper } from '../helpers/constants';

export const RevenueBrackets = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user ? user.organisation.id : null;
  const baseUrl = `${apiHost}/revenue-brackets`;

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

  const [brackets, setBrackets] = useState([]);
  const [rates, setRates] = useState([]);

  const getRevenueBrackets = async () => {
    await fetch(baseUrl)
      .then((res) => res.json())
      .then((result) => {
        const sorted = result.slice().sort((a, b) => b.start - a.start);
        const rates = sorted.map((item) => item.commisionRate);
        setRates(rates);
        setBrackets(sorted);
      })
      .catch((err) =>
        handleAlertOpen('Unable to fetch Revenue Brackets', 'error')
      );
  };

  useEffect(() => {
    getRevenueBrackets();
  }, []);

  // Toolbar Helpers

  // Create Dialog Helpers
  const [createCardOpen, setCreateCardOpen] = useState(false);
  const toggleCreateCardOpen = () => {
    setCreateCardOpen(!createCardOpen);
  };
  const handleCreateCardOpen = () => {
    setCreateCardOpen(true);
  };
  const handleCreateCardClose = () => {
    setCreateCardOpen(false);
  };

  // ConfirmDialog Helpers
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const handleConfirmDialogOpen = () => {
    setConfirmDialogOpen(true);
  };
  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  };

  // Delete Revenue Bracket
  const handleDelete = async () => {
    const deleteUrl = `${baseUrl}/${formik.values.id}`;

    const updateUrl = `${baseUrl}/${brackets[1].id}`;
    const updateBody = JSON.stringify({
      end: null,
    });
    const updateRequestOptions = requestOptionsHelper('PATCH', updateBody);

    const deleteRevenueBracket = fetch(deleteUrl, { method: 'DELETE' }).then(
      (res) => res.json()
    );
    const updateRevenueBracket = fetch(updateUrl, updateRequestOptions).then(
      (res) => res.json()
    );

    await Promise.all([deleteRevenueBracket, updateRevenueBracket])
      .then((values) => {
        getRevenueBrackets();
        handleAlertOpen('Successfully deleted Revenue Bracket!', 'success');
      })
      .catch((err) =>
        handleAlertOpen('Failed to delete Revenue Bracket', 'error')
      );
  };

  const handleUpdate = async (only) => {
    const url = `${baseUrl}/${formik.values.id}`;
    const body = JSON.stringify({
      start: formik.values.start,
      commisionRate: formik.values.commisionRate,
    });
    const requestOptions = requestOptionsHelper('PATCH', body);
    const updateBracket = fetch(url, requestOptions).then((res) => res.json());

    const promises = [updateBracket];

    // If more than 1 bracket, also update the bracket below
    if (!only) {
      const belowUrl = `${baseUrl}/${brackets[1].id}`;
      const belowBody = JSON.stringify({
        end: formik.values.start - 1,
      });
      const belowRequestOptions = requestOptionsHelper('PATCH', belowBody);
      const updateBracketBelow = fetch(belowUrl, belowRequestOptions);
      promises.push(updateBracketBelow);
    }

    await Promise.all(promises)
      .then((values) => {
        getRevenueBrackets();
        handleAlertOpen('Sucessfully updated Revenue Bracket!', 'success');
      })
      .catch((err) =>
        handleAlertOpen('Failed to update Revenue Bracket', 'error')
      );
  };

  const handleCreate = async () => {
    const createBody = JSON.stringify({
      start: formik.values.newStart,
      end: null,
      commisionRate: formik.values.newCommisionRate,
    });
    const createRequestOptions = requestOptionsHelper('POST', createBody);

    const updateUrl = `${baseUrl}/${formik.values.id}`;
    const updateBody = JSON.stringify({
      end: formik.values.newStart - 1,
    });
    const updateRequestOptions = requestOptionsHelper('PATCH', updateBody);

    const createRevenueBracket = fetch(baseUrl, createRequestOptions).then(
      (res) => res.json()
    );
    const updateRevenueBracket = fetch(updateUrl, updateRequestOptions).then(
      (res) => res.json()
    );

    await Promise.all([createRevenueBracket, updateRevenueBracket])
      .then((values) => {
        handleCreateCardClose();
        getRevenueBrackets();
        handleAlertOpen('Successfully created Revenue Bracket!', 'success');
      })
      .catch((err) =>
        handleAlertOpen('Failed to create Revenue Bracket', 'error')
      );
  };

  const formik = useFormik({
    initialValues: {
      // Top Revenue Bracket
      id: brackets.length > 0 ? brackets[0].id : null,
      start: brackets.length > 0 ? brackets[0].start : null,
      commisionRate: brackets.length > 0 ? brackets[0].commisionRate : null,
      // New Revenue Bracket
      newStart: brackets.length > 0 ? brackets[0].start + 5000 : null,
      newCommisionRate: brackets.length > 0 ? brackets[0].commisionRate + 1 : 0,
    },
    validationSchema: Yup.object({
      start: Yup.number()
        .positive('Starting Amount must be positive')
        .min(
          brackets.length > 0
            ? brackets.length === 1
              ? 1
              : brackets[1].start + 1000
            : 1,
          'Starting Amount must be at least $1, or $1000 more than previous bracket'
        )
        .required('Starting Amount is required'),
      commisionRate: Yup.number()
        .min(0, 'Commission cannot be negative')
        .required('Commission Rate is required'),
      newStart: Yup.number()
        .positive('Starting Amount must be positive')
        .min(
          brackets.length > 0 ? brackets[0].start + 1000 : 1,
          'Starting Amount must be at least $1, or $1000 more than previous bracket'
        )
        .required('Starting Amount is required'),
      newCommisionRate: Yup.number()
        .min(0, 'Commission cannot be negative')
        .required('Commission Rate is required'),
    }),
    enableReinitialize: true,
  });

  const updateCommission = async (id, newRate) => {
    const url = `${baseUrl}/${id}`;
    const body = JSON.stringify({
      commisionRate: newRate,
    });
    const requestOptions = requestOptionsHelper('PATCH', body);

    await fetch(url, requestOptions)
      .then((res) => res.json())
      .then((result) => {
        getRevenueBrackets();
        handleAlertOpen('Successfully updated Commission Rate!', 'success');
      })
      .catch((err) =>
        handleAlertOpen('Failed to update Commission Rate', 'error')
      );
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>
            Revenue Brackets
            {user && ` | ${user?.organisation?.name}`}
          </title>
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
          <SimpleToolbar
            key="toolbar"
            name={'Revenue Brackets'}
            open={createCardOpen}
            handleToggle={toggleCreateCardOpen}
          />
          <ConfirmDialog
            open={confirmDialogOpen}
            handleClose={handleConfirmDialogClose}
            dialogTitle={`Delete Revenue Bracket`}
            dialogContent={`Confirm deletion of Revenue Bracket?`}
            dialogAction={() => {
              handleDelete();
            }}
          />
          {/* <form onSubmit={formik.handleSubmit}> */}
          <Box
            sx={{
              mt: 3,
              textAlign: 'center',
            }}
          >
            {createCardOpen && (
              <Card
                sx={{
                  mb: 2,
                }}
              >
                <CardHeader
                  title="Add Revenue Bracket"
                  action={
                    <Button
                      variant="contained"
                      onClick={handleCreate}
                      disabled={formik.isSubmitting || !formik.isValid}
                    >
                      Submit
                    </Button>
                  }
                />
                <Divider />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        error={Boolean(
                          formik.touched.newStart && formik.errors.newStart
                        )}
                        helperText={
                          formik.touched.newStart && formik.errors.newStart
                        }
                        label="Starting Amount"
                        margin="normal"
                        name="newStart"
                        type="number"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.newStart}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        error={Boolean(
                          formik.touched.newCommisionRate &&
                            formik.errors.newCommisionRate
                        )}
                        helperText={
                          formik.touched.newCommisionRate &&
                          formik.errors.newCommisionRate
                        }
                        label="Commission Rate (%)"
                        margin="normal"
                        name="newCommisionRate"
                        type="number"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.newCommisionRate}
                        variant="outlined"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">%</InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}
            {brackets.length > 0 ? (
              brackets.map((bracket, index) => (
                <>
                  <Card
                    sx={{
                      mb: 2,
                    }}
                  >
                    {index === 0 && !createCardOpen && (
                      <>
                        <CardHeader
                          title="Edit Revenue Bracket"
                          action={
                            <>
                              <Button
                                color="primary"
                                onClick={() =>
                                  handleUpdate(brackets.length === 1)
                                }
                                endIcon={<EditIcon />}
                                disabled={
                                  formik.isSubmitting || !formik.isValid
                                }
                              >
                                Update
                              </Button>
                              {brackets.length > 1 && (
                                <IconButton
                                  color="error"
                                  onClick={handleConfirmDialogOpen}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              )}
                            </>
                          }
                        />
                        <Divider />
                      </>
                    )}
                    <CardContent>
                      <Grid container spacing={2} alignItems="center">
                        {index === 0 && (
                          <>
                            <Grid item md={4} xs={12}>
                              <TextField
                                fullWidth
                                error={Boolean(
                                  formik.touched.start && formik.errors.start
                                )}
                                helperText={
                                  formik.touched.start && formik.errors.start
                                }
                                label="Starting Amount"
                                margin="normal"
                                name="start"
                                type="number"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.start}
                                variant="outlined"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      $
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </Grid>
                            <Grid item md={4} xs={12}>
                              <TextField
                                disabled
                                fullWidth
                                error={Boolean(
                                  formik.touched.end && formik.errors.end
                                )}
                                helperText={
                                  formik.touched.end && formik.errors.end
                                }
                                label="Ending Amount"
                                margin="normal"
                                name="end"
                                type="number"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.end}
                                variant="outlined"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      $
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </Grid>
                            <Grid item md={4} xs={12}>
                              <TextField
                                fullWidth
                                error={Boolean(
                                  formik.touched.commisionRate &&
                                    formik.errors.commisionRate
                                )}
                                helperText={
                                  formik.touched.commisionRate &&
                                  formik.errors.commisionRate
                                }
                                label="Commission Rate (%)"
                                margin="normal"
                                name="commisionRate"
                                type="number"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.commisionRate}
                                variant="outlined"
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      %
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </Grid>
                          </>
                        )}
                        {index > 0 && (
                          <>
                            <Grid item md={4} xs={12}>
                              <TextField
                                fullWidth
                                disabled
                                label="Starting Amount"
                                margin="normal"
                                name="start"
                                type="number"
                                value={bracket.start}
                                variant="outlined"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      $
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </Grid>
                            <Grid item md={4} xs={12}>
                              <TextField
                                fullWidth
                                disabled
                                label="Ending Amount"
                                margin="normal"
                                name="end"
                                type="number"
                                value={bracket.end}
                                variant="outlined"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      $
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </Grid>
                            <Grid item md={3} xs={10}>
                              <TextField
                                fullWidth
                                // disabled
                                label="Commission Rate (%)"
                                margin="normal"
                                name="commisionRate"
                                type="number"
                                value={rates[index]}
                                variant="outlined"
                                onChange={(event) =>
                                  setRates(
                                    rates.map((item, idx) =>
                                      index === idx ? event.target.value : item
                                    )
                                  )
                                }
                                InputProps={{
                                  inputProps: { min: 0, max: 100 },
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      %
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </Grid>
                            {/* For Updating of commission if have time */}
                            <Grid item md={1} xs={2}>
                              <Button
                                onClick={() => {
                                  updateCommission(bracket.id, rates[index]);
                                }}
                              >
                                Update %
                              </Button>
                            </Grid>
                          </>
                        )}
                      </Grid>
                    </CardContent>
                  </Card>
                  {index < brackets.length - 1 && (
                    <KeyboardDoubleArrowDownIcon />
                  )}
                </>
              ))
            ) : (
              <Card
                variant="outlined"
                sx={{
                  textAlign: 'center',
                }}
              >
                <CardContent>
                  <Typography>{`No Revenue Brackets Found`}</Typography>
                </CardContent>
              </Card>
            )}
          </Box>
          {/* </form> */}
        </Container>
      </Box>
    </>
  );
};

RevenueBrackets.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default RevenueBrackets;
