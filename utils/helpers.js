const fs = require('fs');
const gitHubConnector = require('./gitHubConnector.js');


function newChapter(title, description)
{
  return {"title" : title, "description": description};
}

function getContributors(creditsRaw)
{
  return creditsRaw
    .split(',')
    .map(item => item.trim())
    .filter(element => {
      return element != null && element != '';
  });
}

async function formatContributors(credits)
{
  let retVal = [];
  for (const userName of credits) {
    try{
      userInfo = await gitHubConnector.getInfoAbout(userName);
      if(userInfo){
        retVal.push(`[${userInfo.name}](${userInfo.profile})`); 
      }
    }
    catch(error){
      console.log(userName + ": unknown user, skipping");
    }
  };
  return retVal;
}

function writeReadmeFile(fileName, text)
{
  fs.writeFile(fileName, text, (err) => {
    if (err) {
      console.log(`Error writing the file (${fileName}): ${err}`);
    }
    else{
      console.log(`Readme generated (${fileName})`);
    }
  });
}

exports.newChapter = newChapter;
exports.getContributors = getContributors;
exports.formatContributors = formatContributors;
exports.writeReadmeFile = writeReadmeFile;