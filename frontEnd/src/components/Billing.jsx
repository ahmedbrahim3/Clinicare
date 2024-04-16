import React, { useEffect, useState } from "react";
import axios, { Axios } from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";
const Billing = () => {
  // Dummy data representing people
  let serviceIdUpdate = null;
  const [data, setData] = useState([]);
  const [userSet, setUserSet] = useState(null);
  const [medication, setMedication] = useState([]);
  const [onePatient, setOnePatient] = useState([]);
  console.log(userSet);
  const [dosageData, setDosageData] = useState([]);
  const [medicDosage, setMedicDosage] = useState([]);
  const [total, setTotal] = useState(null);
  const [vat, setVat] = useState(null);
  const [serviceIsClicked, setServiceIsClicked] = useState(false);
  const [serviceData, setServiceData] = useState([]);
  const [serviceId, setServiceId] = useState(null);

  const billTotal = async () => {
    try {
      const { total, vat } = medicDosage.reduce(
          (accumulator, element) => {
            accumulator.total += element.uses * element.price;
            accumulator.vat += (element.uses * element.price * 19) / 100;
            return accumulator;
          },
          { total: 0, vat: 0 }
      );

      setTotal(total);
      setVat(vat);
    } catch (error) {
      console.log("Error Adding Total ", error);
    }
  };
  const billTotalLast = async () => {
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
    setTotal(total);
    setVat(vat);
  };

  const fetchPatient = async () => {
    try {
      const response = await axios.get("http://localhost:8080/reciption");
      setData(response.data);
    } catch (error) {
      console.log("Error Fetching Data : ", error);
    }
  };

  const fetchMedic = async () => {
    try {
      const response = await axios.get("http://localhost:8080/medications");
      setMedication(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getOne = async () => {
    try {
      const response = await axios.get(
          `http://localhost:8080/onePatient/${userSet}`
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

  const fetchPatientDataDosage = async () => {
    try {
      const response1 = await axios.get("http://localhost:8080/allDosage");
      const filteredData = response1.data.filter(
          (element) => element.patient_id === userSet
      );
      setDosageData(filteredData);

      const medicationIds = [
        ...new Set(filteredData.map((dosage) => dosage.medic_id)),
      ];

      const promises = medicationIds.map(async (medicationId) => {
        try {
          const medicationResponse = await axios.get(
              `http://localhost:8080/medications/${medicationId}`
          );
          return medicationResponse.data;
        } catch (error) {
          console.log("Error Fetching Medication:", error);
          return null;
        }
      });

      const resolvedMedicationPromises = await Promise.all(promises);

      const processedMedicationData = filteredData.map((dosage) => {
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

      setMedicDosage(processedMedicationData);
      console.log("The Dosage Data :", processedMedicationData);
    } catch (error) {
      console.log("Error Fetching Data", error);
    }
  };
  const fetchService = async () => {
    try {
      const response = await axios.get("http://localhost:8080/services");
      console.log("The Services Data :", response.data);
      setServiceData(response.data);
    } catch (error) {
      console.log("Error Fetching Data : ", error);
    }
  };

  const lastData = async () => {
    try {
      // Fetch services for the selected patient
      const serviceResponse = await axios.get(`http://localhost:8080/onePatient/${userSet}`);

      // Filter services that have patient IDs matching userSet

      // Fetch medication dosages for the selected patient
      const dosageResponse = await axios.get("http://localhost:8080/allDosage");
      const filteredDosageData = dosageResponse.data.filter(
          (dosage) => dosage.patient_id === userSet
      );

      const medicationIds = [
        ...new Set(filteredDosageData.map((dosage) => dosage.medic_id)),
      ];

      const medicationPromises = medicationIds.map(async (medicationId) => {
        try {
          const medicationResponse = await axios.get(
              `http://localhost:8080/medications/${medicationId}`
          );
          return medicationResponse.data;
        } catch (error) {
          console.log("Error Fetching Medication:", error);
          return null;
        }
      });

      const resolvedMedicationPromises = await Promise.all(medicationPromises);

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
      setLastData({
        medic_data: processedMedicationData,
        services_data: serviceResponse.data.
            services_data
        ,
      });

      console.log("The Last Data Is :", lastDataForData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      fetchPatient();
      if (userSet !== null) {
        await Promise.all([
          fetchPatientDataDosage(),
          fetchMedic(),
          getOne(),
          lastData(),
          fetchService(),
        ]);
        billTotalLast();
      }
    };

    fetchData();
  }, [userSet]);

  useEffect(() => {
    if (userSet !== null) {
      billTotalLast();
      getOne();
    }
  }, [lastDataForData]);

  useEffect(()=>{
    billTotalLast();
    getOne();


  },[userSet , lastDataForData])
  const navigate =useNavigate();

  const state = async (event, id) => {
    event.preventDefault();
    setUserSet(id);
    await fetchPatientDataDosage();
    await fetchMedic();
    await getOne();
    billTotalLast();
  };

  const updatedService = async (patientId, serviceId) => {
    try {
      const response = await axios.put(
          `http://localhost:8080/services/addService/${patientId}/${serviceId}`
      );
      console.log("The Response Data For Update : ", response.data);
      lastData();
    } catch (error) {
      console.log("Error Update : ", error);
    }
  };

  const PopUp = async () => {
    try {
      const serviceOption = {};
      serviceData.forEach((oneService) => {
        serviceOption[oneService.id] = oneService.name;
      });

      const { value: confirmed } = await Swal.fire({
        title: "Select a Service",
        input: "select", // Changed input type to select
        inputOptions: serviceOption, // Provide medication options for select dropdown
        inputPlaceholder: "Select a Service",
        showCancelButton: true,
        cancelButtonText: "Cancel",
        inputValidator: (value) => {
          if (!value) {
            return "You need to select a Service";
          }
          console.log(
              "The Selected Value For The Select for this is : ",
              value
          );
          setServiceId(value);
          serviceIdUpdate = value;
          return null;
        },
      });

      if (confirmed && confirmed.dismiss !== Swal.DismissReason.cancel) {
        console.log("The Service Selected ", confirmed);
        updatedService(userSet, serviceIdUpdate);
      } else {
        -Swal.fire({
          title: "Cancelled",
          text: "Your session is safe :)",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error displaying popup:", error);
    }
  };

  const handleOpenPopUp = () => {
    PopUp();
  };

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/");
  };

  return (
      <div class="flex">
        <div
            className="shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
            style={{width: "250px", height: "927px"}}
        >
          <img
              src="https://res.cloudinary.com/dljarbi3r/image/upload/v1708609947/ihfe8mqes3febxmkpbis.png"
              style={{width: "140px", height: "auto", margin: "auto"}}
          />
          <div
              id="search-bar"
              className="w-120 bg-white rounded-md shadow-lg z-10"
          >
            <form className="flex items-center justify-center p-2">
              <input
                  type="text"
                  placeholder="Search here"
                  className="w-full rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
              <button
                  type="submit"
                  className="bg-blue-500 text-white rounded-md px-4 py-1 ml-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
              >
                Search
              </button>
            </form>
          </div>
          <ul role="list" style={{marginTop: "40px"}}>
            {data.map((person, index) => (
                <li
                    key={index}
                    className=" hover:bg-slate-100 "
                    style={{width: "auto", height: "50px"}}
                >
                  <img src={person.imageUrl && person.imageUrl} alt=""/>
                  <div>
                    <p
                        style={{marginLeft: "30px"}}
                        onClick={(event) => state(event, person.patient.id)}
                    >
                      {person.patient.firstName}
                    </p>
                  </div>
                </li>
            ))}
          </ul>
        </div>
        <button onClick={handleLogout}
                className="hover:bg-red-700 bg-red-500 text-white rounded-md px-4 py-1 absolute bottom-0 right-0 mb-4 mr-4">
          Logout
        </button>
        <div style={{margin: "auto", marginTop: ""}}>
          {userSet ? (
              onePatient.patient_data && (
                  <h1
                      style={{
                        marginLeft: "500px",
                        fontSize: "40px",
                        fontFamily: "Karla",
                        marginTop: "20px",
                      }}
                      key={onePatient.patient_data.id}
                  >
                    Details for :{" "}
                    {onePatient.patient_data.firstName +
                        " " +
                        onePatient.patient_data.lastName}
                  </h1>
              )
          ) : (
              <h1 style={{marginLeft: "500px", fontSize: "40px"}}>
                Select Patient First
              </h1>
          )}

          <div
              class="shadow-lg rounded-lg overflow-hidden mx-2 md:mx-10 mt-20"
              style={{width: "1400px", marginTop: "10px"}}
          >
            <table class="w-full table-fixed">
              <thead>
              <tr class="bg-gray-100">
                <th class="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                  Serial Number
                </th>
                <th class="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                  Medication and Services
                </th>
                <th class="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                  Quantity
                </th>
                <th class="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                  Price/Unit
                </th>
                <th class="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                  excluding VAT
                </th>
                <th class="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                  VAT 19 %
                </th>
                <th class="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                  Total VAT
                </th>
              </tr>
              </thead>
              <tbody class="bg-white">
              {lastDataForData.medic_data && lastDataForData.medic_data.map((medicElement, index) => (
                  <tr key={index}>
                    <td
                        className="py-4 px-6 border-b border-gray-200 truncate"
                        style={{padding: "8px"}}
                    >
                      {onePatient.patient_data.identityNumber}
                    </td>
                    <td
                        className="py-4 px-6 border-b border-gray-200 truncate"
                        style={{padding: "8px"}}
                    >
                      {medicElement.name}
                    </td>
                    <td
                        className="py-4 px-6 border-b border-gray-200 truncate"
                        style={{padding: "8px"}}
                    >
                      {medicElement.uses}
                    </td>
                    <td
                        className="py-4 px-6 border-b border-gray-200 truncate"
                        style={{padding: "8px"}}
                    >
                      {medicElement.price + " " + "TND"}
                    </td>
                    <td
                        className="py-4 px-6 border-b border-gray-200 truncate"
                        style={{padding: "8px"}}
                    >
                      {medicElement.uses * medicElement.price + " " + "TND"}
                    </td>
                    <td
                        className="py-4 px-6 border-b border-gray-200 truncate"
                        style={{padding: "8px"}}
                    >
                      {(medicElement.uses * medicElement.price * 19) / 100 +
                          " " +
                          "TND"}
                    </td>
                    <td
                        className="py-4 px-6 border-b border-gray-200 truncate"
                        style={{padding: "8px"}}
                    >
                      {(medicElement.uses * medicElement.price * 19) / 100 +
                          medicElement.uses * medicElement.price +
                          " " +
                          "TND"}
                    </td>
                  </tr>
              ))}
              {/* Render service data */}
              {lastDataForData.services_data && lastDataForData.services_data.map((serviceElement, index) => (
                  <tr key={index}>
                    <td
                        className="py-4 px-6 border-b border-gray-200 truncate"
                        style={{padding: "8px"}}
                    >
                      {onePatient.patient_data.identityNumber}
                    </td>
                    <td
                        className="py-4 px-6 border-b border-gray-200 truncate"
                        style={{padding: "8px"}}
                    >
                      {serviceElement.name}
                    </td>
                    <td
                        className="py-4 px-6 border-b border-gray-200 truncate"
                        style={{padding: "8px"}}
                    >
                      {"The Services No Quantity "}
                    </td>
                    <td
                        className="py-4 px-6 border-b border-gray-200 truncate"
                        style={{padding: "8px"}}
                    >
                      {serviceElement.price}
                    </td>
                    <td
                        className="py-4 px-6 border-b border-gray-200 truncate"
                        style={{padding: "8px"}}
                    >
                      {1 * serviceElement.price + " " + "TND"}
                    </td>
                    <td
                        className="py-4 px-6 border-b border-gray-200 truncate"
                        style={{padding: "8px"}}
                    >
                      {((1 * serviceElement.price * 19) / 100).toFixed(2)} TND
                    </td>
                    <td
                        className="py-4 px-6 border-b border-gray-200 truncate"
                        style={{padding: "8px"}}
                    >
                      {((((1 * serviceElement.price * 19) / 100)) + ((1 * serviceElement.price))).toFixed(2) + "TND"}
                    </td>
                    {/* Add other columns for service data as needed */}
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
          <div className="flex" style={{gap: "600px"}}>
            <div>
              <button
                  type="submit"
                  className="bg-blue-500 text-white rounded-md px-4 py-1 ml-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 h-8"
                  style={{marginTop: "70px", marginLeft: "40px"}}
                  onClick={() => handleOpenPopUp()}
              >
                Add Service
              </button>
              <br/>
              <button
                  type="submit"
                  className="bg-blue-500 text-white rounded-md px-4 py-1 ml-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 h-8 "
                  style={{marginTop: "15px", marginLeft: "40px"}}
              >
                Add Medication
              </button>
              <br/>
              <button
                  type="submit"
                  className="bg-blue-500 text-white rounded-md px-4 py-1 ml-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 h-8 "
                  style={{marginTop: "15px", marginLeft: "40px"}}
                  onClick={() => navigate(`/pdf/${userSet}`)}
              >
                Show PDF
              </button>
            </div>

            <div
                class="shadow-lg rounded-lg overflow-hidden mx-2 md:mx-10 mt-20 "
                style={{width: "550px"}}
            >
              <table class="w-full table-fixed">
                <thead>
                <tr class="bg-gray-100">
                  <th class="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                    Description
                  </th>
                  <th class="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                    Amount{" "}
                  </th>
                </tr>
                </thead>
                <tbody class="bg-white">
                <tr>
                  <td class="py-4 px-6 border-b border-gray-200">Total Bill</td>
                  <td class="py-4 px-6 border-b border-gray-200 truncate">
                    {total ? total + " " + "TND" : "--"}
                  </td>
                </tr>
                <tr>
                  <td class="py-4 px-6 border-b border-gray-200">Total VAT</td>
                  <td class="py-4 px-6 border-b border-gray-200">
                    {vat ? vat + " " + "TND" : "--"}
                  </td>
                </tr>
                <tr>
                  <td class="py-4 px-6 border-b border-gray-200">Stamp</td>
                  <td class="py-4 px-6 border-b border-gray-200"> 0.6 TND</td>
                </tr>
                <tr>
                  <td class="py-4 px-6 border-b border-gray-200">
                    Total Price{" "}
                  </td>
                  <td class="py-4 px-6 border-b border-gray-200">
                    {total != null && vat != null ? total + vat + 0.6 : "--"}
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Billing;