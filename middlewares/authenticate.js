const { HttpError } = require("../helpers/HttpError");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const dotenv = require("dotenv");
dotenv.config();
const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  console.log("autorization:", authorization);
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(HttpError(401, "No bearer"));
  }
  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    console.log("user:", user);
    if (!user || !user.token || user.token !== token) {
      next(HttpError(401, "Not authorized option1"));
    }
    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401, "Not authorized option2"));
  }
};

module.exports = authenticate;
