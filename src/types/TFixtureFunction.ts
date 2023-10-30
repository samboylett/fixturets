import { TFixture } from "./TFixture";

export interface TFixtureFunction<TObject extends TFixture> {
  /**
   * Create a fixture using the default attributes with overrides added.
   */
  (overrides?: Partial<TObject>): TObject;

  /**
   * Create an array of fixtures.
   */
  array(overrides: Partial<TObject>[]): TObject[];

  /**
   * Overwrite the value of an existing fixture with new attributes.
   */
  overwrite(fixture: TObject, overrides: Partial<TObject>): TObject;

  /**
   * Extend this fixture function to create a new one with different defaults.
   */
  extend<TNextObject extends TObject>(getDefaultsFn: (existingDefaults: Readonly<TObject>) => TNextObject): TFixtureFunction<TNextObject>;

  /**
   * Create a new fixture function with different defaults.
   */
  defaults(nextDefaults: Partial<TObject>): TFixtureFunction<TObject>;
}