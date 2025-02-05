// Elements
const locationIdElement = document.getElementById("locationid");
const startDateElement = document.getElementById("startdate");
const stopDateElement = document.getElementById("enddate");

// button
const startButton = document.getElementById("startbutton");
const stopButton = document.getElementById("stopbutton");

// listening to events

startButton.onclick = function () {
  console.log("location:", locationIdElement.value);
};

stopButton.onclick = function () {
  console.log("stop Date:", stopDateElement.value);
};
