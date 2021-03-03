/**
 * @tutorial https://leafletjs.com/reference-1.7.1.html#polyline-option
 * @summary - initialize MapQuest Key
 */
L.mapquest.key = getMapquestKey;

/**
 * @constant {Object} map
 * @summary - Define MapQuest map object with a center, layer, and zoom. 'map' refers to a <div> element with the ID map.
 */
const map = L.mapquest.map('map', {
  center: [40.76, -73.85],
  layers: L.mapquest.tileLayer('map'),
  zoom: 12
});

/**
 * @constant {Object} stationMarker
 * @summary - marker to indicate local or express stations
 */
const stationMarker = L.icon({
  iconUrl: 'images/marker.png',
  iconSize: L.point(8, 8)
});

/**
 * @constant {Object} lineColors 
 * @summary - provides independent color indicators to each subway line
 */
const lineColors = {
  'A': '#0039A6', 'C': '#0039A6', 'E': '#0039A6',
  'B': '#FF6319', 'D': '#FF6319', 'F': '#FF6319', 'M': '#FF6319',
  'G': '#6CBE45',
  'J': '#996633', 'Z': '#996633',
  'L': '#A7A9AC',
  'N': '#FCCC0A', 'Q': '#FCCC0A', 'R': '#FCCC0A',
  'S': '#808183',
  '1': '#EE352E', '2': '#EE352E', '3': '#EE352E',
  '4': '#00933C', '5': '#00933C', '6': '#00933C',
  '7': '#B933AD',
  'SIR': '#0039A6'
}

loadHoods();
loadStops();
// loadLines();

/**
 * @function loadHoods
 * @description - when invoked loadHoods() get hood coordinates and maps the polygons to the map
 * @constant {Object} coords 
 * @summary - responsible for getting the coordinates of the hoods and parsing through the Json
 * @constant {Object} area 
 * @summary - responsible for constructing the paint properties and paiting them to the map. In addition to binding tooltip AKA name of the hood to the area. 
 */
function loadHoods() {
  getHoods.forEach(hood => {
    const coords = JSON.parse(
      hood.the_geom.slice('MULTIPOLYGON '.length)
        .replace(/-\d{2}\.\d+ \d{2}\.\d+/g, (reg)=>`[${reg.split(' ')[1]}, ${reg.split(' ')[0]}]`)
        .replace(/\(/g, '[')
        .replace(/\)/g, ']')
    );

    const area = L.polygon(coords, {
      color: '#555555',
      weight: 1,
      fill: true,
      fillColor: '#555555',
      fillOpacity: 0.2
    }).addTo(map);
    area.bindTooltip(hood.NTAName);
  });
}

/**
 * @function loadStops
 * @description when invoked loadStops() loads stations from server http get requst and iterates through each station. If station doesnt exist we return out of the function otherwise grab the latitude and longtitude coordinates and paint the map accordingly. 
 */
function loadStops() {
  getStations.forEach(station => {
    if (!station['Stop Name']) {
      return;
    }
    L.marker([station['GTFS Latitude'], station['GTFS Longitude']], {
      icon: stationMarker,
      title: `${station['Stop Name']} (${station['Daytime Routes']})`,
      riseOnHover: true,
    }).addTo(map);
  });
}

// function loadLines() {
//   getSubwayLines.forEach(line => {
//     const path = JSON.parse(
//       line.the_geom.slice('LINESTRING '.length)
//         .replace(/-\d{2}\.\d+ \d{2}\.\d+/g, (reg)=>`[${reg.split(' ')[1]}, ${reg.split(' ')[0]}]`)
//         .replace(/\(/g, '[')
//         .replace(/\)/g, ']')
//     );
//     L.polyline(path, {
//       color: lineColors[line.RT_SYMBOL],
//       smoothFactor: 1.0,
//       weight: 4,
//     }).addTo(map);
//   });
// }
