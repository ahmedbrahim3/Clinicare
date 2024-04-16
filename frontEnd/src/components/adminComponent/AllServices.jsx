import React, { useEffect, useState } from "react";
import axios from "axios";

const AllServices = () => {
    const [data , setData] = useState([]);
    const sortData = (value) => {
        if (countNumber === 1) {
          setCountNumber(0);
          const sortedData = [...value].sort((a, b) =>
            a && b ? (a.quantity > b.quantity ? 1 : -1) : 0
          );
          setData(sortedData);
        } else {
          setCountNumber(1);
          const sortedData = [...value].sort((a, b) =>
            a && b ? (a.quantity < b.quantity ? 1 : -1) : 0
          );
          setData(sortedData);
        }
      };
    const fetchServices = async()=>{
        try{
            const response = await axios.get("http://localhost:8080/services");
            console.log("The Respnse For The Services :" + response.data);
            setData(response.data);
        }catch(error){
            console.log("Error Fetching Data : " , error);
        }
    }
    useEffect(() => {
        fetchServices();
      }, []);
  return (
    <>
<table className="w-full mb-4">
        <thead>
          <tr>
            <th className="border px-4 py-2" onClick={()=>sortData(data)}>Service Id</th>
            <th className="border px-4 py-2">Service Name</th>
            <th className="border px-4 py-2">Service Price</th>
            <th className="border px-4 py-2">Service Quantity</th>
          </tr>
        </thead>
        <tbody>
          {data.map((element, idx) => (
            <tr key={idx}>
              <td className="border px-4 py-2">{element != null && element.id}</td>
              <td className="border px-4 py-2">{element != null && element.name}</td>
              <td className="border px-4 py-2">{element != null && element.price}</td>
              <td className="border px-4 py-2">{element != null && element.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default AllServices