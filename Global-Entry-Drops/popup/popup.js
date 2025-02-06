// Elements
const locationIdElement = document.getElementById("locationid");
const startDateElement = document.getElementById("startdate");
const endDateElement = document.getElementById("enddate");

// button
const startButton = document.getElementById("startbutton");
const stopButton = document.getElementById("stopbutton");

// listening to events

startButton.onclick = function () {
  const prefs = {
    locationId: locationIdElement.value,
    startDate: startDateElement.value,
    endDate: endDateElement.value,
  };
  chrome.runtime.sendMessage({ event: "onStart", prefs }); // send message to the background.js
};

stopButton.onclick = function () {
  chrome.runtime.sendMessage({ event: "onStop" });
};

chrome.storage.local.get(["locationId", "startDate", "endDate"], (result) => {
  const { locationId, startDate, endDate } = result;

  if (locationId) {
    locationIdElement.value = locationId;
  }

  if (startDate) startDateElement.value = startDate;

  if (endDate) endDateElement.value = endDate;
});
