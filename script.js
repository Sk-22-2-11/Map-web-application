// app.js

new Vue({
  el: '#app',
  data: {
    searchQuery: '',
    searchResults: [],
    selectedLocations: [],
    timeZone: ''
  },
  methods: {
    getCurrentLocation() {
      console.log('Getting current location...');
      // Add your logic for getting the current location here
    },
    searchLocation() {
      console.log('Searching location...');
      // Add your logic for searching a location here
    },
    deleteSelected() {
      console.log('Deleting selected records...');
      // Add your logic for deleting selected records here
    },
    getTimeZone(location) {
      console.log(`Fetching time zone for location: ${location}`);
      axios.get(`https://api.timezonedb.com/v2.1/get-time-zone?key=UBFIO77YZ3MC&format=json&by=position&lat=${location.lat}&lng=${location.lng}`)
        .then(response => {
          console.log('Time zone response:', response.data);
          const { zoneName } = response.data;
          this.timeZone = zoneName;
        })
        .catch(error => {
          console.error('Error fetching time zone:', error);
        });
    }
  }
});

function initMap() {
  console.log('Initializing map...');
  // Add your map initialization code here
}
