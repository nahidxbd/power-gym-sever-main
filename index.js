const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')

const app = express();
require('dotenv').config();
console.log(process.env.DB_NAME);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
const port = 8080

const password = "fahimandroid019CSEF"
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jrzhf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;



app.get('/', (req, res) => {
    res.send('Welcome to Power Gym server api !')
})



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const ourClass = client.db("gym").collection("ourClasses");
    const plan = client.db("gym").collection("plan");
    const paidUsers = client.db("gym").collection("paidUser");

    // to send our class informations
    app.post('/insertClass', (req, res) => {
        const doc = req.body;
        ourClass.insertOne(doc)
        .then(result => res.send("successfully added data in the database"))
    })

    // to send plan information
    app.post('/insertPlan',(req,res)=>{
        const doc=req.body;
        plan.insertOne(doc)
        .then(result=>res.send("successfully added data in the database"));

    })

    // payment and register user information
    app.post('/insertPaymentInformation',(req,res)=>{
        const doc=req.body;
        console.log(req.body);
        paidUsers.insertOne(doc)
        .then(result=>{
            console.log(result);
            res.send("successfully added data in the database")
        });

    })

    // to get our class informations
    app.get("/getAllClass",(req,res)=>{
        ourClass.find({}).toArray((err,documents)=>{
            res.send(documents);
        })
    })
    app.get('/class/:id', (req, res) => {
        const id=Number(req.params.id)
        ourClass.find({ id })
          .toArray((err, result) => {
            res.send(result[0])
          })
      })

     // get all plan
     app.get("/getAllPlan",(req,res)=>{
        plan.find({}).toArray((err,documents)=>{
            res.send(documents);
        })
    })

});



app.listen(process.env.PORT || port, () => {
    console.log(`app listening at http://localhost:${port}`)
}) 

// app.listen(port, () => {
//     console.log(`app listening at http://localhost:${port}`)
// })  