const mongoose = require('mongoose');

const bannerSchema = mongoose.Schema({
  images: {
    data: Buffer,
    contentType: String,
  },
  status:{
    type:String,
    default:"display"
  }
});

module.exports = mongoose.model("Banners", bannerSchema);
