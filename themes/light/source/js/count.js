
var ws = new WebSocket("wss://api.fundebug.com/api/events/websocket/total/count");

ws.onopen = function(evt) { 
  // console.log("Connection open ..."); 
  ws.send("Hello WebSockets!");
};

ws.onmessage = function(evt) {
  // console.log( "Received Message: " + evt.data);
  $("#totalcount").text(evt.data);
};

ws.onclose = function(evt) {
  console.log("Connection closed.");
};
