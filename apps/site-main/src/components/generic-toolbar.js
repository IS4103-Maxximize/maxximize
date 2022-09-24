import { Badge, Card, CardContent, IconButton, Tooltip, Typography } from "@mui/material"
import { Box } from "@mui/system"

function GenericToolbar(props) {
  const {tools, disabled, title, selectedRows, ...handleClickMethods} = props
  return (
    <Box sx={{mb: 3}}>
      <Typography variant="h3" sx={{mb: 1, ml: 1}}>
        {title}
      </Typography>
      <Card>
        <CardContent>
          <Box sx={{display: 'flex', direction: 'row', justifyContent: 'end', alignItems: 'center'}}>
            {tools.map(tool => {
              return (
                <Tooltip title={tool.toolTipTitle} key={tool.toolTipTitle}>
                  {tool.badge ? 
                    <Badge badgeContent={selectedRows.length} color={tool.badge.color}>
                      <IconButton
                        disabled={disabled}
                        onClick={handleClickMethods[tool.handleClickMethod]}
                        >
                        {tool.button()}
                      </IconButton>
                    </Badge> : 
                      <IconButton onClick={tool.handleClickMethod ? handleClickMethods[tool.handleClickMethod]: null}>
                        {tool.button()}
                      </IconButton>}
                  </Tooltip>
                )
              })}
            </Box>
        </CardContent>
      </Card>
    </Box>
    
  )
}

export default GenericToolbar