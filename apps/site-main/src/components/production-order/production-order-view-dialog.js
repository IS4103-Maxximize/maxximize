import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import {
  AppBar,
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DayJS from 'dayjs';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { PurchaseRequisitionNew } from '../../pages/procurement/purchase-requisition-new';
import { ConfirmDialog } from '../assetManagement/confirm-dialog';
import { FinalGoodsAllocationDialog } from './final-goods-allocation-dialog';
import { ViewAllocationDialog } from './view-allocation-dialog';

export const ProductionOrderViewDialog = (props) => {
  const {
    productionOrder,
    openViewDialog,
    closeViewDialog,
    handleAlertOpen,
    handleAlertClose,
    ...rest
  } = props;
  console.log(productionOrder)
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  // PR Dialog Helpers
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const handleCreateDialogOpen = () => {
    setCreateDialogOpen(true);
  };
  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
  };

  // State for confirm dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // Handle closing of dialog
  const onClose = () => {
    formik.resetForm();
    closeViewDialog();
  };

  // Handle sending of product requisition, likely open another dialog/page
  const handleSendProductRequisition = () => {
    // When ProdO status is still created, there is insufficient quantity of ProdO Line items
    // Require to send product Requisition
    handleCreateDialogOpen();
  };

  const [error, setError] = useState('');

  // Handle release of production order
  const handleRelease = async () => {
    // When the ProdO status changes to readytorelease,
    // Button to release will appear to prompt user to confirm release
    const response = await fetch(
      `http://localhost:3000/api/production-orders/${productionOrder.id}`,
      {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'released',
        }),
      }
    );

    if (response.status === 200 || response.status === 201) {
      const result = await response.json();
      handleAlertOpen(`Updated Production Order ${result.id} successfully`);
      setError('');
      onClose();
    } else {
      const result = await response.json();
      setError(result.message);
    }
  };


  // Selected Schedule Helpers
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  // Update Schedules after allocation
  const updateSchedules = (newSchedule) => {
    const updatedSchedules = formik.values.schedules.map((schedule) => {
      if (schedule.id === newSchedule.id) {
        return newSchedule;
      }
      return schedule;
    });
    formik.setFieldValue('schedules', updatedSchedules);
  }

  // Collection and allocation of Final Good
  const [allocationDialogOpen, setAllocationDialogOpen] = useState(false);
  const handleAllocationDialogOpen = () => {
    setAllocationDialogOpen(true);
  }
  const handleAllocationDialogClose = () => {
    setAllocationDialogOpen(false);
  }

  useEffect(() => {
    if (!allocationDialogOpen) {
      setSelectedSchedule(null);
    }
  }, [allocationDialogOpen])


  // View Allocated Batch
  const [viewAllocationDialogOpen, setViewAllocationDialogOpen] = useState(false);
  const handleViewAllocationDialogOpen = () => {
    setViewAllocationDialogOpen(true);
  }
  const handleViewAllocationDialogClose = () => {
    setViewAllocationDialogOpen(false);
  }

  useEffect(() => {
    if (!viewAllocationDialogOpen) {
      setSelectedSchedule(null);
    }
  }, [viewAllocationDialogOpen])


  const formik = useFormik({
    initialValues: {
      id: productionOrder ? productionOrder.id : null,
      status: productionOrder ? productionOrder.status : '',
      daily: productionOrder ? productionOrder.daily : false,
      quantity: productionOrder ? productionOrder.plannedQuantity : null,
      prodLineItems: productionOrder ? productionOrder.prodLineItems : [],
      schedules: productionOrder ? productionOrder.schedules : [],
    },
    enableReinitialize: true,
    onSubmit: handleRelease,
  });

  // Schedule Headers
  const scheduleColumns = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 1
    },
    {
      field: 'start',
      headerName: 'Start Time',
      flex: 2,
      valueFormatter: (params) =>
        DayJS(params?.value).format('DD MMM YYYY hh:mm a'),
    },
    {
      field: 'end',
      headerName: 'End Time',
      flex: 2,
      valueFormatter: (params) =>
        DayJS(params?.value).format('DD MMM YYYY hh:mm a'),
    },
    {
      field: 'status',
      headerName: 'Schedule Status',
      flex: 1
    },
    {
      field: 'productionLineId',
      headerName: 'Production Line ID',
      flex: 1,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => {
        if (params.row.status === 'completed') {
          return (
            <Button 
              variant="contained" 
              onClick={() => {
                setSelectedSchedule(params.row);
                handleAllocationDialogOpen();
              }}
            >
              {`Allocate for Schedule (${params.row.id})`}
            </Button>
          )
        }
        if (params.row.status === 'allocated') {
          return (
            <Button 
              variant="contained" 
              color="secondary"
              onClick={() => {
                setSelectedSchedule(params.row);
                handleViewAllocationDialogOpen();
              }}
            >
              {`View Allocated Goods`}
            </Button>
          )
        }
      }
    }
  ];

  const readyToReleaseScheduleColumns = [
    {
      field: 'start',
      headerName: 'Start Time',
      flex: 2,
      valueGetter: (params) => {
        return params.row ? params.row.start : '';
      },
      valueFormatter: (params) =>
        DayJS(params?.value).format('DD MMM YYYY hh:mm a'),
    },
    {
      field: 'end',
      headerName: 'End Time',
      flex: 2,
      valueGetter: (params) => {
        return params.row ? params.row.end : '';
      },
      valueFormatter: (params) =>
        DayJS(params?.value).format('DD MMM YYYY hh:mm a'),
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.quantity : '';
      },
    },
    {
      field: 'productionLineId',
      headerName: 'Production Line ID',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.productionLineId : '';
      },
    },
  ];

  // Prod Line Item Headers
  const productionOrderColumns = [
    {
      field: 'rawMaterial',
      headerName: 'Raw Material',
      flex: 2,
      valueGetter: (params) => {
        return params.row
          ? `${params.row.rawMaterial.name} [${params.row.rawMaterial.skuCode}] `
          : '';
      },
    },
    {
      field: 'quantity',
      headerName: 'Quantity Required',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.quantity : '';
      },
    },
    {
      field: 'unit',
      headerName: 'Unit',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.rawMaterial.unit : '';
      },
    },
    {
      field: 'sufficient',
      headerName: 'Sufficient Status',
      flex: 1,
      renderCell: (params) => {
        return params.row.sufficient ? (
          <CheckCircleIcon color="success" />
        ) : (
          <CancelIcon color="error" />
        );
      },
    },
  ];

  const readyToReleaseProductionOrderColumns = [
    {
      field: 'rawMaterial',
      headerName: 'Raw Material',
      flex: 2,
      valueGetter: (params) => {
        return params.row
          ? `${params.row.rawMaterial.name} [${params.row.rawMaterial.skuCode}] `
          : '';
      },
    },
    {
      field: 'quantity',
      headerName: 'Quantity Required',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.quantity : '';
      },
    },
    {
      field: 'unit',
      headerName: 'Unit',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.rawMaterial.unit : '';
      },
    },
    {
      field: 'batchId',
      headerName: 'Batch Line Item ID',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.batchLineItem?.id : '';
      },
    },
    {
      field: 'binId',
      headerName: 'Bin ID',
      flex: 1,
      valueGetter: (params) => {
        return params.row ? params.row.batchLineItem?.bin?.id : '';
      },
    },
    {
      field: 'sufficient',
      headerName: 'Sufficient Status',
      flex: 1,
      renderCell: (params) => {
        return params.row.sufficient ? (
          <CheckCircleIcon color="success" />
        ) : (
          <CancelIcon color="error" />
        );
      },
    },
  ];

  useEffect(() => {
    if (openViewDialog) console.log(productionOrder)
  }, [openViewDialog])

  return (
    <form onSubmit={formik.handleSubmit}>
      <ConfirmDialog
        open={confirmDialogOpen}
        handleClose={() => setConfirmDialogOpen(false)}
        dialogTitle={`Release Production Order`}
        dialogContent={`Confirm release of production order?`}
        dialogAction={handleRelease}
      />
      <PurchaseRequisitionNew
        key="purchase-req-new"
        open={createDialogOpen}
        handleClose={handleCreateDialogClose}
        string={'Purchase Requisition'}
        prodOrderId={productionOrder ? productionOrder.id : ''}
        prodLineItems={formik.values.prodLineItems}
        handleAlertOpen={handleAlertOpen}
        handleAlertClose={handleAlertClose}
        closeViewDialog={closeViewDialog}
      />
      <FinalGoodsAllocationDialog
        open={allocationDialogOpen}
        handleClose={handleAllocationDialogClose}
        productionOrder={productionOrder}
        schedule={selectedSchedule}
        handleAlertOpen={handleAlertOpen}
        handleAlertClose={handleAlertClose}
        updateSchedules={updateSchedules}
      />
      <ViewAllocationDialog
        open={viewAllocationDialogOpen}
        handleClose={handleViewAllocationDialogClose}
        schedule={selectedSchedule}
        handleAlertOpen={handleAlertOpen}
        handleAlertClose={handleAlertClose}
      />
      <Dialog fullScreen open={openViewDialog} onClose={onClose}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={onClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              View Production Order
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent sx={{ backgroundColor: '#F9FAFC' }}>
          <Box display="flex">
            <Box width="100%">
              <Typography Typography variant="h6">Final Good Info</Typography>
              <Card sx={{ my: 2 }}>
                <TextField
                  sx={{ ml: 2, width: 150 }}
                  margin="normal"
                  label="Final Good Name"
                  value={productionOrder ? productionOrder.bom.finalGood.name : ''}
                  disabled
                />
                <TextField
                  sx={{ ml: 1, width: 150 }}
                  margin="normal"
                  label="SKU"
                  value={productionOrder ? productionOrder.bom.finalGood.skuCode : ''}
                  disabled
                />
                <TextField
                  sx={{ ml: 1, width: 300 }}
                  margin="normal"
                  label="Planned Production Quantity"
                  value={productionOrder ? 
                    productionOrder.plannedQuantity * productionOrder.bom.finalGood.lotQuantity : ''}
                  disabled
                />
              </Card>
              <Typography variant="h6">Schedule(s)</Typography>
              <Card sx={{ my: 2 }}>
                <DataGrid
                  autoHeight
                  rows={formik.values.schedules}
                  columns={
                    productionOrder?.status === 'readytorelease'
                      ? readyToReleaseScheduleColumns
                      : scheduleColumns
                  }
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  disableSelectionOnClick
                  sx={{ marginLeft: 1, marginRight: 1, marginBottom: 1 }}
                />
              </Card>
              <Typography sx={{ marginTop: 2 }} variant="h6">
                Production Line Items
              </Typography>
              <Card sx={{ my: 2 }}>
                <DataGrid
                  autoHeight
                  rows={formik.values.prodLineItems}
                  columns={
                    productionOrder?.status === 'created' ||
                    productionOrder?.status === 'awaitingprocurement'
                      ? productionOrderColumns
                      : readyToReleaseProductionOrderColumns
                  }
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  disableSelectionOnClick
                  sx={{ marginLeft: 1, marginRight: 1, marginBottom: 1 }}
                />
              </Card>
              <Typography variant="body1" color="red">
                {error}
              </Typography>

              <Box display="flex" justifyContent="flex-end">
                {productionOrder?.status === 'created' ? (
                  <Button
                    variant="contained"
                    onClick={handleSendProductRequisition}
                  >
                    Send Purchase Requisition
                  </Button>
                ) : (
                  <></>
                )}

                {productionOrder?.status === 'readytorelease' ? (
                  <Button variant="contained" onClick={handleRelease}>
                    Release
                  </Button>
                ) : (
                  <></>
                )}
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </form>
  );
};
