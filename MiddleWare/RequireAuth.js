const passport = require("passport");
require("../config/passport");
const requireAuth = passport.authenticate("jwt", { session: false });

module.exports = requireAuth;
