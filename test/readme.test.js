const readme = require("../utils/readme.js");

describe("Formatting functions", () => 
{
    const newLine = '\n';

    test("should generate H1", () =>
    {
        const title = "test";
        const description = "description";
        expect(readme.makeH1(title, description)).toEqual("# " + title + newLine + description + newLine + newLine);
    });

    test("should generate H2", () =>
    {
        const title = "test";
        const description = "description";
        expect(readme.makeH2(title, description)).toEqual("## " + title + newLine + description + newLine + newLine);
    });

    test("should generate table of contents line", () =>
    {
        const title = "test";
        const i = 6;
        expect(readme._makeTocEntry(title, i)).toEqual(`${i}. [${title}](#${title})${newLine}`);
    });
});
