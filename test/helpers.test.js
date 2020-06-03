const myApp = require("../utils/helpers.js");

/*
mock("mypackage");

myApp.myReadFile.mockReturnValue();

console.log("Testing!");
*/

describe("helper functions", () => 
{
    test("should format a chapter JSON", () =>
    {
        const title = "titile";
        const desc = "desc lksadhglakg";
        const chapter = myApp.newChapter(title, desc);
        expect(chapter.title).toEqual(title);
        expect(chapter.description).toEqual(desc);
    });

    test("should parse contributors", () =>
    {
        const contributors = "foo, bar, honza ,petr,pan";
        
        expect(myApp.getContributors(contributors))
            .toEqual(["foo", "bar", "honza", "petr", "pan"]);
    });

    test("should return empty array", () =>
    {
        expect(myApp.getContributors("")).toEqual([]);
    });
});
