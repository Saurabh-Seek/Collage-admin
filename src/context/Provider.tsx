import React, { useReducer, SetStateAction, useState, ReactNode } from "react";
import authInitialState from "./initialStates/authInitialState";
import auth from "./reducers/auth";
import logoutSuccess from "./actions/auth/logoutSuccess";
import { useLocation, useNavigate } from "react-router-dom";
import UserPool from "../utils/UserPool";
import seekSolutionApi from "../utils/seekSolutionApi";

interface CommonContextType {
  loading: boolean;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
  authState: {
    accessToken:string,
    email:string,
    firstName:string,
    lastName:string,
  };
  authDispatch: any;
  logOutNow: any;
}

export const GlobalContext = React.createContext({} as CommonContextType);

type GlobleContextProviderProps = {
  children: ReactNode;
};

export const GlobalProvider = (props: GlobleContextProviderProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [authState, authDispatch] = useReducer(auth, authInitialState, () => {
    const localAuthState = localStorage.getItem("authState");
    let _temp = localAuthState ? JSON.parse(localAuthState) : authInitialState;
    console.log("_temp", _temp);
    console.log("_temp?.idToken?.jwtToken", _temp?.idToken?.jwtToken);

    seekSolutionApi.setToken(_temp?.accessToken);
    return _temp;
  });

  const scrollToTop = () => {
    if (window) {
      window.scrollTo(0, 0);
    }
  };

  const logOutNow = () => {
    logoutSuccess({})(authDispatch);
    navigate("/", { replace: true });
  };

  React.useEffect(() => {
    localStorage.setItem("authState", JSON.stringify(authState));
  }, [authState]);

  React.useEffect(scrollToTop, [location.pathname]);

  return (
    <GlobalContext.Provider
      value={{
        loading,
        setLoading,
        authState,
        authDispatch,
        logOutNow,
        ...props,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};

export const useGlobalProvider = () => React.useContext(GlobalContext);
