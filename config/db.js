
const mongoose = require('mongoose');

function connect() {
  mongoose.connect("mongodb+srv://anojkjayan1998:AnojKJayan@cluster0.pdzfxav.mongodb.net/costa?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Error connecting to MongoDB:', err.message));
}

module.exports = { connect }; 

