import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Avatar, Box, Card, CardContent, Grid, Skeleton, Typography } from '@mui/material';

export const GenericCard = (props) => {
  const {
    title,
    icon,
    value,
    change,
    trend,
    sinceLast,
    avatarColor,
    ...rest
  } = props;

  const trendColorMap = {
    same: 'primary',
    up: 'secondary', // success doesnt work
    down: 'error',
  }

  return (
    <Card {...props}>
      <CardContent>
        <Grid
          container
          spacing={3}
          sx={{ justifyContent: 'space-between' }}
        >
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="overline"
            >
              {title}
            </Typography>
            <Typography
              color="textPrimary"
              variant="h4"
            >
              {value ? value : <Skeleton />}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: avatarColor,
                height: 56,
                width: 56
              }}
            >
              {icon}
            </Avatar>
          </Grid>
        </Grid>
        {(change || sinceLast) && 
        <Box
          sx={{
            pt: 2,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {trend === 'up' && <ArrowUpwardIcon color={trendColorMap[trend]} />}
          {trend === 'down' && <ArrowDownwardIcon color={trendColorMap[trend]} />}
          {trend === 'same' && <Typography color={trendColorMap[trend]} mr={0.5}>{'~'}</Typography>}
          {change &&
          <Typography
            color={trendColorMap[trend]}
            sx={{
              mr: 1
            }}
            variant="body2"
          >
            {change ? change : <Skeleton />}
          </Typography>}
          {sinceLast && 
          <Typography
            color="textSecondary"
            variant="caption"
          >
            {`Since last ${sinceLast ? sinceLast : <Skeleton />}`}
          </Typography>}
        </Box>}
      </CardContent>
    </Card>
  )
};
