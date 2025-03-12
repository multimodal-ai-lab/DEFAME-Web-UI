const axios = require("axios");
const Result = require("../model/claimSchema");

module.exports = {
  downloadReport: async (req, res) => {
    const { query_id, claim_id } = req.params;
    const apiUrl = `http://thot.mai.informatik.tu-darmstadt.de:3003/results/${query_id}/${claim_id}/report.pdf`;

    try {
      // Step 2: Fetch the report from the external API
      const response = await axios.get(apiUrl, { responseType: "arraybuffer" });


      // Step 4: Serve the PDF to the client
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="report_${query_id}_${claim_id}.pdf"`
      );
      res.send(response.data);
    } catch (error) {
      console.error("Error fetching PDF:", error);
      res.status(500).send("Error downloading the report");
    }
  },
  saveResults : async (req,res) =>{
    try {
      const {jobId, content, claims } = req.body;
      if (!jobId || !content || !claims) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const newClaim = new Result({jobId, content, claims });
      await newClaim.save();
      res.status(201).json({ message: "Data saved successfully", id: newClaim._id});
    } catch (error) {
      if (error.code === 11000) {
          return res.status(200).json({ message: "Duplicate found , no data stored" });
      }
      res.status(500).json({ message: "Server Error", error: error.message });
  }
  },
  getResults : async (req,res)=> {
    try {
      const id = req.params.id;
      
      const result = await Result.findOne({ jobId: id });
      if (!result) {
        return res.status(404).json({ message: "Result not found" });
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  },
  deleteResults : async (req,res)=> {
    try {
      const id = req.params.id ; 
      const deletedItem =await Result.deleteOne({jobId : id})
      if(!deletedItem) {
        return res.status(404).json({message : "Result not found"})
      }
      res.json({message:"Item deleted successfully !"})
    }
    catch(error){
      res.status(500).json({ message: "Server Error" ,error: error.message })
    }
  }
};
