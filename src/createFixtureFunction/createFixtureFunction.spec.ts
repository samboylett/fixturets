import { TFixtureFunction } from "../types";
import { createFixtureFunction } from "./createFixtureFunction";

interface TTestType {
  foo: string;
  bar: number;
}

interface TTestExtendedType extends TTestType {
  isSomething: boolean;
}

describe("createFixtureFunction", () => {
  test("is a function", () => {
    expect(createFixtureFunction).toEqual(expect.any(Function));
  });

  describe("when called", () => {
    let getTestType: TFixtureFunction<TTestType>;

    beforeEach(() => {
      getTestType = createFixtureFunction<TTestType>({
        foo: "a",
        bar: 1,
      });
    });

    test("returns a function", () => {
      expect(getTestType).toEqual(expect.any(Function));
    });

    test.each(["array", "overwrite", "extend"])("returns the fn.%s function", fnName => {
      expect(getTestType).toEqual(expect.objectContaining({
        [fnName]: expect.any(Function),
      }));
    });

    test("calling getTestType with out args returns the default type", () => {
      expect(getTestType()).toEqual({
        foo: "a",
        bar: 1,
      });
    });

    test("calling getTestType partial override returns the overridden and default value", () => {
      expect(getTestType({ foo: "b" })).toEqual({
        foo: "b",
        bar: 1,
      });
    });

    test("calling getTestType.array with various overrides returns the correct array value", () => {
      expect(getTestType.array([
        {},
        { foo: "b" },
        { bar: 2 },
      ])).toEqual([
        {
          foo: "a",
          bar: 1,
        },
        {
          foo: "b",
          bar: 1,
        },
        {
          foo: "a",
          bar: 2,
        },
      ]);
    });

    test("calling getTestType.overwrite will overwrite existing fixture values", () => {
      expect(getTestType.overwrite({ foo: "b", bar: 2 }, { bar: 3 })).toEqual({
        foo: "b",
        bar: 3,
      });
    });

    describe("when calling getTestType.extend", () => {
      let getExtendedTestType: TFixtureFunction<TTestExtendedType>;

      beforeEach(() => {
        getExtendedTestType = getTestType.extend<TTestExtendedType>(existing => ({
          ...existing,
          isSomething: false,
        }));
      });

      test("returns a function", () => {
        expect(getExtendedTestType).toEqual(expect.any(Function));
      });
  
      test.each(["array", "overwrite", "extend"])("returns the fn.%s function", fnName => {
        expect(getExtendedTestType).toEqual(expect.objectContaining({
          [fnName]: expect.any(Function),
        }));
      });
      
      test("calling getExtendedTestType with out args returns the default type", () => {
        expect(getExtendedTestType()).toEqual({
          foo: "a",
          bar: 1,
          isSomething: false,
        });
      });

      test("calling getExtendedTestType partial override returns the overridden and default value", () => {
        expect(getExtendedTestType({ foo: "b" })).toEqual({
          foo: "b",
          bar: 1,
          isSomething: false,
        });
      });

      test("calling getExtendedTestType partial override on new attribute returns the overridden and default value", () => {
        expect(getExtendedTestType({ isSomething: true })).toEqual({
          foo: "a",
          bar: 1,
          isSomething: true,
        });
      });

      test("calling getExtendedTestType.array with various overrides returns the correct array value", () => {
        expect(getExtendedTestType.array([
          {},
          { foo: "b" },
          { bar: 2 },
          { isSomething: true },
        ])).toEqual([
          {
            foo: "a",
            bar: 1,
            isSomething: false,
          },
          {
            foo: "b",
            bar: 1,
            isSomething: false,
          },
          {
            foo: "a",
            bar: 2,
            isSomething: false,
          },
          {
            foo: "a",
            bar: 1,
            isSomething: true,
          },
        ]);
      });

      test("calling getExtendedTestType.overwrite will overwrite existing fixture values", () => {
        expect(getExtendedTestType.overwrite({ foo: "b", bar: 2, isSomething: false }, { bar: 3 })).toEqual({
          foo: "b",
          bar: 3,
          isSomething: false,
        });
      });
    });
  });
});