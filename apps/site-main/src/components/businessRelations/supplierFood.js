import {
    Badge,
    Button,
    Checkbox,
    Dialog,
    DialogTitle,
    DialogContent,
    FormGroup,
    FormControlLabel,
    IconButton,
    useTheme,
    Box,
  } from '@mui/material';
  import useMediaQuery from '@mui/material/useMediaQuery';
  import RestaurantIcon from '@mui/icons-material/Restaurant';
  import { BusinessPartnerConfirmDialog } from './BusinessPartnerConfirmDialog';

  export const SupplierFood = () =>  {

  //Confirm Dialog Helpers
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const handleConfirmDialogOpen = () => {
    setConfirmDialogOpen(true);
  };
  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  };

  const handleError = () => {
    setAlertOpen('Update worker error', 'error');
  };

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  
    //Handle dialog close from child dialog
    const handleDialogClose = () => {
      setOpenDialog(false);
      formik.resetForm();
    };
  
  const [rawMaterials,setRawMaterials] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user.organisation.id;
    // State with list of all checked item
  const [checked, setChecked] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);

  //pass in new array of ids for raw materials into shell organisation

  useEffect(() => {
    retrieveAllRawMaterials();
  }, []);

  const retrieveAllRawMaterials = async () => {
    const rawMaterialsList = await fetch(
      `http://localhost:3000/api/organisations/getWorkersByOrganisation/${organisationId}`
    );
    const result = await rawMaterialsList.json();

    const flattenResult = result.map((r) => flattenObj(r));

    setRawMaterials(flattenResult);

    };
  
    return (
      <Dialog
        fullScreen={fullScreen}
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {'List of Raw Materials that can be purhcased from Supplier'}
        </DialogTitle>
        <DialogContent>
            {
            rawMaterialsList.map((rawMaterial, index) => (
            <div>
              <FormGroup>
              <FormControlLabel control={<Checkbox />} label={rawMaterial.name + " : " + rawMaterial.skuCode} />
              </FormGroup>
            </div>
            )
            )
            }

            <Badge badgeContent={selectionModel.length} color="error">
                  <Tooltip title={'Update raw materials that can be sold (Single/Multiple)'}>
                    <>
                      <IconButton
                        disabled={selectionModel.length === 0}
                        onClick={handleConfirmDialogOpen}
                      >
                        <RestaurantIcon color="error" />
                      </IconButton>
                    </>
                  </Tooltip>
                </Badge>

                <BusinessPartnerConfirmDialog
                  open={confirmDialogOpen}
                  handleClose={handleConfirmDialogClose}
                  dialogTitle={`Update raw materials(s)`}
                  dialogContent={`Confirm update of raw materials(s)?`}
                  dialogAction={() => {
                    const event = new Set(selectionModel);
                    handleDelete(event);
                  }}
                />
          
            <Box
              mt={1}
              mb={1}
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Button autoFocus onClick={handleDialogClose}>
                Back
              </Button>
            </Box>
        </DialogContent>
      </Dialog>
    );
  };
  
  //Helper methods
  //Flatten the worker record retrieved, difficult to update with an inner object
  const flattenObj = (obj, parent, res = {}) => {
    for (let key in obj) {
      let propName = key;
      if (typeof obj[key] == 'object' && key != 'organisation') {
        flattenObj(obj[key], propName, res);
      } else {
        res[propName] = obj[key];
      }
    }
    return res;
  };
  