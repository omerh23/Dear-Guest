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
    // const { id } = req.body; // Destructure 'id' from request body
    // const {institution} = req.body;
    // console.log(institution);
    // console.log(id);
    // const database = client.db(institution);
    // const users = database.collection('users');
    // const user = await users.findOne({userId: id});
    // console.log("user ",user);
    // if(user){
        return res.send('success')
   // }
    // else{
    //     res.send('failed')
    // }

});

// app.post('/institutionList', async (req, res) => {
//     try {
//
//         const database = client.db('admin1'); // Ensure this is the correct database name
//         const institutions = database.collection('institutions');
//
//         const institutionList = await institutions.findOne({ _id: new ObjectId('65b3692bf645ea35996bbc12') });
//         //console.log("Institution List: ", institutionList.list);
//
//         res.send(institutionList.list);
//     } catch (error) {
//         console.error("Error fetching institutions: ", error);
//         res.status(500).send("Error fetching institutions");
//     }
// });



app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
