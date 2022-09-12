import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import * as Yup from 'yup';

async function loginUser(credentials) {
  const res = await fetch('http://localhost:3000/api/auth/login',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
  if (res.status === 201 || res.status === 200) {
    const result = await res.json()
    return result
  } else {
    return null
  } 
}

const Login = () => {
  const location = useLocation()
  const navigate = useNavigate()
    
  const from = location.state?.from?.pathname || '/'
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      authenticationError: ''
    },
    validationSchema: Yup.object({
      username: Yup
        .string()
        .max(255)
        .required(
          'Username is required'),
      password: Yup
        .string()
        .max(255)
        .required(
          'Password is required')
    }),
    onSubmit: async({username, password}) => {
      const result = await loginUser({username, password})
      if (result) {
        //check if the user organisation belong to the same organisation as that of login landing page
        const user = await getUserFromJWT(result.access_token)
        if (user?.organisation?.type === 'Maxximize') { //this is not a good way...
          localStorage.setItem('user', JSON.stringify(user))
          formik.values.username = ''
          formik.values.password = ''
          navigate(from, { replace: true });
        }
      } 
      formik.values.authenticationError = "You are Unauthorised" 
    }
  });


  const getUserFromJWT = async(accessToken) => {
    const res = await fetch('http://localhost:3000/api/profile', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    const result = await res.json()
    const {id} = result
    const userRes = await fetch(`http://localhost:3000/api/users/findUser/${id}`)
    const user = await userRes.json()
    return user
  }

  return (
    <>
      <Box
        component="main"
        sx={{
          alignItems: 'center',
            display: 'flex',
            flexGrow: 1,
            minHeight: '85vh'
        }}
      >
        <Container maxWidth="sm">
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ my: 3 }}>
              <Typography
                color="textPrimary"
                variant="h4"
              >
                MaxxiMize
              </Typography>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="body2"
              >
                Organisation Portal Login
              </Typography>
            </Box>
            <TextField
              error={Boolean(formik.touched.username && formik.errors.username)}
              fullWidth
              helperText={formik.touched.username && formik.errors.username}
              label="Username"
              margin="normal"
              name="username"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="email"
              value={formik.values.username}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label="Password"
              margin="normal"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.password}
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
              Having troubles logging in? Call us at 67467891 or Email us at maxximize@gmail.com
            </Typography>
            <Box sx={{ py: 2 }}>
              <Button
                color="success"
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Log in
              </Button>
            </Box>
          </form>
        </Container>
      </Box>
    </>
  );
};

export default Login