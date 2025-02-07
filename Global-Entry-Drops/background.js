import fetchLocations from "./api/fetchLocations.js";

const ALARM_JOB_NAME = "DROP_ALARM";

// #6: how to make crome extention api calls:
chrome.runtime.onInstalled.addListener((details) => {
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

const handleOnStop = (prefs) => {
  console.log("Stop event received");
  setRunningStatus(false);
  stopAlarm();
};

const handleOnStart = (prefs) => {
  console.log("Start event received");
  console.log("prefs received:", prefs);
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

chrome.alarms.onAlarm.addListener(() => {
  console.log("Alarm scheduled!!");
});
