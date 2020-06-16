const expect = require("expect");

const Users = require("../utils/users");

let users;

beforeEach(() => {
  users = new Users();
  users.users = [
    {
      id: "1",
      name: "Mike",
      room: "Node Course",
    },
    {
      id: "2",
      name: "Jen",
      room: "React Course",
    },
    {
      id: "3",
      name: "Julie",
      room: "Node Course",
    },
  ];
});

describe("Users", () => {
  it("should add a new user", () => {
    let users = new Users();
    const user = { id: 12, name: "Damilola", room: "Avengers" };
    users.addUser(user.id, user.name, user.room);
    expect(users.users).toEqual([user]);
  });
  it("should return a user list for a specific room", () => {
    let usersList = users.getUsersList("Node Course");
    expect(usersList).toEqual(["Mike", "Julie"]);
  });
  it("should return a user list for another room", () => {
    let usersList = users.getUsersList("React Course");
    expect(usersList).toEqual(["Jen"]);
  });
  it("should remove a user", () => {
    let user = users.removeUser("1");
    expect(user).toEqual({
      id: "1",
      name: "Mike",
      room: "Node Course",
    });
    expect(users.users.length).toBe(2);
  });
  it("should not remove a user", () => {
    let user = users.removeUser("44");
    expect(user).toBe(undefined);
    expect(users.users.length).toBe(3);
  });
  it("should get a user", () => {
    let user = users.getUser("2");
    expect(user).toEqual({
      id: "2",
      name: "Jen",
      room: "React Course",
    });
  });
  it("should not get a user", () => {
    let user = users.getUser("10");
    expect(user).toBe(undefined);
  });
});
