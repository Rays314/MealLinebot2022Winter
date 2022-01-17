//當機器人被加入群組時
LineApp.prototype.onjoin = function () {
  let groupdata = this.Data.groupdata;
};

//當機器人被踢出群組時
LineApp.prototype.onleave = function () {
  let groupdata = this.Data.groupdata;
};

//當有使用者被加入群組時
LineApp.prototype.onmemberJoined = function () {
  let groupdata = this.Data.groupdata;
  let userdata = this.Data.userdata;
};

//當有使用者離開群組時
LineApp.prototype.onmemberLeft = function () {
  let groupdata = this.Data.groupdata;
  let userdata = this.Data.userdata;
};

//當有使用者家好友時
LineApp.prototype.onfollow = function () {
  let userdata = this.Data.userdata;
};

//當有使用者封鎖時
LineApp.prototype.onunfollow = function () {
  let userdata = this.Data.userdata;
};

//當接收到任何訊息時
LineApp.prototype.onmessage = function () {
  //注意會與以下事件重複觸發      
}
//當收到地理資訊時
LineApp.prototype.onlocation = function () {
  let title = this.Data.title;
  let address = this.Data.address;
  let latitude = this.Data.latitude;
  let longtitude = this.Data.longitude;
}

//當接收到圖片時
LineApp.prototype.onimage = function () {
  let blob = this.Data.Content;
};
//當接收到音訊時
LineApp.prototype.onaudio = function () {
  let blob = this.Data.Content;
}
//當接收到影片時
LineApp.prototype.onvideo = function () {
  let blob = this.Data.Content;
}
//當接收到檔案時
LineApp.prototype.onfile = function () {
  let blob = this.Data.Content;
}
//當接收到貼圖時
LineApp.prototype.onsticker = function () {
  let packageId = this.Data.packageId;
  let stickerId = this.Data.stickerId;
};
//當接收到postback時，按鈕互動時才會使用到
LineApp.prototype.onpostback = function () {
  let postback = this.Data.postback;
}
//當接收到文字訊息時
LineApp.prototype.ontext = function () {
  let trace = [];
  for (let i = 0; i < this.TextRules.length; i++) {
    try {
      let obj = this.TextRules[i];
      let toReply = obj.check.call(this);
      trace.push([i, obj.name, toReply]);
      if (toReply) {
        let data = obj.react.call(this);
        //Line在一則回覆中最多只能回傳5個訊息塊
        this.add(data);
        break;
      }
    }
    catch (ex) {
      log({
        ...ex, "msg": "Error in LineApp.prototype.ontext",
        i, "obj": this.TextRules[i],
      });
    }
  }
  // log({"TextRuleTrace": trace});
};

//當有錯誤發生時
LineApp.prototype.onerror = function () {
  log({ "MsgSent": this.Msg });
  if (this.Msg.length > 0 && FETCH_OPTIONS.TO_SEND_LINE_REPLY)
    this.sendLineReply();
};

//當流程全部走完時
LineApp.prototype.onfinal = function () {
  log({ "MsgSent": this.Msg });
  if (this.Msg.length > 0 && FETCH_OPTIONS.TO_SEND_LINE_REPLY)
    this.sendLineReply(); // Reply to the message
};