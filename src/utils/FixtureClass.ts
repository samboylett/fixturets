import { TFixture, TFixtureFunction, TOverrides } from "../types";
import { TDefaultObject } from "../types/TDefaultObject";
import { TFixtureClass } from "../types/TFixtureClass";
import { mergeOverrides } from "./mergeOverrides";

export class FixtureClass<TObject extends TFixture> implements TFixtureClass<TObject> {
  protected defaultFixture: TDefaultObject<TObject>;

  constructor(defaultFixture: TDefaultObject<TObject>) {
    this.defaultFixture = defaultFixture;
  }

  protected getDefaultAttributes = (): Readonly<TObject> => Object.freeze(
    typeof this.defaultFixture === "function"
      ? this.defaultFixture()
      : this.defaultFixture
  );

  protected mergeOverrides = <
    TNextObject extends Partial<TObject>
  >(overridesOrFn: TOverrides<TObject, TNextObject>) => mergeOverrides(this.getDefaultAttributes(), overridesOrFn);

  generate = (overrides: TOverrides<TObject, Partial<TObject>> = {}): TObject =>
    this.mergeOverrides(overrides);

  array = (overrides: TOverrides<TObject, Partial<TObject>>[]): TObject[] =>
    overrides.map(this.generate);

  overwrite = (base: TObject, overrides: TOverrides<TObject, Partial<TObject>>): TObject =>
    this.generate(mergeOverrides<TObject, Partial<TObject>>(base, overrides));

  extend = <TNextObject extends TObject>(overrides: TOverrides<TObject, TNextObject>): TFixtureClass<TNextObject> =>
    new FixtureClass<TNextObject>(this.mergeOverrides<TNextObject>(overrides));

  defaults = (nextDefaults: TOverrides<TObject, Partial<TObject>>): TFixtureClass<TObject> =>
    new FixtureClass<TObject>(this.mergeOverrides<Partial<TObject>>(nextDefaults));

  createFunction(): TFixtureFunction<TObject> {
    const fixtureFunction: TFixtureFunction<TObject> = (overrides) => this.generate(overrides);

    fixtureFunction.context = this;
    fixtureFunction.generate = this.generate;
    fixtureFunction.array = this.array;
    fixtureFunction.overwrite = this.overwrite;
    fixtureFunction.createFunction = this.createFunction;

    fixtureFunction.extend = <TNextObject extends TObject>(getDefaultsFn: TOverrides<TObject, TNextObject>) =>
      this.extend<TNextObject>(getDefaultsFn).createFunction();

    fixtureFunction.defaults = (nextDefaults: TOverrides<TObject, Partial<TObject>>) =>
      this.defaults(nextDefaults).createFunction();

    return fixtureFunction;
  }
}
