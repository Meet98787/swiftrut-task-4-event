const app = require('./app'); // Importing the app
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load .env variables
dotenv.config();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');

    // Normally, we'd start the server here for local environments
    // const PORT = process.env.PORT || 5000;
    // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit process with failure
  });

// Export the app for Vercel (needed for serverless deployment)
module.exports = app;
