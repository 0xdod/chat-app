const expect = require("expect");

const { isRealString } = require("../utils/validate");

describe("Validate String", () => {
  it("should return true for valid string value", () => {
    let testStrs = ["testString", " test string  "];
    for (let testStr of testStrs) {
      let res = isRealString(testStr);
      expect(res).toBe(true);
    }
  });
  it("should return false for invalid string and non-string values", () => {
    let testStrs = [123, {}, "   "];
    // let testStr = "      ";
    for (let testStr of testStrs) {
      let res = isRealString(testStr);
      expect(res).toBe(false);
    }
  });
});
