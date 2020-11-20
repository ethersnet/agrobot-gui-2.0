  
  export interface ReduxState {
    addRegion: boolean;
    map: any;
    robot: any;
    density: number;
    regions: Region[]
  }
  
  export interface ReduxAction {
    type: string;
    payload: any;
  }

  export class Region {
    region: google.maps.Polygon
    waypoints: google.maps.Marker[]
    density: number
    map: google.maps.Map
  
    constructor(path_inp: any, map_inp: any, density_inp: number) {
      let polygon = new google.maps.Polygon({
          map: map_inp,
          paths: path_inp,
          fillColor: "#D43AAC",
          strokeColor: "#EB807E",
          fillOpacity: 0.2,
          strokeWeight: 5,
          editable: true,
          clickable: true,
      });

      this.density = density_inp
      this.region = polygon;
      this.waypoints = [];
      this.map = map_inp;
      this.updateWaypoints();
  

      google.maps.event.addListener(path_inp, 'set_at', () => {
          this.updateWaypoints();
      });

      google.maps.event.addListener(path_inp, 'insert_at', () => {
        this.updateWaypoints();
      });
      
    }
  
    updateWaypoints() {
      for(let i=0; i<this.waypoints.length; i++){
        this.waypoints[i].setMap(null);
      }
      this.waypoints = [];
      var path = this.region.getPath();
      var minLat = Infinity, minLon = Infinity;
      var maxLat = -Infinity, maxLon = -Infinity;
      var coords = path.getArray();
      for (let i = 0; i < coords.length; i ++) {
        minLat = (coords[i].lat() < minLat) ? coords[i].lat() : minLat;
        maxLat = (coords[i].lat() > maxLat) ? coords[i].lat() : maxLat;
        minLon = (coords[i].lng() < minLon) ? coords[i].lng() : minLon;
        maxLon = (coords[i].lng() > maxLon) ? coords[i].lng() : maxLon;
      }
      let lat_density = this.density / 110.574;
      let lng_density = this.density / 111.320;
      for (let lat = minLat; lat <= maxLat; lat += lat_density) {
        for (let lon = minLon; lon <= maxLon; lon += lng_density / Math.cos(lat * Math.PI/180.0)) {
          var point = new google.maps.LatLng({lat: lat, lng: lon});
          if (google.maps.geometry.poly.containsLocation(point, this.region)) {
            this.addWaypoint(point);
          }
        }
      }
    }

    addWaypoint(pos:google.maps.LatLng) {
      var marker = new google.maps.Marker({ map: this.map, icon: { path: google.maps.SymbolPath.CIRCLE, scale: 1}, position: pos, draggable: true });
      this.waypoints.push(marker);
      google.maps.event.addListenerOnce(marker,'click', () => {
        marker.setMap(null);
        const index = this.waypoints.indexOf(marker);
        if (index > -1) {
          this.waypoints.splice(index, 1);
        }
      });
    }
  
    delete() {
      for (let i = 0; i < this.waypoints.length; i++) {
        this.waypoints[i].setMap(null);
      }
      this.region.setMap(null);
    }

    changeDensity(density: number) {
      this.density = density;
      this.updateWaypoints();
    }

    getWaypoints() {
      let coords = [];
      for (let w = 0; w < this.waypoints.length; w++) {
        coords.push(this.waypoints[w].getPosition())
      }
      return coords;
    }
  }