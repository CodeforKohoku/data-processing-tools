function onOpen() { // ビルトイン関数：スプレッドシートの読み込み時に実行される

  const menu=[ // メニューリスト
    // {name: "To GeoJSON", functionName: "GeoJSONIm.fromSheetIntoDrive"},
    {name: "To GeoJSON", functionName: "GeoJSONFn.fromSheetIntoDrive"},
    {name: "Validate Data", functionName: "SheetValidation.onDataValue"},
    {name: "Validate URL", functionName: "SheetValidation.onFacilityURL"},
    {name: "Diff Lists", functionName: "MatchUp.onFacilityLists"} 
  ];

  SpreadsheetApp.getActiveSpreadsheet().addMenu("Script", menu);
}
