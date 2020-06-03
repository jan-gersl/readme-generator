const axios = require('axios');
const inquirer = require('inquirer');

async function getInfoAbout(user)
{
  const userDetails = await axios.get(`https://api.github.com/users/${user}`);
  const email = await extractEmailFromActivity(user);

  return {
    "email" : email,
    "avatar" : userDetails.data.avatar_url,
    "profile" : userDetails.data.html_url,
    "name" : userDetails.data.name ? userDetails.data.name : "(unknown)",
    "blog" : userDetails.data.blog
  }
}

// Warning: black magic, don't try this at home
//   TODO: find another way to do this
async function extractEmailFromActivity(user)
{
  const userActivity = await axios.get(`https://api.github.com/users/${user}/events/public`);
  const x = userActivity.data.find(item => {
    try{
      return item.payload.commits[0].author.email != '';
    }
    catch(error){
      return false;
    }
  });
  if(x != undefined) return x.payload.commits[0].author.email;
}

async function getAllRepositoryNames(user)
{
  const repos = await axios.get(`https://api.github.com/users/${user}/repos`);
  const x = repos.data.map( item => item.name);
  return x;
}

async function getRepositoryNameFromUser(user)
{
  const repositories = await getAllRepositoryNames(user);
  let userInput = await inquirer.prompt({
    message: "Choose the repository:",
    type: "list",
    name: "projectRepositoryName",
    choices: repositories
  });
  return userInput.projectRepositoryName;
}

exports.getInfoAbout = getInfoAbout;
exports._extractEmailFromActivity = extractEmailFromActivity;
exports._getAllRepositoryNames = getAllRepositoryNames;
exports.getRepositoryNameFromUser = getRepositoryNameFromUser;