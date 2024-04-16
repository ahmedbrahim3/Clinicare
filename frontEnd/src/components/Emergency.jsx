import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Emergency = () => {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        try {
            const response = await axios.get("http://localhost:8080/reciption");
            setPatients(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredPatients = patients.filter((patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const submitRapport = async( )=>{
        try{
            const response =  await axios.put(`http://localhost/8080/updateRapport/${}`);
        }catch(error){
            console.log("Error Putting the Details ");
        }
    }

    return (
        <div className="flex">
            <div className="shadow-[0_3px_10px_rgb(0,0,0,0.2)]" style={{ width: "250px", height: "927px" }}>
                <img src='https://res.cloudinary.com/dljarbi3r/image/upload/v1708609947/ihfe8mqes3febxmkpbis.png' style={{ width: "140px", height: "auto", margin: "auto" }} />
                <div id="search-bar" className="w-120 bg-white rounded-md shadow-lg z-10">
                    <form className="flex items-center justify-center p-2">
                        <input
                            type="text"
                            placeholder="Search here"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        />
                    </form>
                </div>
                <ul role="list" style={{ marginTop: "40px" }}>
                    {filteredPatients.map((patient, index) => (
                        <li key={index} className=" hover:bg-slate-100 " style={{ width: "auto", height: "50px" }}>
                            <img src={patient.imageUrl} alt="" />
                            <div>
                                <p style={{ marginLeft: "30px" }}>{patient.name}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div style={{ margin: "auto", marginTop: "" }}>
                <h1 style={{ marginLeft: "500px", fontSize: "40px" }}>Details for : Ahmed Mohsen</h1>
                <div class="shadow-lg rounded-lg overflow-hidden mx-2 md:mx-10 mt-20" style={{ width: "1400px" }}>
                    <table class="w-full table-fixed">
                        <thead>
                        <tr class="bg-gray-100">
                            <th class="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">Serial Number</th>
                            <th class="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">Medication</th>
                            <th class="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">Quantity</th>
                        </tr>
                        </thead>
                        <tbody class="bg-white">
                        <tr>
                            <td class="py-4 px-6 border-b border-gray-200">555-555-5555</td>
                            <td class="py-4 px-6 border-b border-gray-200 truncate">Medication A</td>
                            <td class="py-4 px-6 border-b border-gray-200">7</td>
                        </tr>
                        <tr>
                            {/* ... (additional rows) */}
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="flex space-x-30 ">
                    <div>
                        <button type="submit"
                                className="bg-blue-500 text-white rounded-md px-4 py-1 ml-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 h-8" style={{ marginTop: "70px", marginLeft: "40px" }}>
                            Add Internal Medication
                        </button>
                    </div>
                    <div class="mt-10 p-10">
                        <form class="flex flex-col mx-auto gap-2 w-1001">
                            <fieldset class="contents">
                                <div class="flex flex-col">
                                    <label for="input" class="font-semibold text-lg">Enter patient report</label>
                                    <textarea name="input" id="input" rows="5" maxlength="256" required=""
                                              placeholder="Provide your Medical Assessment Report "
                                              class="rounded-lg p-4 bg-blue/5 border-2 border-solid border-blue/10 font-mono font-medium text-sm"></textarea>
                                </div>
                                <button type="submit"
                                        class="rounded-lg p-3 bg-blue-400/60 border-2 border-solid border-blue-400/60 transition-colors hover:bg-blue-600/80 font-medium text-base leading-none flex flex-row items-center justify-center gap-2">
                                    <img src="https://icons.veryicon.com/png/o/business/middle-stage-background-icon/submission-3.png" class="w-7" alt="" />
                                    <span class="font-bold" onClick={()=>submitRapport()}>Submit Report!</span>
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
