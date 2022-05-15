/* imperative programming */

const GeoJSONIm = (() => { // namespace to avoid name conflicts and only export public functions

  function fromSheetIntoDrive() {
    const sheet = SpreadsheetApp.getActiveSheet();
    const geojson = fromSheet(sheet);

    const fileName = sheet.getName() + '.geojson';
    DriveApp.createFile(fileName, JSON.stringify(geojson), MimeType.JAVASCRIPT);
  }

  function fromSheet(sheet) {
    const dataRange = sheet.getDataRange().getDisplayValues(); // dataRange[ROW][COLUMN]
    return fromDataRange(
      dataRange, 
      getColumnLabelIndex(dataRange)
    );
  }

  function getColumnLabelIndex(dataRange) {
    const indexListInt = [];
    const indexListStr = [];
    let x, y;

    for (let i = 0; i < dataRange[0].length; i++) { // geoJSONデータの対象列か判定
      switch (dataRange[0][i]) {
    // case 'HID':     　　　Currently not used in the map app
        case 'Full':
        case '設立年月':
          indexListInt.push(i)
        break;

        case 'Type':
    // case 'Kodomo':       Currently not used in the map app
        case 'Name':
    // case 'Label':        Currently not used in the map app. Previously used for the labels of the facility icon at some zoom level
        case 'AgeS':
        case 'AgeE':
        case 'Open':
        case 'Close':
        case 'H24':
        case 'Memo':
        case 'Extra':
        case 'プレ幼稚園':
        case '園バス':
        case '給食':
        case 'Temp':
        case 'Holiday':
        case 'Night':
        case 'Add1':
        case 'Add2':
        case 'TEL':
        case 'FAX':
    // case 'Owner':         Currently not used in the map app
    // case 'Ownership':     Currently not used in the map app
        case '児童発達支援':
        case '重心（児童発達）':
        case '放課後デイ':
        case '重心（放課後デイ）':
        case 'url':
          indexListStr.push(i)
        break;

        case 'X':
          x = i;
        break;
        case 'Y':
          y = i;
        break;
      }
    }

    return {indexListInt, indexListStr, x, y};
  }

  function fromDataRange(dataRange, columnLabelIndex) {
    const features = [];

    for (let i = 1; i < dataRange.length; i++) {
      let prop = {};

      columnLabelIndex.indexListInt.forEach((j) => {
        prop[dataRange[0][j]] = parseInt(0 + dataRange[i][j]); // 0 + はnull対策
      });

      columnLabelIndex.indexListStr.forEach((j) => {
        prop[dataRange[0][j]] = dataRange[i][j];
      });

      features.push({
        properties: prop,
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [
            parseFloat(dataRange[i][columnLabelIndex.x]),
            parseFloat(dataRange[i][columnLabelIndex.y])
          ]
        }
      })
    }

    return {
      type: 'FeatureCollection',
      crs: {
        type: "name",
        properties: {
          name: "urn:ogc:def:crs:OGC:1.3:CRS84"
        }
      },
      features: features
    };
  }

  return { // export public functions
    fromSheetIntoDrive
  };
})();
