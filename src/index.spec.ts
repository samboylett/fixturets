import { FixtureClass, TFixtureFunction, createFixtureFunction } from "./index";

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

  describe.each([
    ["an object", {
      foo: "a",
      bar: 1,
    }],
    ["a function", () => ({
      foo: "a",
      bar: 1,
    })]
  ])("when called with %s", (_, arg) => {
    let getTestType: TFixtureFunction<TTestType>;

    beforeEach(() => {
      getTestType = createFixtureFunction<TTestType>(arg);
    });

    test("returns a function", () => {
      expect(getTestType).toEqual(expect.any(Function));
    });

    test("fn.context returns instance of the class", () => {
      expect(getTestType.context).toEqual(expect.any(FixtureClass));
    });

    test.each(["array", "overwrite", "extend", "defaults", "addGetter", "createFunction", "generate"])("returns the fn.%s function", fnName => {
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

    describe("when calling getTestType with callback", () => {
      let callback: jest.Mock;
      let retVal: TTestType;

      beforeEach(() => {
        callback = jest.fn().mockReturnValue({
          foo: "overwrite",
        });

        retVal = getTestType(callback);
      });

      test("returns overridden values", () => {
        expect(retVal).toEqual({
          foo: "overwrite",
          bar: 1,
        })
      });

      test("calls callback with default values", () => {
        expect(callback).toHaveBeenCalledWith({
          foo: "a",
          bar: 1,
        });
      });
    });

    describe("when calling getTestType.addGetter", () => {
      let getCalculatedTestType: TFixtureFunction<TTestType>;

      beforeEach(() => {
        getCalculatedTestType = getTestType.addGetter("foo", (obj) => `Bar is: ${obj.bar}`);
      });

      test("returns a function", () => {
        expect(getCalculatedTestType).toEqual(expect.any(Function));
      });

      test("calling getCalculatedTestType with out args returns the default type", () => {
        expect(getCalculatedTestType()).toEqual({
          foo: "Bar is: 1",
          bar: 1,
        });
      });
    });

    describe("when calling getTestType.defaults", () => {
      let getSpecialTestType: TFixtureFunction<TTestType>;

      beforeEach(() => {
        getSpecialTestType = getTestType.defaults({
          foo: "special",
        });
      });

      test("returns a function", () => {
        expect(getSpecialTestType).toEqual(expect.any(Function));
      });

      test("calling getSpecialTestType with out args returns the default type", () => {
        expect(getSpecialTestType()).toEqual({
          foo: "special",
          bar: 1,
        });
      });

      test("calling getExtendedTestType partial override returns the overridden and default value", () => {
        expect(getSpecialTestType({ foo: "b" })).toEqual({
          foo: "b",
          bar: 1,
        });
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

      test.each(["array", "overwrite", "extend", "defaults"])("returns the fn.%s function", fnName => {
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
