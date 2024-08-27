import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColorRing } from 'react-loader-spinner';

import Navbar from '../components/Navbar';

export default function List() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
// Get user data from localStorage
const userId = localStorage.getItem('userid');
const userRole = localStorage.getItem('userrole');
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
    setLoading(false);
  }, [userId, userRole]);

  const fetchData = async () => {
    console.log("Fetch Datad");
    try {
      // Fetch data from API based on user role
      const response = await fetch(`https://pagriimagesmanagement.onrender.com/api/getsaveData?userid=${userId}&userrole=${userRole}`);
      const data = await response.json();
      console.log("Fetch Data");
      console.log(data,"Fetch Data 2" );
      setData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleAddNew = () => {
    navigate('/userpanel/Home');
  };

  // Handle deleting an item
  const handleDelete = async (itemId) => {
    try {
      const response = await fetch(`https://pagriimagesmanagement.onrender.com/api/deleteData/${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setData(currentItems.filter(item => item._id !== itemId));
      } else {
        console.error('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };


  // const handleDelete = async (id) => {
  //   try {
  //     const response = await fetch(`https://pagriimagesmanagement.onrender.com/api/deleteData/${id}`, {
  //       method: 'DELETE',
  //     });
  //     if (response.ok) {
  //       // Remove the deleted item from the local state
  //       setData(data.filter(item => item._id !== id));
  //     } else {
  //       console.error('Error deleting data:', response.statusText);
  //     }
  //   } catch (error) {
  //     console.error('Error deleting data:', error);
  //   }
  // };


  const totalFarmers = data.reduce((total, item) => total + (item.numMeetingFarmer || 0), 0);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredData = data.filter((item) => {
    console.log(data, "data")
    const query = searchQuery.toLowerCase();
    const toMatch = (item.to || '').toLowerCase();
    const fromMatch = (item.from || '').toLowerCase();
    const dateMatch = (item.date || '').toLowerCase().includes(query);
    return toMatch.includes(query) || fromMatch.includes(query) || dateMatch;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem).reverse();
console.log(currentItems, "currentItems");
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className='container py-3'>
      {loading ? (
        <div className='d-flex justify-content-center align-items-center' style={{ height: '60vh' }}>
          <ColorRing
            loading={loading}
            aria-label="Loading Spinner"
            data-testid="loader"
            height={80}
            width={80}
            colors={['#ff5733', '#33c1ff', '#33ff57', '#f0ff33', '#ff33d1']}
          />
        </div>
      ) : (
        <div>
          <Navbar />
          <div className='d-flex justify-content-between align-items-center mb-3'>
            <img src="../pagrilogo.png" alt="PAGRI Logo" className='img-fluid' style={{ maxHeight: '50px' }} />
            <button type="button" className="btn btn-primary" onClick={handleAddNew}>
              Add New
            </button>
          </div>

          <div className='mb-3'>
          <p className='mb-2'>
  Total Farmers: <span className='fw-bold fs-4 text-primary bg-light rounded p-2'>{totalFarmers}</span>
</p>

</div>
<div className='row'>
<div className='mb-3'>
<div className='col-md-4'>
            <input
              type="text"
              className="form-control"
              placeholder="Search To, From, or Date"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
             </div>
          </div>
</div>
          
          <div className="table-responsive">
            <p className='text-danger'>See all table fileds Please scroll the table left to right side (Only for Mobile Screens)</p>
  <table className="table table-striped table-bordered mb-0">
    <thead>
      <tr>
        <th scope="col">To</th>
        <th scope="col">From</th>
        <th scope="col">Date</th>
        <th scope="col">Total Distance</th>
        <th scope="col">Number Of Meetings</th>
        <th scope="col">Images</th>
        {userRole === 'admin' && (
              <th scope="col">Actions</th>
            )}
         {/* Added Actions column */}
      </tr>
    </thead>
    <tbody>
        {currentItems.map((item, index) => (
          <tr key={index}>
            <td className="text-nowrap">{item.to}</td>
            <td className="text-nowrap">{item.from}</td>
            <td className="text-nowrap">{formatDate(item.date)}</td>
            <td className="text-nowrap">{item.totalDistance}</td>
            <td className="text-nowrap">{item.numMeetingFarmer}</td>
            {console.log("Item", item )}
            <td className="text-nowrap">
              {item.imageUrl.length > 0 ? (
                item.imageUrl.map((url, idx) => (
                  <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className='me-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                      <path d="M12 12l-4 4H4V4h16v8h-4l-4 4zm6 8H6c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2zm-2-6l2 2V8l-2 2-2-2-4 4h6z"/>
                    </svg>
                  </a>
                ))
              ) : (
                <span>No images</span>
              )}
            </td>
            {userRole === 'admin' && (
              <td>
                <button 
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    {/* <tbody>
      {currentItems.map((item, index) => (
        <tr key={index}>
          <td className="text-nowrap">{item.to}</td>
          <td className="text-nowrap">{item.from}</td>
          <td className="text-nowrap">{formatDate(item.date)}</td>
          <td className="text-nowrap">{item.totalDistance}</td>
          <td className="text-nowrap">{item.numMeetingFarmer}</td>
          <td className="text-nowrap">
            {item.imageUrl.length > 0 ? (
              item.imageUrl.map((url, idx) => (
                <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className='me-2'>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path d="M12 12l-4 4H4V4h16v8h-4l-4 4zm6 8H6c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2zm-2-6l2 2V8l-2 2-2-2-4 4h6z"/>
                  </svg>
                </a>
              ))
            ) : (
              <span>No images</span>
            )}
          </td>
          <td>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </button>
                    </td>
        </tr>
      ))}
    </tbody> */}
  </table>
</div>

          {/* <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th scope="col">To</th>
                  <th scope="col">From</th>
                  <th scope="col">Date</th>
                  <th scope="col">Total Distance</th>
                  <th scope="col">Number Of Meetings</th>
                  <th scope="col">Images</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.to}</td>
                    <td>{item.from}</td>
                    <td>{formatDate(item.date)}</td>
                    <td>{item.totalDistance}</td>
                    <td>{item.numMeetingFarmer}</td>
                    <td>
                      {item.imageUrl.length > 0 ? (
                        item.imageUrl.map((url, idx) => (
                          <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className='me-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                              <path d="M12 12l-4 4H4V4h16v8h-4l-4 4zm6 8H6c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2zm-2-6l2 2V8l-2 2-2-2-4 4h6z"/>
                            </svg>
                          </a>
                        ))
                      ) : (
                        <span>No images</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> */}

          {/* Pagination */}
          <nav>
            <ul className="pagination justify-content-center mt-4">
              {Array.from({ length: Math.ceil(filteredData.length / itemsPerPage) }, (_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => paginate(index + 1)}>
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
