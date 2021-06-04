import { countDataCategories } from "./utils";

test("count data categories", () => {
  const data = [
    { category: "cat1" },
    { category: "cat1" },
    { category: "cat1" },
    { category: "cat2" },
    { category: "cat2" },
    { category: "cat3" },
  ];

  const actual = countDataCategories(data);
  const expected = [
    { name: "cat1", value: 3 },
    { name: "cat2", value: 2 },
    { name: "cat3", value: 1 },
  ];

  expect(actual).toStrictEqual(expected);
});
