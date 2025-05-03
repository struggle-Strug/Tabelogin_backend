const router = require("express").Router();
const requireAuth = require("../Middleware/requireAuth");

module.exports = (db) => {
  const userController = require("../Controllers/UserController")(db);
  router.post("/signin", userController.login);
  router.post("/", userController.register);
  router.put("/", requireAuth, userController.update);
  router.get("/info/:id", requireAuth, userController.getUserStats);
  router.get("/tokenlogin", requireAuth, userController.tokenlogin);
  router.get("/:id", requireAuth, userController.getUserById);

  return router;
};
