const axios = require('axios');
const cheerio = require('cheerio');
var express = require('express');
var app = express();

app.set("view engine", "ejs");

var link = "";

var test = "";

//console.log('/index' + testtt);
app.get('/', async (req, res) => {
  const activities = await grabPageHtml(req.params.page);
  res.render('index', { activities: activities });
});

app.listen(3000);
//link = "http://www.kingcoathletics.com/index.php?pid=0.7.90.5.320"; 
//link = "http://www.kingcoathletics.com/index.php?pid=0.7.90.11.320";

const grabPageHtml = async (link) => {
var activities = {
dates: [
],
datesRemaining: [
],
homeTeamSchoolCompleted: [
],
homeTeamScoreCompleted: [
],
opponentTeamSchoolCompleted: [
],
opponentTeamScoreCompleted: [
],
opponentTeamRemaining: [
],
timeRemaining: [
],
awayHomeRemaining: [
],
placeRemaining: [
],
datePost: [
],
opponentPost: [
],
standingTitle: [
]
};
  const routeObject = {
    'boys/basketball': 3,
    'boys/football': 1,
    'boys/golf': 8
    }

  const route = routeObject[link];
  if (route === null || route === undefined) {
    throw new Error('route does not exist!');
  }
  const kingCoAthleticsUrl = `http://www.kingcoathletics.com/index.php?pid=0.7.90.${route}.320`;
  const html = await axios.get(kingCoAthleticsUrl).then(response => response.data);
  const $ = cheerio.load(html);
  
const gameDatesCompleted = $('#schedule-panel > table:nth-child(5) > tbody > tr:not(:nth-child(2)) > td:nth-child(3)')
    .toArray()
    .map(element => $(element).text())
    .filter(element => element.trim() !== '');
    
const homeTeamCompleted = $('#schedule-panel > table:nth-child(5) > tbody > tr:not(:nth-child(2)) > td:nth-child(4)')
  .toArray()
  .map(element => $(element).text())
  .filter(element => element.trim() !== '');

const homeSchoolArrCompleted = [];
const homeScoreArrCompleted = [];

homeTeamCompleted.forEach(home => {
  homeSchoolArrCompleted.push(home.slice(0, -2).trim());
  homeScoreArrCompleted.push(Number(home.slice(-2)));
});

    const opponentTeamCompleted = $('#schedule-panel > table:nth-child(5) > tbody > tr:not(:nth-child(2)) > td:nth-child(5)')
  .toArray()
  .map(element => $(element).text())
  .filter(element => element.trim() !== '');

  const opponentSchoolArrCompleted = [];
const opponentScoreArrCompleted = [];

opponentTeamCompleted.forEach(opponent => {
  opponentSchoolArrCompleted.push(opponent.slice(0, -2).trim());
  opponentScoreArrCompleted.push(Number(opponent.match(/\d+/)[0]));
});

    const gameDatesRemaining = $('#schedule-panel > table:nth-child(7) > tbody > tr:not(:nth-child(1)) > td:nth-child(2)')
    .toArray()
    .map(element => $(element).text())
    .filter(element => element.trim() !== '');

    const opponentTeamRemaining = $('#schedule-panel > table:nth-child(7) > tbody > tr:not(:nth-child(1)) > td:nth-child(3)')
    .toArray()
    .map(element => $(element).text())
    .filter(element => element.trim() !== 'Eric Anderson Classic');
    

    const timeRemaining = $('#schedule-panel > table:nth-child(7) > tbody > tr:not(:nth-child(1)) > td:nth-child(4)')
    .toArray()
    .map(element => $(element).text())
    .filter(element => element.trim() !== '');

    const awayHomeRemaining = $('#schedule-panel > table:nth-child(7) > tbody > tr:not(:nth-child(1)) > td:nth-child(5)')
    .toArray()
    .map(element => $(element).text())
    .filter(element => element.trim() !== '');

    const placeRemaining = $('#schedule-panel > table:nth-child(7) > tbody > tr:not(:nth-child(1)) > td:nth-child(6)')
    .toArray()
    .map(element => $(element).text())
    .filter(element => element.trim() !== '');

    const datePost = $('#schedule-panel > table:nth-child(9) > tbody > tr:not(:nth-child(1)) > td:nth-child(2)')
    .toArray()
    .map(element => $(element).text())
    .filter(element => element.trim() !== '');

    const opponentPost = $('#schedule-panel > table:nth-child(9) > tbody > tr:not(:nth-child(1)) > td:nth-child(3)')
    .toArray()
    .map(element => $(element).text())
    .filter(element => element.trim() !== '');

    const standingTitle = $('#main-content > div:nth-child(1) > table > tbody > tr > td > div')
    .toArray()
    .map(element => $(element).text())
    .filter(element => element.trim() !== '');    


    //FIX THIS!!! REASON WHY THE TABLES ARE WEIRD!!!
    for (i = 0; i < homeTeamCompleted.length; i++){
      activities.dates.push(gameDatesCompleted[i]);
      activities.homeTeamSchoolCompleted.push(homeSchoolArrCompleted[i]);
      activities.homeTeamScoreCompleted.push(homeScoreArrCompleted[i]);
      activities.opponentTeamSchoolCompleted.push(opponentSchoolArrCompleted[i]);
      activities.opponentTeamScoreCompleted.push(opponentScoreArrCompleted[i]);
      activities.datesRemaining.push(gameDatesRemaining[i]);
      activities.opponentTeamRemaining.push(opponentTeamRemaining[i]);
      activities.timeRemaining.push(timeRemaining[i]);
      activities.awayHomeRemaining.push(awayHomeRemaining[i]);
      activities.placeRemaining.push(placeRemaining[i]);
      activities.datePost.push(datePost[i]);
      activities.opponentPost.push(opponentPost[i]);
      activities.standingTitle.push(standingTitle[i]);
   }

   return activities;
};