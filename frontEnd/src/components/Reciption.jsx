import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

const Reciption = (props) => {
  const [data, setData] = useState([]);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const [doctor, setDoctors] = useState([]);
  const [oneDoctor, setOneDoctor] = useState({ name: "" });
  const [rdv, setRdv] = useState([]);
  const [currentDateData, setCurrentDateData] = useState([]);
  const [upcomingDateData, setUpcomingDateData] = useState([]);
  const [patient, setPatient] = useState({
    firstName: "",
    lastName: "",
    motif: "Emergency",
    date: new Date(),
    doctor_id: 0,
    identityType: "",
    identityNumber: "",
    patientNationality: "Tunisia",
    gender: "",
    age: ""
  });

  const [currentDateSearch, setCurrentDateSearch] = useState("");
  const [upcomingDateSearch, setUpcomingDateSearch] = useState("");

  const today = new Date().toDateString();

  useEffect(() => {
    fetchData();
    const user = localStorage.getItem("userName");
    fetchUser(user);
  }, []);

  const handleShowDetails = (patientId) => {
    navigate(`/onePatient/${patientId}`);
  };
  const fetchUser = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/showOneUser/${id}`);
      setUserName(response.data.userName);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/reciption");
      const currentDate = new Date().getTime();
      console.log("The Response Data : ", response.data);
      const updatedData = await Promise.all(
          response.data.map(async (patient) => {
            try {
              if (patient.doctor_id != null) {
                const doctorResponse = await axios.get(
                    `http://localhost:8080/oneDoctor/${patient.doctor_id}`
                );
                const patientDate = new Date(patient.patient.date);

                const doctorName = doctorResponse.data.name;
                console.log(
                    "The PATIENT Date  : ",
                    patientDate.toDateString(),
                    "The Date For Today",
                    today
                );
                return { ...patient, doctorName };
              }
              return null;
            } catch (error) {
              console.log("Error fetching doctor details:", error);
              return null;
            }
          })
      );
      const filteredData = updatedData.filter((patient) => patient !== null);

      const currentData = filteredData.filter(
          (patient) => new Date(patient.patient.date).toDateString() === today
      );

      const upcomingData = filteredData.filter(
          (patient) => isInFuture(new Date(patient.patient.date))
      );
      console.log("The Upcoming Data : ", upcomingData);

      setCurrentDateData(currentData);
      setUpcomingDateData(upcomingData);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const isInFuture = (date) => {
    const currentDate = new Date();
    return date.getTime() >= currentDate.getTime();
  };


  // const handleEdit = (patientId) => {
  //   navigate(`/editPatient/${patientId}`);
  // };

  const PopUp = async (element) => {
    let inputType = "text";
    let inputOptions = {};

    switch (element.motif) {
      case "Emergency":
        inputType = "select";
        inputOptions = {
          Radiology: "Radiology",
          Endoscopy: "Endoscopy",
          DayHospital: "DayHospital",
        };
        break;
      case "Radiology":
        inputType = "select";
        inputOptions = {
          Endoscopy: "Endoscopy",
          Emergency: "Emergency",
          DayHospital: "DayHospital",
        };
        break;
      case "Endoscopy":
        inputType = "select";
        inputOptions = {
          Emergency: "Emergency",
          Radiology: "Radiology",
          DayHospital: "DayHospital",
        };
        break;
      case "DayHospital":
        inputType = "select";
        inputOptions = {
          Emergency: "Emergency",
          Radiology: "Radiology",
          Endoscopy: "Endoscopy",
        };
        break;
    }

    const update = async (value, id) => {
      const obj = { motif: value };

      try {
        const response = await axios.put(
            `http://localhost:8080/editPatient/${id}`,
            obj
        );
        fetchData();
      } catch (error) {
        console.log(error);
      }
    };

    const result = await Swal.fire({
      title: "Select Motif",
      input: "select",
      inputOptions: inputOptions,
      inputPlaceholder: "Select a motif",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value) {
          return "You need to select a motif";
        }
      },
    });

    if (result.isConfirmed) {
      console.log('The Value For The Select : ' , result.value);
      update(result.value, element.id);
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire({
        title: "Cancelled",
        text: "Your session is safe :)",
        icon: "error",
      });
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/");
  };

  const handleCurrentDateSearch = (e) => {
    setCurrentDateSearch(e.target.value);
  };

  const handleUpcomingDateSearch = (e) => {
    setUpcomingDateSearch(e.target.value);
  };

  const filterData = (originalData, searchTerm) => {
    return originalData.filter((element) => {
      return (
          element.patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          element.patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          element.patient.identityNumber.includes(searchTerm) ||
          element.patient.patientNationality.toLowerCase().includes(searchTerm.toLowerCase()) ||
          element.patient.motif.toLowerCase().includes(searchTerm.toLowerCase()) ||
          element.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  };

  const filteredCurrentDateData = filterData(currentDateData, currentDateSearch);
  const filteredUpcomingDateData = filterData(upcomingDateData, upcomingDateSearch);
  console.log("THe Data Form The Upcoming:" , filteredUpcomingDateData , "Here is the Original :" , upcomingDateData);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  return (
      <div className="bg-gray-50">
        <div className="flex justify-between items-center p-3">
          <div>
            <img
                src="https://res.cloudinary.com/dljarbi3r/image/upload/v1708609947/ihfe8mqes3febxmkpbis.png"
                style={{width: "140px", height: "auto", margin: "auto"}}
                alt="Logo"
            />
          </div>
          <div className="text-center">
            <h1 style={{fontWeight: "bolder", fontSize: "30px"}}>
              Welcome {userName}!
            </h1>
            <h1 className="text-3xl font-extrabold">List Of Patients</h1>
          </div>
          <div>
            <button
                className="bg-red-500 text-white rounded-md px-4 py-1 ml-2 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>


        <div className="overflow-x-auto">
          <div className="shadow rounded-lg overflow-hidden mx-4 md:mx-10">
            <div
                className="scrollable-table-container"
                style={{maxHeight: "600px", overflowY: "auto"}}
            >
              <input
                  type="text"
                  placeholder="Search..."
                  value={currentDateSearch}
                  onChange={handleCurrentDateSearch}
                  className="p-2 m-2 border rounded"
              />
              <table className="w-full table-fixed ">
                <thead>
                <tr className="bg-gray-100">
                  <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                    Patient Id
                  </th>
                  <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                    First Name
                  </th>
                  <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                    Last Name
                  </th>
                  <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                    Identification Number
                  </th>
                  <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                    Nationality
                  </th>
                  <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                    Date of Admission
                  </th>
                  <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                    Motif
                  </th>
                  <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                    Doctor
                  </th>
                  <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                    Action
                  </th>
                </tr>
                </thead>
                <tbody className="bg-white overflow-y-auto">
                {filteredCurrentDateData.map((element, idx) => (
                    <tr key={idx}>
                      <td className="py-4 px-6 border-b border-gray-200">
                        {element.patient.id}
                      </td>
                      <td className="py-4 px-6 border-b border-gray-200">
                        {element.patient.firstName}
                      </td>
                      <td className="py-4 px-6 border-b border-gray-200">
                        {element.patient.lastName}
                      </td>
                      <td className="py-4 px-6 border-b border-gray-200">
                        {element.patient.identityNumber}
                      </td>
                      <td className="py-4 px-6 border-b border-gray-200">
                        {element.patient.patientNationality}
                      </td>
                      <td className="py-4 px-6 border-b border-gray-200">
                        <div>{formatDate(element.patient.date).date}</div>
                      </td>
                      <td className="py-4 px-6 border-b border-gray-200">
                        {element.patient.motif}
                      </td>
                      <td className="py-4 px-6 border-b border-gray-200">
                        {element.doctorName}
                      </td>
                      <td className="py-4 px-6 border-b border-gray-200 flex flex-col items-center">
                        <button
                            className="w-full bg-blue-500 text-white rounded-md px-4 py-1 mb-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                            type="button"
                            onClick={() => PopUp(element.patient)}
                        >
                          Transfer
                        </button>
                        <Link to={`/editPatient/${element.patient.id}`}>
                          <button
                              className="w-full bg-blue-500 text-white rounded-md px-4 py-1 mb-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                          >
                            Edit
                          </button>
                        </Link>
                        <button
                            className="w-full bg-blue-500 text-white rounded-md px-4 py-1 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                            type="button"
                            onClick={() => handleShowDetails(element.patient.id)}
                        >
                          Show
                        </button>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold p-5 flex justify-center">
          Upcoming Date
        </h1>

        <div className="overflow-x-auto">
          <div className="shadow rounded-lg overflow-hidden mx-4 md:mx-10">
            <div
                className="scrollable-table-container"
                style={{maxHeight: "600px", overflowY: "auto"}}
            >
              <input
                  type="text"
                  placeholder="Search..."
                  value={upcomingDateSearch}
                  onChange={handleUpcomingDateSearch}
                  className="p-2 m-2 border rounded"
              />
              <table className="w-full table-fixed">
                <thead>
                <tr className="bg-gray-100">
                  <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                    Patient Id
                  </th>
                  <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                    First Name
                  </th>
                  <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                    Last Name
                  </th>
                  <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                    Identification Number
                  </th>
                  <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                    Nationality
                  </th>
                  <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                    Date of Admission
                  </th>
                  <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                    Motif
                  </th>
                  <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                    Doctor
                  </th>
                  <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                    Action
                  </th>
                </tr>
                </thead>
                <tbody className="bg-white overflow-y-auto">
                {filteredUpcomingDateData.map((element, idx) => (
                    <tr key={idx}>
                      <td className="py-4 px-6 border-b border-gray-200">
                        {element.patient.id}
                      </td>
                      <td className="py-4 px-6 border-b border-gray-200">
                        {element.patient.firstName}
                      </td>
                      <td className="py-4 px-6 border-b border-gray-200">
                        {element.patient.lastName}
                      </td>
                      <td className="py-4 px-6 border-b border-gray-200">
                        {element.patient.identityNumber}
                      </td>
                      <td className="py-4 px-6 border-b border-gray-200">
                        {element.patient.patientNationality}
                      </td>
                      <td className="py-4 px-6 border-b border-gray-200">
                        <div>{formatDate(element.patient.date).date}</div>
                      </td>
                      <td className="py-4 px-6 border-b border-gray-200">
                        {element.patient.motif}
                      </td>
                      <td className="py-4 px-6 border-b border-gray-200">
                        {element.doctorName}
                      </td>
                      <td className="py-4 px-6 border-b border-gray-200 flex flex-col items-center">
                        <button
                            className="w-full bg-blue-500 text-white rounded-md px-4 py-1 mb-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                            type="button"
                            onClick={() => PopUp(element.patient)}
                        >
                          Transfer
                        </button>
                        <Link to={`/editPatient/${element.patient.id}`}>
                          <button
                              className="w-full bg-blue-500 text-white rounded-md px-4 py-1 mb-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                          >
                            Edit
                          </button>
                        </Link>
                        <button
                            className="w-full bg-blue-500 text-white rounded-md px-4 py-1 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                            type="button"
                            onClick={() => handleShowDetails(element.patient.id)}
                        >
                          Show
                        </button>
                      </td>


                    </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <a className="flex justify-center p-3">
          <button
              className="bg-green-500 text-white rounded-md px-4 py-1 ml-2 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
              onClick={(e) => navigate("/addPatient")}
          >
            Add Patient
          </button>
        </a>
      </div>
  );

};

export default Reciption;
