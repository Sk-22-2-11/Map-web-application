new Vue({
  el: '#app',
  data: {
    map: null,
    places: [],
    searchQuery: '',
    selectedPlaces: [],
    selectAll: false,
    currentPage: 1,
    pageSize: 10,
    mapsApiKey: 'AIzaSyDJW6tH9sOIiGlNRXj3jPnGPntN7m1CQ38',
    timezoneApiKey: 'UBFIO77YZ3MC'
  },
  computed: {
    paginatedPlaces() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.places.slice(startIndex, endIndex);
    }
  },
  methods: {
    getCurrentLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.searchPlaceByCoordinates(lat, lng);
        });
      } else {
        alert('Geolocation is not supported by this browser.');
      }
    },
    searchLocation() {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: this.searchQuery }, (results, status) => {
        if (status === 'OK' && results.length > 0) {
          const place = results[0];
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          this.searchPlaceByCoordinates(lat, lng);
        } else {
          alert('Location not found.');
        }
      });
    },
    searchPlaceByCoordinates(lat, lng) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results.length > 0) {
          const place = results[0];
          const timezoneApiUrl = `https://api.timezonedb.com/v2.1/get-time-zone?key=${this.timezoneApiKey}&format=json&by=position&lat=${lat}&lng=${lng}`;
          fetch(timezoneApiUrl)
            .then(response => response.json())
            .then(timezoneResult => {
              const localTime = new Date().toLocaleString('en-US', { timeZone: timezoneResult.zoneName });
              const newPlace = {
                name: place.formatted_address,
                timezone: timezoneResult.zoneName,
                localTime: localTime
              };
              this.places.push(newPlace);
              this.addMarker(place.geometry.location);
            })
            .catch(error => {
              console.error('Error fetching timezone:', error);
              alert('Failed to retrieve timezone information.');
            });
        }
      });
    },
    addMarker(location) {
      if (!this.map) {
        this.map = new google.maps.Map(document.getElementById('map'), {
          center: location,
          zoom: 12
        });
      }
      new google.maps.Marker({
        map: this.map,
        position: location
      });
    },
    toggleSelectAll() {
      if (this.selectAll) {
        this.selectedPlaces = this.places.slice();
      } else {
        this.selectedPlaces = [];
      }
    },
    deleteSelected() {
      this.places = this.places.filter(place => !this.selectedPlaces.includes(place));
      this.selectedPlaces.forEach(place => {
        const marker = this.findMarkerByPlace(place);
        marker.setMap(null);
      });
      this.selectedPlaces = [];
      this.selectAll = false;
    },
    findMarkerByPlace(place) {
      const markers = Array.from(this.map.getMarkers());
      return markers.find(marker => {
        const markerLat = marker.getPosition().lat();
        const markerLng = marker.getPosition().lng();
        const placeLat = place.geometry.location.lat();
        const placeLng = place.geometry.location.lng();
        return markerLat === placeLat && markerLng === placeLng;
      });
    }
  }
});
