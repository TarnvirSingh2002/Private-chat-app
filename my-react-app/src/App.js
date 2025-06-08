import MessageBoard from './Components/MessageBoard'
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Components/Login';
import SignIn from './Components/SignIn';
import SideBar from './Components/SideBar';
export default function App() {
  return (
     <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path="/SignIn" element={<SignIn/>}/>
          <Route path='/allmessages' element={<MessageBoard/>}/>
          <Route path='/Sidebar' element={<SideBar/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}
