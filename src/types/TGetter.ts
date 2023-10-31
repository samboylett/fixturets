import { TFixture } from "./TFixture";

export interface TGetter<TObject extends TFixture, TKey extends keyof TObject> {
  attribute: TKey;
  calculate: (obj: TObject) => TObject[TKey];
}
