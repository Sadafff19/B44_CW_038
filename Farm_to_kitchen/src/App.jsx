import { useState } from 'react'
import './App.css'
import Navbar from './Components/navbar'
import {Routes,Route} from 'react-router-dom'
import Home from './Components/home'
import Login from './Components/login'
import Signup from './Components/signup'
import Profile from './Components/profile'
function App() {
  
  return (
    <>
      <Navbar/>
      <Routes>
          <Route  path='/' element={<Home/>}/>
          <Route  path='/login' element={<Login/>}/>
          <Route  path='/signup' element={<Signup/>}/>
          <Route path='/profile' element={<Profile/>}/>
      </Routes>
    </>
  )
}

export default App
