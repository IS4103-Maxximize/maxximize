import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { apiHost, headers } from '../../helpers/constants';
import { fetchSuppliers } from '../../helpers/procurement-ordering';

export const SupplierDialog = (props) => {
  const { 
    open, 
    handleClose, 
    inquiry, 
    handleAlertOpen,
    ...rest
  } = props;

  // Formik Helpers
  let initialValues = {
    suppliers: inquiry ? inquiry.suppliers : [],
  };

  const handleOnSubmit = async (values) => {
    // Submit
    const salesInquiryId = inquiry.id;
    const shellOrganisationIds = selectedRows;
    const body = {
      salesInquiryId: salesInquiryId,
      shellOrganisationIds: shellOrganisationIds,
    };
    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
    };
    const apiUrl = `${apiHost}/sales-inquiry/send`;
    const result = await fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then(() =>
        handleAlertOpen('Successfully sent to Suppliers!', 'success')
      );
    onClose();
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: handleOnSubmit,
  });

  const onClose = () => {
    formik.resetForm();
    handleClose();
  };

  // DataGrid Helpers
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const getSuppliers = async () => {
    fetchSuppliers()
      .then((result) => setRows(result))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getSuppliers();
  }, []);

  useEffect(() => {
    console.log(rows);
  }, [rows]);

  const columns = [
    {
      field: 'name',
      headerName: 'Supplier Name',
      flex: 3,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 2,
      valueGetter: (params) => {
        return params.row.contact ? params.row.contact.email : '';
      },
    },
    {
      field: 'phoneNumber',
      headerName: 'Phone Number',
      flex: 2,
      valueGetter: (params) => {
        return params.row.contact ? params.row.contact.phoneNumber : '';
      },
    },
  ];

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle>{`Send Inquiry ${inquiry?.id} to Suppliers`}</DialogTitle>
      <DialogContent>
        <DataGrid
          autoHeight
          rows={rows}
          columns={columns}
          checkboxSelection
          pageSize={5}
          rowsPerPageOptions={[5]}
          onSelectionModelChange={(ids) => setSelectedRows(ids)}
          isRowSelectable={(params) => {
            return !inquiry.suppliers
              .map((supp) => supp.id)
              .includes(params.row.id);
          }} // disable selection on Suppliers without contact information
        />
      </DialogContent>
      <DialogActions>
        <Button
          disabled={formik.isSubmitting || selectedRows.length === 0}
          variant="contained"
          onClick={formik.handleSubmit}
        >
          {`Send [${selectedRows.length}]`}
        </Button>
        <Button onClick={onClose}>Back</Button>
      </DialogActions>
    </Dialog>
  );
};
