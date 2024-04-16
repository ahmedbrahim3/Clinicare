import React, { useEffect, useRef } from "react";
import { useParams } from "react-router";
import { useReactToPrint } from "react-to-print";
import { useState } from "react";
import axios from "axios";
import { element } from "react-popup/dist/Bem";
const Print = () => {
  const { patientId } = useParams();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Visitor Pass",
    onAfterPrint: () => console.log("Printed PDF successfully!"),
  });
  const [onePatient, setOnePatient] = useState([]);

  const getOne = async () => {
    try {
      const response = await axios.get(
          `http://localhost:8080/onePatient/${patientId}`
      );
      const dataPatient = {
        id: response.data.id,
        cin: response.data.cin,
      };
      setOnePatient(response.data);
      console.log("The One Patient Data : ", response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const [lastDataForData, setLastData] = useState({
    medic_data: [],
    services_data: [],
  });
  useEffect(() => {
    const fetchData = async () => {
      if (patientId != null) {
        await lastData();
        await getOne();
      }
    };
    fetchData();
  }, []);
  const lastData = async () => {
    try {
      // Fetch services for the selected patient
      const serviceResponse = await axios.get(
          `http://localhost:8080/onePatient/${patientId}`
      );

      // Filter services that have patient IDs matching userSet

      // Fetch medication dosages for the selected patient
      const dosageResponse = await axios.get("http://localhost:8080/allDosage");
      const filteredDosageData = dosageResponse.data.filter((dosage) => {
        return dosage.patient_id === Number(patientId);
      });
      console.log("Filtered Dosage Id : ", filteredDosageData);
      const medicationIds = [
        ...new Set(filteredDosageData.map((dosage) => dosage.medic_id)),
      ];

      const medicationPromises = medicationIds.map(async (medicationId) => {
        console.log("The Medication Id : ", medicationId);
        try {
          console.log("The Medication Id", medicationId);
          const medicationResponse = await axios.get(
              `http://localhost:8080/medications/${medicationId}`
          );
          console.log("The Medic Is :", medicationResponse.data);
          return medicationResponse.data;
        } catch (error) {
          console.log("Error Fetching Medication:", error);
          return null;
        }
      });

      const resolvedMedicationPromises = await Promise.all(medicationPromises);
      console.log("The Resolved Promise :", resolvedMedicationPromises);
      const processedMedicationData = filteredDosageData.map((dosage) => {
        const medication = resolvedMedicationPromises.find(
            (med) => med.id === dosage.medic_id
        );
        return {
          id: dosage.medic_id,
          name: medication ? medication.name : "",
          dosage: medication ? medication.dosage : "",
          quantity: medication ? medication.quantity : "",
          price: medication ? medication.price : "",
          uses: dosage.uses,
        };
      });

      // Update the state with both services and medication dosages
      console.log("The ProceedMedication : ", processedMedicationData);
      console.log("The Service : ", serviceResponse.data.services_data);
      setLastData({
        medic_data: processedMedicationData,
        services_data: serviceResponse.data.services_data,
      });

      console.log("The Last Data Is :", lastDataForData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const [total, setTotla] = useState(null);
  const [vat, setVat] = useState(null);
  const billTotal = async () => {
    let total = 0;
    let vat = 0;

    if (lastDataForData && lastDataForData.medic_data) {
      lastDataForData.medic_data.map((element) => {
        total += element.uses * element.price;
        vat += (element.uses * element.price * 19) / 100;
      });
    }

    if (lastDataForData && lastDataForData.services_data) {
      lastDataForData.services_data.map((element) => {
        total += element.price;
        vat += (element.price * 19) / 100;
      });
    }
    setTotla(total);
    setVat(vat);
  };
  useEffect(() => {
    billTotal();
  }, [lastDataForData]);
  return (
      <>
        <div
            className="pass-title"
            ref={componentRef}
            style={{ width: "100%", height: window.innerHeight }}
        >
          <img
              src="https://res.cloudinary.com/dljarbi3r/image/upload/v1708609947/ihfe8mqes3febxmkpbis.png"
              style={{ width: "140px", height: "auto", margin: "auto" }}
          />
          <table className="w-full mt-8 border-collapse border border-gray-300">
            <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2">
                Patient Name{" "}
              </th>
              <th className="border border-gray-300 px-4 py-2">
                Patient Identification Number
              </th>
              <th className="border border-gray-300 px-4 py-2">
                Patient Rapport
              </th>
            </tr>
            </thead>
            {patientId &&
                onePatient.patient_data &&
                <tr key={onePatient.patient_data.id} className={onePatient.patient_data.id % 2 === 0 ? "bg-gray-100" : ""}>
                  <td>{onePatient.patient_data.firstName.charAt(0).toUpperCase()+onePatient.patient_data.firstName.substr(1 , onePatient.patient_data.firstName.length) + " " + onePatient.patient_data.lastName.charAt(0).toUpperCase()+onePatient.patient_data.lastName.substr(1 , onePatient.patient_data.lastName.length)}</td>
                  <td>{onePatient.patient_data.identityNumber}</td>
                  <td>{onePatient.patient_data.rapport}</td>
                </tr>
            }
          </table>
          <table className="w-full mt-8 border-collapse border border-gray-300">
            <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Uses</th>
              <th className="border border-gray-300 px-4 py-2">Price</th>
            </tr>
            </thead>
            <tbody>
            {lastDataForData &&
                lastDataForData.medic_data.map((element, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-gray-100" : ""}>
                      <td className="border border-gray-300 px-4 py-2">
                        {element.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {element.uses}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {element.price} TND
                      </td>
                    </tr>
                ))}
            {lastDataForData &&
                lastDataForData.services_data.map((element, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-gray-100" : ""}>
                      <td className="border border-gray-300 px-4 py-2">
                        {element.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">-</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {element.price} TND
                      </td>
                    </tr>
                ))}
            </tbody>
            <tfoot>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-bold">
                Total Price
              </td>
              <td className="border border-gray-300 px-4 py-2" colSpan="2">
                {total} TND
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-bold">
                Total Price With Vat
              </td>
              <td className="border border-gray-300 px-4 py-2" colSpan="2">
                {total + vat} TND
              </td>
            </tr>
            </tfoot>
          </table>
        </div>
        <button
            className="absolute top-0 right-0 mt-4 mr-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md"
            onClick={handlePrint}
        >
          Print pass
        </button>
      </>
  );
};

export default Print;
