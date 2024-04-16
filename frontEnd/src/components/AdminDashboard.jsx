import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router";
import AllPatient from "./adminComponent/AllPatient";
import AddUser from "./AddUser";
import AllMedic from "./adminComponent/AllMedic";
import AddMedic from "./AddMedic";
import AllServices from "./adminComponent/AllServices";
import AllUsers from "./adminComponent/AllUsers";
import AddService from "./adminComponent/AddService";
import AddDoctor from "./AddDoctor";
import Doctor from "./adminComponent/Doctor";
import Cookies from "js-cookie";

const AdminDashboard = () => {
  useEffect(() => {
    fetchPatient();
    fetchMedic();
  }, []);

  const navigate = useNavigate();
  const [counterButton, setCounterButton] = useState(1);
  const [data, setData] = useState([]);
  const [patient, setPatient] = useState({
    firstName: "",
    lastName: "",
    cin: "",
    motif: "Emergency",
    date: "",
    doctor_id: 0,
  });
  const [medicQ, setMedicQ] = useState([]);
  const [medic, setMedic] = useState([]);
  const [countNumber, setCountNumber] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const [showDropdown3, setShowDropdown3] = useState(false);
  const [showDropdown4, setShowDropdown4] = useState(false);
  const [isCreateMedicSelected, setIsCreateMedicSelected] = useState(false);

  useEffect(() => {
    fetchPatient();
    fetchMedic();
  }, []);

  const fetchPatient = async () => {
    try {
      const response = await axios.get("http://localhost:8080/reciption");
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

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/");
  };

  const fetchMedic = async () => {
    try {
      const response = await axios.get("http://localhost:8080/medications");
      const medicQ = response.data.filter(
          (element) => element.Medic.quantity > 0
      );
      const medic = response.data.filter(
          (element) => element.Medic.quantity === 0
      );
      setMedicQ(medicQ);
      setMedic(medic);
    } catch (error) {
      console.log("Error Fetching Data Medic  : ", error);
    }
  };

  const sortData = (value) => {
    if (countNumber === 1) {
      setCountNumber(0);
      const sortedData = [...value].sort((a, b) =>
          a.patient && b.patient ? (a.patient.date > b.patient.date ? 1 : -1) : 0
      );
      setData(sortedData);
    } else {
      setCountNumber(1);
      const sortedData = [...value].sort((a, b) =>
          a.patient && b.patient ? (a.patient.date < b.patient.date ? 1 : -1) : 0
      );
      setData(sortedData);
    }
  };

  return (
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="hidden md:flex flex-col w-64 bg-gray-800">
          <div className="flex items-center justify-center h-16 bg-gray-900">
            <span className="text-white font-bold uppercase">Admin Dashboard</span>
          </div>
          <div className="flex flex-col flex-1 overflow-y-auto">
            <nav className="flex-1 px-2 py-4 bg-gray-800">
              <button
                  className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700"
                  onMouseEnter={() => setShowDropdown1(true)}
                  onMouseLeave={() => setShowDropdown1(false)}
                  onClick={() => setCounterButton(1)}
              >
                Models
              </button>

              <button
                  className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700"
                  onClick={() => setCounterButton(3)}
              >
                List Of Patients
              </button>

              <button
                  className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700"
                  onClick={() => setCounterButton(5)}
              >
                Create New Medication
              </button>

              <button
                  className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700"
                  onClick={() => setCounterButton(4)}
              >
                List Of Medications
              </button>

              <button
                  className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700"
                  onClick={() => setCounterButton(7)}
              >
                Create New Service
              </button>

              <button
                  className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700"
                  onClick={() => setCounterButton(6)}
              >
                List Of Services
              </button>

              <button
                  className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700"
                  onClick={() => setCounterButton(9)}
              >
                Add A new User
              </button>

              <button
                  className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700"
                  onClick={() => setCounterButton(8)}
              >
                List Of Users
              </button>

              <button
                  className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700"
                  onClick={() => setCounterButton(12)}
              >
                Create New Doctor
              </button>

              <button
                  className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700"
                  onClick={() => setCounterButton(11)}
              >
                List Of Doctors
              </button>
            </nav>
          </div>
        </div>

        <button onClick={handleLogout}
                className="hover:bg-red-700 bg-red-500 text-white rounded-md px-4 py-1 absolute bottom-0 right-0 mb-4 mr-4">
          Logout
        </button>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          <div className="flex items-center justify-between h-16 bg-white border-b border-gray-200">
            <div className="flex items-center px-4">

              <input
                  className="mx-4 w-full border rounded-md px-4 py-2"
                  type="text"
                  placeholder="Search"
              />
            </div>
            <div className="flex items-center pr-4">

            </div>
          </div>
          <div className="p-4">
            {counterButton === 1 && (
                <div className="flex flex-col items-center">
                  <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2 transition-all duration-300 transform hover:scale-105 mb-5"
                      onClick={() => navigate("/reciption")}
                  >
                    Reception
                  </button>
                  <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2 transition-all duration-300 transform hover:scale-105"
                      onClick={() => navigate("/billing")}
                  >
                    Billing
                  </button>
                </div>
            )}


            {counterButton === 2 && <AddUser/>}
            {counterButton === 3 && <AllPatient/>}
            {counterButton === 4 && <AllMedic/>}
            {counterButton === 5 && <AddMedic/>}
            {counterButton === 6 && <AllServices/>}
            {counterButton === 7 && <AddService/>}
            {counterButton === 8 && <AllUsers/>}
            {counterButton === 9 && <AddUser/>}
            {counterButton === 11 && <Doctor/>}
            {counterButton === 12 && <AddDoctor/>}
          </div>
        </div>
      </div>
  );
};

export default AdminDashboard;
