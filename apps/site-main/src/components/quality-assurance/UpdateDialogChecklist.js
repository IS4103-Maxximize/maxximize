import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    useTheme,
    Box,
    Typography,
    responsiveFontSizes,
    Autocomplete,
    IconButton,
    Badge,
  } from '@mui/material';
  import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
  import useMediaQuery from '@mui/material/useMediaQuery';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
  import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import Divider from '@mui/material/Divider';

  import * as Yup from 'yup';
import { Container } from '@mui/system';

export const UpdateDialogChecklist = ({
    openUpdateDialog,
    setOpenUpdateDialog,
    updateChecklists,
    columnsForRules,
    rules,
    rowToEdit
  }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sx'));
    const [error, setError] = useState('')
    const [ruleCategories, setRuleCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('')
    const [displayedRules, setDisplayedRules] = useState([])
    const [selectedDisplayedRules, setSelectedDisplayedRules] = useState([])
    const [toBeAddedRules, setToBeAddedRules] = useState([])
    const [selectedToBeAddedRules, setSelectedToBeAddedRules] = useState([])
  
    const productTypes = ['Raw Material', 'Final Good']

    const columnsForRulesDisplayed = [...columnsForRules]
    const columnsForRulesAdded = [...columnsForRules, {
        field: 'category',
        headerName: 'category',
        flex: 1
      }]
    
    useEffect(() => {
        const categories = rules.reduce((curr, next) => {
            if (!curr.includes(next.category)) {
                curr.push(next.category)
            }
            return curr
        }, [])
        const retrieveChecklistExistingRules = async(id) => {
            const response = await fetch(`http://localhost:3000/api/qa-checklists/${id}`)
            const result = await response.json()
            setToBeAddedRules(result.qaRules)
            formik.setFieldValue('name', result.name)
            formik.setFieldValue('productType', result.productType === 'rawmaterial' ? 'Raw Material': 'Final Good')
        }
        setRuleCategories(categories)
        retrieveChecklistExistingRules(rowToEdit.id)
        
    }, [])

    useEffect(() => {
        const filteredRules = rules.filter(rule => rule.category === selectedCategory)
        .filter(rule => !toBeAddedRules.map(rule => rule.id).includes(rule.id))
        setDisplayedRules(filteredRules)
    }, [selectedCategory])

    const transferRulesForward = () => {
      const rulesToTransfer = rules.filter(rule => selectedDisplayedRules.includes(rule.id))
      const rulesToKeep = displayedRules.filter(rule => !selectedDisplayedRules.includes(rule.id))
      setDisplayedRules(rulesToKeep)
      setToBeAddedRules([...toBeAddedRules, ...rulesToTransfer])
      //clear selectedDisplayedRules
      setSelectedDisplayedRules([])
    }
    const handleDialogClose = () => {
      setOpenUpdateDialog(false);
      formik.resetForm();
    };

    const transferRulesBackward = () => {
      const rulesToTransfer = toBeAddedRules.filter(rule => selectedToBeAddedRules.includes(rule.id) && rule.category === selectedCategory)
      const rulesToKeep = toBeAddedRules.filter(rule => !selectedToBeAddedRules.includes(rule.id))
      setToBeAddedRules(rulesToKeep)
      setDisplayedRules([...displayedRules, ...rulesToTransfer])
      setSelectedToBeAddedRules([])
    }

    const user = JSON.parse(localStorage.getItem('user'));
    const orgId = user?.organisation.id

    const handleOnSubmit = async () => {

        const response = await fetch(`http://localhost:3000/api/qa-checklists/${rowToEdit.id}`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formik.values.name,
          productType: formik.values.productType === 'Raw Material' ? 'rawmaterial' : 'finalgood',
          qaRuleIds: toBeAddedRules.map(rule => rule.id)
        }),
      });
        if (response.status === 200 || response.status === 201) {
          const result = await response.json();
  
          updateChecklists(result);
          setError('')
          handleDialogClose();
        } else {
          const result = await response.json()
          setError(result.message)
        }
        
    
      
  };
  
    const formik = useFormik({
      initialValues: {
        name: '',
        productType: '',
        error: ''
      },
      validationSchema: Yup.object({
        name: Yup.string()
        .min(1, 'Name must be at least be 1 character long')
        .max(50, 'Name can at most be 50 characters long')
        .required('Name is required'),
        productType: Yup.string().required('ProductType is required').nullable()
      }),
      onSubmit: handleOnSubmit
    });
    
    return (
      <Dialog
        fullScreen
        open={openUpdateDialog}
        onClose={handleDialogClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
            Add a new checklist
        </DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit} style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%'}}>
            <Box sx={{display: 'flex', flexDirection: 'column', height: '100%' }}>
              <TextField
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
                sx={{mb: 1}}
              />
              {/* Autocomplete for product Type */}
              <Autocomplete disablePortal 
                options={productTypes}
                renderInput={(params) => 
                <TextField {...params}
                error={Boolean(formik.touched.productType && formik.errors.productType)}
                helperText={formik.touched.productType && formik.errors.productType} 
                label="Product Type"
                name="productType"
                fullWidth
                />}
              onChange={(e, value) => {
                  formik.setFieldValue('productType', value)
              }}
              sx={{mb:3}}
              defaultValue='Raw Material'
              value={formik.values.productType !== "" ? formik.values.productType : 'Raw Material'}
              isOptionEqualToValue={(option, value) => option === value}
              >
              </Autocomplete>


              {/* Autocomplete for Rule category selection */}
              <Autocomplete disablePortal 
              options={ruleCategories}
              renderInput={(params) => 
              <TextField {...params} 
              label="Rule Category"
              fullWidth
              />}
              onChange={(e, value) => {
                  setSelectedCategory(value)
              }}
              sx={{mb:3, width: '20%'}}
              >
              </Autocomplete>
            
              <Box sx={{display: 'flex', gap: 3, alignItems: 'center', flexGrow: 1}}>
                {/* Datagrid for displayedRules */}
                <div style={{width: '50%', height: '90%'}}>
                  <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                    <Typography variant="h4">
                      Rules to Select
                    </Typography>
                    <Badge badgeContent={selectedDisplayedRules.length} color="success">
                      <IconButton onClick={transferRulesForward}>
                        <ArrowForwardIcon />
                      </IconButton>
                    </Badge>
                  </Box>
                  
                  <DataGrid
                    rows={displayedRules}
                    columns={columnsForRulesDisplayed}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    allowSorting={true}
                    components={{
                    Toolbar: GridToolbar,
                    }}
                    disableSelectionOnClick
                    checkboxSelection={true}
                    onSelectionModelChange={(ids) => {
                    setSelectedDisplayedRules(ids);
                  }}
                  />
                </div>
                <Divider orientation="vertical" flexItem>
                </Divider>
                <div style={{width: '50%', height: '90%'}}>
                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                    <Typography variant="h4">
                      Rules Added
                    </Typography>
                    <Badge badgeContent={selectedToBeAddedRules.length} color="error">
                      <IconButton onClick={transferRulesBackward}>
                        <ClearIcon />
                      </IconButton>
                    </Badge>
                  </Box>
                  {/* Datagrid for toBeAddedRules */}
                  <DataGrid
                    sx={{flexGrow: 1}}
                    rows={toBeAddedRules}
                    columns={columnsForRulesAdded}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    allowSorting={true}
                    components={{
                    Toolbar: GridToolbar,
                    }}
                    disableSelectionOnClick
                    checkboxSelection={true}
                    onSelectionModelChange={(ids) => {
                    setSelectedToBeAddedRules(ids);
                  }}
                  />
                </div>
            </Box>
            
          
            <Typography variant="caption" color="red">
                {error}
            </Typography>
            </Box>

            <Box
              mt={3}
              mb={1}
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'end',
              }}
            >
              <Button autoFocus 
              onClick={handleDialogClose}>
                Back
              </Button>
              <Button
                color="primary"
                disabled={formik.isSubmitting}
                size="medium"
                type="submit"
                variant="contained"
              >
                Update
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    );
  };
  