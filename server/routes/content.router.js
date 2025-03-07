const express = require("express")
const router = express.Router()
const {verify,getContent,saveContent} = require("../controller/content.controller")

router.post("/verify",verify)
router.get("/get-content/:jobId",getContent)
router.post("/save-content/:jobId",saveContent)

module.exports = router;
