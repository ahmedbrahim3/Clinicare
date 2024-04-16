import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

const AddUser = () => {
    const [user, setUser] = useState({
        userName: "",
        password: "",
        type: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    console.log(user.type);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/creationUser", user);
            console.log("The User Response: ", response.data);
            // --------------------------------------
            // this for the error Handling 
        } catch (error) {
            console.log("Something Must Not Match: ", error.response.data);
            const errorHandling = {};
            const errorMessage = error.response.data.split("; ");
            console.log("This The Error Message:", errorMessage);
            errorMessage.forEach((errorMessage) => {
                const [fieldName, errorMessageContent] = errorMessage.split(':');
                console.log("The Field Name : " , fieldName , "The ErrorMessageContent : " , errorMessageContent);
                console.log("This The One We Looping Around:", errorMessage);
                if (errorMessage === '') return;
                if(errorMessageContent!=undefined){
                    errorHandling[fieldName] = errorMessageContent;
                }else{
                    errorHandling[fieldName] = fieldName;
                }
                
            });
            console.log("Error Handling: ", errorHandling);
            setError(errorHandling);
        }
    };

    return (
        <>
  <h1 className="text-2xl font-bold mb-4">Add User</h1>
  {/* {JSON.stringify(error)} */}
  <form onSubmit={handleSubmit} className="space-y-4">
    <div>
      <label className="block">UserName:</label>
      <input
        type="text"
        name="userName"
        onChange={(e) => setUser({ ...user, userName: e.target.value })}
        className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-500"
      />
    </div>
    <div>
      <label className="block">Password:</label>
      <input
        type="password"
        name="password"
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-500"
      />
    </div>
    <div>
      <label className="block">Type:</label>
        <select
            name="type"
            onChange={(e) => setUser({...user, type: e.target.value})}
            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-500"
        >
            <option value="">Select The Type Of The User</option>
            <option value="Reception">Reception</option>
            <option value="Emergency">Emergency</option>
            <option value="Endoscopy">Endoscopy</option>
            <option value="Radiology">Radiology</option>
            <option value="Billing">Billing</option>
        </select>
    </div>
      <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Create
    </button>
  </form>
</>

    );
};

export default AddUser;
