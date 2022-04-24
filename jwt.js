const jwt = require("jsonwebtoken");
const User = require("./modals/user/User");
require("dotenv").config();

// generate jwt token
const generateToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_secret, { expiresIn: "7d" });
};

// ----------------------------------------------------------------------

// validator
const validate = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // get token from header
      token = req.headers.authorization.split(" ")[1];
      //   verify token
      const decoded = jwt.verify(token, process.env.JWT_secret);
      //   get user from token
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.log(error);
      res.status(401).json("Not authorized");
    }
  } else {
    res.status(401).json("Not authorized, no token");
  }
};

module.exports = {
  generateToken,
  validate,
};
