/* functional like programming */

const GeoJSONFn = (() => { // namespace to avoid name conflicts and only export public functions
  const X_LABEL = 'X';
  const Y_LABEL = 'Y';

  const COLUMN_NUM_LABEL_LIST = [
  //'HID',     　　　Currently not used in the map app
    'Full',
    '設立年月'
  ];

  const COLUMN_STR_LABEL_LIST = [
    'Type',
  //'Kodomo',       Currently not used in the map app
    'Name',
  //'Label',        Currently not used in the map app. Previously used for the labels of the facility icon at some zoom level
    'AgeS',
    'AgeE',
    'Open',
    'Close',
    'H24',
    'Memo',
    'Extra',
    'プレ幼稚園',
    '園バス',
    '給食',
    'Temp',
    'Holiday',
    'Night',
    'Add1',
    'Add2',
    'TEL',
    'FAX',
  //'Owner',         Currently not used in the map app
  //'Ownership',     Currently not used in the map app
    '児童発達支援',
    '重心（児童発達）',
    '放課後デイ',
    '重心（放課後デイ）',
    'url',
  ];

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
    const findLabelIndex = lbl => dataRange[0].findIndex(val => val === lbl);
    const makeLabelIndexPairList = lbl => [lbl, findLabelIndex(lbl)];
    return {
      pairInt: COLUMN_NUM_LABEL_LIST.map(makeLabelIndexPairList),
      pairStr: COLUMN_STR_LABEL_LIST.map(makeLabelIndexPairList),
      x: findLabelIndex(X_LABEL),
      y: findLabelIndex(Y_LABEL)
    };
  }

  function fromDataRange(dataRange, columnLabelIndex) {
    return {
      type: 'FeatureCollection',
      crs: {
        type: "name",
        properties: {
          name: "urn:ogc:def:crs:OGC:1.3:CRS84"
        }
      },
      features: makeFeatureList(dataRange, columnLabelIndex)
    };
  }

  function makeFeatureList(dataRange, columnLabelIndex) {
    return dataRange.slice(1).map(cols => {
      return {
        properties: makePropObject(cols, columnLabelIndex),
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [
            parseFloat(cols[columnLabelIndex.x]),
            parseFloat(cols[columnLabelIndex.y])
          ]
        }
      };
    });
  }

  function makePropObject(cols, columnLabelIndex) {
    const reduceFn = (fn) => (obj, [lbl, idx]) => Object.assign(obj, {[lbl]: fn(idx)});
    const intFn = idx => parseInt(0 + cols[idx]);  // 0 + はnull対策

    return Object.assign(
      columnLabelIndex.pairInt.reduce(reduceFn(intFn), {}),
      columnLabelIndex.pairStr.reduce(reduceFn(idx => cols[idx]), {})
    );
  };

  // function makePropObject(cols, columnLabelIndex) {
  //   const mapIntFn = ([lbl, idx]) => Object({[lbl]: parseInt(0 + cols[idx])}); // 0 + はnull対策
  //   const mapStrFn = ([lbl, idx]) => Object({[lbl]: cols[idx]});
  //   const reduceFn = (a, b) => Object.assign(a, b);

  //   return Object.assign(
  //     columnLabelIndex.pairInt.map(mapIntFn).reduce(reduceFn),
  //     columnLabelIndex.pairStr.map(mapStrFn).reduce(reduceFn)
  //   );
  // };

  return { // export public functions
    fromSheetIntoDrive
  };
})();
