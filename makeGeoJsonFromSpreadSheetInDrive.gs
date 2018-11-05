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
  
  // geoJsonのキーの対象列か判定
  var targetCol = [];
  var xCol, yCol;
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
  
  // 1行ずつデータを作成して配列として取得
  var features = [];
  for(var i = 1; i<dataRange.length;i++){
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

  // JSONを文字列にしてGoogleドライブにファイルを作成
  data.features = features;
  DriveApp.createFile(fileName, JSON.stringify(data), MimeType.JAVASCRIPT);
  
}
