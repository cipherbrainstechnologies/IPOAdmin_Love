const express = require("express");
const router = express.Router();
const Multer = require("multer");
const MainLineIPO = require("../../helper/mainLineIPO/mainlineIPO");
const path = require("path");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/createMainlineIPO/:id",
  // upload.none(),
  MainLineIPO.createMainlineIPO
);
router.post("/GetMainLineIpo", MainLineIPO.GetMainLineIpo);
router.post("/GetIdByMainLineIpo/:id", MainLineIPO.GetIdByMainLineIpo);
router.post("/UpdateMainLineIpo/:id", MainLineIPO.UpdateMainLineIpo);
router.post("/DeleteMainLineIpo", MainLineIPO.DeleteMainLineIpo);
router.post("/uploadImage/:id", upload.single("file"), MainLineIPO.uploadImage);
router.get("/GetImage/:id", MainLineIPO.GetImage);
router.post("/DeleteIPO", MainLineIPO.DeleteIPO);
module.exports = {
  router,
};
