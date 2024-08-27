const express = require('express');
const router = express.Router();
const momentTimezone = require('moment-timezone');
const User = require('../models/User');

const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const jwrsecret = "MYNameisJashandeepSInghjoharmukts"
const bcrypt = require("bcryptjs");
const Home = require('../models/Home');
const multer = require('multer');
const { google } = require('googleapis');
const storage = multer.memoryStorage()
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
// Now you can access the variables using process.env





const upload = multer({ dest: 'uploads/' });
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URL = 'https://pagriimagesmanagement.onrender.com/api/oauth2callback'; // YOUR_REDIRECT_URL

console.log(CLIENT_ID, CLIENT_SECRET, "sddsdsdsds");

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);


// Cloudinary Configuration
cloudinary.config({
    cloud_name: 'dlq5b1jed',
    api_key: '249495292915953',
    api_secret: '7Sqyit1Cc5VeuPfm1OEFWTI5i7I',
  });

// Step 1: Generate Auth URL and Redirect User to Google Login
router.get('/auth', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline', // Will return a refresh token
      scope: ['https://www.googleapis.com/auth/drive.file'], // Access to Google Drive
  });
  res.redirect(authUrl);
});

// Step 2: Handle OAuth 2.0 Callback and Get Refresh Token
router.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;
  try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);
      console.log('Access Token:', tokens.access_token);
      console.log('Refresh Token:', tokens.refresh_token);

      // Store the refresh token and access token securely
      fs.writeFileSync('tokens.json', JSON.stringify(tokens));

      res.send('Authentication successful! You can close this window.');
  } catch (error) {
      console.error('Error getting OAuth tokens:', error);
      res.status(500).send('Authentication failed');
  }
});

router.post('/uploadAndSave', upload.array('images'), async (req, res) => {
  const files = req.files;
  const { to, from, date, totalDistance, numMeetingFarmer,userid } = req.body;

  // Check if tokens.json exists and load it
  if (!fs.existsSync('tokens.json')) {
    return res.status(500).send('tokens.json file not found. Please authenticate via /auth.');
  }

  const tokens = JSON.parse(fs.readFileSync('tokens.json', 'utf-8'));
  oauth2Client.setCredentials(tokens);

  const drive = google.drive({ version: 'v3', auth: oauth2Client });

  try {
    // Upload files to Google Drive
    const uploadPromises = files.map(file => {
      const fileMetadata = {
        name: file.originalname,
        parents: ['1HCS3d721B98rlBVbzv0Y89FihNPWn_zx'], // Replace with your folder ID
      };
      const media = {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.path),
      };
      return drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id',
      });
    });

    const results = await Promise.all(uploadPromises);

    // Generate URLs for the uploaded files
    const fileUrls = results.map(result => {
      const fileId = result.data.id;
      return `https://drive.google.com/uc?id=${fileId}`;
    });

    // Create a new Home object with the form data and image URLs
    const template = new Home({
      to,
      imageUrl: fileUrls, // Save the array of image URLs
      from,
      date,
      totalDistance,
      userid,
      numMeetingFarmer,
    });

    // Save the Home object to the database
    await template.save();

    res.status(200).json({
      fileUrls: fileUrls,
      message: 'Files uploaded and data saved successfully!',
    });
  } catch (error) {
    console.error('Error uploading files or saving data:', error);
    res.status(500).json({ error: 'Failed to upload files and save data' });
  } finally {
    // Clean up uploaded files from the server
    files.forEach(file => fs.unlinkSync(file.path));
  }
});


// Route to add a new user
// Route to add a new user
router.post('/addUser', async (req, res) => {
  try {
    const { name, email, password, userrole } = req.body;

    // Validate required fields
    if (!name || !email || !password || !userrole) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    // Validate userrole
    if (!['admin', 'user'].includes(userrole)) {
      return res.status(400).json({ message: 'Invalid user role specified.' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Hash the password before saving it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      userrole,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User added successfully', user: newUser });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// DELETE route to remove an entry by ID
router.delete('/deleteData/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find and delete the entry with the specified ID
    const result = await Home.findByIdAndDelete(id);
    
    if (result) {
      res.status(200).json({ message: 'Data deleted successfully' });
    } else {
      res.status(404).json({ message: 'Data not found' });
    }
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ message: 'Error deleting data' });
  }
});



// Get data based on user role
router.get('/getsaveData', async (req, res) => {
  try {
    const { userid, userrole } = req.query; // Assuming you pass userid and userrole as query parameters

    let data;
    if (userrole === 'admin') {
      // If the user is an admin, return all data
      data = await Home.find({});
    } else {
      // If the user is not an admin, return only their data
      data = await Home.find({ userid: userid });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

// Delete data by ID
router.delete('/api/deleteData/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await UserData.findByIdAndDelete(id);
    res.status(200).json({ message: 'Data deleted successfully' });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ message: 'Error deleting data' });
  }
});


router.get('/getuserData', async (req, res) => {
  try {
    // Find all users but only select the name, email, and role fields
    const data = await User.find({}, 'name email role');
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

router.delete('/deleteUser/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

router.post('/login', [
    body('email').isEmail(),
    body('password').isLength({ min: 4 }),
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ Success: false, errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (user) {
        const pwdCompare = await bcrypt.compare(password, user.password);
        if (pwdCompare) {
          const data = {
            user: {
              id: user._id,
            },
          };

          console.log(user, "data")
          const authToken = jwt.sign(data, jwrsecret);
          return res.json({ Success: true, authToken, userid: user._id,userrole:user.role, userName: user.name });
        }
      }
      res.json({ Success: false, errors: "Invalid credentials" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ Success: false, errors: "Server error" });
    }
  });

module.exports = router;