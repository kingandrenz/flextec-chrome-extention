export const createNotification = (openSlots, numberOfSlots, prefs) => {
  const { tzData } = prefs;

  let message = `Found an item interview at ${openSlots.timestamp} ${tzData} timezone`;

  if (numberOfSlots > 1) {
    message = `${message} and ${numberOfSlots - 1} additional open interviews`;
  }

  chrome.notifications.create({
    title: "Global Entry Drops",
    message,
    iconUrl: "./images/icon-48.png",
    type: "basic",
  });
};
