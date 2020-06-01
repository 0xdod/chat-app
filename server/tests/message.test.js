const expect = require("expect");

const { genMessage } = require("../utils/message");

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
    expect(message.createdAt).type("string");
  });
});
