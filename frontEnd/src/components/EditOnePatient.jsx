import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditOnePatient = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const [doctor, setDoctors] = useState([]);
  const [click, setClick] = useState();
  const [patient, setPatient] = useState({
    id: 0,
    firstName: "",
    lastName: "",
    motif: "Emergency",
    date: new Date(),
    doctor_id: 0,
    identityType: "",
    identityNumber: "",
    patientNationality: "Tunisia",
    gender: "",
    age: "",
  });

  const fetchPatientData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/onePatient/${patientId}`
      );
      const patientData = response.data;
      setPatient(patientData.patient_data);
    } catch (error) {
      console.log(error);
    }
  };
  // const fetchPatientDetails = async () => {
  //     try {
  //         const response = await axios.get(`http://localhost:8080/onePatient/${patientId}`);
  //         console.log("API Response:", response.data);
  //         setPatientDetails(response.data.patient_data);
  //         console.log("The Response Data", response.data.patient_data);
  //     } catch (error) {
  //         console.error("Error fetching patient details:", error);

  const fetchDoctor = async (motif) => {
    console.log(motif + " jassez eze ze ze zeze ze ze ze");
    try {
      const response = await axios.get("http://localhost:8080/allDoctors");
      const filteredDoctors = response.data.filter(
        (doctor) => doctor.type === motif
      );
      console.log(
        response.data.filter((doctor) => doctor.type === motif) +
          "78978978978945456 456 4564 564 5645 446 "
      );
      console.log(filteredDoctors + "*/*/*/*/*/*/*/*/*/*");
      setDoctors(filteredDoctors);
    } catch (error) {
      console.log(error);
    }
  };

  const updateDoctor = async (value, patient_id) => {
    console.log(value + "Value for Update ");
    const data = {
      id: patient_id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      identityType: patient.identityType,
      identityNumber: patient.identityNumber,
      patientNationality: patient.patientNationality,
      gender: patient.gender,
      age: patient.age,
      motif: patient.motif,
    };
    console.log(data);
    try {
      const response = await axios.put(
        `http://localhost:8080/doctor/edit/${value}`,
        data
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const change = (value) => {
    // this for setThePatient Motif From The Selected Inputs
    setPatient({ ...patient, motif: value });
    fetchDoctor(value);
    // This for Fetch The Doctor Data That Match The Motif Selected Inputs
  };

  useEffect(() => {
    fetchPatientData();
    fetchDoctor(patient.motif);
  }, [patientId]);

  const getAllCountries = () => {
    return [
      "Afghanistan",
      "Albania",
      "Algeria",
      "Andorra",
      "Angola",
      "Antigua and Barbuda",
      "Argentina",
      "Armenia",
      "Australia",
      "Austria",
      "Azerbaijan",
      "Bahamas",
      "Bahrain",
      "Bangladesh",
      "Barbados",
      "Belarus",
      "Belgium",
      "Belize",
      "Benin",
      "Bhutan",
      "Bolivia",
      "Bosnia and Herzegovina",
      "Botswana",
      "Brazil",
      "Brunei",
      "Bulgaria",
      "Burkina Faso",
      "Burundi",
      "Cabo Verde",
      "Cambodia",
      "Cameroon",
      "Canada",
      "Central African Republic",
      "Chad",
      "Chile",
      "China",
      "Colombia",
      "Comoros",
      "Congo",
      "Costa Rica",
      "Croatia",
      "Cuba",
      "Cyprus",
      "Czech Republic",
      "Denmark",
      "Djibouti",
      "Dominica",
      "Dominican Republic",
      "East Timor",
      "Ecuador",
      "Egypt",
      "El Salvador",
      "Equatorial Guinea",
      "Eritrea",
      "Estonia",
      "Eswatini",
      "Ethiopia",
      "Fiji",
      "Finland",
      "France",
      "Gabon",
      "Gambia",
      "Georgia",
      "Germany",
      "Ghana",
      "Greece",
      "Grenada",
      "Guatemala",
      "Guinea",
      "Guinea-Bissau",
      "Guyana",
      "Haiti",
      "Honduras",
      "Hungary",
      "Iceland",
      "India",
      "Indonesia",
      "Iran",
      "Iraq",
      "Ireland",
      "Israel",
      "Italy",
      "Ivory Coast",
      "Jamaica",
      "Japan",
      "Jordan",
      "Kazakhstan",
      "Kenya",
      "Kiribati",
      "Korea, North",
      "Korea, South",
      "Kosovo",
      "Kuwait",
      "Kyrgyzstan",
      "Laos",
      "Latvia",
      "Lebanon",
      "Lesotho",
      "Liberia",
      "Libya",
      "Liechtenstein",
      "Lithuania",
      "Luxembourg",
      "Madagascar",
      "Malawi",
      "Malaysia",
      "Maldives",
      "Mali",
      "Malta",
      "Marshall Islands",
      "Mauritania",
      "Mauritius",
      "Mexico",
      "Micronesia",
      "Moldova",
      "Monaco",
      "Mongolia",
      "Montenegro",
      "Morocco",
      "Mozambique",
      "Myanmar",
      "Namibia",
      "Nauru",
      "Nepal",
      "Netherlands",
      "New Zealand",
      "Nicaragua",
      "Niger",
      "Nigeria",
      "North Macedonia",
      "Norway",
      "Oman",
      "Pakistan",
      "Palau",
      "Palestine",
      "Panama",
      "Papua New Guinea",
      "Paraguay",
      "Peru",
      "Philippines",
      "Poland",
      "Portugal",
      "Qatar",
      "Romania",
      "Russia",
      "Rwanda",
      "Saint Kitts and Nevis",
      "Saint Lucia",
      "Saint Vincent and the Grenadines",
      "Samoa",
      "San Marino",
      "Sao Tome and Principe",
      "Saudi Arabia",
      "Senegal",
      "Serbia",
      "Seychelles",
      "Sierra Leone",
      "Singapore",
      "Slovakia",
      "Slovenia",
      "Solomon Islands",
      "Somalia",
      "South Africa",
      "South Sudan",
      "Spain",
      "Sri Lanka",
      "Sudan",
      "Suriname",
      "Sweden",
      "Switzerland",
      "Syria",
      "Taiwan",
      "Tajikistan",
      "Tanzania",
      "Thailand",
      "Togo",
      "Tonga",
      "Trinidad and Tobago",
      "Tunisia",
      "Turkey",
      "Turkmenistan",
      "Tuvalu",
      "Uganda",
      "Ukraine",
      "United Arab Emirates",
      "United Kingdom",
      "United States",
      "Uruguay",
      "Uzbekistan",
      "Vanuatu",
      "Vatican City",
      "Venezuela",
      "Vietnam",
      "Yemen",
      "Zambia",
      "Zimbabwe",
    ];
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(patient.doctor_id);
    try {
      if (click == 1) {
        const response = await axios.put(
            `http://localhost:8080/editReciption/${patientId}?doctor_id=${patient.doctor_id}`,
          patient
        );
        // console.log(patient);
        // console.log(response.data);
        const result = response.data.substr(
          response.data.indexOf(":") + 1,
          response.data.length
        );
        // console.log(result);
        console.log("*******************");
        console.log(patient.doctor_id, result);
        await updateDoctor(patient.doctor_id, result);
        navigate("/reciption");
      } else {
        const response = await axios.put(
            `http://localhost:8080/editReciptionRv/${patientId}?doctor_id=${patient.doctor_id}`,
          patient
        );
        const result = response.data.substr(
          response.data.indexOf(":") + 1,
          response.data.length
        );
        console.log("***************************");
        console.log(patient.doctor_id, result);
        // await fetchData();
        await updateDoctor(patient.doctor_id, result);
        navigate("/reciption");
      }
      await fetchPatientData();
      //   window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex justify-evenly">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4100/4100581.png"
          style={{
            marginBottom: "-100px",
            width: "90px",
            height: "90px",
            marginTop: "20px",
          }}
        />
        <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
          Edit Patient Information
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto md:w-full max-w-2xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="mx-auto">
            <div className="mb-4">
              <a href="">
                <label
                  htmlFor="fname"
                  className="block text-sm font-medium leading-5 text-gray-700"
                >
                  First Name
                </label>
              </a>
              <div className="mt-1 rounded-md shadow-sm">
                <input
                  id="fname"
                  name="fname"
                  type="text"
                  required
                  value={patient.firstName}
                  onChange={(e) =>
                    setPatient({ ...patient, firstName: e.target.value })
                  }
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  placeholder="First Name"
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="lname"
                className="block text-sm font-medium leading-5 text-gray-700"
              >
                Last Name
              </label>
              <div className="mt-1 rounded-md shadow-sm">
                <input
                  id="lname"
                  name="lname"
                  type="text"
                  required
                  value={patient.lastName}
                  onChange={(e) =>
                    setPatient({ ...patient, lastName: e.target.value })
                  }
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  placeholder="Last Name"
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="identity"
                className="block text-sm font-medium leading-5 text-gray-700"
              >
                Identity
              </label>
              <select
                name="identity"
                id="identity"
                value={patient.identityType}
                onChange={(e) =>
                  setPatient({ ...patient, identityType: e.target.value })
                }
                className="mt-1 rounded-md shadow-sm w-full"
                defaultValue="0"
              >
                <option value="0" disabled style={{ color: "grey" }}>
                  Select one of the Following ID Types
                </option>
                <option value="CIN">CIN</option>
                <option value="Passport">Passport</option>
                <option value="Driver Licence">Driver Licence</option>
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="number"
                className="block text-sm font-medium leading-5 text-gray-700"
              >
                Identity Number
              </label>
              <div className="mt-1 rounded-md shadow-sm">
                <input
                  id="number"
                  name="number"
                  type="text"
                  required
                  value={patient.identityNumber}
                  onChange={(e) =>
                    setPatient({ ...patient, identityNumber: e.target.value })
                  }
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  placeholder="Identity Number"
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="nationality"
                className="block text-sm font-medium leading-5 text-gray-700"
              >
                Nationality
              </label>
              <div className="mt-1 rounded-md shadow-sm">
                <select
                  id="nationality"
                  name="nationality"
                  required
                  value={patient.patientNationality}
                  onChange={(e) =>
                    setPatient({
                      ...patient,
                      patientNationality: e.target.value,
                    })
                  }
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                >
                  <option value="" disabled>
                    Select Nationality
                  </option>
                  {getAllCountries().map((country, index) => (
                    <option key={index} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="gender"
                className="block text-sm font-medium leading-5 text-gray-700"
              >
                Gender
              </label>
              <select
                name="gender"
                id="gender"
                value={patient.gender}
                onChange={(e) =>
                  setPatient({ ...patient, gender: e.target.value })
                }
                className="mt-1 rounded-md shadow-sm w-full"
                defaultValue="0"
              >
                <option value="0" disabled style={{ color: "grey" }}>
                  Select one of the Following Genders
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="age"
                className="block text-sm font-medium leading-5 text-gray-700"
              >
                Age
              </label>
              <div className="mt-1 rounded-md shadow-sm">
                <input
                  id="age"
                  name="age"
                  type="number"
                  required
                  value={patient.age}
                  onChange={(e) =>
                    setPatient({ ...patient, age: e.target.value })
                  }
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  placeholder="Age"
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="motif"
                className="block text-sm font-medium leading-5 text-gray-700"
              >
                Motif
              </label>
              <select
                name="motif"
                id="motif"
                value={patient.motif}
                onChange={(e) => change(e.target.value)}
                className="mt-1 rounded-md shadow-sm w-full"
                defaultValue="0"
              >
                <option value="0" disabled style={{ color: "grey" }}>
                  Select one of the Following Departments
                </option>
                <option value="Emergency">Emergency</option>
                <option value="Endoscopy">Endoscopy</option>
                <option value="Radiology">Radiology</option>
                <option value="DayHospital">DayHospital</option>
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="doctor"
                className="block text-sm font-medium leading-5 text-gray-700"
              >
                Doctor
              </label>
              <select
                name="doctor"
                id="doctor"
                onChange={(e) =>
                  setPatient({ ...patient, doctor_id: e.target.value })
                }
                className="mt-1 rounded-md shadow-sm w-full"
                defaultValue="0"
              >
                <option value="0" style={{ color: "grey" }}>
                  Select One Of The Following Doctor
                </option>
                {doctor.map((element, idx) => (
                  <option key={idx} value={element.id}>
                    {element.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="date"
                className="block text-sm font-medium leading-5 text-gray-700"
              >
                Date
              </label>
              <input
                id="date"
                type="date"
                value={patient.date}
                defaultValue={new Date().getTime()}
                onChange={(e) =>
                  setPatient({ ...patient, date: e.target.value })
                }
                className="mt-1 rounded-md shadow-sm w-full"
              />
            </div>
            <div className="flex justify-evenly">
              <Link to="/reciption">
                <button className="bg-gray-500 text-white rounded-md px-4 py-1 ml-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50">
                  Back to Reception
                </button>
              </Link>

              <button
                type="submit"
                className="bg-blue-500 text-white rounded-md px-4 py-1 ml-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                onClick={(e) => setClick(1)}
              >
                Edit Patient
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white rounded-md px-4 py-1 ml-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                onClick={(e) => setClick(2)}
              >
                Edit Appointment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditOnePatient;
