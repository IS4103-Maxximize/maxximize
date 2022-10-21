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
    'Final Good Batch Line Item',
    'Raw Material Batch Line Item',
    'Batch',
    'Goods Receipt',
    'Purchase Order',
    'Supplier'
  ]

  const [nodeIdMap, setNodeIdMap] = useState(new Map()); // id => parentId
  const [objectNodeIdMap, setObjectNodeIdMap] = useState(new Map()); // nodeId => object

  const transform = (nodes, parentId, depth) => {
    // console.log(nodes);

    const treeViewArr = nodes.map(attr => {
      const rng = uuid();
      
      if (parentId) {
        setNodeIdMap(nodeIdMap.set(rng, parentId));
      }

      if (Array.isArray(attr[1])) {
        const nodeArray = attr[1].map(node => {
          const id = uuid();
          setNodeIdMap(nodeIdMap.set(id, rng));

          return {
            id: id,
            parentId: rng,
            name: `${labels[depth]} (${node.id})`,
            children: transform(Object.entries(node), rng, depth+1)
          }
        })

        return {
          id: rng,
          parentId: parentId,
          name: attr[0],
          children: nodeArray
        }
      }

      if (attr[1] instanceof Object) {
        setObjectNodeIdMap(objectNodeIdMap.set(rng, attr[1]))
        return {
          id: rng,
          parentId: parentId,
          name: `${labels[depth]} (${attr[1].id})`,
          children: transform(Object.entries(attr[1]), rng, depth+1)
        }
      }

      return {
        id: rng,
        parentId: parentId,
        name: `${attr[0]}: ${attr[1]}`,
      }
    })

    return treeViewArr;
  }

  const renderTree = (nodes) => {
    if (nodes) {
      return (
        <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
          {Array.isArray(nodes.children)
            ? nodes.children.map((node) => renderTree(node))
            : null}
        </TreeItem>
      )
    }
    return [];
  }

  const [treeViewArr, setTreeViewArr] = useState();

  useEffect(() => {
    if (batch) {
      const treeViewArr = transform(Object.entries(batch?.fgBatchLineItems), null, 0)[0];
      // console.log(treeViewArr)
      // console.log(nodeIdMap)
      // console.log(objectNodeIdMap)
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
    return nodeIds.length > 0 ? nodeIds.map(nodeId => {
      const object = objectNodeIdMap.get(nodeId);
      console.log(object);

      return (
        <>
          {object && 
          <Card
            sx={{ my: 1 }}
          >
            <CardContent>
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
        </>
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
        }}
      >
        <Container maxWidth={false}>
          <NotificationAlert
            key="notification-alert"
            open={alertOpen}
            severity={alertSeverity}
            text={alertText}
            handleClose={handleAlertClose}
          />
          <QATrackingToolbar
            key="toolbar"
            name={name}
            search={search}
            setSearch={setSearch}
            handleSearch={handleSearch}
            clearSearch={clearSearch}
            handleConfirmDialogOpen={handleConfirmDialogOpen}
          />
          <Box
            sx={{
              mt: 3,
            }}
          >
            {batch ? (
              <Stack direction="row">
                <Box
                  sx={{
                    width: '40%',
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
                  }}
                >
                  {/* <Card>
                    <CardContent>
                      <Typography>TRACKING</Typography>
                    </CardContent>
                  </Card> */}
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
