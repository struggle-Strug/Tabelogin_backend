const router = require("express").Router();
const requireAuth = require("../Middleware/requireAuth");

module.exports = (db) => {
  const imageController = require("../Controllers/ImageController")(db);
  router.post("/", requireAuth, imageController.save);

  return router;
};
