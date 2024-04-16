import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
const AllMedic = () => {
    useEffect(() => {
        fetchMedic();
      }, []);
    const [medicQ, setMedicQ] = useState([]);
    const [medic, setMedic] = useState([]);
    const navigate = useNavigate();
    const fetchMedic = async () => {
        try {
          const response = await axios.get("http://localhost:8080/medications");
          console.log("Medic Response Data : ", response.data);
          const medicQ = response.data.filter(
            (element) => element.Medic.quantity > 0
          );
          const medic = response.data.filter(
            (element) => element.Medic.quantity == 0
          );
          console.log("This Medic Available :", medicQ);
          console.log("This Medic Data That Arent Available : ", medic);
          setMedicQ(medicQ);
          setMedic(medic);
        } catch (error) {
          console.log("Error Fetching Data Medic  : ", error);
        }
      };
      const deleted = async(id)=>{
        try{
          const response = await axios.delete(`http://localhost:8080/medications/delete/${id}`);
          console.log("The Medic Has Deleted :" , response.data);
        }catch(error){
          console.log("Error Deleting This Medic " , error);
        }
      };
  return (
    <>
    <h2 className="text-lg font-bold mb-2">List Of All Available Medic</h2>
      <table className="w-full mb-4">
        <thead>
          <tr>
            <th className="border px-4 py-2">Medic Id</th>
            <th className="border px-4 py-2">Medic Name</th>
            <th className="border px-4 py-2">Dosage</th>
            <th className="border px-4 py-2">Medic Quantity</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {medicQ.sort((a, b) => (a.id > b.id ? 1 : -1)).map((element, idx) => (
            <tr key={idx}>
              <td className="border px-4 py-2">{element.Medic.id}</td>
              <td className="border px-4 py-2">{element.Medic.name}</td>
              <td className="border px-4 py-2">{element.Medic.dosage}</td>
              <td className="border px-4 py-2">{element.Medic.quantity}</td>
              <td className="border px-4 py-2">{element.Medic.price} TND</td>
              <td className="border px-4 py-2">
                <button onClick={()=>navigate("/admin")}>Edit</button>
                <button onClick={()=>deleted(element.Medic.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <h2 className="text-lg font-bold mb-2">List Of All Not Available Medic</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th className="border px-4 py-2">Medic Id</th>
            <th className="border px-4 py-2">Medic Name</th>
            <th className="border px-4 py-2">Dosage</th>
            <th className="border px-4 py-2">Medic Quantity</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {medic.sort((a, b) => (a.id > b.id ? 1 : -1)).map((element, idx) => (
            <tr key={idx}>
              <td className="border px-4 py-2">{element.Medic.id}</td>
              <td className="border px-4 py-2">{element.Medic.name}</td>
              <td className="border px-4 py-2">{element.Medic.dosage}</td>
              <td className="border px-4 py-2">{element.Medic.quantity}</td>
              <td className="border px-4 py-2">{element.Medic.price} TND</td>
              <td className="border px-4 py-2">
                <button>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default AllMedic