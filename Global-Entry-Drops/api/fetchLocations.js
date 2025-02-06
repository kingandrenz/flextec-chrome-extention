const LOCATION_ENDPOINT =
  "https://ttp.cbp.dhs.gov/schedulerapi/locations/?temporary=false&inviteOnly=false&operational=true&serviceName=Global%20Entry";

export default function fetchLocations() {
  fetch(LOCATION_ENDPOINT)
    .then((response) => response.json())
    .then((data) => {
      const filteredLocation = data.map((res) => ({
        id: res.id,
        name: res.name,
        shortName: res.shortName,
        tzData: res.tzData,
      }));
      filteredLocation.sort((a, b) => a.name.localeCompare(b.name));
      chrome.storage.local.set({ locations: filteredLocation });
      console.log(filteredLocation);
    })
    .catch((error) => {
      console.log(error);
    });
}
