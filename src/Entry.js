function doGet(e) {
  try {
    // log({ "func": "doGet", "event": e });
    const resultPage = Route(e);
    return resultPage;
  }
  catch (ex) {
    log({ "msg": "Error in doGet(e)", ...ex, });
  }
}

function doPost(request) {
  // log({ "func": "doPost", request });
  const contents = JSON.parse(request.postData.contents);
  if (typeof contents !== typeof {} || contents.events === undefined ||
    contents.events.length === undefined || contents.events.length === 0 ||
    contents.destination != LINE_BOT_ID)
    return;

  log({ "func": "doPost", "events": contents.events });
  for (const event of contents.events) {
    try {
      let line = new LineApp(CHANNEL_ACCESS_TOKEN);
      line.react(event);
    }
    catch (ex) {
      log({ "msg": "Error in doPost()", ...ex, event });
    }
  }

  fetchAll();
  finishLogging();
  finishLoggingFetch();
}
