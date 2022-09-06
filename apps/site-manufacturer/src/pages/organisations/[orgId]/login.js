import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Container, Link, Skeleton, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as Yup from 'yup';

async function loginUser(credentials) {
  try {
    const res = await fetch('http://localhost:3000/api/login',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
    console.log(res)
    if (res.status === 201 || res.status === 200) {
      const result = await res.json()
      return result
    } else {
      return null
    } 
  } catch (err) {
    throw err
  }
  
}

const Login = ({organisation}) => {
  const router = useRouter();
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
        localStorage.setItem('access_token', result.access_token)
        //retrieve user Data
        const user = await getUserFromJWT(result.access_token)
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('organisation', JSON.stringify(organisation))
        console.log(organisation)
        router.push(`/organisations/${organisation.id}/users/${user.id}/dashboard`)
      } else {
        formik.values.authenticationError = 'Your credentials are incorrect/not found'
      }
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
      <Head>
        <title>Login</title>
      </Head>
      <Box
        component="main"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexGrow: 1,
          minHeight: '100%'
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
                color="textPrimary"
                variant="h4"
              >
                {organisation?.name}
              </Typography>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="body2"
              >
                Login
              </Typography>
            </Box>
            <TextField
              error={Boolean(formik.touched.email && formik.errors.email)}
              fullWidth
              helperText={formik.touched.email && formik.errors.email}
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
                color="primary"
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

export const getServerSideProps = async(context) => {
    console.log(context.params)
  const res = await fetch(`http://localhost:3000/api/organisations/${context.params.orgId}`)
  const organisation = await res.json()
  return {
    props: {
      organisation
    }
  }
}

export default Login;
