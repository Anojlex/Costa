const { default: mongoose } = require('mongoose')
const Category=require('../models/categoryModel')



const loadListCategory=async(req,res)=>{
  const categories=await Category.find({})      
   res.render('listCategories',{categories})
}

const loadAddCategory=(req,res)=>{
res.render('addCategories')
}

const addCategory = async (req, res) => {

  const category = req.body.category;

  const searchRegex = new RegExp(category, "i");

  const exist = await Category.find({ category: { $regex: searchRegex } });

  if (exist.length > 0) {
    res.json({ success: false, message: "Category already exists" });
  } else {
    const categories = new Category({
      category: category,
    });

    await categories.save();

    res.json({ success: true, message: "Category added successfully" });
  }
};



const loadEditCategory=async(req,res)=>{
  const id =req.query.id;
  try{
  const category=await Category.findOne({_id:new mongoose.Types.ObjectId(id)})
 
  res.render('editCategory',{category})
  }catch(error){
      console.log(error.message);
  }
}

const updateCategory=async(req,res)=>{ 
  const{category,status,id}=req.body
  try{
  await Category.updateOne({_id:new mongoose.Types.ObjectId(id)},{$set:{category:category,status:status}})

  res.redirect('/admin/categories')
  }catch(error){
      console.log(error.message);
  }
}

const deleteCategory=async(req,res)=>{
  const id =req.query.id;
  try{
  await Category.deleteOne({_id:new mongoose.Types.ObjectId(id)})

  res.redirect('/admin/categories')
} catch(error){
  console.log(error);
}
}

module.exports={
    loadListCategory,
    loadAddCategory,
    addCategory,
    loadEditCategory,
    updateCategory,
    deleteCategory
}