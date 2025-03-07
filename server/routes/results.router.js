const express = require("express")
const router = express.Router()
const {downloadReport, getResults , saveResults} = require("../controller/results.controller")

router.get("/:query_id/:claim_id/report.pdf",downloadReport)
router.post("/save",saveResults)
router.get("/:id",getResults)

module.exports = router;