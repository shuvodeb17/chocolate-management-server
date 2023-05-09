const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
require('dotenv').config()
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.b0yctrm.mongodb.net/?retryWrites=true&w=majority`;

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


        const chocolateCollection = client.db('chocolateDB').collection('chocolateManagement')

        app.get('/chocolates', async (req, res) => {
            const cursor = chocolateCollection.find();
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/chocolate/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await chocolateCollection.findOne(query)
            res.send(result)
        })

        app.put('/chocolate/:id', async (req, res) => {
            const id = req.params.id;
            const chocolate = req.body;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updateChocolate = {
                $set: {
                    photo: chocolate.photo,
                    name: chocolate.name,
                    country: chocolate.country,
                    category: chocolate.category
                }
            }
            const result = await chocolateCollection.updateOne(filter, updateChocolate, options)
            res.send(result)
        })

        app.post('/chocolates', async (req, res) => {
            const chocolates = req.body;
            const result = await chocolateCollection.insertOne(chocolates)
            res.send(result)
            console.log(result);
        })

        app.delete('/chocolate/:id', async (req,res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await chocolateCollection.deleteOne(query)
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
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Chocolate server is running on PORT ${port}`)
})
