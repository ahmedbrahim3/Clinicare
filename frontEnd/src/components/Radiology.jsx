import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Radiology = () => {
    const [showRadiology, setShowRadiology] = useState(false);
    const [showEndoscopy, setShowEndoscopy] = useState(false);
    const [activeButton, setActiveButton] = useState(null);
    const [activeProcedure, setActiveProcedure] = useState(null);
    const navigate = useNavigate();
    const [interventions1, setInterventions1] = useState({
        ECHO: [
            { serial: 1, name: 'John Doe', type: 'Echo' },
            { serial: 2, name: 'Alice Johnson', type: 'Echo' },
            { serial: 3, name: 'Bob Brown', type: 'Echo' },
        ],
        RX: [
            { serial: 4, name: 'Jane Smith', type: 'RX' },
            { serial: 5, name: 'Charlie Davis', type: 'RX' },
            { serial: 6, name: 'David Wilson', type: 'RX' },
        ],
        IRM: [
            { serial: 7, name: 'Eve Miller', type: 'IRM' },
            { serial: 8, name: 'Fiona White', type: 'IRM' },
            { serial: 9, name: 'Grace Lee', type: 'IRM' },
        ],
        'X-RAY': [
            { serial: 10, name: 'Henry Jones', type: 'X-RAY' },
            { serial: 11, name: 'Ivy Martinez', type: 'X-RAY' },
            { serial: 12, name: 'Jack Green', type: 'X-RAY' },
        ],
    });

    const [interventions2, setInterventions2] = useState({
        FIBRO: [
            { serial: 13, name: 'Kate Brown', type: 'FIBRO' },
            { serial: 14, name: 'Liam Taylor', type: 'FIBRO' },
            { serial: 15, name: 'Mia Anderson', type: 'FIBRO' },
        ],
        COLO: [
            { serial: 16, name: 'Noah Clark', type: 'COLO' },
            { serial: 17, name: 'Olivia Scott', type: 'COLO' },
            { serial: 18, name: 'Peter Wright', type: 'COLO' },
        ],
        FIBROCOLO: [
            { serial: 19, name: 'Quinn Hill', type: 'FIBROCOLO' },
            { serial: 20, name: 'Rose Baker', type: 'FIBROCOLO' },
            { serial: 21, name: 'Samuel Murphy', type: 'FIBROCOLO' },
        ],
    });


    const toggleRadiology = () => {
        setShowRadiology(!showRadiology);
        setShowEndoscopy(false);
        setActiveProcedure(null);
    };

    const toggleEndoscopy = () => {
        setShowEndoscopy(!showEndoscopy);
        setShowRadiology(false);
        setActiveButton(null);
    };


    const handleLogout = () => {
        Cookies.remove("token");
        navigate("/");
    };

    // Calculate the total number of interventions
    const totalInterventions = Object.values(interventions1).flat().length + Object.values(interventions2).flat().length;

    // Determine whether to show the scroll based on the total number of interventions
    const showScroll = totalInterventions > 10;

    return (
        <div style={{ display: "flex" }}>
            <div style={{ width: "200px", height: "100vh", boxShadow: "0 3px 10px rgba(0,0,0,0.2)", position: "sticky", top: 0 }}>
                <img src="https://res.cloudinary.com/dljarbi3r/image/upload/v1708609947/ihfe8mqes3febxmkpbis.png" style={{ width: "140px", height: "auto", margin: "auto" }} />
                <div style={{ marginLeft: "30px", marginTop: "30px", display: "flex", flexDirection: "column" }}>
                    <button onClick={toggleRadiology} className="hover:bg-slate-100 font-bold underline underline-offset-4" style={{ width: "auto", height: "40px", color: "grey", border: "none", background: "none" }}>
                        Radiology
                    </button>
                    {showRadiology && (
                        <>
                            {Object.keys(interventions1).map((procedure, index) => (
                                <button key={index} className={`hover:bg-slate-100 ${activeProcedure === procedure ? 'font-semibold' : ''}`} style={{ width: "auto", height: "30px", border: "none", background: "none" }} onClick={() => setActiveProcedure(procedure)}>
                                    {procedure}
                                </button>
                            ))}
                        </>
                    )}
                    <button onClick={toggleEndoscopy} className="hover:bg-slate-100 font-bold underline underline-offset-4" style={{ width: "auto", height: "40px", color: "grey", border: "none", background: "none" }}>
                        Endoscopy
                    </button>

                    {showEndoscopy && (
                        <>
                            {Object.keys(interventions2).map((procedure, index) => (
                                <button key={index} className={`hover:bg-slate-100 ${activeButton === procedure ? 'font-semibold' : ''}`} style={{ width: "auto", height: "30px", border: "none", background: "none" }} onClick={() => setActiveButton(procedure)}>
                                    {procedure}
                                </button>
                            ))}
                        </>
                    )}
                    <button onClick={handleLogout} className="hover:bg-red-700 bg-red-500 text-white rounded-md px-4 py-1 absolute bottom-0 right-0 mb-4 mr-4">
                        Logout
                    </button>
                </div>
            </div>
            <div style={{ flex: 1, marginLeft: "4px" }}>
                {(activeProcedure && !showEndoscopy) && (
                    <div className="shadow-lg rounded-lg overflow-hidden mx-4 md:mx-10">
                        <table className="w-full table-fixed">
                            <thead>
                            <tr className="bg-gray-100">
                                <th className="w-1/4 py-4 px-3 text-left text-gray-600 font-bold uppercase">Serial Number</th>
                                <th className="w-1/4 py-4 px-3 text-left text-gray-600 font-bold uppercase">Name</th>
                                <th className="w-1/4 py-4 px-3 text-left text-gray-600 font-bold uppercase">Type of Intervention</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white" style={{ maxHeight: showScroll ? '400px' : 'auto', overflowY: showScroll ? 'auto' : 'visible' }}>
                            {activeProcedure === 'ECHO' && interventions1.ECHO.map((intervention, index) => (
                                <tr key={index}>
                                    <td className="py-4 px-3 border-b border-gray-200">{intervention.serial}</td>
                                    <td className="py-4 px-3 border-b border-gray-200">{intervention.name}</td>
                                    <td className="py-4 px-3 border-b border-gray-200">{intervention.type}</td>
                                </tr>
                            ))}
                            {activeProcedure === 'RX' && interventions1.RX.map((intervention, index) => (
                                <tr key={index}>
                                    <td className="py-4 px-3 border-b border-gray-200">{intervention.serial}</td>
                                    <td className="py-4 px-3 border-b border-gray-200">{intervention.name}</td>
                                    <td className="py-4 px-3 border-b border-gray-200">{intervention.type}</td>
                                </tr>
                            ))}
                            {activeProcedure === 'IRM' && interventions1.IRM.map((intervention, index) => (
                                <tr key={index}>
                                    <td className="py-4 px-3 border-b border-gray-200">{intervention.serial}</td>
                                    <td className="py-4 px-3 border-b border-gray-200">{intervention.name}</td>
                                    <td className="py-4 px-3 border-b border-gray-200">{intervention.type}</td>
                                </tr>
                            ))}
                            {activeProcedure === 'X-RAY' && interventions1['X-RAY'].map((intervention, index) => (
                                <tr key={index}>
                                    <td className="py-4 px-3 border-b border-gray-200">{intervention.serial}</td>
                                    <td className="py-4 px-3 border-b border-gray-200">{intervention.name}</td>
                                    <td className="py-4 px-3 border-b border-gray-200">{intervention.type}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {activeButton && !showRadiology && (
                    <div className="shadow-lg rounded-lg overflow-hidden mx-4 md:mx-10">
                        <table className="w-full table-fixed">
                            <thead>
                            <tr className="bg-gray-100">
                                <th className="w-1/4 py-4 px-3 text-left text-gray-600 font-bold uppercase">Serial Number</th>
                                <th className="w-1/4 py-4 px-3 text-left text-gray-600 font-bold uppercase">Name</th>
                                <th className="w-1/4 py-4 px-3 text-left text-gray-600 font-bold uppercase">Type of Intervention</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white" style={{ maxHeight: showScroll ? '400px' : 'auto', overflowY: showScroll ? 'auto' : 'visible' }}>
                            {activeButton === 'FIBRO' && interventions2.FIBRO.map((intervention, index) => (
                                <tr key={index}>
                                    <td className="py-4 px-3 border-b border-gray-200">{intervention.serial}</td>
                                    <td className="py-4 px-3 border-b border-gray-200">{intervention.name}</td>
                                    <td className="py-4 px-3 border-b border-gray-200">{intervention.type}</td>
                                </tr>
                            ))}
                            {activeButton === 'COLO' && interventions2.COLO.map((intervention, index) => (
                                <tr key={index}>
                                    <td className="py-4 px-3 border-b border-gray-200">{intervention.serial}</td>
                                    <td className="py-4 px-3 border-b border-gray-200">{intervention.name}</td>
                                    <td className="py-4 px-3 border-b border-gray-200">{intervention.type}</td>
                                </tr>
                            ))}
                            {activeButton === 'FIBROCOLO' && interventions2.FIBROCOLO.map((intervention, index) => (
                                <tr key={index}>
                                    <td className="py-4 px-3 border-b border-gray-200">{intervention.serial}</td>
                                    <td className="py-4 px-3 border-b border-gray-200">{intervention.name}</td>
                                    <td className="py-4 px-3 border-b border-gray-200">{intervention.type}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {!activeProcedure && !activeButton && (
                    <>
                        <div className="shadow-lg rounded-lg overflow-hidden mx-4 md:mx-10">
                            <table className="w-full table-fixed">
                                <thead>
                                <tr className="bg-gray-100">
                                    <th className="w-1/4 py-4 px-3 text-left text-gray-600 font-bold uppercase">Serial Number</th>
                                    <th className="w-1/4 py-4 px-3 text-left text-gray-600 font-bold uppercase">Name</th>
                                    <th className="w-1/4 py-4 px-3 text-left text-gray-600 font-bold uppercase">Type of Intervention</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white" style={{ maxHeight: showScroll ? '400px' : 'auto', overflowY: showScroll ? 'auto' : 'visible' }}>
                                {Object.values(interventions1).flat().map((intervention, index) => (
                                    <tr key={index}>
                                        <td className="py-4 px-3 border-b border-gray-200">{intervention.serial}</td>
                                        <td className="py-4 px-3 border-b border-gray-200">{intervention.name}</td>
                                        <td className="py-4 px-3 border-b border-gray-200">{intervention.type}</td>
                                    </tr>
                                ))}
                                {Object.values(interventions2).flat().map((intervention, index) => (
                                    <tr key={index}>
                                        <td className="py-4 px-3 border-b border-gray-200">{intervention.serial}</td>
                                        <td className="py-4 px-3 border-b border-gray-200">{intervention.name}</td>
                                        <td className="py-4 px-3 border-b border-gray-200">{intervention.type}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );

};

export default Radiology;
