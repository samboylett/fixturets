import { TDefaultObject } from "../types/TDefaultObject";
import { TFixture } from "../types/TFixture"
import { TFixtureFunction } from "../types/TFixtureFunction"
import { TOverrides } from "../types/TOverrides";
import { mergeOverrides } from "./mergeOverrides";
import { TCreateFixtureFunction } from "../types/TCreateFixtureFunction";
import { FixtureClass } from "./FixtureClass";

/**
 * Create a fixture function.
 */
export const createFixtureFunction: TCreateFixtureFunction = <TObject extends TFixture>(baseDefaultAttributes: TDefaultObject<TObject>): TFixtureFunction<TObject> =>
  new FixtureClass<TObject>(baseDefaultAttributes).createFunction();
