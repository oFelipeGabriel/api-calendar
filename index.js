// Fonte: https://dev.to/megazear7/google-calendar-api-integration-made-easy-2a68

const express = require('express');
var bodyParser = require("body-parser");
const { google } = require('googleapis');

const app = express();
app.use(bodyParser.json());
const port = 3000;

const SCOPES = 'https://www.googleapis.com/auth/calendar';
const GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCe6NYb+1G6IOwz\n9/1P6q6Ffhv6gz2f0NMboHeyy6VTY0nqVslVzV4QOLaVS/2+/P1i6jYbVOr7OKa5\nSeB0qFJclxZyuYzTOI2nlLnowxt7UGbqW8e/py+pX/SpUh+4Hfl7ht7AAJq3Bljs\ngqnUJL2UdrptZbEhskHL4MsI3vaOoqv5mhflDpLes6Br+FTQI/X9tlYlbGqXvhNA\nPErQgvjh6FpHNCL+p90ujgStciMpkLuNGhIOmpTzPG5BXzPWE4PDB1+10ryCsW05\nRVjmuwbJ36Or9IfP4UpZ+JystVoxWU8C+bLaY7vGq/P4Z+eHiHVmVrDL7YuDYusM\nqU3qPrWDAgMBAAECggEADsmG5wqvc70NjdZ1VYL2o4h1LQ4aZW1Gv8riaJpns4dJ\nQQu7Z4cZSjQk1WbBYYzkPVijGU8BIMiIRzS3NNPW+jO7DIj0sFESaXY/CIhjXcnB\nEezhfRWfK0k5GKqCNh1f8l0+DCriOsbV7ohIKmwS0iZsObLdVU/jrIeqDRTGZ8ZY\n3kltQCUn5x5Ch4nlmG8rQnzdd/dkwh287Ld6KAezjXDQrd11AuFIxZH2pOLg4Rg2\nc0ydqlUsY3VI7xKFtuzByem5KFTunKgO4U+i+HHM71yMeESTEBMb55NuUnK79SAx\nsvvAZNMwtSrs97+vHE8mWVIFQK5In6x6YmscH4QsyQKBgQDR2Fw1/6tHwD+vhbgg\n/qiT2OzEiehGMcCsF/lmxqzAoBNVC1b0hE9W6ODeoTGPmmHeg4D5ls6JBR/CFnlx\nUz7aFyQGDP5nj+XTUbOysNhXB/8k9nA15LQFp6we/WbNWI0yG6cU/jOtZLVTMW2l\nrtFMNWbMmJj8/AouNoxtsCC6iQKBgQDB3HhbBOq7YFnNxc4k0YNJuijBMjNItWP5\nLZNYlrgpDinPXn1ffledmMgxs/OZdVIvhdlH3N1fwPU32pNIa+7jyD5QBflLoC0n\ny0ve6zIycpUBZI+z+M/0AgVioqXzjQAhY0NyaP9x4BmscI945n6Bbd95odBLMtIS\nPngcwNo8qwKBgQDG5qRojoEkDmaPEVk49QiGsvuhQvJF7oyo0kSUlUZTgqcwWgI+\n3FZzk2LpwrI+Yl/X0J/kc3wqxg+XIURVFUmi4IJFtfVB5lQ6W9vPSO6Wd77woyIz\nAydboNV1vky94OxcjXduX5BODwIL6/L5M12xNYDN9uo0CRYBPbUXlvU+uQKBgCS6\n4e7U2qiP09QB81HUhFx2sfwQx9ixzXRLp0w0mkXlEhThIT3zkSQh62RHZRMhQGYS\npR1Rgnv+8jcX6aniEUwFB5Ff4GDsw0Fz6jcdNtCKFyNBa1y8+qGPtHeAu5KOl4S7\n6u6FaEiqHhMm7HgKq9NX/uxrtSxaP6UHQvinrXGrAoGASYpwdVGRE+f14Bf+a7go\nBgPh86agJvWWxvSYmiYEa21DeAJ3+BHM/qkJwvl8O4Vps48xD3gnzvFBDi0mtORW\n9kSDsPCdI/IbpeLuEjGIsCgAh1CFXN/Jb03W+Tys3tIHLK9tibxSUHxpCGT3Luoq\nMugBPClShSdZ138Y1C6LXxw=\n-----END PRIVATE KEY-----\n"
const GOOGLE_CLIENT_EMAIL = "app-calendario@norse-coral-221214.iam.gserviceaccount.com"
const GOOGLE_PROJECT_NUMBER = "763988571681"
const GOOGLE_CALENDAR_ID = "lucyjbrandao@gmail.com"

var event = {
  'summary': 'Google I/O 2019',
  'location': '800 Howard St., San Francisco, CA 94103',
  'description': 'A chance to hear more about Google\'s developer products.',
  'start': {
    'dateTime': '2019-11-28T09:00:00-07:00'
  },
  'end': {
    'dateTime': '2019-11-28T17:00:00-07:00'
  }
};
var event2 = {
  'summary': '',
  'location': '',
  'description': '',
  'start': {
    'dateTime': ''
  },
  'end': {
    'dateTime': ''
  }
};
const jwtClient = new google.auth.JWT(
  GOOGLE_CLIENT_EMAIL,
  null,
  GOOGLE_PRIVATE_KEY,
  SCOPES
);
const calendar = google.calendar({
  version: 'v3',
  project: GOOGLE_PROJECT_NUMBER,
  auth: jwtClient
});

app.get('/', (req, res) => {
  calendar.events.list({
    calendarId: GOOGLE_CALENDAR_ID,
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  }, (error, result) => {
    if (error) {
      res.send(JSON.stringify({ error: error }));
    } else {
      if (result.data.items.length) {
        res.send(JSON.stringify({ events: result.data.items }));
      } else {
        res.send(JSON.stringify({ message: 'No upcoming events found.' }));
      }
    }
  });
});

app.get('/novo', (req,res) => {
  const jwtClient = new google.auth.JWT(
    GOOGLE_CLIENT_EMAIL,
    null,
    GOOGLE_PRIVATE_KEY,
    SCOPES
  );

  const calendar = google.calendar({
    version: 'v3',
    project: GOOGLE_PROJECT_NUMBER,
    auth: jwtClient
  });

  calendar.events.insert({
    auth: jwtClient,
    calendarId: GOOGLE_CALENDAR_ID,
    resource: event,
  }, function(err, event){
    if(err){
      res.send(JSON.stringify({ error: err}));
      console.log('There was an error contacting the Calendar service: ' + err);
      return;
    }
    res.send(JSON.stringify({ events: event }));
    console.log('Event created: %s', event.htmlLink)
  })
});

app.post('/api/novo', (request, response) => {
  const postBody = request.body;
  let nome = postBody.nome;
  let local = postBody.local;
  let descricao = postBody.descricao;
  let start = postBody.start;
  let end = postBody.end;
  event2 = {
    'summary': nome,
    'location': local,
    'description': descricao,
    'start': {
      'dateTime': start
    },
    'end': {
      'dateTime': end
    }
  }
  calendar.events.insert({
    auth: jwtClient,
    calendarId: GOOGLE_CALENDAR_ID,
    resource: event2,
  }, function(err, event){
    if(err){
      response.send(JSON.stringify({ error: err}));
      console.log('There was an error contacting the Calendar service: ' + err);
      return;
    }
    response.send(JSON.stringify({ events: event }));
    console.log('Event created: %s', event.htmlLink)
  })
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
