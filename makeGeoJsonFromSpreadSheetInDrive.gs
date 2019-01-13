function onOpen(){
 
  //メニュー配列
  var menu=[
//    {name: "Test menu", functionName: "testFunc"},
    {name: "To GeoJSON", functionName: "makeGeoJsonFromSpreadSheetInDrive"}
  ];
 
  // スプレッドシートにメニューを追加
  SpreadsheetApp.getActiveSpreadsheet().addMenu("Script",menu);
 
}
    
function testFunc(){
  Browser.msgBox("テスト");
}

function makeGeoJsonFromSpreadSheetInDrive() {
  
  var sheet = SpreadsheetApp.getActiveSheet();
  var dataRange = sheet.getDataRange().getDisplayValues();
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
          validateCordination(dataRange[i][xCol], "X列"+(i+1)+"行目"),
          validateCordination(dataRange[i][yCol], "Y列"+(i+1)+"行目")
        ]
      }
    })
  }

  data.features = features;
  var test = JSON.stringify(data);
  
  DriveApp.createFile(fileName, JSON.stringify(data), MimeType.JAVASCRIPT);
  
}

// 座標データの浮動小数点の検証パターン
var pattern = /^\d+.\d{5}$/
        
function validateCordination(cord, adress){

  // より直感的な記述
  // if (!isFinite(cord) || String.prototype.slice.call(cord, -6, -5) !== ".") {        
  if (!(String.prototype.match.call(cord, pattern))) {
    exitWithError(adress + ": 数値またはフォーマットが正しくありません。");
  }
  return parseFloat(cord)

  // cordを数値型で渡された場合、但し小数点末尾の桁が0だと桁数が現象してしまう。
  // var e = 1, p = 0;
  // while (Math.round(cord * e) / e !== cord) { e *= 10; p++; }
  // var digit = 5
  // return (p === digit) ? cord : exitWithError(adress + ": 小数点以下が" + digit +"桁になっているか確認ください。");
}

function exitWithError(msg){
  Browser.msgBox(msg);
  throw new Error(msg);
}

