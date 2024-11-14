import React, { useState } from 'react'
import"./Login.css"
import { BiSolidCoffee } from "react-icons/bi";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";


function Login() {

    const [user, setUser] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const refreshToken = async () => {
        console.log('react refresh token function');
        try {
          const res = await axios.post("http://localhost:3001/user/refresh", { token: user.refreshToken });
          console.log('response data from refresh token: ', res.data);
          setUser({
            ...user,
            accessToken: res.data.accessToken,
            refreshToken: res.data.refreshToken,
          });
            sessionStorage.setItem('user', JSON.stringify({
                ...user,
                accessToken: res.data.accessToken,
                refreshToken: res.data.refreshToken,
            }));
          return res.data;
        } catch (err) {
          console.log(err);
        }
      };

      const axiosJWT = axios.create()
    
      axiosJWT.interceptors.request.use(
        async (config) => {
          let currentDate = new Date();
          const decodedToken = jwtDecode(user.accessToken);
          if (decodedToken.exp * 1000 < currentDate.getTime()) {
            const data = await refreshToken();
            console.log('data from axiosJWT: ', data);
            config.headers["authorization"] = "Bearer " + data.accessToken;
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    

    const loginUser = async (e) => {
        e.preventDefault();
        if(email === '' || password === '') {
            alert('All fields are required');
            return;
        }
        try{
            const response = await axios.post('http://localhost:3001/user/login',
            {
                users_email: email,
                users_password: password
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('response data from login: ', response.data);
            setUser(response.data);
            // set session storage
            sessionStorage.setItem('user', JSON.stringify(response.data));
        }catch(error){
            console.log('error while login: ', error);
        }
    }
    
    {/* #testing @bibek will delete this code later */}
    const removeAccount = async () => {
        try{
            const response = await axiosJWT.delete('http://localhost:3001/user/removeAccount/' + user.users_id,
            {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            });
            console.log('response data from delete: ', response.data);
        }catch(error){
            console.log('error while delete: ', error);
        }
    }

    const logout = async () => {
        try{
            const response = await axios.post('http://localhost:3001/user/logout',
            {
                token: user.refreshToken
            },
            {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            });
            console.log('response data from logout: ', response.data);
            setUser(null);
            sessionStorage.removeItem('user');
        }catch(error){
            console.log('error while logout: ', error);
        }
    }

    const whatOnSession = () => {
        console.log('session data: ', sessionStorage.getItem('user'));
    }
    
  return (
    <div className='Container'>
        <div className='app-title'>
            <BiSolidCoffee className='app-logo'/>
            <h1>Movie App</h1>
        </div>
        <form className='Form'>
            <label className='Label'>Email</label>
            <input onChange={ (e) => setEmail(e.target.value) } className='form-input' type='email' placeholder='Enter Email'/>
            <label className='Label'>Password</label>
            <input onChange={ (e) => setPassword(e.target.value) } className='form-input' type='password' placeholder='Enter Password' />
            <p id='forgot-password'>
                <Link to="../ResetPassword">Forgot password?</Link>
            </p>
            <button onClick={loginUser} className='btn' type='submit' >Login</button>
            <p>No Account? 
                <Link to={"/register"}>Register</Link>  
            </p>
        </form>

        {/* #testing @bibek will delete this code later */}
        {/* <button onClick={removeAccount}>Remove your account</button>
        <button onClick={logout}>Logout</button>
        <button onClick={whatOnSession}>session data</button> */}
    
    </div>
  )
}

export default Login