import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const AddMedic = () => {
  const [medic, setMedic] = useState({
    name: "",
    dosage: "",
    quantity: "",
    price: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const formHandle = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
          "http://localhost:8080/medications/new",
          medic
      );
      console.log("Response Data For Medic :", response.data);
      navigate("/admin");
      setMedic({
        name: "",
        dosage: "",
        quantity: "",
        price: "",
      });
    } catch (error) {
      console.log("There Is Error During This Post Request : ", error);
    }
  };

  return (
      <>
        <h1 className="text-2xl font-bold mb-4">Add Medic</h1>
        <form onSubmit={formHandle} className="space-y-4">
          <div>
            <label htmlFor="name" className="block">
              Medic Name:
            </label>
            <input
                type="text"
                name="name"
                onChange={(e) => setMedic({ ...medic, name: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="dosage" className="block">
              Medic Dosage:
            </label>
            <input
                type="text"
                name="dosage"
                onChange={(e) => setMedic({ ...medic, dosage: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="quantity" className="block">
              Medic Quantity:
            </label>
            <input
                type="text"
                name="quantity"
                onChange={(e) => setMedic({ ...medic, quantity: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="price" className="block">
              Medic Price:
            </label>
            <input
                type="text"
                name="price"
                onChange={(e) => setMedic({ ...medic, price: e.target.value })}
                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end">
            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Create Medic
            </button>
            <button
                type="reset"
                className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded hover:bg-gray-400 focus:outline-none focus:bg-gray-400 ml-4"
            >
              Cancel
            </button>
          </div>
        </form>
      </>
  );
};

export default AddMedic;
