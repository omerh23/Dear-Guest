const express = require('express');
const { MongoClient, ServerApiVersion} = require('mongodb');

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
    //console.log(institution);
    //console.log(id);
    const database = client.db(institution);
    const users = database.collection('users');
    const user = await users.findOne({userId: id});
    //console.log("user ",user);
    if(user){
        return res.send({"status":"success","username":user.username,"isAdmin":user.isAdmin});
   }
    else{
        res.send('failed')
    }

});


app.post('/meetingsList', async (req, res) => {
    const {institution} = req.body;
    const database = client.db(institution);
    const meetingsCollection = database.collection('meetings');
    const meetingsList = await meetingsCollection.findOne({id: '123'});
    //console.log(meetingsList.meeting);
    res.send(meetingsList.meeting);
});

app.post('/addMeeting', async (req, res) => {
    const { newMeeting, institution } = req.body;
    console.log(institution);
    //console.log("new meeting",newMeeting);
    const database = client.db(institution);
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


app.post('/addEmployee', async (req, res) => {
    const { newEmployee, institution } = req.body;
    const database = client.db(institution);
    const employeesCollection = database.collection('users');

    // Check if the employee already exists
    const employeeExist = await employeesCollection.findOne({ userId: newEmployee.userId });
    console.log(employeeExist)
    if (employeeExist !== null) {
        const result = await employeesCollection.insertOne(newEmployee);

        if (result.acknowledged) {
            // Successfully inserted one document
            res.send('success');
        } else {
            // Failed to insert
            res.status(500).send('Failed to add employee to the database');
        }
    }

    else {
        res.send('exist');

    }
});


app.post('/finishMeeting', async (req, res) => {
    try {
        const { meetingDetails, institution } = req.body;
        const database = client.db(institution);
        const meetingsCollection = database.collection('meetings');

        // Update the document by pulling the specific meeting from the 'meeting' array
        const result = await meetingsCollection.updateOne(
            { id: '123', meeting: { $elemMatch: meetingDetails } },
            { $pull: { meeting: meetingDetails } }
        );

        if (result.modifiedCount > 0) {
            res.send('success');
        } else {
            res.send('Meeting not found');
        }

    } catch (error) {
        console.error('Error finishing meeting:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
