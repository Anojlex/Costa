
const mongoose = require('mongoose');

function connect() {
  mongoose.connect("mongodb+srv://costaAdmin:AdminCosta@cluster0.pucj5a3.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Error connecting to MongoDB:', err.message));
}

module.exports = { connect }; 

