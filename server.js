const express = require('express')
const {mongodb, MongoClient, ObjectId } = require('mongodb')


const app = express()

let db
let connectionString = 'mongodb://localhost:27017/todo-app'
MongoClient.connect(connectionString, {useNewUrlParser: true}, function(err, client){
  db = client.db()
  app.listen(3000, () => {
        console.log("Server running on port 3000")
      })
    })
// async function go() {
//   const client = new MongoClient('mongodb://localhost:27017/todo-app')
// await client.connect()
//   db = client.db()
//   app.listen(3000, () => {
//     console.log("Server running on port 3000")
//   })
// }

// go()




app.use(express.json()) // tells express to take async requests and include in body object
app.use(express.urlencoded({extended: false})) // Tells express to takes submitted form data and add it to body object
app.use(express.static('public'))

app.get('/', function(req, res) {
  db.collection('items').find().toArray(function (err, items){

    console.log(items)


  res.send(`<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple To-Do App</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
  </head>
  <body>
    <div class="container">
      <h1 class="display-4 text-center py-1">To-Do App</h1>
      
      <div class="jumbotron p-3 shadow-sm">
        <form id="create-form" action="/create-item" method="POST">
          <div class="d-flex align-items-center">
            <input id="create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
            <button class="btn btn-primary">Add New Item</button>
          </div>
        </form>
      </div>
      
      <ul id="item-list" class="list-group pb-5">

      </ul>
      
    </div>

    <script>
      let items = ${JSON.stringify(items)}
    </script>
    <script src="https://unpkg.com/axios@1.1.2/dist/axios.min.js"></script>
    <script src="/browser.js"></script>
  </body>
  </html>`)
  })
})

app.post('/create-item', function(req, res) {
  console.log(req.body)

  db.collection('items').insertOne({text: req.body.text}, function (err, info) {     // insertOne returns acknowledged anf insertedId
  console.log("info from sercer")
    
    console.log(info)
    res.json({_id: info.insertedId, text: req.body.text})
  })
})

app.post('/update-item', function(req, res){
  console.log(req.body)
  db.collection('items').findOneAndUpdate({_id: new ObjectId(req.body.id)}, {$set: {text: req.body.text}}, function(err, doc) {
    if (err) {console.log(err)}
    res.send("Success")
  })
})

app.post('/delete-item', function(req, res) {
  console.log(req.body)

  db.collection('items').deleteOne({_id: new ObjectId(req.body.id)}, function() {
    res.send("Success")
  })
})

