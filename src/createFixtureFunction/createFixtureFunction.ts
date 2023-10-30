import merge from "lodash.merge";
import { TFixture } from "../types/TFixture"
import { TFixtureFunction } from "../types/TFixtureFunction"

/**
 * Create a fixture function.
 */
export const createFixtureFunction = <TObject extends TFixture>(defaultAttributes: TObject): TFixtureFunction<TObject> => {
  const fixtureFunction: TFixtureFunction<TObject> = (overrides = {}) => merge<{}, TObject, Partial<TObject>>({}, defaultAttributes, overrides);

  fixtureFunction.array = (overrides) => overrides.map(fixtureFunction);

  fixtureFunction.overwrite = (base, overrides) => fixtureFunction(merge<{}, TObject, Partial<TObject>>({}, base, overrides));

  fixtureFunction.extend = <TNextObject extends TObject>(nextDefaults: TNextObject) => createFixtureFunction<TNextObject>(merge<{}, TObject, TNextObject>({}, defaultAttributes, nextDefaults));

  return fixtureFunction;
}