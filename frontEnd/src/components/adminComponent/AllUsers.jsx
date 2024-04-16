import React, { useEffect, useState } from "react";
import axios from "axios";
const AllUsers = () => {

    const [data , setData] = useState([]);

    const fetchUsers = async()=>{
        try{
            const response = await axios.get("http://localhost:8080/allUsers");
            console.log("All Users : " , response.data);
            setData(response.data);
        }catch(error){
            console.log("Error Fetching Data :" , error);
        }
    }
    useEffect(()=>{
        fetchUsers();
    },[])



  return (
    <>
    <table className="w-full mb-4">
        <thead>
          <tr>
            <th className="border px-4 py-2">User Id</th>
            <th className="border px-4 py-2">UserName</th>
            <th className="border px-4 py-2">Type</th>
          </tr>
        </thead>
        <tbody>
          {data.map((element, idx) => (
            <tr key={idx}>
              <td className="border px-4 py-2">{element != null && element.id}</td>
              <td className="border px-4 py-2">{element != null && element.userName}</td>
              <td className="border px-4 py-2">{element != null && element.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    
    </>
  )
}

export default AllUsers