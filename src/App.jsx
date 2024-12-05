import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Login from './Components/Login'
import Home from './Components/Home'
import Page from './Components/Material UI/Page'
import {Routes, Route,} from 'react-router-dom';


import './App.css'

function App() {
  const [count, setCount] = useState(0)

  

  return (
    <Page>
      <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/home" element={<Home/>}/>
      </Routes>
    </Page>
  )
}

export default App
