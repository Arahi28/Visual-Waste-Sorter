const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
dotenv.config();
const cookieParser = require('cookie-parser');
const apiRoutes = require('./routes/api');

// Set port to 8080 for Cloud Run
const port = process.env.PORT || 8080;

// Set the environment variable for Google Application Credentials
//const serviceAccountPath = '/secrets/serviceAccountKey.json';
const serviceAccountPath = '/secrets/serviceAccount.json';


if (fs.existsSync(serviceAccountPath)) {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = serviceAccountPath;
} else {
    console.error(`Service account key file not found at ${serviceAccountPath}`);
}

app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

app.use('/api', apiRoutes);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
