const router = require("express").Router();
const requireAuth = require("../Middleware/requireAuth");

module.exports = (db) => {
  const postController = require("../Controllers/PostController")(db);
  router.post("/comments/:id", requireAuth, postController.saveComments);
  router.post("/like", requireAuth, postController.likePost);
  router.post("/", requireAuth, postController.save);
  router.get("/comments/:id", requireAuth, postController.getComments);
  router.get("/images/:id", requireAuth, postController.getImages);
  router.get("/likes", requireAuth, postController.getAllContentsWithLikes);
  router.get("/", requireAuth, postController.getPosts);

  return router;
};
