import { TFixture } from "./TFixture";

export type TDefaultObject<TObject extends TFixture> = TObject | (() => TObject);
