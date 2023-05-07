const connection = require('./connection');
const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads");
    },
    filename: (req, file, cb)=> {
      cb(null, file.originalname);
    },
  });
const upload = multer({ storage });

app.use(express.json())
connection();
app.use(cors());

const DoubtSolveModule1 = require('./models/DoubtSolveModule1');

app.post('/DoubtSolverModule1',upload.single('testImage'), async (req, res) => {
    try {
        const QuestionsDetails = new DoubtSolveModule1({
            description: req.body.description,
            subject: req.body.subject,
            topic: req.body.topic,
            resource: req.body.resource,
            img: {
                data: fs.readFileSync('uploads/' + req.file.filename),
                contentType: 'image/png'
            }
        });
        const AddQuestion = await QuestionsDetails.save();
        res.status(200).send({ success: true , AddQuestion });
    } catch (error) {
        res.status(404).json({ error });
    }
});

const DoubtSolveModule2 = require('./models/DoubtSolveModule2');

app.post('/DoubtSolverModule2',upload.single('testImage'), async (req, res) => {
    try {
        const QuestionsDetails = new DoubtSolveModule2({
            description: req.body.description,
            img: {
                data: fs.readFileSync('uploads/' + req.file.filename),
                contentType: 'image/png'
            }
        });
        const AddQuestion = await QuestionsDetails.save();
        res.status(200).send({ success: true , AddQuestion });
    } catch (error) {
        res.status(404).json({ error });
    }
});

app.get('/DisplayExpertQuestions', async (req, res) => {
    try {
        const QuestionsDetails = await DoubtSolveModule1.find();
        res.status(200).send({ success: true , QuestionsDetails });
    } catch (error) {
        res.status(404).json({ error });
    }
});

app.get('/DisplayQuestionsMod2', async (req, res) => {
    try {
        const QuestionsDetails = await DoubtSolveModule2.find();
        res.status(200).send({ success: true , QuestionsDetails });
    } catch (error) {
        res.status(404).json({ error });
    }
});

const { google } = require('googleapis');
const OAuth2Data = require('./Credentials.json');

app.use(cors(
    {
        origin: 'http://localhost:3000',
        credentials: true
    }
));

const session = require('express-session');
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET',
}
));
//Forntend (router-dom and axios)

const upload1 = multer({ dest: 'doubtsolve/' });

const CLIENT_ID = OAuth2Data.web.client_id;
const CLIENT_SECRET = OAuth2Data.web.client_secret;
const REDIRECT_URI = OAuth2Data.web.redirect_uris[0];

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
const scopes = ['https://www.googleapis.com/auth/youtube.upload'];

const getAuthUrl = () => {
  return oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
};

app.get('/auth', (req, res) => {
  const authUrl = getAuthUrl();
  res.redirect(authUrl);
});

app.get('/oauth2callback', (req, res) => {
  const authorizationCode = req.query.code;

  oAuth2Client.getToken(authorizationCode, async (err, tokens) => {
    if (err) {
      console.error('Error retrieving access token:', err);
      res.status(500).send('Error retrieving access token');
      return;
    }

    oAuth2Client.setCredentials(tokens);

    const youtube = google.youtube({
      version: 'v3',
      auth: oAuth2Client,
    });

    const videoPath = req.session.videoPath;
    const videoTitle = req.session.videoTitle;

    try {
      const videoData = {
        snippet: {
          title: videoTitle,
          description: 'Uploaded using YouTube Data API v3',
        },
        status: {
          privacyStatus: 'private', // Set the privacy status as desired
        },
      };

      const media = {
        body: fs.createReadStream(videoPath),
      };

      const response = await youtube.videos.insert({
        part: 'snippet,status',
        media: media,
        resource: videoData,
      });

      res.json({ videoId: response.data.id });
    } catch (error) {
      console.error('Error uploading video:', error);
      res.status(500).send('Error uploading video');
    }
  });
});

app.post('/upload', upload1.single('video'), (req, res) => {
  console.log(req.file);
  req.session.videoTitle = req.file.originalname;
  req.session.videoPath = `uploads/${req.file.filename}`;

  res.redirect('/auth');
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});