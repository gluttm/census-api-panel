import { FC, useState, createContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/app/store';
import { setIsLogged } from 'src/feautures/authSlice';
import { JwtToken } from 'src/types/Login';
import { Auth } from 'src/types/User';
import { LocalKey, LocalStorage } from 'ts-localstorage';
import jwt_decode from "jwt-decode";

type SidebarContextType = { sidebarToggle: any; toggleSidebar: () => void };

export const SidebarContext = createContext<SidebarContextType>(
  {} as SidebarContextType
);

export const SidebarProvider: FC = ({ children }) => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
console.log('sidebar');

  const isLogged = useSelector((state: RootState) => state.auth.isLogged)
  const dispatch = useDispatch()

  useEffect(() => {
    console.log('When magic');
    
      const key = new LocalKey<Auth>("user", {accessToken: '', isLogged: false});
      const creds : Auth  = LocalStorage.getItem<Auth>(key);
      if (creds !== null) {
        const decoded_token : JwtToken = jwt_decode(creds.accessToken)
        const authorities = [];
        decoded_token.authorities.map(auths => authorities.push(auths.authority))
        const expiresIn = decoded_token.exp - decoded_token.iat
        dispatch(setIsLogged({accessToken: creds.accessToken, isLogged: true, authorities}))
        setTimeout(() => {
          LocalStorage.removeItem(key)
          dispatch(setIsLogged({accessToken: '', isLogged: false, authorities}))
          window.location.href = '/login'
        }, expiresIn * 1000)
      }
  }, [dispatch, isLogged])

  const toggleSidebar = () => {
    setSidebarToggle(!sidebarToggle);
  };

  return (
    <SidebarContext.Provider value={{ sidebarToggle, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};
