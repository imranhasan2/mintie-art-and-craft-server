const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bhkveen.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();


        const userCollection = client.db('userDB').collection('user')

        const craftCollection = client.db('craftDB').collection('craft')
        const userItemCollection = client.db('userItem').collection('item')

        app.post('/user', async (req, res) => {
            const user = req.body
            const result = await userCollection.insertOne(user)
            res.send(result)
        })

        app.get('/art/:email', async (req, res) => {
            const email = req.params.email;

            const query = { email: req.params.email }
            const result = await userItemCollection.find(query).toArray()

            res.send(result)

        })

        app.get('/artView/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await userItemCollection.findOne(query)
            res.send(result)
        })

        app.post('/item', async (req, res) => {
            const userItem = req.body
            const result = await userItemCollection.insertOne(userItem)

            res.send(result)
        })


        app.get('/my/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: req.params.email }
            const result = await userItemCollection.find(query).toArray()

            res.send(result)
        })


        app.delete('/my/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: req.params.email }
            const result = await userItemCollection.deleteOne(query)
            res.send(result);
        })
        



        app.get('/craft', async (req, res) => {
            const cursor = craftCollection.find()
            const result = await cursor.toArray()
            res.send(result)

        })

        app.get('/craft/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await craftCollection.findOne(query)
            res.send(result)
        })





        app.post('/craft', async (req, res) => {
            const craft = req.body
            console.log(craft)
            const result = await craftCollection.insertOne(craft)
            res.send(result)


        })







        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('art and craft server is running')
})

app.listen(port, () => {
    console.log(`art and craft is running on port: ${port}`)
})