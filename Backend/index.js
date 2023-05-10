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

//Frontend (router-dom and axios)
//Backend (npm install --save youtube-api , express-sessions, multer , open , uuid)
const youtube = require('youtube-api');
const OAuth2Data = require('./Secret3.json');
const childProcess = require('child_process');
const CLIENT_ID = OAuth2Data.web.client_id;
const CLIENT_SECRET = OAuth2Data.web.client_secret;
const REDIRECT_URI = OAuth2Data.web.redirect_uris[0];

const oAuth = youtube.authenticate({
  type: "oauth",
  client_id: CLIENT_ID,
  client_secret: CLIENT_SECRET,
  redirect_url: REDIRECT_URI
});

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

const upload1 = multer({  
  dest: 'doubtsolve/',
  filename(req, file, cb) {
    const newFilename = `${file.originalname}`;
    cb(null, newFilename);
  }
});

app.post('/upload', upload1.single("videoFile"), (req, res) => {
  if (req.file) {
    const filename = req.file.filename;
    const { title, description } = req.body;

    const authUrl = oAuth.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/youtube.upload',
      state: JSON.stringify({
        filename,
        title,
        description
      })
    });

    childProcess.exec(getOpenCommand(authUrl), (error) => {
      if (error) {
        console.error(`Error opening URL: ${error.message}`);
      }
    });

    res.status(200).json({ success: true });
  } else {
    res.status(404).json({ success: false });
  }
});


app.get('/oauth2callback', (req, res) => {
  const { filename, title, description } = JSON.parse(req.query.state);

  oAuth.getToken(req.query.code, (err, token) => {
    if (err) {
      console.log(err);
      res.status(500).json({ success: false });
    } else {
      oAuth.setCredentials(token);

      youtube.videos.insert({
        resource: {
          snippet: {
            title,
            description
          },
          status: {
            privacyStatus: 'public'
          }
        },
        part: 'snippet,status',
        media: {
          body: fs.createReadStream('doubtsolve/' + filename)
        }
      }, (err, data) => {
        if (err) {
          console.error(err);
          res.status(500).json({ success: false });
        } else {
          const videoId = data.data.id;
          const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
          console.log('YouTube video URL:', videoUrl);
          res.status(200).json({ success: true, videoUrl });
        }
      });
    }
  });
});


const getOpenCommand = (url) => {
  switch (process.platform) {
    case 'darwin': 
      return `open "${url}"`;
    case 'win32': 
      return `start "" "${url}"`;
    case 'linux': 
      return `xdg-open "${url}"`;
    default:
      console.error('Unsupported platform');
      return '';
  }
};



app.listen(3001, () => {
  console.log('Server is running on port 3001');
});