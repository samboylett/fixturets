import merge from "lodash.merge";
import { TFixture } from "../types/TFixture"
import { TFixtureFunction } from "../types/TFixtureFunction"
import { parseOverrides } from "./parseOverrides";
import { TOverrides } from "../types/TOverrides";
import { mergeOverrides } from "./mergeOverrides";

/**
 * Create a fixture function.
 */
export const createFixtureFunction = <TObject extends TFixture>(baseDefaultAttributes: TObject | (() => TObject)): TFixtureFunction<TObject> => {
  const getDefaultAttributes = (): Readonly<TObject> => Object.freeze(
    typeof baseDefaultAttributes === "function"
      ? baseDefaultAttributes()
      : baseDefaultAttributes
  );

  const fixtureFunction: TFixtureFunction<TObject> = (overridesOrFn = {}) =>
    mergeOverrides<TObject, Partial<TObject>>(getDefaultAttributes(), overridesOrFn);

  fixtureFunction.array = (overrides) => overrides.map(fixtureFunction);

  fixtureFunction.overwrite = (base, overrides) =>
    fixtureFunction(mergeOverrides<TObject, Partial<TObject>>(base, overrides));

  fixtureFunction.extend = <TNextObject extends TObject>(getDefaultsFn: TOverrides<TObject, TNextObject>) =>
    createFixtureFunction<TNextObject>(mergeOverrides<TObject, TNextObject>(getDefaultAttributes(), getDefaultsFn));

  fixtureFunction.defaults = (nextDefaults: TOverrides<TObject, Partial<TObject>>) =>
    createFixtureFunction<TObject>(mergeOverrides<TObject, Partial<TObject>>(getDefaultAttributes(), nextDefaults));

  return fixtureFunction;
}
