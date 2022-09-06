import { Box, Button, Container, TextField, Typography } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { useFormik } from 'formik';

function organisationSelection() {
    const router = useRouter();
    const formik = useFormik({
        initialValues: {
            organisation: '',
            authenticationError: ''
        },
        validationSchema: Yup.object({
        organisation: Yup
            .string()
            .max(255)
            .required(
            'Organisation Code is required')
        }),
        onSubmit: async({organisation}) => {
            console.log('HI')
            //retrieve data based on the provided organisation code
            const response = await fetch(`http://localhost:3000/api/organisations/${organisation}`)
            //if organisation is found
            if (response.status === 201 || response.status === 200) {
                const result = await response.json()
                //navigate to the login page with id of the organisation
                router.push(`organisations/${result.id}/login`)
            } else {
                //organisation not found
                formik.values.authenticationError = 'Organisation Code is invalid'
            }
        }
    });
    return (
        <div>
            <Head>
            <title>Organisation Selection</title>
            </Head>
            <Box component="main"
            sx={{
            alignItems: 'center',
            display: 'flex',
            flexGrow: 1,
            minHeight: '85vh'
            }}>
                <Container maxWidth="sm">
                    <form onSubmit={formik.handleSubmit}>
                        <Box sx={{ my: 3 }}>
                            <Typography
                                color="textPrimary"
                                variant="h4"
                            >
                                MaxxiMize
                            </Typography>
                        </Box>
                        <TextField
                            error={Boolean(formik.touched.organisation && formik.errors.organisation)}
                            fullWidth
                            helperText={formik.touched.organisation && formik.errors.organisation}
                            label="Organisation Code"
                            margin="normal"
                            name="organisation"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type="text"
                            value={formik.values.organisation}
                            variant="outlined"
                        />
                        <Typography 
                        color="red"
                        variant="subtitle2">
                        {formik.values.authenticationError}
                        </Typography>
                        <Typography 
                        color="textPrimary"
                        variant="subtitle2">
                        Forgot the organisation Code? Call us at 67467891 or Email us at maxximize@gmail.com
                        </Typography>
                        <Box sx={{ py: 2 }}>
                            <Button
                                color="primary"
                                disabled={formik.isSubmitting}
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                            >
                                Enter Portal
                            </Button>
                        </Box>
                    </form>
                </Container>
            </Box>
        </div>
    )
}

export default organisationSelection