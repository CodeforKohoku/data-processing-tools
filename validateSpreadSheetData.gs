function validateDataOnSpreadSheet() {
  validateOverDataRange(colName => {
    if (colName in VALIDATORS) return VALIDATORS[colName];
    throw new ValidFuncNotFound;
  });
}

function validateFacilityURL() {
  validateOverDataRange(colName => {
    if (colName === "url") return validateFetchURL;
    throw new ValidFuncNotFound;
  });
}

function validateOverDataRange(getValidator) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const dataRange = sheet.getDataRange().getDisplayValues(); // ataRange[ROW][COLUMN]

  const res = validateData(dataRange, getValidator, new ResultArray);
  Browser.msgBox(res);
}

function validateData(dataRange, getValidator, res) {
　try {
    dataRange[0].forEach(
      validateRow(dataRange, getValidator, res)
    );
  }
  catch (e) {
    outerError(e, res);
  }
  return res;
}

function validateRow(dataRange, getValidator, res) {
  return (colName, j) => {
    try {
      const func = getValidator(colName);

      dataRange.slice(1).forEach((cols, i) => {
        res.push(colName, i, func(cols[j], i));
      });
    }
    catch (e) {
      innerError(e)
    }
  }
}

/* Errors */
const NUMBER_OF_VALID_LIMIT = 20;  // データチェックのエラー数上限のハンドリング

class ValidExitOuterFlow extends Error {}
class ValidFuncNotFound extends Error {}
class ValidExceededError extends Error {}

function innerError(e) {
  if (!(e instanceof ValidFuncNotFound)) throw e;
}

function outerError(e, res) {
  if (e instanceof ValidExitOuterFlow) return;
  if (e instanceof ValidExceededError) {
    res.superPush('エラー上限数' + NUMBER_OF_VALID_LIMIT + 'に達しました。');
  }
  else {
    res.superPush('予期せぬエラーが発生しました。');
    res.superPush(e.name + ': ' + e.message);
  }
}

/* Result Handling */
class ResultArray extends Array {
  push(colName, idx, msg) {
    if (msg) {
      super.push(`${colName} ${idx + 2}行目: ${msg}`)
      if (this.length > NUMBER_OF_VALID_LIMIT) throw new ValidExceededError;
    }
    // do nothing
  }

  superPush(msg) {
    super.push(msg);
  }

  toString() {
    return this.join('\\n') || "全てのチェックに合格しました！";
  }
}


/* Validators */

function validateHID(str, idx) { // dataRange.slice(1)と0始まりのため、idxは行番号 - 2
  if (str != ++idx) { // == により暗黙の型変換がされる
    return "行番号から1引いた数値であると判定されませんでした。";
  }
}

function validateMinimumStrSize(str) {
  if (str.length < minimumSize) {
    return "最小文字数より少ないと判定されませんでした。";
  }
}
const minimumSize = 3;

function validateYesNoBlank(str) {
  if (!str.match(patYesNoBlank)) {
    return "YかNか空欄と判定されませんでした。";
  }
}
const patYesNoBlank = /^(|Y|N)$/;

function validateYYYYMM(str) {
  if (!str.match(patYYYYMM)) {
    return "1990～2020年代の有効なYYYYMM(MMは不明な場合の00を含む)と判定されませんでした。";
  }
}
const patYYYYMM = /^(|(199|20[0-2])\d(0\d|1[0-2]))$/;  // MMが00は月が不明な場合

function validateMeal(str) {
  if (!str.match(patMeal)) {
    return "YかNか空欄か有効な範囲の週〇日あるいは週〇～〇日と判定されませんでした。";
  }
}
const patMeal = /^(|Y|N|週([1-7]|[1-6]～[2-7])日)$/;

function validateJyushin(str) {
  if (!str.match(patJyushin)) {
    return "空欄、重心、一部重心、休止中のいずれかと判定されませんでした。";
  }
}
const patJyushin = /^(|重心|一部重心|休止中)$/;

function validateURL(str) {
  if (!str.match(patURL)) {
    return "空欄かhttpあるいはhttps://から始まる文字列と判定されませんでした。";
  }
}
const patURL = /^(|http(|s):\/\/.+)$/;

function validateCordX(str) {
  if (!str.match(patCordX)) {
    return "経度139度の小数点以下5桁の数値と判定されませんでした。";
  }
}
const patCordX = /^139\.\d{5}$/; // 座標データの浮動小数点の検証パターン

function validateCordY(str) {
  if (!str.match(patCordY)) {
    return "緯度35度の小数点以下5桁の数値と判定されませんでした。";
  }
}
const patCordY = /^35\.\d{5}$/; // 座標データの浮動小数点の検証パターン

const VALIDATORS = {
  "HID": validateHID,
  "Name": validateMinimumStrSize,
  "H24": validateYesNoBlank,
  "Extra": validateYesNoBlank,
  "Temp": validateYesNoBlank,
  "Holiday": validateYesNoBlank,
  "Night": validateYesNoBlank,
  "設立年月": validateYYYYMM,
  "プレ幼稚園": validateYesNoBlank,
  "園バス": validateYesNoBlank,
  "給食": validateMeal,
  "児童発達支援": validateYesNoBlank,
  "重心（児童発達）": validateJyushin,
  "放課後デイ": validateYesNoBlank,
  "重心（放課後デイ）": validateJyushin,
  "url": validateURL,
  "X": validateCordX,
  "Y": validateCordY
};

function validateFetchURL(str) {  // VALIDATORSオブジェクトには含まれない
  if (!str) return;

  const msg = validateURL(str);
  if (msg) return msg;
  
  try {
    const rsp = UrlFetchApp.fetch(str, urlParams);
    const code = rsp.getResponseCode();
    if (code !== 200 && code !== 206) return "予期せぬステータスコード：" + code;
  }
  catch (e) {
    return e.message;
  }
}
const urlParams = {
  method: 'get', // head is not available
  headers: {
    Range: "bytes=0-0" // returns 206 Partial Content
  },
  muteHttpExceptions: true // trueでステータスコード(404など)による例外発生を停止
};
