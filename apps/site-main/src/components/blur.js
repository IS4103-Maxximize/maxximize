import { Backdrop } from "@mui/material";

export const Blur = (props) => {
  const { open, children, ...rest } = props
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: 1, position: 'absolute', backdropFilter: 'blur(5px)' }}
      open={open}
    >
      {children}
    </Backdrop>
  )
};
