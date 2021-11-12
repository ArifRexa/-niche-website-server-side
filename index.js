const express = require('express')
const app = express()
const cors = require('cors');
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h6t6k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try {
    await client.connect();
    const database = client.db("kbo-watch");
    const watchesCollection = database.collection("watches")
    const ordersCollection = database.collection("orders")
    const usersCollection = database.collection("users")

    app.get("/watches", async (req, res) => {
      const cursor = watchesCollection.find({});
      const watches = await cursor.toArray();
      res.json(watches)
    })

    app.get("/watches/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await watchesCollection.findOne(query);
      res.json(result)
    })

    app.post("/watches", async (req, res) => {
      const watch = req.body;
      const result = await watchesCollection.insertOne(watch);
      console.log(watch);
      res.json(result);
    })

    app.delete("/watches/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await watchesCollection.deleteOne(query);
      res.json(result)
    })



    app.get("/orders", async (req, res) => {
      const cursor = ordersCollection.find({});
      const order = await cursor.toArray();
      res.json(order)
    })

    app.get("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.findOne(query);
      res.json(result)
    })


    app.put("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const updateStatus = req.body;
      const filter = { _id: ObjectId(id) }
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: `Shifted`

        }

      };
      const result = await ordersCollection.updateOne(filter, updateDoc, options)
      // console.log("updating user",req);
      res.json(result)
    })


    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.json(result)
    })



    // app.get("/orders", async (req, res) => {
    //   const email = req.query.email;
    //   const query = {email: email}
    //   console.log(query);
    //   const cursor = ordersCollection.find(query);
    //   const orders = await cursor.toArray();
    //   res.json(orders)
    // })




    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order);
      console.log(order);
      res.json(result);
    })




    // app.post("/users", async (req, res) => {
    //   const user = req.body;
    //   const result = await usersCollection.insertOne(user);
    //   console.log(order);
    //   res.json(result);
    // })



    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { Email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    })

    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      console.log("put", user);
      const filter = { Email: user.email };
      const updateDoc = { $set: { role: 'admin' } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    })

    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { Email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === 'admin') {
        isAdmin = true;

      }
      res.json({ admin: isAdmin })
    })



  }
  finally {
    // await client.close();
  }

}
run().catch(console.dir)


app.get('/', (req, res) => {
  res.send('Welcome to watches world')
})

app.listen(port, () => {
  console.log(`listening at ${port}`)
})