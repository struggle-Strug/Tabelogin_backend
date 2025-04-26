const router = require("express").Router();
const requireAuth = require("../Middleware/requireAuth");

module.exports = (db) => {
  const FileCtr = require("../Controllers/fileController/FileCtr")(db);
  // Route for image upload
  router.post("/multi", FileCtr.uploadMultipleFiles);
  router.post("/", FileCtr.uploadFile);
  router.get("/download/:filename", FileCtr.download);
  router.delete("/:filename", FileCtr.deleteFile);
  return router;
};
