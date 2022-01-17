function UserData(id) {
  let { dataRow, position } =
    findIdInSheet(id, SAVE_OPTIONS.USER_DATA_SHEET_NAME, "A2:D");

  this.position = position;

  if (dataRow !== undefined) {
    this.id = id;
    this.nickname = dataRow[1];
    this.photo = dataRow[2];
    this.group = dataRow[3];
  }
  else {
    this.id = id;
    this.nickname = "";
    this.photo = "";
    this.group = "";
    if (SAVE_OPTIONS.TO_SAVE_USER_DATA)
      this.save();
  }
}

UserData.prototype.save = function () {
  let ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName(SAVE_OPTIONS.USER_DATA_SHEET_NAME);
  if (sheet !== null) {
    ss.getRange(this.position, 1, 1, 4)
      .setValues([[this.id, this.nickname, this.photo, this.group]]);
  }
  else {
    sheet = ss.insertSheet(SAVE_OPTIONS.USER_DATA_SHEET_NAME);
    sheet.getRange("A1:D").setHorizontalAlignment("center");
    sheet.getRange("A1:D2").setBackground("#5b0f00").setFontColor("white")
      .setValues([["ID", "LINE顯示名稱", "顯示圖片", "分組ID"]]);
    sheet.getRange("A2:D2")
      .setValues([[this.id, this.nickname, this.photo, this.group]]);
  }
}