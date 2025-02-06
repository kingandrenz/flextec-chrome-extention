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
  console.log("prefs received:", prefs);
};

const handleOnStart = (prefs) => {
  console.log("Start event received");
  console.log("prefs received:", prefs);
  chrome.storage.local.set(prefs);
};
