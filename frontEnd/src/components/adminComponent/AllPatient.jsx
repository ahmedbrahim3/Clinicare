import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const AllPatient = () => {
    const [data, setData] = useState([]);
    // const navigate = useNavigate();
    useEffect(() => {
        fetchPatient();
      }, []);
    const fetchPatient = async () => {
        try {
          const response = await axios.get("http://localhost:8080/reciption");
          console.log(response.data);
          const updatedData = await Promise.all(
            response.data.map(async (patient) => {
              try {
                if (patient.doctor_id != null) {
                  const doctorResponse = await axios.get(
                    `http://localhost:8080/oneDoctor/${patient.doctor_id}`
                  );
                  const doctorName = doctorResponse.data.name;
                  return { ...patient, doctorName };
                }
                return null;
              } catch (error) {
                console.log("Error Fetching Data details : ", error);
                return null;
              }
            })
          );
          console.log("Updated Data : ", updatedData);
          const dataUpdated = [];
          updatedData.map((element, idx) => {
            if (element != null) {
              dataUpdated.push(element);
            }
          });
          setData(dataUpdated);
        } catch (error) {
          console.log(error);
        }
      };
      const sortData = (value) => {
        if (countNumber === 1) {
          setCountNumber(0);
          const sortedData = [...value].sort((a, b) =>
            a && b ? (a.id > b.id ? 1 : -1) : 0
          );
          setData(sortedData);
        } else {
          setCountNumber(1);
          const sortedData = [...value].sort((a, b) =>
            a && b ? (a.id < b.id ? 1 : -1) : 0
          );
          setData(sortedData);
        }
      };
  return (
    <table className="w-full mb-4">
        <thead>
          <tr>
            <th className="border px-4 py-2">Patient Id</th>
            <th className="border px-4 py-2">First Name</th>
            <th className="border px-4 py-2">Last Name</th>
            <th className="border px-4 py-2">Identification Number</th>
            <th className="border px-4 py-2 cursor-pointer" onClick={() => sortData(data)}>Date Admission</th>
            <th className="border px-4 py-2">Motif</th>
            <th className="border px-4 py-2">Doctor</th>
          </tr>
        </thead>
        <tbody>
          {data.map((element, idx) => (
            <tr key={idx}>
              <td className="border px-4 py-2">{element != null && element.patient.id}</td>
              <td className="border px-4 py-2"><Link to={`/showOne/${element.patient.id}`}>{element != null && element.patient.firstName}</Link></td>
              <td className="border px-4 py-2">{element != null && element.patient.lastName}</td>
              <td className="border px-4 py-2">{element != null && element.patient.identityNumber}</td>
                <td className="border px-4 py-2">
                    {element != null && element.patient.date ? new Date(element.patient.date).toLocaleDateString() : ""}
                </td>

                <td className="border px-4 py-2">{element != null && element.patient.motif}</td>
                <td className="border px-4 py-2">{element != null && element.doctorName}</td>
            </tr>
          ))}
        </tbody>
      </table>
  )
}

export default AllPatient