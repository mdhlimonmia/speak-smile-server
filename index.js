const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

//middleware
const corsConfig = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
    // methods: ['GET', 'POST', 'PUT', 'DELETE']
  };
  app.use(cors(corsConfig));
  app.options("*", cors(corsConfig));
  // app.use(cors())
  app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pk85uor.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    const coursesCollection = client.db("spSmileDB").collection("courses");
    const instructorsCollection = client.db("spSmileDB").collection("instructors");
    const usersCollection = client.db("spSmileDB").collection("users");
  
    //get all courses
    app.get("/courses", async (req, res) => {
      const courses = coursesCollection.find();
      const result = await courses.toArray();
      res.send(result);
    });

    //get all instructor
    app.get("/instructors", async (req, res) => {
      const instructors = instructorsCollection.find();
      const result = await instructors.toArray();
      res.send(result);
    });

    //get all user
    app.get("/users", async (req, res) => {
      const users = usersCollection.find();
      const result = await users.toArray();
      res.send(result);
    });
    
    //Post new course
    app.post("/courses", async(req, res) => {
      const course = req.body;
      // console.log(course);
      const result = await coursesCollection.insertOne(course);
      res.send(result);
    })

     //users
     app.post('/users', async (req, res) => {
      const user = req.body;
      // console.log(user);
      const query = { email: user.email }
      const existingUser = await usersCollection.findOne(query);

      if (existingUser) {
        return res.send({ message: 'user already exists' })
      }

      const result = await usersCollection.insertOne(user);
      res.send(result);
    });
   
    //update user status 
    app.patch("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const data= req.body
      const updateUser = {$set: data };
      // console.log(query, data);
      const result = await usersCollection.updateOne(query, updateUser)
      res.send(result);
    });

    //update courses status 
    app.patch("/courses/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const data= req.body
      const updateCourses = {$set: data };
      // console.log(query, data);
      const result = await coursesCollection.updateOne(query, updateCourses)
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Speak Smile is Running......");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
