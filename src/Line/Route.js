function Route(e) {
  let para = e.parameter;
  let method = para.method;

  let groupId = para.groupId;
  let userId = para.userId;
  let userName = para.userName;

  let state = typeof para.state !== 'undefined' ? para.state : "";//LINE 回傳之參數    
  let statekey = state.split('_')[0];
  let resultPage;

  switch (statekey) {
    case "linenotify":
      if (!FETCH_OPTIONS.TO_HANDLE_CALLBACK_LINE_NOTIFY)
        break;
      groupId = state.split('_')[1];
      let groupdata = new GroupData(groupId);
      let notifyResult = handleCallbackLinenotify(para.code);
      groupdata.token = notifyResult.token;
      groupdata.name = notifyResult.groupname;
      if (SAVE_OPTIONS.TO_SAVE_GROUP_DATA)
        groupdata.save();

      if (FETCH_OPTIONS.TO_SEND_LINE_NOTIFY)
        SendLineNotify(groupdata.token, "群組：" + groupdata.name + "連動成功!");

      resultPage = HtmlService
        .createHtmlOutput("群組：" + groupdata.name + "連動成功!");
      break;

    case "linelogin":
      //groupId = para.state.split('_')[1];
      if (!FETCH_OPTIONS.TO_HANDLE_CALLBACK_LINE_LOGIN)
        break;
      let userResult = handleCallbackLineLogin(para.code);
      resultPage = HtmlService.createHtmlOutput("userId：" + userResult.userId + "</br>" + "username:" + userResult.username);
      break;

    default:
      switch (method) {
        case "testliff":
          let userdata = new UserData(userId);
          resultPage = HtmlService.createHtmlOutput("userId：" + userId + "</br>" + "userName:" + userdata.nickname + "</br>" + "groupId:" + groupId);
          break;
      }
      break;
  }
  if (resultPage !== undefined)
    return resultPage
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .setTitle("LIFF")
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}