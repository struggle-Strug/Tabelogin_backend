const router = require("express").Router();
const requireAuth = require("../Middleware/requireAuth");

module.exports = (db) => {
  const userController = require("../Controllers/UserController")(db);
  router.post("/signin", userController.login);
  router.post("/", userController.register);
  router.put("/", requireAuth, userController.update);
  router.get("/tokenlogin", requireAuth, userController.tokenlogin);

  return router;
};
