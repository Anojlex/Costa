const mongoose=require('mongoose')

const categorySchema = mongoose.Schema({
    category: {
      type: String,
      required: true,
      unique: true,
     },
     status:{
      type:String,
      default:"Active"
     },
     
});
categorySchema.index({
  category: "text",
  // Add other fields you want to search here
});
    module.exports = mongoose.model("Category", categorySchema);