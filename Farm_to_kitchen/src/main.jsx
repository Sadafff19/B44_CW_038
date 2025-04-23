import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import {  UserContextProvider } from './context/userContext.jsx'
import { ThemeProvider } from "@material-tailwind/react";

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <UserContextProvider>
        <BrowserRouter>
        <App />
      </BrowserRouter>  
    </UserContextProvider> 
  </ThemeProvider> 
  
)
