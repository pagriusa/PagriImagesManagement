import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [Role, setRole] = useState('')

  useEffect(() => {

    const getUserRole = localStorage.getItem('userrole');
    setRole(getUserRole)
  })

  const navigate = useNavigate();
  const handleLogout = (e) => {
    localStorage.removeItem('userid')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('authToken')
    localStorage.removeItem('userName')
    localStorage.removeItem('userrole')
    navigate('/')

  }
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-success rounded mb-5 text-white">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold text-white" href="#">PAGRI</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav ">

              <li className="nav-item">
                <a className="nav-link  text-white" href="/userpanel/Home">New Entry</a>
              </li>
              <li className="nav-item">
                <a className="nav-link  text-white" href="/userpanel/List">View List</a>
              </li>

              {Role === 'user'
                ?
                ''
                :
                <li className="nav-item">
                  <a className="nav-link  text-white" href="/userpanel/User">Add User</a>
                </li>
              }

              <li className="nav-item">
                <button className="nav-link  text-white" onClick={handleLogout} >Logout</button>
              </li>

            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar