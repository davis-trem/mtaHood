// map docs - https://leafletjs.com/reference-1.7.1.html#polyline-option
L.mapquest.key = getMapquestKey;

// 'map' refers to a <div> element with the ID map
const map = L.mapquest.map('map', {
  center: [40.76, -73.85],
  layers: L.mapquest.tileLayer('map'),
  zoom: 12
});

const stationMarker = L.icon({
  iconUrl: 'images/marker.png',
  iconSize: L.point(8, 8)
});

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
loadLines();

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

function loadLines() {
  getSubwayLines.forEach(line => {
    const path = JSON.parse(
      line.the_geom.slice('LINESTRING '.length)
        .replace(/-\d{2}\.\d+ \d{2}\.\d+/g, (reg)=>`[${reg.split(' ')[1]}, ${reg.split(' ')[0]}]`)
        .replace(/\(/g, '[')
        .replace(/\)/g, ']')
    );
    L.polyline(path, {
      color: lineColors[line.RT_SYMBOL],
      smoothFactor: 1.0,
      weight: 4,
    }).addTo(map);
  });
}
