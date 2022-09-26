import { Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

export const CreateGoodReceiptDataGrid = ({
  header,
  products,
  columns,
  setSelectionModel,
  handleRowUpdate,
  typeIn,
}) => {
  return (
    <>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        {header}
      </Typography>
      <DataGrid
        autoHeight
        sx={{ overflowX: 'scroll' }}
        rows={products}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        allowSorting={true}
        components={{
          Toolbar: GridToolbar,
        }}
        disableSelectionOnClick
        checkboxSelection={true}
        onSelectionModelChange={(ids) => {
          setSelectionModel(ids);
        }}
        experimentalFeatures={{ newEditingApi: true }}
        processRowUpdate={(R) => handleRowUpdate(R, typeIn)}
      />
    </>
  );
};
