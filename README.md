# FixtureTS

A simple library to help generate typed fixtures for testing/storybook, with default values.

## Usage

Create a fixture function for your type:

```typescript
import { createFixtureFunction } from "fixturets";

interface TYourType {
  foo: string;
  bar: number;
}

export const getYourType = createFixtureFunction<TYourType>({
  foo: "",
  bar: 0,
})
```

Then you can create new fixtures for your tests:

```typescript
import { getYourType } from "./path/to/fixture";

const fixture1 = getYourType(); // Default fixture

const fixture2 = getYourType({
  foo: "some value",
}); // Override some attribute for this fixture

const fixtures = getYourType.array([
  {},
  { bar: 2 },
]); // Generates an array of fixtures, first value here is default, second has `bar` overridden

const fixture3 = getYourType.overwrite(fixture2, { bar: 2 }); // Modify an existing fixture
```

You can also create another function with different default values, should you require:

```typescript
import { getYourType } from "./path/to/fixture";

const getSpecialType = getYourType.defaults({
  foo: "Special",
});

// Then all these work as per above:
getSpecialType()
getSpecialType.array([])
getSpecialType.overwrite(...) // etc.
```

You can also extend a fixture function in a similar way you can extend interfaces in typescript:

```typescript
import { getYourType, TYourType } from "./path/to/fixture";

interface TSpecificType extends TYourType {
  anotherAttribute: boolean;
}

export const getSpecificType = getYourType.extend(existingDefaults => ({
  ...existingDefaults,
  anotherAttribute: false, // Add new/changed attributes for the defaults.
}));

// Then all these work as per above:
getSpecificType()
getSpecificType.array([])
getSpecificType.overwrite(...) // etc.
```