import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <Auth0Provider domain="dev-0lpn2fkjja3i4mrj.us.auth0.com"
    clientId="WaDi8GWKkwpDYFTA50x0HGMxyprqapR7"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}>
    <App />
    </Auth0Provider>
  </StrictMode>
)
