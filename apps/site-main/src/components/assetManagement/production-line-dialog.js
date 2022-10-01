import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { fetchMachine} from '../../helpers/assetManagement';
import { DateTimePicker } from '@mui/x-date-pickers';
import DurationPicker from 'react-duration-picker'
import { fetchBOMs } from '../../helpers/production/bom';

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

export const ProductionLineDialog = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;

  // const options = ['available', 'not available'];

  const [duration, setDuration] = useState();

  const {
    action, 
    open,
    handleClose,
    productionLine,
    addProductionLine,
    updateProductionLine,
    handleAlertOpen,
    selectedRow,
  } = props;

  const [error, setError] = useState('');

  const initialValues = {
    id: productionLine ? productionLine.id : '',
    name: productionLine ? productionLine.name : '',
    description: productionLine ? productionLine.description : '',
    isAvailable: productionLine ? productionLine.isAvailable : "available",
    bomId: productionLine ? productionLine.bomId : '',
    organisationId: organisationId,
    gracePeriod: productionLine ? productionLine.gracePeriod : '',
    outputPerHour: productionLine ? productionLine.outputPerHour : '',
    created: productionLine ? productionLine.created : '',
    startTime: productionLine ? productionLine.startTime : '',
    endTime: productionLine ? productionLine.endTime : '',
    productionCostPerLot: productionLine ? productionLine.productionCostPerLot : '',
  };

  let schema = {
    name: Yup.string().max(255, "Production Line Name should be less than 255 characters").required('Name is required'),
    description: Yup.string(),
    outputPerHour: Yup.number().required('Output Per Hour is required').positive('Output per hour has to be more than 0'),
    productionCostPerLot: Yup.number().required('Production Cost Per Lot is required').positive('Production Cost has to be more than 0'),
  };


  const handleOnSubmit = async () => {
    if (action === 'POST') {
      console.log("Create")
      const response = await fetch('http://localhost:3000/api/production-lines', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formik.values.name,
          description: formik.values.description,
          gracePeriod: duration.hours * 3600000 + duration.minutes *60000 + duration.seconds *1000,
          bomId: BOMs.id,
          organisationId: organisationId,
          startTime: startDate,
          endTime: endDate,
          outputPerHour: formik.values.outputPerHour,
          productionCostPerLot: formik.values.productionCostPerLot,
        }),
      });
  
      if (response.status === 200 || response.status === 201) {
        const result = await response.json();
        console.log(result);
        addProductionLine(result);
        handleAlertOpen(`Production Line ${result.id} successfully`);
        setError('');
        onClose();
      }
      else {
        const result = await response.json();
        setError(result.message);
      }
    } else if (action === 'PATCH') {
      console.log(selectedRow)
        const response = await fetch(`http://localhost:3000/api/production-lines/${selectedRow.id}`, {
            method: 'PATCH',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: formik.values.name,
              description: formik.values.description,
              gracePeriod: duration.hours * 3600000 + duration.minutes *60000 + duration.seconds *1000,
              bomId: BOMs.id,
              organisationId: organisationId,
              startTime: startDate,
              endTime: endDate,
              outputPerHour: formik.values.outputPerHour,
              productionCostPerLot: formik.values.productionCostPerLot,
                }),
              });
              if (response.status === 200 || response.status === 201) {
                const result = await response.json();
                console.log(result)
                updateProductionLine(result)
                handleAlertOpen(`Updated Production Line ${result.id} successfully`);
                setError('');
                onClose();
              }
              else {
                const result = await response.json();
                setError(result.message);
              } 
    };
  
      
    };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object(schema),
    onSubmit: handleOnSubmit,
  });

  const onClose = () => {
    console.log("Close Dialog")
    formik.resetForm();
    handleClose();
  };

  const [createdDate, setCreated] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedDate, handleDateChange] = useState(new Date());
  const [BOMs, setBOMs] = useState([]);
  const [machines, setMachines] = useState([]);

  const getBOMs = async () => {
    const final = await fetchBOMs(organisationId)    
    setBOMs(final);
  }

  useEffect(() => {
    if (action === 'POST') {
      getBOMs();
    }
  },[open]);

  useEffect(() => {
    console.log(BOMs);
  }, [BOMs])

  const getMachines = async () => {
    const final = await fetchMachine(organisationId)    
    setMachines(final);
  }

  useEffect(() => {
    if (action === 'POST') {
      getMachines();
    }
  },[open]);

  const onChange = (duration) => {
    const { hours, minutes, seconds } = duration;
    setDuration({duration});    
  };
  

  return (
    <form onSubmit={formik.handleSubmit}>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>
        {action === 'POST' && 'Add '}
        {action === 'PATCH' && 'Edit '}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter Production Line Details
          </DialogContentText>
          <TextField
            required
            error={Boolean(formik.touched.name && formik.errors.name)}
            fullWidth
            helperText={formik.touched.name && formik.errors.name}
            label="Name"
            margin="normal"
            name="name"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.name}
            variant="outlined"
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
          
          <Stack direction="row" spacing={2} alignItems="center">
              <Typography>Created:</Typography>
            <DateTimePicker
            renderInput={(params) => <TextField {...params} />}
            value={createdDate}
            onChange={(newValue) => {
              setCreated(newValue);
            }}
            disabled={action === 'POST'}
            />
            </Stack>
          

          <Stack direction="row" justifyContent="space-evenly" spacing={1} alignItems="center">
              <Typography>Start:</Typography>
            <DateTimePicker
            onChange={startDate => setStartDate(startDate)}
            createdDate={createdDate}
            value={startDate}
            minDate={createdDate}
            renderInput={(params) => <TextField {...params} />}
            disabled={
              action === 'PATCH' || 
                 productionLine?.schedules.filter(schedule => {
                  const status = schedule.status
                  return status === 'ongoing' || status === 'planned'
                }).length >= 1
            }
            />

            <Typography>End:</Typography>
            <DateTimePicker
            onChange={date => setEndDate(date)}
            startDate={startDate}
            value={endDate}
            minDate={startDate}
            renderInput={(params) => <TextField {...params} />}
            disabled={
              action === 'PATCH' || 
                 productionLine?.schedules.filter(schedule => {
                  const status = schedule.status
                  return status === 'ongoing' || status === 'planned'
                }).length >= 1
            }
            />
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
            <Typography>Grace Period:</Typography>
            <DurationPicker
              onChange={onChange}
              initialDuration={{ hours: 0, minutes: 0, seconds: 0 }}
              maxHours={23}
              disabled={
                action === 'PATCH' || 
                   productionLine?.schedules.filter(schedule => {
                    const status = schedule.status
                    return status === 'ongoing' || status === 'planned'
                  }).length >= 1
              }
            />
            </Stack>
            
          
            <Stack direction="row" spacing={1}>
            {/* BOM Selection */}
            <Autocomplete
              id="bom-selector"
              sx={{ width: 400, mb: 2 }}
              options={BOMs}
              getOptionLabel={(option) => `${option.finalGood}`}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(e, value) => formik.setFieldValue('bomId', value ? value.id : null)}
              renderInput={(params) => (<TextField {...params} label="BOM" />)}
            />
            </Stack>

          <TextField
            required
            error={Boolean(formik.touched.outputPerHour && formik.errors.outputPerHour)}
            fullWidth
            helperText={formik.touched.outputPerHour && formik.errors.outputPerHour}
            label="Output per hour"
            margin="normal"
            name="outputPerHour"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            type="number"
            value={formik.values.outputPerHour}
            variant="outlined"
            disabled={
              action === 'PATCH' || 
                 productionLine?.schedules.filter(schedule => {
                  const status = schedule.status
                  return status === 'ongoing' || status === 'planned'
                }).length >= 1
            }
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
            disabled={
              action === 'PATCH' || 
                 productionLine?.schedules.filter(schedule => {
                  const status = schedule.status
                  return status === 'ongoing' || status === 'planned'
                }).length >= 1
            }
          />

        <Stack direction="row" spacing={1} alignItems="center">
                <Typography>Last Serviced :</Typography>
              <DateTimePicker
              value={selectedDate}
              renderInput={(props) => <TextField {...props} />}
              onChange={handleDateChange}
              disableFuture={true}
              disabled={action === 'POST'}
              />
              </Stack>
              {/* <Stack direction="row" spacing={1} alignItems="center">
              <Typography>Status :</Typography>
              <RadioGroup
                label="isAvailable"
                margin="normal"
                name="isAvailable"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.isAvailable}
                defaultValue={formik.values.isAvailable}
                disabled={action === 'POST'}
                row
              >
                {options.map((option) => (
                  <FormControlLabel
                    key={option}
                    value={option}
                    control={<Radio />}
                    label={option}
                    
                  />
                ))}
              </RadioGroup>
            </Stack> */}

            <Stack direction="row" spacing={1}>
            {/* Machine Selection */}
            <Autocomplete
              id="machine-selector"
              multiple={true}
              sx={{ width: 400, mb: 2 }}
              options={machines}
              getOptionLabel={(option) => `${option.make} - ${option.model} - ${option.serialNumber}`}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(e, value) => formik.setFieldValue('machineId', value ? value.id : null)}
              renderInput={(params) => (<TextField {...params} label="Machine" />)}
            />
            </Stack>

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
