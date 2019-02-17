const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const BootBot = require('bootbot')
const axios = require('axios');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
const verificationController = require('./controllers/verification');
const messageWebhookController = require('./controllers/messageWebhook');
const FB_VERIFY_TOKEN = 'xx'
const FB_ACCESS_TOKEN = 'xxx';
const FB_APP_SECRET = 'xx'
const request = require('request');
const DF_CLIENT_TOKEN = 'xx'
function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop))
      return false;
  }

  return true;
}
app.get('/verify_token', function(res, req) {
  console.log("verify token")
  const hubChallenge = req.query['hub.challenge'];
  const hubMode = req.query['hub.mode'];
  const verifyTokenMatches = (req.query['hub.verify_token'] === FB_VERIFY_TOKEN);
  console.log((req.query['hub.verify_token'] === verifyTokenMatches))
  if (hubMode && verifyTokenMatches) {
    res.status(200).send(hubChallenge);
  } else {
    res.status(403).end();
  }
})

const bot = new BootBot({
  accessToken: FB_ACCESS_TOKEN,
  verifyToken: FB_VERIFY_TOKEN,
  appSecret: FB_APP_SECRET
})
function restart(payload, chat) {
  console.log('restarting')
  chat.getUserProfile().then((user) => {
    chat.say("Hello! I'm Nurse Joy! How may I help you " + user.first_name + " ?", {
      onDelivery: (payload, convo) => {
        chat.say({
          text: "What do you want to do? Please select a button!",
          quickReplies: ["Health Updates", "Reminders", "Schedule an Appointment"]
        })
      }
    })
  })

}
function main(payload, convo) {
  console.log('back to main')
  convo.say({
          text: "Please select from below!",
          quickReplies: ["Health Updates", "Reminders", "Schedule an Appointment"]
        })
  convo.end()
}

// TEXTBOOK CODE
function formatText(items, title, subtitle) {
  console.log(items)
  var element = items.map((item) => {
    return {
      title: item[title],
      subtitle: item[subtitle] ? item[subtitle] : "N/A",
      buttons: [{
        type: "postback",
        payload: "s_a " + item[title],
        title: "Select"
      }]

    }

  })
  if (element.length > 10) {
    element = element.slice(0, 10)
  }

  return element
}

const reminders = (convo) => {
  convo.ask("What do you want to be reminded of?", (payload, convo) =>{
    const task = payload.message.text
    convo.ask({text: "Do you want to be reminded once a day?", quickReplies: ["Yes", "No"]}, (payload, convo, data) =>{
        const text = payload.message.text
        if(text.toLowerCase() == "yes"){
          convo.say("Okay, will remind you to " + task + " once a day at 12pm!").then(() => main(payload, convo))
        }else{
          convo.say("Sorry about that.").then(() => main(convo))
        }

    })
  })
}

const scheduleAppointment = (convo) =>{
  convo.say("Select an available time slot below!").then(() => {
      let json = [{"date": "20/02/2019 2PM", "doctor": "Dr.Ross"}, {"date": "24/02/2019 1PM", "doctor": "Dr.Ross"}, {"date": "01/03/2019 1PM", "doctor": "Dr.Jane"}, {"date": "10/03/2019 4PM", "doctor": "Dr.Susan"}]
      convo.sendGenericTemplate(formatText(json, "date", "doctor")) 

  })
}
const confirm = (convo, date) =>{
  convo.ask({text: "Are you sure you want to schedule an appointment for " + date, quickReplies: ["Yes", "No"]}, (payload, convo, data) =>{
    const text = payload.message.text
    if(text.toLowerCase() == "yes"){
        axios.patch("https://nursejoy-152cb.firebaseio.com/" + "Carlson Lau" + ".json", {
          nextAppointment: date
        }).then(() =>{
          convo.say("Appointment scheduled!").then(() => main(payload, convo))
        })
          
        }else{
          convo.say("Please pick another date.").then(() => scheduleAppointment(convo))
        }
  })
}

const symptomChecker = (convo) => {
  convo.ask({text:"Have you had any chest discomfort today?", quickReplies: ['Yes', 'No']}, (payload, convo, data) => {
    const text = payload.message.text;
    if(['yes', 'no'].includes(text.toLowerCase())){
      convo.set('chest', text.toLowerCase());
      if(text.toLowerCase() == 'yes'){
        convo.say("Noted.").then(() => chestPressure(convo))
      }else{
        heartRate(convo)
      }
      
    }
    else {
      convo.say('Please press one of the buttons!').then(() => symptomChecker(convo))
    }
  })
}
const chestPressure = (convo) => {
  convo.ask({text:"Did you feel pressure in your chest?", quickReplies: ['Yes', 'No']}, (payload, convo, data) => {
    const text = payload.message.text;
    if(['yes', 'no'].includes(text.toLowerCase())){
      convo.set('c_pressure', text.toLowerCase());
      chestPain(convo)
      
    }
    else {
      convo.say('Please press one of the buttons!').then(() => chestPressure(convo))
    }
  })
}
const chestPain = (convo) => {
  convo.ask({text:"Did you feel chest pain?", quickReplies: ['Yes', 'No']}, (payload, convo, data) => {
    const text = payload.message.text;
    if(['yes', 'no'].includes(text.toLowerCase())){
      convo.set('c_pain', text.toLowerCase());
      if(text.toLowerCase() == 'yes'){
        chestIntense(convo)
      }else{
        chestHeart(convo)
      }
      
    }
    else {
      convo.say('Please press one of the buttons!').then(() => chestPain(convo))
    }
  })
}
const chestIntense= (convo) => {
  convo.ask({text:"How intense was the pain?", quickReplies: ['1', '2', '3', '4', '5']}, (payload, convo, data) => {
    const text = payload.message.text;
    if(['1', '2', '3', '4', '5'].includes(text.toLowerCase())){
      convo.set('c_intense', text.toLowerCase());
      chestHeart(convo)
    }
    else {
      convo.say('Please press one of the buttons!').then(() => chestIntense(convo))
    }
  })
}
const chestHeart = (convo) => {
  convo.ask({text:"Did you feel any heartburn?", quickReplies: ['Yes', 'No']}, (payload, convo, data) => {
    const text = payload.message.text;
    if(['yes', 'no'].includes(text.toLowerCase())){
      convo.set('c_heart', text.toLowerCase());
      chestFlutter(convo)
      
    }
    else {
      convo.say('Please press one of the buttons!').then(() => chestHeart(convo))
    }
  })
}
const chestFlutter = (convo) => {
  convo.ask({text:"Did you feel fluttering in your chest?", quickReplies: ['Yes', 'No']}, (payload, convo, data) => {
    const text = payload.message.text;
    if(['yes', 'no'].includes(text.toLowerCase())){
      convo.set('c_flutter', text.toLowerCase());
      heartRate(convo)
      
    }
    else {
      convo.say('Please press one of the buttons!').then(() => chestFlutter(convo))
    }
  })
}
const heartRate = (convo) => {
  convo.ask({text:"How was your heartrate today?", quickReplies: ['Fast', 'Slow', 'Abnormal', 'Not Sure']}, (payload, convo, data) => {
    const text = payload.message.text;
    if(['fast', 'slow', 'abnormal', 'not sure'].includes(text.toLowerCase())){
      convo.set('hr', text.toLowerCase());
      breath(convo)
      
    }
    else {
      convo.say('Please press one of the buttons!').then(() => heartRate(convo))
    }
  })
}
const breath = (convo) => {
  convo.ask({text:"Did you feel short of breath?", quickReplies: ['Yes', 'No']}, (payload, convo, data) => {
    const text = payload.message.text;
    if(['yes', 'no'].includes(text.toLowerCase())){
      convo.set('breath', text.toLowerCase());
      numb(convo)
      
    }
    else {
      convo.say('Please press one of the buttons!').then(() => breath(convo))
    }
  })
}
const numb = (convo) => {
  convo.ask({text:"Did you feel any pain/numbness in your extremities? ", quickReplies: ['Yes', 'No']}, (payload, convo, data) => {
    const text = payload.message.text;
    if(['yes', 'no'].includes(text.toLowerCase())){
      convo.set('numb', text.toLowerCase());
      checkSymp(convo)
      
    }
    else {
      convo.say('Please press one of the buttons!').then(() => numb(convo))
    }
  })
}
const checkSymp = (convo) => {
  convo.ask({text:"Did you feel any of the following - check all that apply ", quickReplies: ['No more', 'Lightheadedness','Dizziness','Nausea',
'Vertigo','Vomiting','Fainting','Sweating','Weakness','Fatigue']}, (payload, convo, data) => {
    const text = payload.message.text;
    if(['no more', 'lightheadedness','dizziness','nausea',
'vertigo','vomiting','fainting','sweating','weakness','fatigue'].includes(text.toLowerCase())){
      if(text.toLowerCase() == 'no more'){
        analyze(convo)
      }
      else{
        convo.set(text, "true");
        checkSymp(convo)
      }
      
    
      
      
    }
    else {
      convo.say('Please press one of the buttons!').then(() => checkSymp(convo))
    }
  })
}
const analyze = (convo) =>{
  const chest = convo.get("chest") == "yes" ? 1 : 0
  const c_pressure = convo.get("c_pressure") == "yes" ? 1 : 0
  const c_pain = convo.get("c_pain") == "yes" ? 1 : 0
  const c_intense = convo.get("c_intense") != undefined ? parseInt(convo.get("c_intense")) : 0
  const c_heart = convo.get("c_heart") == "yes" ? 1 : 0
  const c_flutter = convo.get("c_flutter") == "yes" ? 1 : 0
  const hr = convo.get("hr") 
  const breath = convo.get("breath") == "yes" ? 1 : 0
  const numb = convo.get("numb") == "yes" ? 1 : 0
  const lightheadedness = convo.get("Lightheadedness") != undefined ? 1 : 0
  const dizziness = convo.get("Dizziness") != undefined ? 1 : 0
  const nausea = convo.get("Nausea") != undefined ? 1  : 0
  const vertigo = convo.get("Vertigo")!= undefined ? 1 : 0
  const vomiting = convo.get("Vomiting") != undefined ? 1 : 0
  const fainting = convo.get("Fainting") != undefined ? 1 : 0
  const sweating = convo.get("Sweating")!= undefined ? 1 : 0
  const weakness = convo.get("Weakness")!= undefined ? 1 : 0
  const fatigue = convo.get("Fatigue")!= undefined ? 1 : 0
  let features = [chest, c_pressure, c_pain, c_heart, c_flutter, breath, numb]
  let person = [19, 1, 3, 120, 0, 0, 1, 120, 0, -0.5]
  let data = person.concat(features)
  console.log("concat data", data)
  axios.post("http://localhost:6000/predict", {data: data}).then(json =>{
    console.log("recieved prediction: ", json.data, json.data['prediction'], json.data.score)
      axios.patch("https://nursejoy-152cb.firebaseio.com/" + "Carlson Lau" + ".json", {
          chest: chest,
          c_pressure: c_pressure,
          c_pain: c_pain,
          c_intense: c_intense,
          c_heart: c_heart,
          c_flutter: c_flutter,
          hr: hr,
          breath: breath,
          numb: numb,
          lightheadedness: lightheadedness,
          dizziness: dizziness,
          nausea: nausea,
          vertigo: vertigo,
          vomiting: vomiting,
          fainting: fainting,
          sweating: sweating,
          weakness: weakness,
          fatigue: fatigue,
          predict: json.data.prediction,
          score: json.data.score,
          details: person
        }).then(() =>{
          convo.say("Thanks! The doctors recieved your information!").then(() => main('main', convo))
        })
  })
  
  
  
}


bot.setGetStartedButton((payload, chat) => {
  restart(payload, chat)
})

bot.setPersistentMenu([{
  title: "Main Menu",
  type: "postback",
  payload: "restart"
}])


bot.on("postback:restart", (payload, chat) => {
  restart(payload, chat)
})
bot.on("restart", (payload, chat) => {
  restart(payload, chat)
})

bot.on('postback', (payload, chat) => {
  console.log("in postback")
  const pick_appointment = /Schedule an Appointm\.\.\./i
  const pick_reminder= /Reminders/i
  const pick_health = /Health Updates/i
  const schedule = /s_a (.*)/i
  const buttonPayload = payload.postback.payload;
  console.log("payload:", buttonPayload)
  const match_appointment = buttonPayload.match(pick_appointment)
  const match_reminder = buttonPayload.match(pick_reminder)
  const match_health = buttonPayload.match(pick_health)
  const match_time = buttonPayload.match(schedule)
  console.log(match_appointment, match_reminder, match_health, match_time)
  if (match_appointment) {
    chat.conversation((convo) => scheduleAppointment(convo))
  } else if(match_time){
    console.log("match_time", match_time)
    let date = match_time[1]
    chat.conversation((convo) => confirm(convo, date))

  }
    else if (match_reminder) {
    chat.conversation((convo) => reminder(convo))
  } else if (match_health){
    chat.conversation((convo) => symptomChecker(convo))
  }


});
bot.on('message', (payload, chat) => {
  let text = payload.message.text
  console.log("caught msg:", text)
  if (/Schedule an Appointm\.\.\./i.test(text)) {
          chat.conversation((convo) => {
            console.log('searching for appointment')
            scheduleAppointment(convo)
          })
        }


        if (/Reminders/i.test(text)) {
          chat.conversation((convo) => {
            console.log("search for reminders")
            reminders(convo)
          })
        }
        if (/Health Updates/i.test(text)) {
          chat.conversation((convo) => {
            console.log("search for health")
            symptomChecker(convo)
          })
        }
        if(/Main menu/i.test(text)){
          restart(payload, chat)
        }
        if(/restart/i.test(text)){
          restart(payload, chat)
        }
})


const callbacks = [{
  event: 'postback',
  callback: (payload, convo, data) => {
    convo.end();
    bot._handleEvent(`postback:${payload.postback.payload}`, payload)

    console.log('callbacks')
  }
}]


bot.start(8080)