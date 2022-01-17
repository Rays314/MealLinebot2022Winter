/**
 * The constructor of the Line app
 * @param {!string} accessToken Channel access token of a Linebot
 */
function LineApp(accessToken) {
  this.Token = accessToken;
  this.Msg = [];
  this.Data = {};
  this.TextRules = [];
  initializeTextRules.call(this);
}

LineApp.prototype.react = function (event) {
  const type = event.type;

  // 取出 replayToken 和發送的訊息文字
  const replyToken = event.replyToken;
  const sourceType = (event.source !== undefined) ? event.source.type : undefined;
  const userId = (sourceType !== undefined &&
    (sourceType == 'group' || sourceType == 'user' || sourceType == 'room'))
    ? event.source.userId : '';
  const groupId = (sourceType !== undefined && sourceType == 'group') ? event.source.groupId : '';
  const timestamp = event.timestamp;
  const roomId = (sourceType !== undefined && sourceType == 'room') ? event.source.roomId : '';

  this.Data = {
    type, replyToken, sourceType, userId, roomId, groupId, timestamp,
    'Id': (groupId != '') ? groupId : (roomId != '') ? roomId : userId,
  };

  if (groupId != "")
    this.Data.groupdata = new GroupData(groupId);

  if (roomId != "")
    this.Data.groupdata = new GroupData(groupId);

  if (type == "join" && typeof this.onjoin !== 'undefined')
    this.onjoin();

  if (type == "leave" && typeof this.onleave !== 'undefined')
    this.onleave();

  if (type == "memberJoined" && typeof this.onmemberJoined !== 'undefined') {
    this.Data.members = event.joined.members;
    this.onmemberJoined();
  }

  if (type == "memberLeft" && typeof this.onmemberLeft !== 'undefined') {
    this.Data.members = event.left.members;
    this.onmemberLeft();
  }

  if (type == "follow" && typeof this.onfollow !== 'undefined') {
    if (FETCH_OPTIONS.TO_GET_USER_PROFILE)
      this.Data.User = this.getUserProfile(userId);

    this.onfollow();
  }

  if (type == "unfollow" && typeof this.unfollow !== 'undefined') {
    if (FETCH_OPTIONS.TO_GET_USER_PROFILE)
      this.Data.User = this.getUserProfile(userId);

    this.onunfollow();
  }

  if (type == "postback") {
    let userdata = new UserData(userId);
    let prop;

    if (FETCH_OPTIONS.TO_GET_USER_PROFILE)
      prop = this.getUserProfile(userId);

    if (prop === undefined && FETCH_OPTIONS.TO_GET_GROUP_MEMBER_PROFILE)
      prop = this.getGroupMemberProfile(groupId, userId);

    if (prop === undefined && FETCH_OPTIONS.TO_GET_ROOM_MEMBER_PROFILE)
      prop = this.getRoomMemberProfile(roomId, userId)

    if (prop !== undefined) {
      userdata.nickname = prop.displayName;
      userdata.photo = prop.imageurl;
      if (SAVE_OPTIONS.TO_SAVE_USER_DATA)
        userdata.save();
    }

    this.Data.User = prop;
    this.Data.userdata = userdata;

    this.Data.postback = event.postback.data;
    if (typeof this.onpostback !== 'undefined')
      this.onpostback(this);
  }
  
  if (type == "message") {
    const message = event.message;
    this.Data.messageId = message.id;
    this.Data.messageType = message.type;
    if (userId == "") {
      let text = "找不到LINEID，請更新到最新版本，或註冊綁定email。";
      this.add(LineText(text));
      log(text);
      if (typeof this.onerror !== 'undefined')
        this.onerror(this);

      return;
    }

    let userdata = new UserData(userId);
    let prop;
    if (userdata.nickname == "") { // not recorded user
      if (FETCH_OPTIONS.TO_GET_USER_PROFILE)
        prop = this.getUserProfile(userId);

      if (prop === undefined && FETCH_OPTIONS.TO_GET_GROUP_MEMBER_PROFILE)
        prop = this.getGroupMemberProfile(groupId, userId);

      if (prop === undefined && FETCH_OPTIONS.TO_GET_ROOM_MEMBER_PROFILE)
        prop = this.getRoomMemberProfile(roomId, userId)

      if (prop !== undefined) {
        userdata.nickname = prop.displayName;
        userdata.photo = prop.imageurl;
        if (SAVE_OPTIONS.TO_SAVE_USER_DATA)
          userdata.save();
        this.Data.User = prop;
      }
    }
    this.Data.userdata = userdata;

    if (typeof this.onmessage !== 'undefined')
      this.onmessage(this);

    if (this.Data.messageType == "file") {
      if (FETCH_OPTIONS.TO_GET_FILE_CONTENT) {
        this.Data.Content = this.getFileContent(this.Data.messageId).getBlob();
        this.Data.fileName = message.fileName;
      }
      if (typeof this.onfile !== 'undefined')
        this.onfile(this);
    }

    if (this.Data.messageType == "location") {
      this.Data.title = message.title;
      this.Data.address = message.address;
      this.Data.latitude = message.latitude;
      this.Data.longitude = message.longitude;
      if (typeof this.onlocation !== 'undefined')
        this.onlocation(this);
    }

    if (this.Data.messageType == "text") {
      this.Data.userMessage = message.text;
      if (typeof this.ontext !== 'undefined')
        this.ontext(this);
    }

    if (this.Data.messageType == "sticker") {
      this.Data.packageId = message.packageId;
      this.Data.stickerId = message.stickerId;
      if (typeof this.onsticker !== 'undefined')
        this.onsticker(this);
    }

    if (this.Data.messageType == "image") {
      this.Data.Content = this.getFileContent(this.Data.messageId).getBlob();
      if (typeof this.onimage !== 'undefined')
        this.onimage(this);
    }

    if (this.Data.messageType == "video") {
      this.Data.Content = this.getFileContent(this.Data.messageId).getBlob();
      if (typeof this.onvideo !== 'undefined')
        this.onvideo(this);
    }

    if (this.Data.messageType == "audio") {
      this.Data.Content = this.getFileContent(this.Data.messageId).getBlob();
      if (typeof this.onaudio !== 'undefined')
        this.onaudio(this);
    }
  }
  if (typeof this.onfinal !== 'undefined')
    this.onfinal();

}

LineApp.prototype.add = function (msg) {
  this.Msg.push(msg);
  return this;
}

LineApp.prototype.getUserProfile = function (userid) {
  let url = 'https://api.line.me/v2/bot/profile/' + userid + '/';
  let params = {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + this.Token,
    },
    'method': 'get',
  };
  let response = tryToFetch(url, params);
  if (response === undefined)
    return;

  let userprop = JSON.parse(response);
  let imageurl = "";
  if (typeof userprop.pictureUrl !== 'undefined') {
    imageurl = "https://profile.line-scdn.net/" +
      userprop.pictureUrl.split('/')[userprop.pictureUrl.split('/').length - 1];
  }

  let statusMessage = (typeof userprop.statusMessage === 'undefined') ?
    "" : userprop.statusMessage;

  return {
    "userId": userid, "displayName": userprop.displayName,
    "imageurl": imageurl, "statusMessage": statusMessage
  };
}

LineApp.prototype.getGroupMemberProfile = function (groupid, userid) {
  let url = 'https://api.line.me/v2/bot/group/' + groupid + '/member/' + userid + '/';
  let params = {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + this.Token,
    },
    'method': 'get',
  };
  let response = tryToFetch(url, params);
  if (response === undefined)
    return;

  let userprop = JSON.parse(response);
  let imageurl = "";
  if (typeof userprop.pictureUrl !== 'undefined')
    imageurl = "https://profile.line-scdn.net/" + userprop.pictureUrl.split('/')[userprop.pictureUrl.split('/').length - 1];
  let statusMessage = (typeof userprop.statusMessage === 'undefined') ? "" : userprop.statusMessage;
  return { userId: userid, displayName: userprop.displayName, imageurl: imageurl, statusMessage: statusMessage };
}

LineApp.prototype.getRoomMemberProfile = function (roomid, userid) {
  let url = 'https://api.line.me/v2/bot/room/' + roomid + '/member/' + userid + '/';
  let params = {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + this.Token,
    },
    'method': 'get',
  };
  let response = tryToFetch(url, params);
  if (response === undefined)
    return;

  let userprop = JSON.parse(response);
  let imageurl = "";
  if (typeof userprop.pictureUrl !== 'undefined')
    imageurl = "https://profile.line-scdn.net/" + userprop.pictureUrl.split('/')[userprop.pictureUrl.split('/').length - 1];
  let statusMessage = (typeof userprop.statusMessage === 'undefined') ? "" : userprop.statusMessage;
  return { userId: userid, displayName: userprop.displayName, imageurl: imageurl, statusMessage: statusMessage };
}

LineApp.prototype.getFileContent = function (messageid) {
  let url = 'https://api-data.line.me/v2/bot/message/' + messageid + '/content';
  let params = {
    'headers': {
      'Authorization': 'Bearer ' + this.Token,
    },
    'method': 'get',
  };
  return tryToFetch(url, params);
}

// Not used
LineApp.prototype.getGroupMemberIds = function (groupid) {
  //只有認證帳號才能
  let url = 'https://api.line.me/v2/bot/group/' + groupid + '/member/ids'
  let params = {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + this.Token,
    },
    'method': 'get',
  };
  return tryToFetch(url, params);
}

// Not used
LineApp.prototype.leaveGroup = function (groupid) {
  let url = 'https://api.line.me/v2/bot/group/' + groupid + '/leave';
  let params = {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + this.Token,
    },
    'method': 'post',
  };
  return addFetchRequest(url,params);
  // The status code of the response must be 200.
}

LineApp.prototype.sendLinePush = function (id) {
  let url = 'https://api.line.me/v2/bot/message/push';
  let params = {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + this.Token,
    },
    'method': 'post',
    'payload': JSON.stringify(
      { 'to': id, 'messages': this.Msg, }
    )
  };
  return addFetchRequest(url, params);
}

LineApp.prototype.sendLineReply = function () {
  let url = 'https://api.line.me/v2/bot/message/reply';
  let params = {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + this.Token,
    },
    'method': 'post',
    'payload': JSON.stringify(
      { 'replyToken': this.Data.replyToken, 'messages': this.Msg, }
    ),
  };
  return addFetchRequest(url, params);
}