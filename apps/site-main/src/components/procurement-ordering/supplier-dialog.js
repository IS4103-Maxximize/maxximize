import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { fetchSuppliers } from "../../helpers/procurement-ordering";

export const SupplierDialog = (props) =>{
  const {
    action,
    open,
    handleClose,
    inquiry,
  } = props

  // Formik Helpers
  let initialValues = {
    suppliers: []
  }

  const handleOnSubmit = async (values) => {
    // Submit
    onClose();
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: handleOnSubmit
  })

  const onClose = () => {
    formik.resetForm();
    handleClose();
  }

  // DataGrid Helpers
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const getSuppliers = async () => {
    fetchSuppliers()
      .then(result => setRows(result))
      // .catch(err)
  }

  useEffect(() => {
    getSuppliers();
  }, [inquiry]);

  useEffect(() => {
    console.log(rows);
  }, [rows])

  const columns = [
    {
      field: "name",
      headerName: "Supplier Name",
      flex: 2,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 2,
      valueGetter: (params) => {
        return params.contact.email;
      }
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: 2,
      valueGetter: (params) => {
        return params.contact.phoneNumber;
      }
    },
  ]

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={onClose}
    >
      <DialogTitle>
        {`Send Inquiry ${inquiry?.id} to Suppliers`}
      </DialogTitle>
      <DialogContent>
        <DataGrid 
          autoHeight
          rows={rows}
          columns={columns}
          checkboxSelection
          pageSize={5}
          rowsPerPageOptions={[5]}
          onSelectionModelChange={(ids) => setSelectedRows(ids)}
        />
      </DialogContent>
      <DialogActions>
        <Button 
          disabled={formik.isSubmitting || selectedRows.length === 0}
          variant="contained"
          onClick={formik.handleSubmit}>
          {`Send [${selectedRows.length}]`}
        </Button>
        <Button 
          onClick={onClose}
        >
          Back
        </Button>
      </DialogActions>
    </Dialog>
  )
}
