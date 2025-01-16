import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const LoginButton = () => {
  const { user, loginWithRedirect, isAuthenticated, logout} = useAuth0();

  return <div className="flex items-center justify-center bg-amber-50 min-h-screen">{
    isAuthenticated && (<p>Hi {user.name}</p>)
  }
    {isAuthenticated ? (<button onClick={(e) => logout()}>Log Out</button>) : (<button onClick={(e) => loginWithRedirect()}>Log In</button>)}
  </div> 
};

export default LoginButton;