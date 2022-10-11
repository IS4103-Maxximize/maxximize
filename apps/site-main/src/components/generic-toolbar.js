import {
  Badge,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Stack,
  SvgIcon,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { GridSearchIcon } from '@mui/x-data-grid';

function GenericToolbar(props) {
  const {
    tools,
    disabled,
    title,
    selectedRows,
    handleSearch,
    ...handleClickMethods
  } = props;
  return (
    <>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          m: -1,
        }}
      >
        <Typography sx={{ m: 1 }} variant="h4">
          {title}
        </Typography>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                m: -1,
              }}
            >
              <Stack direction="row" spacing={1}>
                <TextField
                  sx={{ width: 500 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SvgIcon fontSize="small" color="action">
                          <GridSearchIcon />
                        </SvgIcon>
                      </InputAdornment>
                    ),
                  }}
                  placeholder={`Search ${title}`}
                  variant="outlined"
                  type="search"
                  onChange={handleSearch}
                />
              </Stack>

              <Box sx={{ m: 1 }}>
                {tools.map((tool) => {
                  return (
                    <Tooltip title={tool.toolTipTitle} key={tool.toolTipTitle}>
                      {tool.badge ? (
                        <span>
                          <IconButton
                            disabled={disabled}
                            onClick={handleClickMethods[tool.handleClickMethod]}
                            color={tool.badge.color}
                          >
                            <Badge
                              badgeContent={selectedRows.length}
                              color={tool.badge.color}
                            >
                              {tool.button()}
                            </Badge>
                          </IconButton>
                        </span>
                      ) : (
                        <IconButton
                          onClick={
                            tool.handleClickMethod
                              ? handleClickMethods[tool.handleClickMethod]
                              : null
                          }
                        >
                          {tool.button()}
                        </IconButton>
                      )}
                    </Tooltip>
                  );
                })}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

export default GenericToolbar;
