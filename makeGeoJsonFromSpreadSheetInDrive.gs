function makeGeoJsonFromSpreadSheetInDrive() {
  
  var sheet = SpreadsheetApp.getActiveSheet();
  var dataRange = sheet.getDataRange().getValues();
  var endCol =dataRange[0].length;
  
  var fileName = sheet.getName() + '.geojson';
  var data = {
    type: 'FeatureCollection',
    crs: {
      type: "name",
      properties: {
        name: "urn:ogc:def:crs:OGC:1.3:CRS84"
      }
    }}
  
  var targetCol = [];
  var xCol, yCol;
  // geoJsonのキーの対象列か判定
  for(var i = 0; i < endCol; i++) {
    switch (dataRange[0][i]) {
      case 'HID':
      case 'Type':
      case 'Kodomo':
      case 'Name':
      case 'Label':
      case 'AgeS':
      case 'AgeE':
      case 'Full':
      case 'Open':
      case 'Close':
      case 'H24':
      case 'Memo':
      case 'Extra':
      case 'Extra_type':
      case '設立年度':
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
      case 'Owner':
      case 'Ownership':
      case 'Proof':
      case 'Shanai':
      case '児童発達支援':
      case '重心（児童発達）':
      case '放課後デイ':
      case '重心（放課後デイ）':
      case 'url':
      case 'Vacancy':
      case 'VacancyDate':
        targetCol.push(i)
      break;
      case 'Y':
        yCol = i;
      break;
      case 'X':
        xCol = i;
      break;
    }
  }
  
  var features = [];
  for(var i = 0; i<dataRange.length;i++){
    var prop = {};
    targetCol.forEach(function(j) {
      prop[dataRange[0][j]] = dataRange[i][j]
    });
    features.push({
      properties: prop,
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [
          parseFloat(dataRange[i][xCol]),
          parseFloat(dataRange[i][yCol])
        ]
      }
    })
  }

  data.features = features;
  DriveApp.createFile(fileName, JSON.stringify(data), MimeType.JAVASCRIPT);
  
}
