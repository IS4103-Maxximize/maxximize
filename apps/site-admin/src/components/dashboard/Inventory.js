import { PurchaseRequisitionNew } from '../../pages/procurement/purchase-requisition-new';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography
} from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { SeverityPill } from '../severity-pill';
import { DataGrid } from '@mui/x-data-grid';

export const Inventory = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;


  const [selectedProduct, setSelectedProduct] = useState(null);
  const [prDialogOpen, setPrDialogOpen] = useState(false);
  const handlePrDialogOpen = () => {
    setPrDialogOpen(true);
  }
  const handlePrDialogClose = () => {
    setPrDialogOpen(false);
  }

  useEffect(() => {
    if (!prDialogOpen) {
      setSelectedProduct(null);
    }
  }, [prDialogOpen])

  // Update inventory after sending PR 
  const updateInventory = (newInventory) => {
    const updatedInventory = formik.values.quantity.map((quantity) => {
      if (quantity.id === updatedInventory.id) {
        return updatedInventory;
      }
      return quantity;
    });
    formik.setFieldValue('quantity', updatedInventory);
  }

  //edit
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


const inventoryColumns = [
  {
    field: 'id',
    headerName: 'ID',
    flex: 1
  },
  {
    field: 'name',
    headerName: 'Product Name',
    flex: 2,
  },
  {
    field: 'uen',
    headerName: 'Product UEN',
    flex: 2,
  },
  {
    field: 'quantity',
    headerName: 'Inventory Level',
    flex: 1,
    renderCell: (params) => (
      params.value ? 
      <SeverityPill color={prodOrderScheduleStatusColorMap[params.value]}>
        {params.value}
      </SeverityPill>
      : ''
    )
  },
  {
    //edit
    field: 'actions',
    headerName: 'Actions',
    flex: 1,
    renderCell: (params) => {
      if (params.row.quantity === '20') {
        return (
          <Button 
            variant="contained" 
            onClick={() => {
              setSelectedProduct(params.row);
              handlePrDialogOpen();
            }}
          >
            {`Send Purchase Requisition (${params.row.id})`}
          </Button>
        )
      }
    }
  }
];

return (
<Card
            variant="outlined"
            sx={{
              textAlign: 'center',
            }}
          >
            <CardContent>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Inventory Level
          </Typography>
          </CardContent>
            <Card sx={{ my: 2 }}>
              <DataGrid
                autoHeight
                rows={formik.values.schedules}
                columns={inventoryColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                sx={{ marginLeft: 1, marginRight: 1, marginBottom: 1 }}
              />
            </Card>
            </Card>
);
};

