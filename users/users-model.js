const db = require("../database/dbConfig");

module.exports = {
  find,
  findByUsername,
  add,
};

function find() {
  return db("users");
}
function findByUsername(username) {
  return db("users").where({ username });
}

function add(user) {
  return db("users")
    .insert(user)
    .then(([id]) => db("users").where({ id }).first());
}
