function initializeTextRules() {

  //聲音訊息
  //LineMessage.Audio(url,duration), must be "https"

  //影片訊息
  //LineMessage.Audio(url,duration), must be "https"

  //貼圖訊息
  //可參考: https://developers.line.biz/media/messaging-api/sticker_list.pdf
  //LineSticker:LineSticker(packageid,stickerid),

  //隨機一個正面貼圖
  //LinePositiveSticker:LinePositiveSticker(),

  //圖片訊息
  //LineImage:LineImage(url), must be "https"

  //文字訊息
  //LineText:LineText(str),

  //進階flex訊息
  //{可自行組合JSON檔案}

  this.TextRules.push({
    name: "連動", check: function () {
      let word = this.Data.userMessage;
      let userdata = this.Data.userdata;
      let groupdata = this.Data.groupdata;

      return word == "連動" && typeof groupdata !== 'undefined';
    }, react: function () {
      let word = this.Data.userMessage;
      let userdata = this.Data.userdata;
      let groupdata = this.Data.groupdata;

      let url = getRegisterLinenotifyUrl(groupdata.id);

      let bubble =
      {
        "type": "bubble",
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "button",
              "action": LineUriAction("連動", url),
              "style": "primary",
              "color": "#ff8d00"
            }]
        }
      };

      //回傳訊息
      return LineMessage.FlexBubble("連動", bubble);
    },
  });

  this.TextRules.push({
    name: "登入", check: function () {
      let word = this.Data.userMessage;
      let userdata = this.Data.userdata;
      let groupdata = this.Data.groupdata;

      return word == "登入" && typeof groupdata !== 'undefined';
    }, react: function () {
      let word = this.Data.userMessage;
      let userdata = this.Data.userdata;
      let groupdata = this.Data.groupdata;

      let url = getLineLoginUrl(groupdata.id, "test");

      let bubble =
      {
        "type": "bubble",
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "button",
              "action": LineUriAction("登入", url),
              "style": "primary",
              "color": "#ff8d00"
            }]
        }
      };

      //回傳訊息
      return LineMessage.FlexBubble("登入", bubble);
    },
  });

  this.TextRules.push({
    name: "LIFF", check: function () {
      let word = this.Data.userMessage;
      let userdata = this.Data.userdata;
      let groupdata = this.Data.groupdata;

      return word == "LIFF" && typeof groupdata !== 'undefined';
    }, react: function () {
      let word = this.Data.userMessage;
      let userdata = this.Data.userdata;
      let groupdata = this.Data.groupdata;

      let url = getLIFFUrl("測試一下", "&groupId=" + groupdata.id + "&method=testliff");

      let bubble =
      {
        "type": "bubble",
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "button",
              "action": LineUriAction("LIFF", url),
              "style": "primary",
              "color": "#ff8d00"
            }]
        }
      };

      //回傳訊息
      return LineMessage.FlexBubble("LIFF", bubble);
    },
  });

  //新增邏輯處理
  //name:紀錄使用
  //check:檢查是否有回覆的需要
  //react:處理回覆訊息
  
  this.TextRules.push({
    name: "回聲", check: function () {
      let word = this.Data.userMessage;
      let userdata = this.Data.userdata;
      let groupdata = this.Data.groupdata;

      return true;//if true then goto react; if false then keep go through.    
    }, react: function () {
      let word = this.Data.userMessage;
      let userdata = this.Data.userdata;
      let groupdata = this.Data.groupdata;

      //回傳訊息
      return LineMessage.Text(word + "\n(received by bot)");
    },
  });
  

  //新增回覆
  //line.add(msg);
}