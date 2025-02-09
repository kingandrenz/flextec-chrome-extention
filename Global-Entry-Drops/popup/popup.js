// Elements
const locationIdElement = document.getElementById("locationid");
const startDateElement = document.getElementById("startdate");
const endDateElement = document.getElementById("enddate");

// button
const startButton = document.getElementById("startbutton");
const stopButton = document.getElementById("stopbutton");

// span listenner
const runningSpan = document.getElementById("runningSpan");
const stoppedSpan = document.getElementById("stoppedSpan");

// Error Message
const locationIdError = document.getElementById("locationIdError");
const startDateError = document.getElementById("startDateError");
const endDateError = document.getElementById("endDateError");

const hideElement = (elem) => {
  elem.style.display = "none";
};

const showElement = (elem) => {
  elem.style.display = "";
};

const enableElement = (elem) => {
  elem.disabled = false;
};

const disableElement = (elem) => {
  elem.disabled = true;
};

const handleOnStartState = () => {
  // spans
  showElement(runningSpan);
  hideElement(stoppedSpan);
  // buttons
  disableElement(startButton);
  enableElement(stopButton);
  //disable Element
  disableElement(locationIdElement);
  disableElement(startDateElement);
  disableElement(endDateElement);
};

const handleOnStopState = () => {
  // spans
  showElement(stoppedSpan);
  hideElement(runningSpan);
  // button
  disableElement(stopButton);
  enableElement(startButton);
  // enable element
  enableElement(locationIdElement);
  enableElement(startDateElement);
  enableElement(endDateElement);
};

const performOnStartValidation = () => {
  if (!locationIdElement.value) {
    showElement(locationIdError);
  } else {
    hideElement(locationIdError);
  }

  if (!startDateElement.value) {
    showElement(startDateError);
  } else {
    hideElement(startDateError);
  }

  if (!endDateElement.value) {
    showElement(endDateError);
  } else {
    hideElement(endDateError);
  }

  return (
    locationIdElement.value && startDateElement.value && endDateElement.value
  );
};

// listening to events

startButton.onclick = function () {
  const allFieldsValid = performOnStartValidation();

  if (allFieldsValid) {
    handleOnStartState();
    const prefs = {
      locationId: locationIdElement.value,
      startDate: startDateElement.value,
      endDate: endDateElement.value,
      tzData:
        locationIdElement.options[locationIdElement.selectedIndex].getAttribute(
          "data-tz"
        ),
    };
    chrome.runtime.sendMessage({ event: "onStart", prefs }); // send message to the background.js
  }
};

stopButton.onclick = function () {
  handleOnStopState();
  chrome.runtime.sendMessage({ event: "onStop" });
};

chrome.storage.local.get(
  ["locationId", "startDate", "endDate", "locations", "isRunning"],
  (result) => {
    const { locationId, startDate, endDate, locations, isRunning } = result;

    setLocations(locations);

    if (locationId) {
      locationIdElement.value = locationId;
    }

    if (startDate) startDateElement.value = startDate;

    if (endDate) endDateElement.value = endDate;

    if (isRunning) {
      console.log("running:", runningSpan, isRunning);
      handleOnStartState();
    } else {
      handleOnStopState();
    }
  }
);

const setLocations = (locations) => {
  locations.forEach((location) => {
    let optionElement = document.createElement("option");
    optionElement.value = location.id;
    optionElement.innerHTML = location.name;
    optionElement.setAttribute("data-tz", location.tzData);
    locationIdElement.appendChild(optionElement);
  });
};
