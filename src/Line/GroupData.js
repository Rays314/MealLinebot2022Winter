function GroupData(id) {
  let { datarow: dataRow, position } =
    findIdInSheet(id, SAVE_OPTIONS.GROUP_DATA_SHEET_NAME, "A2:C");

  this.position = position;

  if (typeof dataRow != 'undefined') {
    this.id = id;
    this.token = dataRow[1];
    this.name = dataRow[2];
  }
  else {
    this.id = id;
    this.token = "";
    this.name = "";
    if (SAVE_OPTIONS.TO_SAVE_GROUP_DATA)
      this.save();
  }
}

GroupData.prototype.save = function () {
  let ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName(SAVE_OPTIONS.GROUP_DATA_SHEET_NAME);
  if (sheet !== null) {
    ss.getRange(this.position, 1, 1, 3)
      .setValues([[this.id, this.token, this.name]]);
  }
  else {
    sheet = ss.insertSheet(SAVE_OPTIONS.GROUP_DATA_SHEET_NAME);
    sheet.getRange("A1:C").setHorizontalAlignment("center");
    sheet.getRange("A1:C1").setBackground("#5b0f00").setFontColor("white")
      .setValues([["R_G_ID", "LineNotify", "名稱"]]);
    sheet.getRange("A2:C2").setValues([[this.id, this.token, this.name]])
  }
}