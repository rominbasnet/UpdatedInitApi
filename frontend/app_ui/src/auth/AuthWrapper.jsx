import {createContext, useState} from 'react';

export const AuthContext = createContext({});

export const AuthWrapper = ({children}) =>{
  const [auth, setAuth] = useState({});

  return(
    <AuthContext.Provider value = {
      {
        auth, 
        setAuth
      }
    }>
     {children}
    </AuthContext.Provider>
  )
}
export default AuthWrapper; 


