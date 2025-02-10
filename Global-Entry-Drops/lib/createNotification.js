export const createNotification = (openSlots, numberOfSlots, prefs) => {
  const { tzData } = prefs;

  let message = "";

  if (numberOfSlots > 1) {
    message = `Found an item interview at (${
      openSlots.timestamp
    } ${tzData} timezone) and ${numberOfSlots - 1} additional open interviews`;
  } else {
    message = `Found an item interview at ${openSlots.timestamp} ${tzData} timezone`;
  }

  chrome.notifications.create({
    title: "Global Entry Drops",
    message,
    iconUrl: "./images/icon-48.png",
    type: "basic",
  });
};

chrome.notifications.onClicked.addListener(() => {
  chrome.tabs.create({
    url: "https://ttp.cbp.dhs.gov/schedulerui/schedule-interview/location?lang=en&vo=true&returnUrl=ttp-external&service=up",
  });
});
