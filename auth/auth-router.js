const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const secrets = require("../secrets");
const Users = require("../users/users-model.js");

router.post("/register", (req, res) => {
  const user = req.body;
  if (user.username && user.password) {
    user.password = bcrypt.hashSync(user.password, 8);

    Users.add(user)
      .then((addedUser) => {
        res.status(201).json(addedUser);
      })
      .catch((err) => {
        res.status(404).json({ errorMessage: "Error adding user", err });
      });
  } else {
    res
      .status(400)
      .json({ errorMessage: "Username and password is required." });
  }
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    Users.findByUsername(username).then(([user]) => {
      if (bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({ message: `Welcome, ${username}!`, token });
      } else {
        res.status(401).json({ errorMessage: "Password is wrong" });
      }
    });
  } else {
    res
      .status(400)
      .json({ errorMessage: "Username and Password is required." });
  }
});

function generateToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
  };

  const secret = secrets.JWT_SECRET;

  const options = {
    expiresIn: "1d",
  };

  return jwt.sign(payload, secret, options);
}

module.exports = router;
