const inquirer = require('inquirer');
const gitHubConnector = require('./utils/gitHubConnector.js');
const readme = require('./utils/readme.js');
const tools = require('./utils/helpers.js');


// ---------  >> add more questions here <<  ----------------
let questions = [
  {
    name: 'gitUserName',
    message: 'What is your git username?',
    validate: function(value) {
      if(!value.match(/^\s*\S+\s*$/i)){
        return 'This question is mandatory.';
      }
      return true;
    }
  },
  {
    name: 'projectName',
    message: 'What is the project name?',
    default: "Sample Project"
  },
  {
    name: 'projectDescription',
    message: 'What is the project description?'
  },
  {
    name: 'license',
    message: 'What is the license?',
    default: "ISC"
  },
  {
    name: 'credits',
    message: 'Please name the contributors (comma-separated list or leave empty)',
    validate: function(value) {
      if(!value.match(/^([^,]*)(,([^,]+))*$/i)){
        return 'Please enter a comma-separated list or leave empty';
      }
      return true;
    }
  },
  {
    name: 'isRepositorySelectionFromGitHub',
    message: 'Would you like to pick one of your existing GitHub repositories?',
    type: "confirm",
    default: true
  },
  {
    name: 'projectRepositoryName',
    message: 'What is the project repository name?',
    default: "sample-project-repo",
    when : function( answers ) {
      return answers.isRepositorySelectionFromGitHub === false;
    },
    validate: function(value) {
      if(!value.match(/^\s*\S+\s*$/i)){
        return 'This question is mandatory.';
      }
      return true;
    }
  }
];


// ---------  >> add more chapters here <<  ----------------
async function defineChapters(answers)
{
  const userInfo = await gitHubConnector.getInfoAbout(answers.gitUserName);
  const credits = await tools.formatContributors(tools.getContributors(answers.credits));

  let chapters = [];
  chapters.push(aboutInstallation());
  chapters.push(aboutLicense(answers.license ));
  chapters.push(aboutContributions(userInfo));
  chapters.push(aboutQuestions(userInfo));
  if(credits.length > 0) chapters.push(aboutCredits(credits));
  
  return chapters;
}

function aboutInstallation(){
  return tools.newChapter("Installation", "  Open your terminal and type ```npm install```");
}

function aboutLicense(license){
  return tools.newChapter("License", "This project is under the " + license + " license.");
}

function aboutContributions(userInfo){
  return tools.newChapter("Contributions", 
    `  * Contact [${userInfo.name}](mailto:${userInfo.email}?` +
      `subject=Contribution&body=Hi%2C%0D%0AI'd%20like%20to%20contribute%20to%20your%20project!)\n` + 
    `  * ![${userInfo.name}](${userInfo.avatar})`);
}

function aboutQuestions(userInfo){
  return tools.newChapter("Questions",
  `  * [GitHub Profile](${userInfo.profile})\n` + 
  `  * [Blog](${userInfo.blog})`);
}

function aboutCredits(credits){
  return tools.newChapter("Credits", credits.join(", "));
}


// -------------  >> add more badges here <<  ----------------
function defineBadges(userName, repoName)
{
  const userAndRepo = `${userName}/${repoName}`;
  return [
    readme.makeImg('Open Issues','https://img.shields.io/github/issues-raw/' + userAndRepo),
    readme.makeImg('Last Commit','https://img.shields.io/github/last-commit/' + userAndRepo),
    readme.makeImg('Version','https://img.shields.io/github/package-json/v/' + userAndRepo),
    readme.makeImg('License','https://img.shields.io/github/license/' + userAndRepo)
  ];
}

async function generate(outputFile) {
  let userInput = await inquirer.prompt(questions);

  if(userInput.isRepositorySelectionFromGitHub){
    userInput.projectRepositoryName = await gitHubConnector.getRepositoryNameFromUser(userInput.gitUserName);
  }

  const chapters = await defineChapters(userInput);
  const badges = defineBadges(userInput.gitUserName, userInput.projectRepositoryName);
  
  const readmeText = readme.create(userInput.projectName, userInput.projectDescription, chapters, badges);
  tools.writeReadmeFile(outputFile, readmeText);
}

generate("gen_README.md").catch((err) => {console.log(err);});