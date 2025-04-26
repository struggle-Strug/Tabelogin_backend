const router = require("express").Router();
const requireAuth = require("../Middleware/requireAuth");

module.exports = (db) => {
  const postController = require("../Controllers/PostController")(db);
  router.post("/", requireAuth, postController.save);
  router.get("/", requireAuth, postController.getPosts);

  return router;
};
