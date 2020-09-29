const { request, response } = require("express");
require('dotenv').config()
const express = require("express");
const _ = require("underscore");
const app = express();
const morgan = require("morgan")
const cors = require('cors')
const mongoose = require("mongoose");
const {Person} = require("./models/person")

app.use(express.json());
app.use(cors())
app.use(express.static('build'))


morgan.token('data', req=>{
    if(req.body){
        return JSON.stringify(req.body)
    }
    
})


app.use(morgan(":method :url :response-time :data"))


app.get("/api/persons", (request, response) => {
    
    Person.find({}).then( persons => response.json(persons) )

});

app.get("/info", (request, response) => {
    Person.find({}).then(data=>{
        response.send(`Phonebook has info about ${data.length} people
    <br><br>
    ${new Date()}`);
    })
    
});

app.get("/api/persons/:id", (request, response) => {
    let id = request.params.id;
    Person.findById(id).then(single => {
    if (single) {
        response.json(single);
    } else {
        response.status(404).send("404 not found").end();
    }
    })
    
});

app.delete("/api/persons/:id", (request, response, next) => {

    Person.findByIdAndDelete(request.params.id).then(()=>{
        response.status(204).send("deleted").end()
    })
    .catch(err=>next(err))

});

app.put("/api/persons/:id", (request, response, next) => {
    let person = request.body;
    Person.findByIdAndUpdate(request.params.id, person, {new:true})
    .then(data=>{
        response.json(data)
    })
    .catch(e=>next(e))
})

app.post("/api/persons", (request, response) => {
    let newPerson = request.body;

    Person.find({}).then(data=>{
        if (data.find((p) => p.name == newPerson.name)) {
            response.json({ error: "name must be unique" });
        } else if (!newPerson.number) {
            response.json({ error: "number must be filled" });
        } else {
            let personToSave = new Person(newPerson)
            personToSave.save().then(data=>{
                response.status(201).json(data);
            })
            
        }
    })


});


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log("server running on port:",PORT)
});




