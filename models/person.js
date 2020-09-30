const mongoose = require("mongoose");
require("dotenv").config();

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    })
    .then((result) => console.log("connected to MONGODB"))
    .catch((e) => console.log("error connecting:", e));

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 2,
    },
    number: {
        type: Number,
        min: 10000000,
        required: true,
    },
});

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

const Person = mongoose.model("Person", personSchema);

module.exports = { Person };
