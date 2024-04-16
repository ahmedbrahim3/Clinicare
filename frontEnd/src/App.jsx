import { createContext, useState , useEffect} from 'react'
import {Route , Routes , Navigate} from 'react-router-dom';
import Cookies from "js-cookie";
import Home from './components/Home';
import Login from './components/Login';
import Reciption from './components/Reciption';
import AddPatient from './components/AddPatient';
import AdminDashboard from './components/AdminDashboard';
import AddMedic from './components/AddMedic';
import AddUser from './components/AddUser';
import Billing from './components/Billing';
import Print from './components/Print';
import Emergency from './components/Home';
import ShowOnePatient from './components/ShowOnePatient';
import EditOnePatient from './components/EditOnePatient';
import Radiology from "./components/Radiology.jsx";
function App() {
  const token = Cookies.get("token");
  const [data, setData] = useState("");
  // const userName = localStorage.setItem("userName" , data);
  useEffect(()=>{
    console.log(token);
  },[token])
  return (
    <>
      <Routes>
        <Route path='/' element={<Navigate to="/login"/>}/>
        <Route path="/login" element={<Login setData={setData}/>}/>
        <Route path='/pdf/:patientId' element={<Print />}/>
        {/* <Route path='/' element={<Navigate to="/home"/>}/> */}
        <Route path='*' element={<Navigate to="/login"/>}/>
        {/* <Route path='/emergency' element={<Emergency />}/> */}
        {token && (
          <>
          <Route path='/home' element={<Emergency />}/>
          <Route path='/addPatient' element={<AddPatient />}/>
          <Route path='/reciption' element={<Reciption user = {data}/>}/>
          <Route path='*' element={<Navigate to="/home" />}/>
          <Route path="/showOne/:patientId" element={<ShowOnePatient />} />
          <Route path="/onePatient/:patientId" element={<ShowOnePatient />} />
          <Route path="/editPatient/:patientId" element={<EditOnePatient />} />
          <Route path='/admin' element={<AdminDashboard />}/>
          <Route path='/addMedic' element={< AddMedic />}/>
          <Route path='/addUser' element={< AddUser />}/>
          <Route path='/billing' element={<Billing />}/>
          <Route path='/radiology' element={< Radiology />}/>
          </>
        )
        }
      </Routes>
    </>
  )
}

export default App
