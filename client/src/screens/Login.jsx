import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { ColorRing } from  'react-loader-spinner'

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [alertShow, setAlertShow] = useState("");
  const [ loading, setloading ] = useState(false);
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);

    const response = await fetch("https://pagriimagesmanagement.onrender.com/api/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: credentials.email, password: credentials.password })
    });

    const json = await response.json();

    if (!json.Success) {
      setMessage("");
      setAlertShow("Invalid email or password.");
    } else {
      localStorage.setItem("authToken", json.authToken);
      localStorage.setItem("userid", json.userid);
      localStorage.setItem("userEmail", credentials.email);
      localStorage.setItem("userName", json.userName);
      localStorage.setItem("userrole", json.userrole);
      console.log(json, "json");
      setMessage("Login successful");
      setAlertShow("");
      navigate("/userpanel/Home");
    }
  };

  const onchange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };

  return (
    <div className='container py-3'>
    {
      loading?
      <div className='row'>
        <ColorRing
      // width={200}
      loading={loading}
      // size={500}
      display="flex"
      justify-content= "center"
      align-items="center"
      aria-label="Loading Spinner"
      data-testid="loader"        
    />
      </div>:
    <div className='row'>
        <div className='pagrilogo'>
            <img src="./pagrilogo.png" alt="" className='img-fluid pagrilogoimg' />
        </div>
      <section className='d-flex justify-content-center align-items-center pt-3'>
        <form className="loginbox" onSubmit={handleSubmit}>
          <div className='p-5 pb-4 mt-3'>
            <p className='h4 fw-bold'>Sign In</p>

            {alertShow && <div className="alert alert-danger">{alertShow}</div>}
            {message && <div className="alert alert-success">{message}</div>}

            <div className="form-group mb-3 pt-3 txt-left">
              <label className="label" htmlFor="email">Email</label>
              <input type="email" className="form-control mt-2" name="email" value={credentials.email} onChange={onchange} placeholder="Email" required />
            </div>
            <div className="form-group mb-3 txt-left">
              <label className="label" htmlFor="password">Password</label>
              <input type="password" className="form-control mt-2" name="password" value={credentials.password} onChange={onchange} placeholder="Password" required />
            </div>
            <div className="form-group d-flex justify-content-center">
              <button type="submit" className="form-control w-75 btn btnblur text-white mb-1">Sign In</button>
            </div>
          </div>
        </form>
      </section>
    </div>
}
    </div>
  );
}
