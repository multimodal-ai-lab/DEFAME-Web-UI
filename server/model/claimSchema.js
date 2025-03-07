const mongoose = require("mongoose");

const ClaimEntrySchema = new mongoose.Schema({
  claim_id: { type: String,required: true  },
  data: { type: [[String]], required: true }, // Array of arrays of strings
  verdict: { type: String, required: true },
  justification: { type: [[String]], required: true } // Array of arrays of strings
});

const ClaimSchema = new mongoose.Schema({ 
  jobId: { type: String, unique:true , required: true },
  content: { type: [[String]], required: true }, // Array of arrays of strings
  claims: {
    type: [ClaimEntrySchema], // Now it's an array of claim objects
    required: false
  }
});

const Result = mongoose.model("Result", ClaimSchema);

module.exports = Result;