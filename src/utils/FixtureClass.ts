import { TFixture, TFixtureFunction, TOverrides } from "../types";
import { TDefaultObject } from "../types/TDefaultObject";
import { TFixtureClass } from "../types/TFixtureClass";
import { TGetter } from "../types/TGetter";
import { mergeOverrides } from "./mergeOverrides";

export class FixtureClass<TObject extends TFixture> implements TFixtureClass<TObject> {
  protected defaultFixture: TDefaultObject<TObject>;
  protected getters: Array<TGetter<TObject, keyof TObject>>;

  constructor(defaultFixture: TDefaultObject<TObject>, getters: Array<TGetter<TObject, keyof TObject>> = []) {
    this.defaultFixture = defaultFixture;
    this.getters = getters;
  }

  protected getDefaultAttributes = (): Readonly<TObject> => Object.freeze(
    typeof this.defaultFixture === "function"
      ? this.defaultFixture()
      : this.defaultFixture
  );

  protected mergeOverrides = <
    TNextObject extends Partial<TObject>
  >(overridesOrFn: TOverrides<TObject, TNextObject>) => mergeOverrides(this.getDefaultAttributes(), overridesOrFn);

  private get Klass() {
    return this.constructor as typeof FixtureClass;
  }

  generate(overrides: TOverrides<TObject, Partial<TObject>> = {}): TObject {
    return this.getters.reduce((prev, getter) => ({
      ...prev,
      [getter.attribute]: getter.calculate(prev),
    }), this.mergeOverrides(overrides));
  }

  array(overrides: TOverrides<TObject, Partial<TObject>>[]): TObject[] {
    return overrides.map(o => this.generate(o));
  }

  overwrite(base: TObject, overrides: TOverrides<TObject, Partial<TObject>>): TObject {
    return this.generate(mergeOverrides<TObject, Partial<TObject>>(base, overrides));
  }

  extend<TNextObject extends TObject>(overrides: TOverrides<TObject, TNextObject>): TFixtureClass<TNextObject> {
    return new this.Klass<TNextObject>(this.mergeOverrides<TNextObject>(overrides));
  }

  defaults(nextDefaults: TOverrides<TObject, Partial<TObject>>): TFixtureClass<TObject> {
    return new this.Klass<TObject>(this.mergeOverrides<Partial<TObject>>(nextDefaults));
  }

  addGetter<TKey extends keyof TObject>(key: TKey, calculate: (obj: TObject) => TObject[TKey]) {
    return new this.Klass(this.defaultFixture, [
      ...this.getters,
      {
        attribute: key,
        calculate,
      }
    ]);
  }

  createFunction(): TFixtureFunction<TObject> {
    const fixtureFunction: TFixtureFunction<TObject> = (overrides) => this.generate(overrides);

    fixtureFunction.context = this;
    fixtureFunction.generate = this.generate.bind(this);
    fixtureFunction.array = this.array.bind(this);
    fixtureFunction.overwrite = this.overwrite.bind(this);
    fixtureFunction.createFunction = this.createFunction.bind(this);

    fixtureFunction.addGetter = <TKey extends keyof TObject>(
      key: TKey,
      calculate: (obj: TObject) => TObject[TKey]
    ) => this.addGetter(key, calculate).createFunction();

    fixtureFunction.extend = <TNextObject extends TObject>(getDefaultsFn: TOverrides<TObject, TNextObject>) =>
      this.extend<TNextObject>(getDefaultsFn).createFunction();

    fixtureFunction.defaults = (nextDefaults: TOverrides<TObject, Partial<TObject>>) =>
      this.defaults(nextDefaults).createFunction();

    return fixtureFunction;
  }
}
