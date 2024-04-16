import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Emergency = () => {
  let pzexterne = null;
  let counterMedic = 0;
  const [pz, setPz] = useState(null);
  const [patients, setPatient] = useState([]);
  const [onePatients, setOnePatient] = useState([]);
  const [medication, setMedication] = useState([]);
  const [oneMedication, setOneMedication] = useState([]);
  const [pationId, setPatientId] = useState(null);
  const [counterValue, setCounterValue] = useState(1);
  const [id, setId] = useState(null);
  const [dosageData, setDosageData] = useState([]);
  const [selectedMedicationId, setSelectedMedicationId] = useState(0);
  const [medicDosage, setMedicDosage] = useState([]);
  const [dosageTemp, setDosageTemp] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [rapport, setRapport] = useState({ rapport: "" });
  const navigate = useNavigate();
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/reciption");
      const filteredData = response.data.filter(
        (element, idx) => element.patient.motif === "Emergency"
      );
      setPatient(filteredData);
    } catch (error) {
      console.log(error);
    }
  };
  const submitRapport = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      const response = await axios.put(
        `http://localhost:8080/updateRapport/${pationId}`,
        rapport
      );
      console.log(
        "The Patient Rapport has Been Submited With Succes",
        response.data
      );
    } catch (error) {
      console.log("Error Putting the Details ", error);
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
        `http://localhost:8080/onePatient/${pationId}`
      );
      const dataPatient = {
        id: response.data.id,
        cin: response.data.cin,
      };
      setOnePatient(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
    getOne();
    fetchMedic();
    fetchPatientDataDosage();
  }, [pationId]);

  const state = (id) => {
    setPatientId(id);
    fetchPatientDataDosage();
  };

  const addMedic = async () => {
    try {
      if (pzexterne != null) {
        await axios.put(
          `http://localhost:8080/reception/${pzexterne}/${pationId}/medic`
        );
        const res = await axios.put(
          `http://localhost:8080/insertDosage/${pationId}/${pzexterne}/${counterMedic}`
        );
        fetchData();
        fetchPatientDataDosage();
        pzexterne = 0;
      } else {
        console.log("The Medication Id Is Null");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPatientDataDosage = async () => {
    try {
      const response = await axios.get("http://localhost:8080/allDosage");
      const filteredData = response.data.filter(
        (element) => element.patient_id === pationId
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
    } catch (error) {
      console.log("Error Fetching Data", error);
    }
  };

  const PopUp = async () => {
    let counter = 0;
    try {
      const medicationOptions = {};
      medication.forEach((oneMedic) => {
        medicationOptions[oneMedic.Medic.id] = oneMedic.Medic.name;
      });

      const { value: confirmed } = await Swal.fire({
        title: "Select a Medication",
        input: "select",
        inputOptions: medicationOptions,
        inputPlaceholder: "Select a medication",
        showCancelButton: true,
        cancelButtonText: "Cancel",
        inputValidator: (value) => {
          if (!value) {
            return "You need to select a medication";
          }

          setPz(value);
          pzexterne = value;
          return null;
        },
        html: `
          <div class="flex items-center justify-center space-x-2">
            <button id="decrement" class="px-3 py-1 bg-gray-200 text-gray-700 rounded-full focus:outline-none" type="button">-</button>
            <input id="counter" type="text" value="${counter}" class="px-3 py-1 w-12 text-center border border-gray-300 rounded-md focus:outline-none" readonly />
            <button id="increment" class="px-3 py-1 bg-gray-200 text-gray-700 rounded-full focus:outline-none" type="button">+</button>
          </div>`,
        focusConfirm: true,
        didOpen: () => {
          const incrementButton = Swal.getPopup().querySelector("#increment");
          const decrementButton = Swal.getPopup().querySelector("#decrement");
          const counterInput = Swal.getPopup().querySelector("#counter");

          const handleIncrement = () => {
            setCounterValue((prevCounterValue) => prevCounterValue + 1);
            counter++;
            counterInput.value = counter;
            counterMedic = counter;
          };

          const handleDecrement = () => {
            setCounterValue((prevCounterValue) => prevCounterValue - 1);
            counter--;
            counterInput.value = counter;
            counterMedic = counter;
          };

          incrementButton.addEventListener("click", handleIncrement);
          decrementButton.addEventListener("click", handleDecrement);

          return () => {
            incrementButton.removeEventListener("click", handleIncrement);
            decrementButton.removeEventListener("click", handleDecrement);
          };
        },
      });

      if (confirmed && confirmed.dismiss !== Swal.DismissReason.cancel) {
        addMedic();
      } else {
        Swal.fire({
          title: "Cancelled",
          text: "Your session is safe :)",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error displaying popup:", error);
    }
  };

  useEffect(() => {
    // Filter patients based on searchInput
    setFilteredPatients(
      patients.filter((person) =>
        person.patient.firstName
          .toLowerCase()
          .includes(searchInput.toLowerCase())
      )
    );
  }, [searchInput, patients]);

  useEffect(() => {
    console.log("Medic Dosage State Updated:", medicDosage);
  }, [medicDosage]);

  useEffect(() => {
    console.log(pz, "Pz after setting it");
  }, [pz]);

  useEffect(() => {
    console.log(counterValue, "Counter value after setting it");
  }, [counterValue]);

  const handleOpenPopUp = () => {
    PopUp();
  };

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/");
  };

  return (
    <div className="flex">
      <div
        className="shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
        style={{ width: "250px", height: "927px", overflowY: "auto" }}
      >
        <img
          src="https://res.cloudinary.com/dljarbi3r/image/upload/v1708609947/ihfe8mqes3febxmkpbis.png"
          style={{ width: "140px", height: "auto", margin: "auto" }}
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
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </form>
        </div>
        <ul
          role="list"
          style={{ marginTop: "40px", maxHeight: "650px", overflowY: "auto" }}
        >
          {(searchInput ? filteredPatients : patients).map((person, index) => (
            <li
              key={index}
              className="hover:bg-slate-100"
              style={{ width: "auto", height: "50px" }}
            >
              <div>
                <p
                  style={{ marginLeft: "30px" }}
                  onClick={() => state(person.patient.id)}
                >
                  {person.patient.firstName}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div style={{margin: "auto", marginTop: ""}}>
        {pationId ? (
            onePatients.patient_data && (
                <h1
                    style={{
                      marginLeft: "500px",
                      fontSize: "40px",
                      fontFamily: "Karla",
                      marginTop: "20px",
                    }}
                    key={onePatients.patient_data.id}
                >
                  Details for :{" "}
                  {onePatients.patient_data.firstName +
                      " " +
                      onePatients.patient_data.lastName}
                </h1>
            )
        ) : (
            <h1 style={{marginLeft: "500px", fontSize: "40px"}}>
              Select Patient First
            </h1>
        )}

        <button onClick={handleLogout}
                className="hover:bg-red-700 bg-red-500 text-white rounded-md px-4 py-1 absolute bottom-0 right-0 mb-4 mr-4">
          Logout
        </button>

        <div
            className="shadow-lg rounded-lg overflow-hidden mx-2 md:mx-10 mt-20"
            style={{width: "1400px"}}
        >
          <table className="w-full table-fixed">
            <thead>
            <tr className="bg-gray-100">
              <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                Serial Number
              </th>
              <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                Medication
              </th>
              <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                Dosage Of The Medication
              </th>
            </tr>
            </thead>
            <tbody className="bg-white">
            {onePatients &&
                onePatients.patient_data &&
                dosageData &&
                medicDosage.map((element, index) => (
                    <tr key={index}>
                      <td
                          className="py-4 px-6 border-b border-gray-200 truncate"
                          style={{padding: "8px"}}
                      >
                        {onePatients.patient_data.identityNumber}
                      </td>
                      <td
                          className="py-4 px-6 border-b border-gray-200 truncate"
                          style={{padding: "8px"}}
                      >
                        {element.name ? element.name : "--"}
                      </td>
                      <td
                          className="py-4 px-6 border-b border-gray-200 truncate"
                          style={{padding: "8px"}}
                      >
                        {element.uses ? element.uses : "--"}
                      </td>
                    </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="flex space-x-30 ">
          <div>
            <button
                type="submit"
                className="bg-blue-500 text-white rounded-md px-4 py-1 ml-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 h-8"
                style={{marginTop: "70px", marginLeft: "40px"}}
                onClick={handleOpenPopUp}
            >
              Add Internal Medication
            </button>
          </div>
          <div className="mt-10 p-10">
            <form
                className="flex flex-col mx-auto gap-2 w-1001"
                onSubmit={submitRapport}
            >
              <fieldset className="contents">
                <div className="flex flex-col">
                  <label htmlFor="input" className="font-semibold text-lg">
                    Enter patient report
                  </label>
                  <textarea
                      name="input"
                      id="input"
                      rows="5"
                      maxLength="256"
                      required=""
                      placeholder="Provide your Medical Assessment Report "
                      className="rounded-lg p-4 bg-blue/5 border-2 border-solid border-blue/10 font-mono font-medium text-sm"
                      value={rapport.rapport}
                      onChange={(e) =>
                          setRapport({...rapport, rapport: e.target.value})
                      }
                  ></textarea>
                </div>
                <button
                    type="submit"
                    className="rounded-lg p-3 bg-blue-400/60 border-2 border-solid border-blue-400/60 transition-colors hover:bg-blue-600/80 font-medium text-base leading-none flex flex-row items-center justify-center gap-2"
                >
                  <img
                      src="https://icons.veryicon.com/png/o/business/middle-stage-background-icon/submission-3.png"
                      className="w-7"
                      alt=""
                  />
                  <span className="font-bold">Submit Report!</span>
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Emergency;
