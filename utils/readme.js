const newLine = "\n";

function createReadme(projectTitle, projectDescription, chapters, badges)
{
  myText = makeH1(projectTitle,projectDescription + newLine + newLine + badges.join(newLine));
  myText += makeH2("Table of Contents", "puttableofcontentshere");
  tableOfContents = "";
  chapters.forEach((chapter, i) =>
  {
    tableOfContents += makeTocEntry(chapter.title, i+1);
    myText += makeH2(chapter.title, chapter.description);
  });
  return myText.replace("puttableofcontentshere", tableOfContents);
}

function makeTocEntry(title, i)
{
  return `${i}. [${title}](#${title})${newLine}`;
}

function makeH1(title, text)
{
  return "# " + title + newLine + text + newLine + newLine;
}

function makeH2(title, text)
{
  return "## " + title + newLine + text + newLine + newLine;
}

function makeImg(title, url){
  return `![${title}](${url})`;
}

exports.create = createReadme;
exports._makeTocEntry = makeTocEntry;
exports.makeH1 = makeH1;
exports.makeH2 = makeH2;
exports.makeImg = makeImg;