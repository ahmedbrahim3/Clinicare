import React, { useState } from "react";
import axios from "axios";
const AddService = () => {
    const [service, setService] = useState({
        name: "",
        quantity: "",
        price: "",
      });
    const [error, setError] = useState("");
    const formHandle = async (e)=>{
        e.preventDefault();
        try{
            const response = await axios.post("http://localhost:8080/services/add" , service);
            console.log("The Service Been Added Succesfully :" , response.data);
        }catch (error) {
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
    }
  return (
    <>
    <h1 className="text-2xl font-bold mb-4">Add Service</h1>
    {JSON.stringify(error)}
    <form onSubmit={formHandle} className="space-y-4">
    <div>
      <label className="block">Service Name :</label>
      <input
        type="text"
        name="userName"
        onChange={(e) => setService({ ...service, name: e.target.value })}
        className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-500"
      />
    </div>
    <div>
      <label className="block">Service Price :</label>
      <input
        type="text"
        name="text"
        onChange={(e) => setService({ ...service, price: e.target.value })}
        className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-500"
      />
    </div>
    <div>
      <label className="block">Service Quantity :</label>
      <input
        type="text"
        name="text"
        onChange={(e) => setService({ ...service, quantity: e.target.value })}
        className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-500"
      />
    </div>
    <button
      type="submit"
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Create
    </button>
  </form>
  </>
  )
}

export default AddService