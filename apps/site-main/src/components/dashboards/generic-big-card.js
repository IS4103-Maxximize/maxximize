import { Card, CardContent, CardHeader, Divider, Skeleton, useTheme } from '@mui/material';

export const GenericBigCard = (props) => {
  const {
    headerProps,
    content,
    ...rest
  } = props;

  const theme = useTheme();

  return (
    <Card {...props}>
      <CardHeader
        {...headerProps}
      />
      <Divider />
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
};
