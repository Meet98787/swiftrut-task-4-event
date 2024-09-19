const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Load .env file

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('MongoDB connected successfully');
    // Start the server after successful DB connection
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit with failure if connection fails
});
