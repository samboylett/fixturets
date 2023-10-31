import { TFixture } from "./TFixture";
import { TFixtureFunction } from "./TFixtureFunction";
import { TOverrides } from "./TOverrides";

export interface TFixtureClass<TObject extends TFixture> {
  /**
   * Create a fixture using the default attributes with overrides added.
   */
  generate(overrides?: TOverrides<TObject, Partial<TObject>>): TObject;

  /**
   * Create an array of fixtures.
   */
  array(overrides: TOverrides<TObject, Partial<TObject>>[]): TObject[];

  /**
   * Overwrite the value of an existing fixture with new attributes.
   */
  overwrite(fixture: TObject, overrides: TOverrides<TObject, Partial<TObject>>): TObject;

  /**
   * Extend this fixture function to create a new one with different defaults.
   */
  extend<TNextObject extends TObject>(overrides: TOverrides<TObject, TNextObject>): TFixtureClass<TNextObject>;

  /**
   * Create a new fixture function with different defaults.
   */
  defaults(nextDefaults: TOverrides<TObject, Partial<TObject>>): TFixtureClass<TObject>;

  /**
   * Generate a function from the class.
   */
  createFunction(): TFixtureFunction<TObject>;
}
