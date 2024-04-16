import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
const Doctor = () => {
  const [data ,setData] = useState([]);
  useEffect(()=>{
    fetchDoctor();
  },[]);
  const fetchDoctor = async()=>{
    try{
      const response  = await axios.get("http://localhost:8080/allDoctors");
      console.log("The Doctor Responses : " , response.data);
      setData(response.data);
    }catch(error){
      console.log("Error Fetching Data :" , error);
    }
  }
  return (
    <table className="w-full mb-4">
        <thead>
          <tr>
            <th className="border px-4 py-2">Doctor Id</th>
            <th className="border px-4 py-2">Doctor Name</th>
            <th className="border px-4 py-2">Doctor Type</th>
            <th className="border px-4 py-2">Doctor Availability</th>
          </tr>
        </thead>
        <tbody>
          {data.map((element, idx) => (
            <tr key={idx}>
              <td className="border px-4 py-2">{element != null && element.id}</td>
              <td className="border px-4 py-2"><Link to={`/showOne/${element.name}`}>{element != null && element.name}</Link></td>
              <td className="border px-4 py-2">{element != null && element.type}</td>
              <td className="border px-4 py-2">{element != null && element.available ?"Available" : "False "}</td>
            </tr>
          ))}
        </tbody>
      </table>
  )
}

export default Doctor