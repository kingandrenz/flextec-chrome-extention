// Elements
const locationIdElement = document.getElementById("locationid");
const startDateElement = document.getElementById("startDate");
const endDateElement = document.getElementById("endDate");

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

const showDateError = (dateErrorElem, errorMessage) => {
  dateErrorElem.innerHTML = errorMessage;
  showElement(dateErrorElem);
};

const validateStartDate = (today, startDate) => {
  const isAfterToday = !startDate.isBefore(today, "date");
  if (!startDateElement.value) {
    showDateError(startDateError, "please enter a valid start date");
  } else if (!isAfterToday) {
    showDateError(startDateError, "start date must be before today");
  } else {
    hideElement(startDateError);
  }

  return startDateElement.value && isAfterToday;
};

const validateEndDate = (today, startDate, endDate) => {
  const isAfterStartDate = endDate.isAfter(startDate, "date");
  const isAfterToday = endDate.isAfter(today, "day");

  if (!endDateElement.value) {
    showDateError(endDateError, "please enter a valid end date");
  } else if (!isAfterStartDate) {
    showDateError(endDateError, "End date must be after the start date");
  } else {
    hideElement(endDateError);
  }

  return endDateElement.value && isAfterStartDate && isAfterToday;
};

const validateDates = () => {
  const today = spacetime.now().startOf("day");
  const startDate = spacetime(startDateElement.value).startOf("day");
  const endDate = spacetime(endDateElement.value).startOf("day");

  const isStartDateValid = validateStartDate(today, startDate);
  const isEndDateValid = validateEndDate(today, startDate, endDate);

  return isStartDateValid && isEndDateValid;
};

const performOnStartValidation = () => {
  const isDateValid = validateDates();
  if (!locationIdElement.value) {
    showElement(locationIdError);
  } else {
    hideElement(locationIdError);
  }

  return locationIdElement.value && isDateValid;
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

// diabling past dates
const today = spacetime.now().startOf("day").format();
startDateElement.setAttribute("min", today);
endDateElement.setAttribute("min", today);
