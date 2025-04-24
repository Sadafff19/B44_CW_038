import { useState } from 'react'
import './App.css'
import Navbar from './Components/navbar'
import {Routes,Route} from 'react-router-dom'
import Home from './Components/home'
import Login from './Components/login'
import Signup from './Components/signup'
import Profile from './Components/profile'
import Shop from './Components/shop'
import AboutUs from './Components/about'
import Contact from './Components/contact'
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  
  return (
    <>
      <Navbar/>
      <Routes>
          <Route  path='/' element={<Home/>}/>
          <Route  path='/login' element={<Login/>}/>
          <Route  path='/signup' element={<Signup/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/shop' element={<Shop/>}/>
          <Route path='/about' element={<AboutUs/>}/>
          <Route path='/contact' element={<Contact/>}/>
      </Routes>
    </>
  )
}

export default App
