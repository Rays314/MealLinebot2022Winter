var exeLogs = [];

var fetchLogs = [];

function logImmediately(str) {
  let ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName("Exe log");
  if (sheet === null) {
    sheet = ss.insertSheet("Exe log");
    sheet.getRange("A1:B1").setBackground("#6aa84f").setFontColor("white")
      .setHorizontalAlignment("center").setValues([["Time", "Message"]]);
  }

  try {
    sheet.appendRow([getNowStr(), JSON.stringify(str)]);
  }
  catch (ex) {
    console.log({ ...ex, "msg": "Error in logImmediately(str)", str });
    sheet.deleteRows(2, sheet.getMaxRows() - 1);
  }
}

function log(str) {
  exeLogs.push([getNowStr(), JSON.stringify(str)]);
}

function finishLogging() {
  if (exeLogs.length === 0)
    return;

  let ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName("Exe log");
  if (sheet === null) {
    logImmediately("Sheet created.");
    sheet = ss.getSheetByName("Exe log");
  }

  try {
    let range = sheet.getRange(sheet.getLastRow() + 1, 1, exeLogs.length, 2);
    range.setValues(exeLogs);
  }
  catch (ex) {
    console.log({ ...ex, "msg": "Error in batchLog()", logs: exeLogs });
    sheet.deleteRows(2, sheet.getMaxRows() - 1);
  }
}

function logFetch(url, params) {
  fetchLogs.push([getNowStr(), JSON.stringify(url), JSON.stringify(params)]);
}

function finishLoggingFetch() {
  if (fetchLogs.length == 0)
    return;

  let ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName("Fetch log");
  if (sheet === null) {
    sheet = ss.insertSheet("Fetch log");
    sheet.getRange("A1:C1").setBackground("#3d85c6").setFontColor("white")
      .setHorizontalAlignment("center").setValues([["Time", "url", "params"]]);
  }

  try {
    sheet.getRange(sheet.getLastRow() + 1, 1, fetchLogs.length, 3)
      .setValues(fetchLogs);
  }
  catch (ex) {
    log({ ...ex, "msg": "Error in finishLoggingFetch()", fetchLogs });
    sheet.deleteRows(2, sheet.getMaxRows() - 1);
  }
}