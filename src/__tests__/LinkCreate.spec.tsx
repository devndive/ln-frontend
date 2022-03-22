import { prefillNotes } from "../pages/LinkCreate";
import { faker } from "@faker-js/faker";

describe("LinkCreate", () => {
  it("should return empty string if title and description are missing", () => {
    const actual = prefillNotes("", "");

    expect(actual).toBe("");
  });

  it("should only return the title if ony the title is given", () => {
    const title = faker.lorem.words();

    const actual = prefillNotes(title, "");

    expect(actual).toBe(title);
  });

  it("should only return the description if only description is given", () => {
    const description = faker.lorem.paragraph();
    const actual = prefillNotes("", description);

    expect(actual).toBe(description);
  });

  it("it should return title and description separated by new lines", () => {
    const title = faker.lorem.words();
    const description = faker.lorem.paragraph();

    const actual = prefillNotes(title, description);

    expect(actual).toBe(`${title}\n\n${description}`);
  });
});
