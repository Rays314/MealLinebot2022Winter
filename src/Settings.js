const CHANNEL_ACCESS_TOKEN = '';

const LINE_BOT_ID = '';

const LINENOTIFY = {
  CLIENTID: '',
  CLIENTSECRET: '',
};

// Not used
const LINELOGIN = {
  CLIENTID: '',
  CLIENTSECRET: '',
};

// Not used
const LIFFURL = '';

const SAVE_OPTIONS = {
  "GROUP_DATA_SHEET_NAME": "群組",
  "USER_DATA_SHEET_NAME": "名單",
  "TO_SAVE_GROUP_DATA": true,
  "TO_SAVE_USER_DATA": true,
};

/**
 * Guards of fetching in the Line APIs.  
 * Set some of them of false to avoid to reach the quotas
 * of fetching (which is 20,000 times per day).
 *   
 * It doesn't affect user-defined functions.  
 * E.g., if someone writes new LineApp(accessToken).sendLineReply(),
 * it will still reply even when TO_SEND_LINE_REPLY is set to false.  
 *   
 * However, those APIs with wrappers may be affected.  
 * E.g., SendPushMessage().
 */
const FETCH_OPTIONS = {
  "TO_FETCH": true, // master of the following settings
  "TO_SEND_LINE_REPLY": true,
  "TO_SEND_LINE_PUSH_MESSAGE": true,
  "TO_SEND_LINE_NOTIFY": true,
  "TO_SEND_LINE_NOTIFY_IMAGE": true,
  "TO_HANDLE_CALLBACK_LINE_NOTIFY": true,
  "TO_HANDLE_CALLBACK_LINE_LOGIN": true,
  "TO_GET_FILE_CONTENT": true, // including file, image, video and audio
  "TO_GET_USER_PROFILE": true,
  "TO_GET_ROOM_MEMBER_PROFILE": true,
  "TO_GET_GROUP_MEMBER_PROFILE": true,
};