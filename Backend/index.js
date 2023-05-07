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




app.listen( 3001 , ()=> {console.log("LISTENING AT PORT: 3001")} )
