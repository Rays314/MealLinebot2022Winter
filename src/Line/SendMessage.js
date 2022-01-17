//id : userid,groupid,roomid
//msg: JSON格式
//LineBot傳送推播訊息 注意:有一定額度 每月超過500則會收費
function SendPushMessage(id, msg) {
  let line = new LineApp(CHANNEL_ACCESS_TOKEN);
  line.add(msg);
  
  line.sendLinePush(id);
  if (!FETCH_OPTIONS.TO_SEND_LINE_PUSH_MESSAGE)
    log("FETCH_OPTIONS.TO_SEND_LINE_PUSH_MESSAGE is disabled but a message is sent.");
}

//使用LineNotify傳送文字
function SendLineNotify(token, text) {
  if (!FETCH_OPTIONS.TO_SEND_LINE_NOTIFY)
    log("FETCH_OPTIONS.TO_SEND_LINE_NOTIFY is disabled but a message is sent.");

  if (typeof token === 'undefined' || token == "")
    return { status: 999, message: "Token is Null" };

  let sending_url = 'https://notify-api.line.me/api/notify';
  log("[sendLineNotify]" + token + ":" + text);
  let params = {
    'headers': { 'Authorization': 'Bearer ' + token },
    'method': 'post',
    'muteHttpExceptions': true,
    'payload':
    {
      'message': text,
      //也可傳送貼圖
      //'stickerPackageId':sticker[stickno][0].toString(),
      //'stickerId':sticker[stickno][1].toString(),
    }
  };
  let response = tryToFetch(sending_url, params);
  if (response !== undefined)
    return JSON.parse(response.getContentText());
}

// Not used
//使用LineNotify傳送圖片
function SendLineNotifyImage(token, img, text) {
  if(!FETCH_OPTIONS.TO_SEND_LINE_NOTIFY_IMAGE)
    log("FETCH_OPTIONS.TO_SEND_LINE_NOTIFY_IMAGE is disabled but a message is sent.");

  let sending_url = 'https://notify-api.line.me/api/notify';
  log("[sendLineNotify]" + token + ":" + text);

  let boundary = "labnol";

  // let attributes = "{\"name\":\"abc.pdf\", \"parent\":{\"id\":\"FOLDER_ID\"}}";

  let requestBody = Utilities.newBlob(
    "--" + boundary + "\r\n"
    + "Content-Disposition: form-data; name=\"message\"\r\n\r\n"
    + text + "\r\n" + "--" + boundary + "\r\n"
    + "Content-Disposition: form-data; name=\"imageFile\"; filename=\"" + img.getName() + "\"\r\n"
    + "Content-Type: " + img.getContentType() + "\r\n\r\n").getBytes()
    .concat(img.getBytes())
    .concat(Utilities.newBlob("\r\n--" + boundary + "--\r\n").getBytes());

  let options = {
    "method": "post",
    "contentType": "multipart/form-data; boundary=" + boundary,
    "payload": requestBody,
    "muteHttpExceptions": true,
    "headers": { 'Authorization': 'Bearer ' + token }
  };

  return tryToFetch(sending_url, options)
}