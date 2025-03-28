const axios = require("axios");
const Claim = require("../model/claimSchema"); // Import your model

module.exports = {
  verify: async (req, res) => {
    try {
      const apiKey = "jksdfgikjnwaoolekrnt3298iun3qpo0s0o2knsadfo19";
      const apiUrl = process.env.AI_API_URL;
      const data = req.body;

      const response = await axios.post(
        `${apiUrl}/verify`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": apiKey,
          },
        }
      );
      const jobId = response.data.job_id;
      res.status(201).json(jobId);
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  },
  getContent: async (req, res) => {
    try {
      const { jobId } = req.params;

      const claim = await Claim.findOne({ jobId });
      if (!claim) {
        return res.status(404).json({ error: "Claim not found" });
      }
      res.status(200).json(claim.content);
    } catch (error) {
      console.error("Error fetching claim:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  saveContent: async (req, res) => {
    try {
      const { jobId } = req.params;
      const { content } = req.body; 

      const newClaim = new Claim({
        jobId : jobId,
        content : content, 
        claims: {}, 
      });
      await newClaim.save();
      res
        .status(201)
        .json("Content saved successfully");
    } catch (error) {
      console.error("Error saving content:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
