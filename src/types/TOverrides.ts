import { TFixture } from "./TFixture";

export type TOverrides<TObject extends TFixture, TNextObject extends Partial<TObject>> =
  | TNextObject
  | ((existingDefaults: Readonly<TObject>) => TNextObject);
