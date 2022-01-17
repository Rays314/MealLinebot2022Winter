//與Line服務的連動

//連動LineNotify
function getRegisterLinenotifyUrl(groupId) {
  return 'https://notify-bot.line.me/oauth/authorize?response_type=code&client_id=' + LINENOTIFY.CLIENTID + '&redirect_uri=' + ScriptApp.getService().getUrl() + '&scope=notify&state=linenotify_' + groupId;
}

function handleCallbackLinenotify(code) {
  let url = 'https://notify-bot.line.me/oauth/token'
  let postParams = {
    'method': 'post',
    'payload': {
      'grant_type': 'authorization_code',
      'code': code,
      'redirect_uri': ScriptApp.getService().getUrl(),
      'client_id': LINENOTIFY.CLIENTID,
      'client_secret': LINENOTIFY.CLIENTSECRET
    }
  };
  let response = tryToFetch(url, postParams);
  if (response === undefined)
    return;

  let token = JSON.parse(response.getContentText())['access_token'];

  let sending_url = 'https://notify-api.line.me/api/status';
  let getParams = {
    'headers': { 'Authorization': 'Bearer ' + token },
    'method': 'GET',
  };
  response = tryToFetch(sending_url, getParams);
  if (response === undefined)
    return;

  let groupname = JSON.parse(response.getContentText()).target;
  return { token: token, groupname: groupname };
}

//連動LineLogin
function getLineLoginUrl(groupId, callbackMethod) {
  return 'https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=' + LINELOGIN.CLIENTID + '&redirect_uri=' + ScriptApp.getService().getUrl() + '&scope=openid%20profile&state=linelogin_' + groupId + "_" + callbackMethod;
}

function handleCallbackLineLogin(code) {
  let url = 'https://api.line.me/oauth2/v2.1/token';
  let params = {
    'method': 'post',
    'payload':
    {
      'grant_type': 'authorization_code',
      'code': code,
      'redirect_uri': ScriptApp.getService().getUrl(),
      'client_id': LINELOGIN.CLIENTID,
      'client_secret': LINELOGIN.CLIENTSECRET
    }
  };
  let response = tryToFetch(url, postParams);
  if (response === undefined)
    return;

  let idtoken = JSON.parse(response.getContentText())['id_token'];
  let jwtobj = JSON.parse(
    Utilities
      .newBlob(Utilities.base64Decode(idtoken.split('.')[1]))
      .getDataAsString());
  let userId = jwtobj['sub'];
  let username = jwtobj['name'];
  return { userId: userId, username: username };
}

//LIFF
function getLIFFUrl(title, queryString) {
  let t = encodeURIComponent(title);
  return LIFFURL + "?p=1&title=" + t + "&url=" + ScriptApp.getService().getUrl() + queryString;
}