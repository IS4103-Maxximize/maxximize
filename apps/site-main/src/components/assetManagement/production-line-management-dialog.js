import CloseIcon from '@mui/icons-material/Close';
import {
  AppBar,
  Autocomplete,
  Button,
  Dialog,
  DialogContent,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import {
  createProductionLine,
  updateProductionLine,
  fetchFinalGood,
} from '../../helpers/assetManagement';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export const QuotationDialog = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));

  const {
    action, 
    open,
    handleClose,
    productionLine,
    addProductionLine,
    handleAlertOpen,
  } = props;

  const initialValues = {
    id: productionLine ? productionLine.id : null,
    productionLineName: productionLine ? productionLine.name : null,
    description: productionLine ? productionLine.description : null,
    isAvailable: productionLine ? productionLine.isAvailable : false,
    finalGood: productionLine ? productionLine.finalGood : null,
    lastStopped: productionLine ? productionLine.lastStopped : null,
    changeOverTime: productionLine ? productionLine.changeOverTime : null,
    nextAvailableDateTime: productionLine ? productionLine.nextAvailableDateTime : null,
    productionCostPerLot: productionLine ? productionLine.productionCostPerLot : null,
  };

  let schema = {
    productionLineName: Yup.string().max(255).required('Name is required'),
    description: Yup.string(),
    finalGood: Yup.string().required('Final Good Produced is required'),
    changeOverTime: Yup.string().required('Changeover time is required'),
    productionCostPerLot: Yup.number().required('Production Cost Per Lot is required'),
  };

  const handleOnSubmit = async (values) => {
    if (action === 'POST') {
      const result = await createProductionLine(values, organisationId).catch(
        (err) => handleAlertOpen(`Error creating Production Line`, 'error')
      );
      addProductionLine(result);
    } else if (action === 'PATCH') {
      try {
        const updatedProductionLine = await updateProductionLine(productionLine.id, values);
        updateProductionLine(updatedProductionLine);
        handleAlertOpen(
          `Updated Production Line ${updatedProductionLine.id} successfully!`,
          'success'
        );
      } catch (err) {
        handleAlertOpen(`Error updating Production Line`, 'error');
      }
    }
    onClose();
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object(schema),
    onSubmit: handleOnSubmit,
  });

  const onClose = () => {
    formik.resetForm();
    handleClose();
  };

  const [selectedDate, handleDateChange] = useState(new Date());
  const [selectedFinalGood, setSelectedFinalGood] = useState([]);
  const [finalGoodOptions, setFinalGoodOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const finalGoodNames = await fetchFinalGood(user.organisation.factoryMachine.productionLine.finalGood);
      setFinalGoodOptions(finalGoodNames.map((finalGood) => finalGood.name));
    };

    if (action === 'POST') {
      fetchData();
    }
  });

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedFinalGood(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>
          {action === 'POST' && 'Add '}
          {action === 'PATCH' && 'Edit '}
          {typeString}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter Production Line Name, Final Good Produced, Machines under Production Line, Production cost per lot
          </DialogContentText>
          <TextField
            required
            error={Boolean(formik.touched.productionLineName && formik.errors.productionLineName)}
            fullWidth
            helperText={formik.touched.productionLineName && formik.errors.productionLineName}
            label="Production Line Name"
            margin="normal"
            name="productionLineName"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.productionLineName}
            variant="outlined"
            disabled={action === 'PATCH'}
          />
          <TextField
            error={Boolean(
              formik.touched.description && formik.errors.description
            )}
            fullWidth
            helperText={formik.touched.description && formik.errors.description}
            label="Description"
            margin="normal"
            name="description"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.description}
            variant="outlined"
          />
          <Stack direction="row" spacing={1} alignItems="center">
              <Typography>Last Serviced Date :</Typography>
            <DateTimePicker
            label="Last Serviced Date"
            inputVariant="outlined"
            value={selectedDate}
            onChange={handleDateChange}
            />
            </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography>Final Good Produced :</Typography>
            <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="finalGoodLabel">Final Good Id</InputLabel>
            <Select
              labelId="finalGoodLabel"
              id="finalGood"
              value={selectedFinalGood}
              onChange={handleChange}
              input={<OutlinedInput label="Final Good" />}
              MenuProps={MenuProps}
            >
              {finalGoodOptions.map((name) => (
                <MenuItem
                  key={name}
                  value={name}
                >
                  {name}
                </MenuItem>
              ))}
          </Select>
          </FormControl>
          </Stack>

          <TextField
            required
            error={Boolean(formik.touched.changeOverTime && formik.errors.changeOverTime)}
            fullWidth
            helperText={formik.touched.changeOverTime && formik.errors.changeOverTime}
            label="Change Over Time in Milliseconds"
            margin="normal"
            name="changeOverTime"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="number"
            value={formik.values.changeOverTime}
            variant="outlined"
          />
          <TextField
            required
            error={Boolean(formik.touched.productionCostPerLot && formik.errors.productionCostPerLot)}
            fullWidth
            helperText={formik.touched.productionCostPerLot && formik.errors.productionCostPerLot}
            label="Production Cost Per Lot"
            margin="normal"
            name="productionCostPerLot"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="number"
            value={formik.values.productionCostPerLot}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button
            disabled={!formik.isValid || formik.isSubmitting}
            variant="contained"
            onClick={formik.handleSubmit}
          >
            Submit
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};
