import HomeIcon from '@mui/icons-material/Home';
import { Button, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

function Unauthorized() {
  return (
    <div className="container" style={{height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <main className="textField">
            <h1 style={{fontSize: 30}}>You are unauthorized! Please go back.</h1>
            <Link component={RouterLink} underline="none" to='/'>
              <Button
                component="a"
                startIcon={<HomeIcon fontSize="small" />}
                sx={{ mt: 3 }}
                variant="contained"
              >
                Home
              </Button>
            </Link>
        </main>
    </div>
  )
}

export default Unauthorized