function Users() {
  this.users = [];
}

Users.prototype.addUser = function (id, name, room) {
  const user = { id, name, room };
  this.users.push(user);
  return user;
};

Users.prototype.getUser = function (id) {
  return this.users.filter((user) => user.id === id)[0];
};

Users.prototype.getUsersList = function (room) {
  const users = this.users.filter((user) => user.room === room);
  return users.map((user) => user.name);
};

Users.prototype.removeUser = function (id) {
  const delUser = this.getUser(id);
  if (delUser) {
    this.users = this.users.filter((user) => user.id !== delUser.id);
  }
  return delUser;
};

module.exports = Users;
