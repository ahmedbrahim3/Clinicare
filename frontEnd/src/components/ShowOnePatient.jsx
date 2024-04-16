import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const ShowOnePatient = () => {
    const [patientDetails, setPatientDetails] = useState(null);
    const { patientId } = useParams();

    const fetchPatientDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/onePatient/${patientId}`);
            console.log("API Response:", response.data);
            setPatientDetails(response.data.patient_data);
            console.log("The Response Data", response.data.patient_data);
        } catch (error) {
            console.error("Error fetching patient details:", error);
        }
    };

    useEffect(() => {
        fetchPatientDetails();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center">

            <div className="sm:mx-auto sm:w-full sm:max-w-md flex justify-evenly align-center">
                <img
                    src="https://res.cloudinary.com/dljarbi3r/image/upload/v1708609947/ihfe8mqes3febxmkpbis.png"
                    style={{width: "140px", height: "auto", margin: "auto"}}
                    alt="Logo"
                />
                {/* You can add your logo here if needed */}
                <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
                    Patient Details
                </h2>
            </div>
            <div className="mt-8 sm:mx-auto md:w-full max-w-2xl">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <ul className="list-none text-center">
                    <li className="mb-2">
                            <strong>First Name:</strong> {patientDetails && patientDetails.firstName}
                        </li>
                        <li className="mb-2">
                            <strong>Last Name:</strong> {patientDetails && patientDetails.lastName}
                        </li>
                        <li className="mb-2">
                            <strong>Motif:</strong> {patientDetails && patientDetails.motif}
                        </li>
                        <li className="mb-2">
                            <strong>Date:</strong> {patientDetails && new Date(patientDetails.date).toLocaleDateString()}
                        </li>
                        {/* Remove Doctor ID */}
                        {/* <li className="mb-2">
                        <strong>Doctor ID:</strong> {patientDetails && patientDetails.doctor_id}
                    </li> */}
                        <li className="mb-2">
                            <strong>Identity Type:</strong> {patientDetails && patientDetails.identityType}
                        </li>
                        <li className="mb-2">
                            <strong>Identity Number:</strong> {patientDetails && patientDetails.identityNumber}
                        </li>
                        <li className="mb-2">
                            <strong>Patient Nationality:</strong> {patientDetails && patientDetails.patientNationality}
                        </li>
                        <li className="mb-2">
                            <strong>Gender:</strong> {patientDetails && patientDetails.gender}
                        </li>
                        <li className="mb-2">
                            <strong>Age:</strong> {patientDetails && patientDetails.age}
                        </li>
                    </ul>
                    <div className="flex justify-evenly mt-4">
                        <Link to="/reciption">
                            <button
                                className="bg-gray-500 text-white rounded-md px-4 py-1 ml-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50">
                                Back to Reception
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowOnePatient;
