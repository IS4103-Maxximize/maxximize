import { useEffect } from "react";
import Head from 'next/head';
import Router from 'next/router'

function index() {
  useEffect(() => {
      Router.push('./home')
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

