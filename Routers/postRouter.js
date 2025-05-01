const router = require("express").Router();
const requireAuth = require("../Middleware/requireAuth");

module.exports = (db) => {
  const postController = require("../Controllers/PostController")(db);
  router.post("/", requireAuth, postController.save);
  router.post("/comments/:id", requireAuth, postController.saveComments);
  router.get("/comments/:id", requireAuth, postController.getComments);
  router.get("/", requireAuth, postController.getPosts);

  return router;
};
