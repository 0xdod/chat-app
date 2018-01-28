const expect = require("expect");

const { genMessage, genLocMessage } = require("../utils/message");

expect.extend({
  type(received, type) {
    const pass = typeof received === type;
    if (pass) {
      return {
        message: () =>
          `expected ${received} to be of type ${typeof type} number`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be of type ${type} but got ${typeof received}`,
        pass: false,
      };
    }
  },
});

describe("Generate message", () => {
  it("should generate a valid message", () => {
    const message = genMessage("Admin", "Hola!");
    expect(message.from).toBe("Admin");
    expect(message.body).toBe("Hola!");
    expect(message.createdAt).type("number");
  });
});

describe("Generate Location Message", () => {
  it("should generate a valid location message", () => {
    const lat = 39.936717,
      lng = -75.1708349,
      from = "Admin";
    const message = genLocMessage(from, lat, lng);
    expect(message.from).toBe(from);
    expect(message.url).toBe(`https://www.google.com/maps?q=${lat},${lng}`);
    expect(message.createdAt).type("number");
  });
});
