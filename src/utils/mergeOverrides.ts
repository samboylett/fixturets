import merge from "lodash.merge";
import { TFixture } from "../types";
import { parseOverrides } from "./parseOverrides";
import { TOverrides } from "../types/TOverrides";

export const mergeOverrides = <TObject extends TFixture, TNextObject extends Partial<TObject>>(
  defaultAttributes: Readonly<TObject>,
  overridesOrFn: TOverrides<TObject, TNextObject>,
) =>
  merge<
    {},
    TObject,
    TNextObject
  >({}, defaultAttributes, parseOverrides<TObject, TNextObject>(defaultAttributes, overridesOrFn));
