import { fetchLocations } from "./api/fetchLocations.js";
import { fetchOpenSlots } from "./api/fetchOpenSlots.js";
import { createNotification } from "./lib/createNotification.js";

const ALARM_JOB_NAME = "DROP_ALARM";

let catchedPrefs = {};
let firstAppointmentTimestamp = null;

// #6: how to make crome extention api calls:
chrome.runtime.onInstalled.addListener((details) => {
  handleOnStop();
  fetchLocations();
});

chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
  const { event, prefs } = data;

  switch (event) {
    case "onStop":
      handleOnStop(prefs);
      break;
    case "onStart":
      handleOnStart(prefs);
      break;
    default:
      console.warn("Unknown event:", event);
      break;
  }
});

chrome.notifications.onClicked.addListener(() => {
  chrome.tabs.create({
    url: "https://ttp.cbp.dhs.gov/schedulerui/schedule-interview/location?lang=en&vo=true&returnUrl=ttp-external&service=up",
  });
});

chrome.alarms.onAlarm.addListener(() => {
  console.log("Alarm scheduled!!");
  openSlotsJob();
});

const handleOnStop = (prefs) => {
  console.log("Stop event received");
  setRunningStatus(false);
  stopAlarm();
  catchedPrefs = {};
  firstAppointmentTimestamp = null;
};

const handleOnStart = (prefs) => {
  console.log("Start event received");
  console.log("prefs received:", prefs);
  catchedPrefs = prefs;
  chrome.storage.local.set(prefs);
  setRunningStatus(true);
  createAlarm();
};

const setRunningStatus = (isRunning) => {
  chrome.storage.local.set({ isRunning });
};

const createAlarm = () => {
  chrome.alarms.get(ALARM_JOB_NAME, (existingAlarm) => {
    if (!existingAlarm) {
      chrome.alarms.create(ALARM_JOB_NAME, { periodInMinutes: 1.0 });
    }
  });
};

const stopAlarm = () => {
  chrome.alarms.clearAll();
};

const openSlotsJob = () => {
  fetchOpenSlots(catchedPrefs).then((data) => handleOpenSlots(data));
};

const handleOpenSlots = (openSlots) => {
  if (
    openSlots &&
    openSlots.length > 0 &&
    openSlots[0].timestamp != firstAppointmentTimestamp
  ) {
    firstAppointmentTimestamp = openSlots[0].timestamp;
    // create notification
    createNotification(openSlots[0], openSlots.length, catchedPrefs);
  }
};
