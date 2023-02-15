const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

//models
const TodoTask = require("./models/TodoTask");

dotenv.config();

app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: true }));

//connection to db
mongoose.set('strictQuery', false)
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
console.log("Connected to db!");
});

app.listen(3000, () => console.log("Server Up and running"));

app.set("view engine", "ejs");

//SOFTWARE CONCEPT : HTTP METHODS
// GET METHOD
app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        //SOFTWARE CONCEPT : REUSABLE COMPONENTS (RENDERING HTML TEMPLATES)
        res.render("todo.ejs", { todoTasks: tasks });
    });
});

//SOFTWARE CONCEPT : HTTP METHODS
//POST METHOD
//SOFTWARE CONCEPT : ASYNCHRONOUS REQUESTS
app.post("/", async (req, res) => {
    
    const todoTask = new TodoTask({
        content: req.body.content
    });
    //SOFTWARE CONCEPT : ERROR-HANDLING
    try {
        await todoTask.save();
        console.log(req.body);
        res.redirect("/");
    } catch (err) {
        console.log("An error occured. Could not save task.");
        res.redirect("/");
    }
    });

//SOFTWARE CONCEPT : ROUTING
//UPDATE
app.route("/edit/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
        //SOFTWARE CONCEPT : REUSABLE COMPONENTS (RENDERING HTML TEMPLATES)
        res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    });
}).post((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});

//SOFTWARE CONCEPT : ROUTING
//DELETE
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});