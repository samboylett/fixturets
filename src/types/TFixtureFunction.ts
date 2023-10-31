import { TFixture } from "./TFixture";
import { TFixtureClass } from "./TFixtureClass";
import { TOverrides } from "./TOverrides";

export interface TFixtureFunction<TObject extends TFixture> extends TFixtureClass<TObject> {
  /**
   * Create a fixture using the default attributes with overrides added.
   */
  (overrides?: TOverrides<TObject, Partial<TObject>>): TObject;

  /**
   * Extend this fixture function to create a new one with different defaults.
   */
  extend<TNextObject extends TObject>(overrides: TOverrides<TObject, TNextObject>): TFixtureFunction<TNextObject>;

  /**
   * Create a new fixture function with different defaults.
   */
  defaults(nextDefaults: TOverrides<TObject, Partial<TObject>>): TFixtureFunction<TObject>;

  /**
   * Add a getter calculator.
   */
  addGetter<TKey extends keyof TObject>(key: TKey, calculate: (obj: TObject) => TObject[TKey]): TFixtureFunction<TObject>;

  /**
   * The underlying class.
   */
  context: TFixtureClass<TObject>;
}
