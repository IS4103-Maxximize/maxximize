import { Outlet } from "react-router-dom"
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../theme';
import { CssBaseline } from '@mui/material';

const Layout = () => {
    return (
        <ThemeProvider theme={theme}>
        <CssBaseline />
            <main className="App">
                <Outlet/>
            </main>
        </ThemeProvider>
    )
}

export default Layout