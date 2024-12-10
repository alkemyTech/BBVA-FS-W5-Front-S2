import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Login from './Components/Login'
import Home from './Components/Home'
import SignUp from './Components/SignUp/signUp'
import Balance from './Components/Balance/Balance'
import PlazoFijo from './Components/FixedTermDeposit/FixedTermDeposit'
import {Routes, Route,} from 'react-router-dom';
import Users from './Components/Users/Users';
import Page from './Components/Material UI/Page'


import './App.css'
function App() {
  const [count, setCount] = useState(0)
  return (
    <Page>
      <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="/Balance" element={<Balance />} />
          <Route path="/PlazoFijo" element={<PlazoFijo />} />
          <Route path="/Usuarios" element={<Users/>} />
      </Routes>
    </Page>
  )
}
export default App