import { createFixtureFunction } from "./createFixtureFunction";

describe("createFixtureFunction", () => {
  test("is a function", () => {
    expect(createFixtureFunction).toEqual(expect.any(Function));
  });
});