"use strict";

const auth = require("basic-auth");
const bcrypt = require("bcryptjs");
const User = require("../models").User;

//Middleware using basic authentication to verify the request and return a 401 status code when it fails
exports.authenticateUser = async (req, res, next) => {
  let message = null;

  // Parse the user's credentials from the Authorization header.
  const credentials = auth(req);
  // If the user's credentials are available...
  if (credentials) {

    const user = await User.findOne({
      raw: true,
      where: { emailAddress: credentials.name },
    });
   console.log("this is the user",user);
    if (user) {
      // Use the bcrypt npm package to compare the user's password
      const authenticated = await bcrypt.compare(
        credentials.pass,
        user.password
      );
      console.log(authenticated);
      // If the passwords match...
      if (authenticated) {
        console.log(
          `Authentication successful for username: ${user.emailAddress}`
        );

        req.currentUser = user;
      } else {
        message = `Authentication failure for username: ${user.emailAddress}`;
      }
    } else {
      message = `User not found for username: ${credentials.name}`;
    }
  } else {
    message = "Auth header not found";
  }

  // If user authentication failed...
  if (message) {
    console.warn(message);

    // Return a response with a 401 Unauthorized HTTP status code.
    res.status(401).json({ message: "Access Denied" });
  } else {
    // Call the next() method.
    next();
  }
};
