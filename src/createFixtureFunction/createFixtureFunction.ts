import merge from "lodash.merge";
import { TFixture } from "../types/TFixture"
import { TFixtureFunction } from "../types/TFixtureFunction"

/**
 * Create a fixture function.
 */
export const createFixtureFunction = <TObject extends TFixture>(baseDefaultAttributes: TObject): TFixtureFunction<TObject> => {
  const defaultAttributes = Object.freeze(baseDefaultAttributes);
  
  const fixtureFunction: TFixtureFunction<TObject> = (overrides = {}) => merge<{}, TObject, Partial<TObject>>({}, defaultAttributes, overrides);

  fixtureFunction.array = (overrides) => overrides.map(fixtureFunction);

  fixtureFunction.overwrite = (base, overrides) => fixtureFunction(merge<{}, TObject, Partial<TObject>>({}, base, overrides));

  fixtureFunction.extend = <TNextObject extends TObject>(getDefaultsFn: (existingDefaults: Readonly<TObject>) => TNextObject) => {
    const nextDefaults = getDefaultsFn(defaultAttributes);

    return createFixtureFunction<TNextObject>(merge<{}, TObject, TNextObject>({}, defaultAttributes, nextDefaults));
  }

  fixtureFunction.defaults = (nextDefaults: Partial<TObject>) => 
    createFixtureFunction<TObject>(merge<{}, TObject, Partial<TObject>>({}, defaultAttributes, nextDefaults));

  return fixtureFunction;
}