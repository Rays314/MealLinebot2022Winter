class LineMessage {
  static Text(message) {
    return { "type": "text", "text": message };
  }

  static Bubble(content) {
    content.type = 'bubble';
    return content;
  }

  static FlexBubble(alterText, bubble, extra) {
    let obj = {
      "type": "flex",
      "altText": alterText,
      "contents": bubble
    };
    if (typeof extra !== 'undefined') {
      for (let k in extra)
        obj[k] = extra[k];
    }
    return obj;
  }

  static FlexCarousel(alterText, bubbles, extra) {
    let obj = {
      "type": "flex",
      "altText": alterText,
      "contents": { "type": "carousel", "contents": bubbles }
    };
    if (typeof extra !== 'undefined') {
      for (let k in extra)
        obj[k] = extra[k];
    }
    return obj;
  }

  static Audio(url, duration) {
    return {
      'type': 'audio',
      'originalContentUrl': url,
      'duration': duration
    };
  }

  static Image(url, thumbnail) {
    if (typeof thumbnail === 'undefined')
      thumbnail = url;
    return {
      "type": "image",
      "originalContentUrl": url,
      "previewImageUrl": thumbnail,
    };
  }

  static Video(url, thumbnail) {
    return {
      'type': 'video',
      'originalContentUrl': url,
      'previewImageUrl': thumbnail
    };
  }

  static Location(title, address, latitude, longitude) {
    return {
      'type': 'location',
      'title': title,
      'address': address,
      'latitude': latitude,
      'longitude': longitude
    };
  }

  static Sticker(packageid, stickerid) {
    return {
      "type": "sticker",
      "packageId": packageid,
      "stickerId": stickerid,
    };
  }
  static PositiveSticker() {
    const sticker = [
      [1, 2], [1, 4], [1, 5], [1, 13], [1, 14],
      [1, 114], [1, 119], [1, 125], [1, 132],
      [1, 134], [1, 137], [1, 138], [1, 139],
      [1, 407], [2, 34], [2, 45], [2, 144],
      [2, 164], [2, 166], [2, 171], [2, 172],
      [2, 516], [3, 180], [3, 184], [3, 186],
      [3, 195], [3, 200]];
    const stickerNumber = Math.floor(Math.random() * sticker.length);

    return {
      "type": "sticker",
      "packageId": sticker[stickerNumber][0].toString(),
      "stickerId": sticker[stickerNumber][1].toString()
    };
  }

  static MessageAction(label, text) {
    return {
      "type": "message",
      "label": label,
      "text": text
    };
  }

  static UriAction(label, url, desktopurl) {
    if (typeof desktopurl === 'undefined') desktopurl = url;
    return {
      "type": "uri",
      "label": label,
      "uri": url,
      "altUri": { "desktop": desktopurl }
    };
  }

  static PostbackAction(label, data, text) {
    return {
      "type": "postback",
      "label": label,
      "data": data,
      "displayText": text
    };
  }
}