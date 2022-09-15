const useAuth = () => {
    // return useContext(AuthContext)
    //check localStorage if it contains user
    return localStorage.getItem('user')
}

export default useAuth;