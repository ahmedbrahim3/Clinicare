import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import Cookies from 'js-cookie';

const Login = (props) => {
    const [user, setUser] = useState({ userName: '', password: '' });
    const navigate = useNavigate();
    const {setData} = props;
    const handleLogin = (e) => {
        e.preventDefault();
        axios.post(`http://localhost:8080/login`, user)
            .then(response => {
                const { token, user_type , user } = response.data;

                Cookies.set('token', token);
                localStorage.setItem("userName" , user);
                setData(user);
                if (user_type === "Emergency") {
                    navigate("/home");
                }
                if (user_type === "Billing") {
                    navigate("/billing");
                }
                if (user_type === "Admin") {
                    navigate("/admin");
                }
                if (user_type === "Reception") {
                    navigate("/reciption");
                }
                if (user_type === "Radiology") {
                    navigate("/radiology");
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-6">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <img className="mx-auto" style={{width:"70px"}} src="https://cdn-icons-png.flaticon.com/512/169/169869.png" alt="Workflow" />
                <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="name"
                                   className="block text-sm font-medium leading-5 text-gray-700">Username</label>
                            <div className="mt-1 rounded-md shadow-sm">
                                <input
                                    type="text"
                                    required
                                    value={user.userName}
                                    onChange={(e) => setUser({...user, userName: e.target.value})}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                    placeholder='Username'
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password"
                                   className="block text-sm font-medium leading-5 text-gray-700 mt-3">Password</label>
                            <div className="mt-1 rounded-md shadow-sm">
                                <input
                                    type="password"
                                    required
                                    value={user.password}
                                    onChange={(e) => setUser({...user, password: e.target.value})}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                    placeholder='Password'
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-between">
                            <div className="flex items-center">
                                <input id="remember_me" name="remember" type="checkbox" value="1"
                                       className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"/>
                                <label htmlFor="remember_me" className="ml-2 block text-sm leading-5 text-gray-900">Remember
                                    me</label>
                            </div>

                        </div>

                        <div className="mt-6">
                            <span className="block w-full rounded-md shadow-sm">
                                <button type="submit"
                                        className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
                                    Sign in
                                </button>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
