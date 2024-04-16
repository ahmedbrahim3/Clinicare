import React, { useState } from 'react';
import axios from 'axios';

const AddDoctor = () => {
    const [doctor, setDoctor] = useState({ name: '', type: '' });

    const formHandle = async () => {
        try {
            const response = await axios.post('http://localhost:8080/doctor/add', doctor);
            console.log('The Doctor Has Been Added Successfully:', response.data);
        } catch (error) {
            console.error('Error Adding Doctor:', error);
        }
    };

    return (
        <>
            <h1 className="text-2xl font-bold mb-4">Add Doctor</h1>
            <form onSubmit={formHandle} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block">
                        Doctor Name:
                    </label>
                    <input
                        type="text"
                        name="name"
                        onChange={(e) => setDoctor({ ...doctor, name: e.target.value })}
                        className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="type" className="block">
                        Doctor Type:
                    </label>
                    <select
                        onChange={(e) => setDoctor({ ...doctor, type: e.target.value })}
                        className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring focus:border-blue-500"
                    >
                        <option value="">Select The Type Of The Doctor</option>
                        <option value="Emergency">Emergency</option>
                        <option value="Endoscopy">Endoscopy</option>
                        <option value="Radiology">Radiology</option>
                    </select>
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Create Doctor
                    </button>
                    <button
                        type="reset"
                        className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded hover:bg-gray-400 ml-4"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </>
    );
};

export default AddDoctor;
