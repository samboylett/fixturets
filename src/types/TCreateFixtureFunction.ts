import { TDefaultObject } from "./TDefaultObject";
import { TFixture } from "./TFixture"
import { TFixtureFunction } from "./TFixtureFunction"

export type TCreateFixtureFunction = <TObject extends TFixture>(baseDefaultAttributes: TDefaultObject<TObject>) => TFixtureFunction<TObject>;
