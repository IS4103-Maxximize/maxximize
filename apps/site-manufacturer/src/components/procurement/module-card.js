import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useRouter } from 'next/router';

const styles = {
  cardAction: {
    display: 'block',
    textAlign: 'initial',
  },
};

const useStyles = makeStyles({
  root: {
    transition: 'transform 0.3s ease-in-out',
  },
  cardHovered: {
    transform: 'scale3d(1.01, 1.01, 1)',
  },
});

export const ModuleCard = ({ module, ...rest }) => {
  const classes = useStyles();
  const [state, setState] = useState({
    raised: false,
    shadow: 1,
  });

  const router = useRouter();
  const { organisation } = router.query;

  return (
    <Card
      className={classes.root}
      classes={{ root: state.raised ? classes.cardHovered : '' }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      {...rest}
      onMouseOver={() => setState({ raised: true, shadow: 3 })}
      onMouseOut={() => setState({ raised: false, shadow: 1 })}
      raised={state.raised}
      zdepth={state.shadow}
    >
      <CardActionArea
        onClick={() =>
          router.push(
            `/${organisation}/procurement/${module.title.toLowerCase()}`
          )
        }
      >
        <CardMedia
          component="img"
          height="140"
          image={module.media}
          alt={module.title}
        />
        <CardContent>
          <Typography
            align="center"
            color="textPrimary"
            gutterBottom
            variant="h5"
          >
            {module.title}
          </Typography>
          <Typography align="center" color="textPrimary" variant="body1">
            {module.description1}
          </Typography>
          <Typography align="center" color="textPrimary" variant="body1">
            {module.description2}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

ModuleCard.propTypes = {
  module: PropTypes.object.isRequired,
};
