const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');

const cors = require('cors');

const uri = "mongodb+srv://DearGuest23:rUKmEgVN6lPmfYaE@cluster.kly5ytl.mongodb.net/?retryWrites=true&w=majority";
const app = express();
const port = 8000;
app.use(cors());
app.use(express.json());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

app.get('/', (req, res) => {
    res.send('Hello, the server is running!');
});

app.post('/login', async (req, res) => {
    const { id } = req.body; // Destructure 'id' from request body
    const {institution} = req.body;
    console.log(institution);
    console.log(id);
    const database = client.db(institution);
    const users = database.collection('users');
    const user = await users.findOne({userId: id});
    console.log("user ",user);
    if(user){
        return res.send('success')
   }
    else{
        res.send('failed')
    }

});


app.post('/meetingsList', async (req, res) => {

    const database = client.db('aleyZahv');
    const meetingsCollection = database.collection('meetings');
    const meetingsList = await meetingsCollection.findOne({id: '123'});
    console.log(meetingsList.meeting);
    res.send(meetingsList.meeting);
});

app.post('/addMeeting', async (req, res) => {
    const {newMeeting} = req.body;
    console.log("new meeting",newMeeting);
    const database = client.db('aleyZahv');
    const meetingsCollection = database.collection('meetings');

    // Insert the new meeting into the collection
    const result = await meetingsCollection.updateOne(
        { id: '123' },
        { $push: { meeting: newMeeting } }
    );
    if (result){

        res.send('success')
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
