import { TFixture } from "../types";
import { TOverrides } from "../types/TOverrides";

export const parseOverrides = <
  TObject extends TFixture,
  TNextObject extends Partial<TObject>
>(existingDefaults: Readonly<TObject>, overridesOrFn: TOverrides<TObject, TNextObject>): TNextObject =>
  typeof overridesOrFn === "function"
    ? overridesOrFn(existingDefaults)
    : overridesOrFn;
