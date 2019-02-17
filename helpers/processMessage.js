const API_AI_TOKEN = '8b7bcd55abf148a4a35dd0efea53e26c';
const apiAiClient = require('apiai')(API_AI_TOKEN);

const FACEBOOK_ACCESS_TOKEN = 'EAAEMh7AXLD0BAPIFbQMrs8R8cWVZBtBEclBAM0ZBZCTcYpfp8XZBYPLGQZBSbgYUZAzvKFvu15itt1LWmc4iXuOVYa0C7kooLO3qOjrTubeOBrgkGKJ0lPuMWaZA9LACfm3TgLoPcT9n00xPC0jeuZBesnlnwKrWmbAJSEcDmuT5ogZDZD';
const request = require('request');

const sendTextMessage = (senderId, text) => {
 request({
 url: 'https://graph.facebook.com/v2.6/me/messages',
 qs: { access_token: FACEBOOK_ACCESS_TOKEN },
 method: 'POST',
 json: {
 recipient: { id: senderId },
 message: { text },
 }
 });
};

module.exports = (event) => {
 const senderId = event.sender.id;
 const message = event.message.text;

const apiaiSession = apiAiClient.textRequest(message, {sessionId: 'uoft_bot'});

apiaiSession.on('response', (response) => {
 const result = response.result.fulfillment.speech;

sendTextMessage(senderId, result);
 });

apiaiSession.on('error', error => console.log(error));
 apiaiSession.end();
};