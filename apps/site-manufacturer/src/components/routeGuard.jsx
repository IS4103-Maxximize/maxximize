import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';


export { RouteGuard };

function RouteGuard({ children }) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const url = router.asPath
        const handleRouteChangeStart = (url, { shallow }) => {
            setAuthorized(false)
        }

        const handleRouteChangeComplete = (url, { shallow }) => {
            setAuthorized(true)
        }
            
        router.events.on('routeChangeStart', handleRouteChangeStart)
        router.events.on('routeChangeComplete', handleRouteChangeComplete)
        const accessToken = localStorage.getItem('access_token')
        const orgId = JSON.parse(localStorage.getItem('organisation'))?.id
        const userId = JSON.parse(localStorage.getItem('user'))?.id
        const accessibleRoutes = ['/']
        if (!accessToken) {
            //if no accessToken, navigate back to login page
            router.push('/organisationSelection')
        } else {
            //can only access urls with /organisation/:orgId/users/:userId/..
            if (url.includes(`organisations/${orgId}/users/${userId}`) || accessibleRoutes.includes(url)) {
                setAuthorized(true)
            } else {
                router.push('/404')
            }
        }
    }, []);

    return (authorized && children);
}