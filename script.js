
new Vue({
  el: '#app',
  data: {
    searchQuery: '',
    searchResults: [],
    selectedLocations: [],
    timeZone: '',
    localTime: ''
  },
  methods: {
    getCurrentLocation() {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        const location = { lat: latitude, lng: longitude };
        this.searchResults.push(location);
        this.getTimeZone(location);
        this.updateMap();
      }, error => {
        console.error('Error getting current location:', error);
      });
    },
    searchLocation() {
      // Clear previous search results
      this.searchResults = [];
      this.selectedLocations = [];

      // Perform search using the searchQuery
      axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(this.searchQuery)}&key=YOUR_GOOGLE_MAPS_API_KEY`)
        .then(response => {
          const results = response.data.results;
          if (results.length > 0) {
            results.forEach(result => {
              const { lat, lng } = result.geometry.location;
              const location = { lat, lng };
              this.searchResults.push(location);
            });
            this.getTimeZone(this.searchResults[this.searchResults.length - 1]);
            this.updateMap();
          } else {
            console.log('No results found.');
          }
        })
        .catch(error => {
          console.error('Error searching for location:', error);
        });
    },
    deleteSelected() {
      this.searchResults = this.searchResults.filter(location => !this.selectedLocations.includes(location));
