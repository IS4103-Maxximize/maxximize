import Head from 'next/head';
import  Router  from 'next/router';
import { useEffect } from 'react';
  
function index() {
  useEffect(() => {
    const accessToken = localStorage.getItem('access_token')
    if (accessToken) {
      const orgId = JSON.parse(localStorage.getItem('organisation')).id
      const userId = JSON.parse(localStorage.getItem('user')).id
      Router.push(`/organisations/${orgId}/users/${userId}/dashboard`)
    }
  })

  return (
    <>
      <Head>
        <title>
          Maxximize
        </title>
      </Head>
    </>
  )
}

export default index

