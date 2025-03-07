const router = require("express").Router();
module.exports = (db) => {
  const userController = require("../Controllers/UserController")(db);
  router.post("/", userController.register);

  return router;
};
