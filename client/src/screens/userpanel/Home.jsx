import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ColorRing } from  'react-loader-spinner'
import Navbar from '../components/Navbar';

export default function Home() {
  // Function to format date to YYYY-MM-DD

  const [email,setemail] = useState('')
  const [name,setname] = useState('')
  const [userid,setuserid] = useState('')
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  useEffect(() => {
   
    if (!localStorage.getItem("authToken")) {
        navigate("/");
    }

    const getdata = localStorage.getItem('userEmail')
    const getuserId = localStorage.getItem('userid')
    const getname = localStorage.getItem('userName')
    setemail(getdata)
    setname(getname)
    setuserid(getuserId)
    

}, []);

  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const [ loading, setloading ] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formData, setFormData] = useState({
    to: '',
    from: '',
    date: getCurrentDate(), // Set the initial value to today's date
    totalDistance: '',
    imageUrl: '',
    userid: '',
    numMeetingFarmer: '',
  });


  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (event) => {
  setSelectedFiles(event.target.files);
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setloading(true);
  console.log(formData);

  const formDataSave = new FormData();
  
  // Append the selected files to the FormData object
  if (selectedFiles && selectedFiles.length > 0) {
      for (let i = 0; i < selectedFiles.length; i++) {
        formDataSave.append('images', selectedFiles[i]);
      }
  }


  console.log(formDataSave, "ForDataSave");

  // Append other form data to the FormData object
  formDataSave.append('to', formData.to || '');
  formDataSave.append('userid',userid || '');
  formDataSave.append('from', formData.from || '');
  formDataSave.append('date', formData.date || '');
  formDataSave.append('totalDistance', formData.totalDistance || 0);
  formDataSave.append('numMeetingFarmer', formData.numMeetingFarmer || 0);

  // Log FormData content
  for (let pair of formDataSave.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
  }

  try {
      const response = await fetch('https://pagriimagesmanagement.onrender.com/api/uploadAndSave', {
          method: 'POST',
          body: formDataSave,
      });

      const result = await response.json();

      if (response.ok) {
          console.log('Files uploaded and data saved:', result);
          navigate('/userpanel/List');  // Redirect to the List page after successful save
      } else {
          console.error('Error saving data:', result.message || response.statusText);
      }
  } catch (error) {
      console.error('Error:', error);
  } finally {
      setloading(false);
  }
};



  const handleViewList = () => {
    navigate('/userpanel/List')
  };

  return (
    <div className='container py-3'>
    {
      loading
      ?
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
<Navbar />
        
        {/* <div className='pagrilogo'>
            <img src="../pagrilogo.png" alt="" className='img-fluid pagrilogoimg' />
        </div> */}


        <div className='row'>
          <div className='col-md-12'>
            <p>Welcome, {name}</p>
       
          </div>
          <div className='col-md-6'>
           
          </div>

        </div>
        <section className='d-flex justify-content-center align-items-center pt-3'>
          <form className="loginbox">
            <div className='px-5 py-3 pb-4 mt-3'>
              <div className="row">
                <div className="col-6">
                  <div className="form-group mb-3 pt-3 txt-left">
                    <label className="label" htmlFor="to">To</label>
                    <input type="text" className="form-control mt-2" name="to" value={formData.to} onChange={handleChange} required />
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-group mb-3 pt-3 txt-left">
                    <label className="label" htmlFor="from">From</label>
                    <input type="text" className="form-control mt-2" name="from" value={formData.from} onChange={handleChange} required />
                  </div>
                </div>
              </div>
              <div className="form-group mb-3 txt-left">
                <label className="label" htmlFor="date">Date</label>
                <input type="date" className="form-control mt-2" name="date" value={formData.date} onChange={handleChange} required />
              </div>
              <div className="form-group mb-3 txt-left">
                <label className="label" htmlFor="total-distance">Total Distance</label>
                <input type="text" className="form-control mt-2" name="totalDistance" value={formData.totalDistance} onChange={handleChange} required />
              </div>
              <div className="form-group mb-3 txt-left">
                <label className="label" htmlFor="images">Upload Image(Multiple)</label>
                <input type="file" className="form-control mt-2" name="images" multiple onChange={handleImageUpload} required />
              </div>
              <div className="form-group mb-3 txt-left">
                <label className="label" htmlFor="numMeetingFarmer">Number Of Meeting with Farmer</label>
                <input type="number" className="form-control mt-2" name="numMeetingFarmer" value={formData.numMeetingFarmer} onChange={handleChange} required />
              </div>
              <div className="form-group d-flex justify-content-center">
                <button type="button" className="form-control w-75 btn btnblur text-white mb-1" onClick={handleSubmit}>Submit</button>
              </div>
              <div className="form-group d-flex justify-content-center">
                <button type="button" className="form-control w-75 btn btnblur text-white mb-1" onClick={handleViewList}>View List</button>
              </div>
            </div>
          </form>
        </section>
      </div>
}
    </div>
  );
}
