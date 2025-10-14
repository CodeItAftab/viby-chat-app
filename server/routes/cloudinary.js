const express = require("express");
const { GetSignature } = require("../controllers/cloudinary");
const router = express.Router();

router.get("/get-signature", GetSignature);

module.exports = router;
