const { request, response } = require("express");
const express = require("express");
const _ = require("underscore");
const app = express();
const morgan = require("morgan")
const cors = require('cors')

app.use(express.json());
app.use(cors())
app.use(express.static('build'))


morgan.token('number', req=>{
    return req.body.number
})
morgan.token('pName', req=>{
    return req.body.name
})

app.use(morgan(":method :url :response-time {\"name\":\":pName\",\"number\":\":number\"}"))
let persons = [
    {
        name: "sa",
        number: "32",
        id: 2,
    },
    {
        name: "pjpj",
        number: "32110",
        id: 3,
    },
    {
        name: "sa32",
        number: "213123",
        id: 4,
    },
    {
        name: "dwe",
        number: "54",
        id: 5,
    },
];

app.get("/api/persons", (request, response) => {
    response.json(persons);
});

app.get("/info", (request, response) => {
    response.send(`Phonebook has info about ${persons.length} people
    <br><br>
    ${new Date()}`);
});

app.get("/api/persons/:id", (request, response) => {
    let id = request.params.id;
    let person = persons.find((p) => p.id == id);
    if (person) {
        response.json(person);
    } else {
        response.status(404).send("404 not found").end();
    }
});

app.delete("/api/persons/:id", (request, response) => {
    let newPersons = persons.filter((p) => p.id != Number(request.params.id));
    if (_.isEqual(persons, newPersons)) {
        response.send("id is not correct");
    } else {
        response.status(204).send("data was deleted").end();
    }
});

app.post("/api/persons", (request, response) => {
    let newPerson = request.body;

    if (persons.find((p) => p.name == newPerson.name)) {
        response.json({ error: "name must be unique" });
    } else if (!newPerson.number) {
        response.json({ error: "number must be filled" });
    } else {
        let id = Math.random() * 1000000000000;
        newPerson.id = id;
        persons.push(newPerson);
        response.status(201).json(newPerson);
    }
});


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log("server running on port:",PORT)
});
