export const handleNotification = (activeAppointments) => {
  if (activeAppointments.lenght > 0) {
    createOpenNotification(activeAppointments[0]);
  }
};

const createOpenNotification = (activeAppointments) => {
  chrome.notification.create({
    title: "Global Entry Drops",
    messages: `Found an item interview at ${activeAppointments.timestamp}`,
    iconUrl: "./images/icon-48.png",
    type: "basic",
  });
};
