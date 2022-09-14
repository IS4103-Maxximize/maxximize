import { Box, IconButton, Tooltip } from "@mui/material"
import GroupsIcon from '@mui/icons-material/Groups';
import HelpIcon from '@mui/icons-material/Help';

function RelationsToolBar(props) {
  const {disabled, numRelations, type, handleConfirmDialogOpen, handleOpenDialog} = props
  return (
    <Box>
      <Tooltip title={`Add new ${type}`}>
        <IconButton onClick={handleOpenDialog}>
          <GroupsIcon />
        </IconButton>
      </Tooltip>


      <Tooltip title={'Delete Supplier (Single/Multiple)'}>
        <Badge badgeContent={numRelations} color="error">
          <IconButton
            disabled={disabled}
            color="error"
            onClick={handleConfirmDialogOpen}
          >
            <DeleteIcon />
          </IconButton>
        </Badge>
      </Tooltip>

      <Tooltip title={'Update entry by clicking on the field to be updated'}>
        <IconButton>
          <HelpIcon />
        </IconButton>
      </Tooltip>
    </Box>
  )
}

export default RelationsToolBar