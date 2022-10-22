import {
  Box,
  Card,
  CardContent,
  Container,
  Typography, 
  Stack,
  CardHeader,
  TextField
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { DashboardLayout } from '../components/dashboard-layout'
import { NotificationAlert } from '../components/notification-alert';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import { QATrackingToolbar } from '../components/quality-assurance/qa-tracking-toolbar';
import { fetchBatchTracking } from '../helpers/quality-assurance';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { v4 as uuid } from 'uuid'


export const QATracking = (props) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const organisationId = user ? user.organisation.id : null;
  const name = 'Batch Tracking';

  

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

  // Tree View Helpers
  const [batch, setBatch] = useState(null);


  // Toolbar Helpers
  // Searchbar
  const [search, setSearch] = useState('');
  const handleSearch = () => {
    console.log(search)
    // fetch batch based on search
    setLoading(true)
    // setBatch(batch)
    fetchBatchTracking(search)
      .then(res => {
        setBatch(res);
        handleAlertOpen(`Successfully Retrieved Batch!`, 'success');
      })
      .catch(err => handleAlertOpen(`Invalid Batch Number`, 'warning'));
  };

  const clearSearch = () => {
    setBatch(null);
    setSearch('');
  }


  // Create Dialog Helpers
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const handleCreateDialogOpen = () => {
    setCreateDialogOpen(true);
  };
  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
  };


  // ConfirmDialog Helpers
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const handleConfirmDialogOpen = () => {
    setConfirmDialogOpen(true);
  };
  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  };


  // Tree View Helpers
  const labels = [
    'Batch',
    'Final Good Batch Line Item',
    'Raw Material Batch Line Item',
    'Batch',
    'Goods Receipt',
    'Purchase Order',
    'Supplier',
    'Contact'
  ]

  const [nodeIdMap, setNodeIdMap] = useState(new Map()); // id => parentId
  const [objectNodeIdMap, setObjectNodeIdMap] = useState(new Map()); // nodeId => object

  const transform = (object, parentId, depth) => {
    let result = {};
    const rng = uuid();
    setNodeIdMap(nodeIdMap.set(rng, parentId));
    setObjectNodeIdMap(objectNodeIdMap.set(rng, object));

    const keys = Object.keys(object)
    const newDepth = depth + 1
    const title = (depth === 0) ? `${labels[depth]} (${search})` : `${labels[depth]} (${object.id})`
    const id = rng
    //there should only 1 instance of object or array
    for (const key of keys) {
      const value = object[key]
      
      if (typeof value === 'object' && !Array.isArray(value)) {
        //Object but not an array
        result = {
          id,
          title,
          children: Object.keys(value).length > 0 ? [transform(value, id, newDepth)] : null,
          parentId
        }
      } else if (typeof value === 'object' && Array.isArray(value)) {
        //Object and is an array
        let resultArray = []
        for (const currentVal of value) {
          const temp = transform(currentVal, rng, newDepth)
          resultArray.push(temp)
        }
        result = {
          id,
          title,
          children: resultArray,
          parentId
        }
      }
    }
    
    return result
  }

  const renderTree = (treeViewArr) => {
    if (!treeViewArr) {
      return null
    }
    return treeViewArr.map((treeViewItem) => {
      return (
        <TreeItem key={treeViewItem.id} nodeId={treeViewItem.id} label={treeViewItem.title}>
          {renderTree(treeViewItem.children)}
        </TreeItem>
      )
    })
  }

  const [treeViewArr, setTreeViewArr] = useState();

  useEffect(() => {
    if (batch) {
      // console.log(batch)
      const treeViewArr = [transform(batch, null, 0)]
      setTreeViewArr(treeViewArr)
      setNodeIds([])
    }
  }, [batch])


  // Tracking Display helpers

  const [nodeIds, setNodeIds] = useState([]);

  useEffect(() => {
    if (nodeIds.length > 0) {
      console.log(nodeIds)
    }
  }, [nodeIds])
  
  const renderTrackingCards = (nodeIds) => {
    // start from top -> bottom
    return nodeIds.length > 0 ? nodeIds.map((nodeId, index) => {
      if (index === 0) return null;

      const object = objectNodeIdMap.get(nodeId);
      console.log(object);

      return (
        <div style={{ textAlign: 'center' }}>
          {object && 
          <Card
            sx={{ 
              my: 1
            }}
          >
            <CardContent>
              <Typography sx={{ mb: 2, fontWeight: 'medium' }}>{labels[index]}</Typography>
              {Object.entries(object).map(entry => {
                if (!(entry[1] instanceof Object)) {
                  return (
                    <TextField
                      fullWidth
                      label={entry[0]}
                      value={entry[1]}
                      sx={{ mb: 1 }}
                    />
                  )
                }
                return null;
              })}
            </CardContent>
          </Card>}
          {(object && index < nodeIds.length-1) && <KeyboardArrowDownIcon />}
        </div>
      )
    }) :
    <Typography>TRACKING</Typography>
  }

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{`${name} | ${user?.organisation?.name}`}</title>
        </Helmet>
      </HelmetProvider>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 4,
          pb: 4,
          height: '100vh'
        }}
      >
        <Container maxWidth={false}
        >
          <NotificationAlert
            key="notification-alert"
            open={alertOpen}
            severity={alertSeverity}
            text={alertText}
            handleClose={handleAlertClose}
          />
          <Box
            sx={{ height: '10%'}}
          >
            <QATrackingToolbar
              key="toolbar"
              name={name}
              search={search}
              setSearch={setSearch}
              handleSearch={handleSearch}
              clearSearch={clearSearch}
              handleConfirmDialogOpen={handleConfirmDialogOpen}
            />
          </Box>
          <Box
            sx={{
              mt: 3,
              height: '90%'
            }}
          >
            {batch ? (
              <Stack direction="row">
                <Box
                  sx={{
                    width: '40%',
                    height: '100%',
                    textAlign: 'left',
                    pt: 2,
                    pr: 2
                  }}
                >
                  {/* <Typography>{JSON.stringify(treeViewArr)}</Typography> */}
                  <TreeView
                    aria-label="batch-tracking-tree"
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    sx={{ flexGrow: 1, overflowY: 'auto' }}
                    onNodeSelect={(e, nodeIds) => {
                      console.log('id: ' + nodeIds)
                      console.log('parentId: ' + nodeIdMap.get(nodeIds))
                      
                      let current = nodeIds;
                      const arr = []
                      while (current) {
                        arr.push(current);
                        current = nodeIdMap.get(current);
                      }
                      setNodeIds(arr.reverse());
                    }}
                  >
                    {renderTree(treeViewArr)}
                  </TreeView>
                </Box>
                <Box
                  sx={{
                    width: '60%',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '700px',
                    overflowY: "scroll"
                  }}
                >
                  {renderTrackingCards(nodeIds)}
                </Box>
              </Stack>
            ) : (
              <Card
                variant="outlined"
                sx={{
                  textAlign: 'center',
                }}
              >
                <CardContent>
                  <Typography>{`No Batch Selected`}</Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

QATracking.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default QATracking;
