const mongoose = require('mongoose');

const salesReportSchema = new mongoose.Schema({
    date: { 
    type: Date,
    default: Date.now,
     required: true 
    },
    totalSales: {
     type: Number,
      required: true 
    },
    productCount:{
    type:Number,
    required: true,
    },
    orderCount:{
        type:Number,
        required:true
    },



});

const SalesReport = mongoose.model('SalesReport', salesReportSchema);

module.exports = SalesReport;
