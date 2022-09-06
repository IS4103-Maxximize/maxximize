import Router from "next/router";
import { useEffect } from "react";


function layout({children}) {


    useEffect(() => {
        const tokenString = localStorage.getItem('access_token')
        if (!tokenString) {
            Router.push('./login')
        }
    })


    return (
        <>
        {children}
        </>
    )
}

export default layout
