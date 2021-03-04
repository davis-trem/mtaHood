const express = require('express');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();

app.set('port', process.env.PORT || 5000);
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', async (req, res) => {
  let stations = await readCsv('Stations.csv', [
    'Station ID', 'Complex ID', 'GTFS Stop ID' , 'Division', 'Line', 'Stop Name',
    'Borough', 'Daytime Routes', 'Structure', 'GTFS Latitude', 'GTFS Longitude'
  ]);

  let subwayLines = await readCsv('subway_lines.csv', [
    'the_geom', 'OBJECTID', 'ID', 'RT_SYMBOL', 'NAME', 'URL', 'SHAPE_LEN'
  ]);

  let hoods = await readCsv('nynta.csv', [
    'the_geom', 'BoroName', 'BoroCode', 'CountyFIPS', 'NTACode', 'NTAName', 'Shape_Leng', 'Shape_Area'
  ]);

  res.render('index', {
    stations: JSON.stringify(stations),
    subwayLines: JSON.stringify(subwayLines),
    hoods: JSON.stringify(hoods),
    mapquestKey: process.env.MAPQUEST_KEY
  });
});

app.listen(app.get('port'), () => {
  console.log(`Server running on ${app.get('port')}...`);
});

function readCsv(filename, headers) {
  return new Promise((resolve, reject) => {
    try {
      const readInterface = readline.createInterface({
        input: fs.createReadStream('csv/' + filename)
      });

      console.log(`started reading ${filename}...`, new Date());

      let list = [];

      readInterface.on('line', line => {
        if (line === headers.join()) {
          return;
        }
        const values = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
        list.push(
          headers.reduce(
            (map, key, i) => ({ ...map, [key]: values[i] }),
            {}
          )
        );
      });

      readInterface.on('close', () => {
        console.log(`closed ${filename}...`, new Date());
        resolve(list);
      });
    } catch (err) {
      reject(err);
    }
  });
}
