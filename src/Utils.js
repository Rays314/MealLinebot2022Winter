var fetchRequests = [];

function getNowStr() {
  return new Date().Format("yyyy/MM/dd hh:mm:ss");
}

Date.prototype.Format = function (fmt) { //author: meizz 
  let o = {
    "M+": this.getMonth() + 1, //月份 
    "d+": this.getDate(), //日 
    "h+": this.getHours(), //小時 
    "m+": this.getMinutes(), //分 
    "s+": this.getSeconds(), //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (let k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

function findIdInSheet(id, sheetName, range) {
  let sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
  if (sheet === null)
    return { dataRow: undefined, position: undefined };

  let rows = sheet.getRange(range).getValues();

  let dataRow, position = 0;
  for (; position < rows.length; position++) {
    let row = rows[position];
    if (row[0] == "") // End of list
      break;
    if (row[0] == id) { // Found
      dataRow = row;
      break;
    }
  }

  return { "dataRow": dataRow, "position": position + 2 };
}

function tryToFetch(url, params) {
  if (!FETCH_OPTIONS.TO_FETCH) {
    log({ "msg": "FETCH_OPTIONS.TO_FETCH is disabled.", url, params, });
    return;
  }
  logFetch(url, params);
  try {
    let response = UrlFetchApp.fetch(url, params);
    return response;
  }
  catch (ex) {
    log({ ...ex, "msg": "Error in tryToFetch(e)", url, params, });
    return;
  }
}

function addFetchRequest(url, params) {
  fetchRequests.push({ url, ...params });
  logFetch(url, params);
}

function fetchAll() {
  try {
    let response = UrlFetchApp.fetchAll(fetchRequests);
    return response;
  }
  catch (ex) {
    log({ "msg": "Error in fetchAll", fetchRequests, ...ex });
  }
}