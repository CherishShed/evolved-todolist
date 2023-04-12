const bodyParser = require("body-parser");
const express = require("express");
const mysql = require("mysql");
const app = express();
const con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "todolist"
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    const tasks = [];
    con.connect((err) => {
        if (err) throw err;
        console.log("Connected");
        var stmt = 'select taskId, task, time from taskData';
        con.query(stmt, (err, result) => {
            if (err) throw err;
            tasks.push(...result);
            if (tasks.length === 0) {
                var taskcount = 0
            }
            else {
                var taskcount = tasks.length;
            }

            res.render("index", { root: __dirname, tasks, taskcount })
        })
    })
})
app.post("/", (req, res) => {
    var taskDet = req.body.taskDets;
    var timeToDo = new Date(req.body.time).toISOString();
    timeToDo = timeToDo.replace(/T|\.000Z/g, " ");
    timeToDo = timeToDo.trim();
    var stmt = `INSERT INTO taskData (task, time) VALUES ('${taskDet}', '${timeToDo}')`;
    con.query(stmt, (err, result) => {
        if (err) throw err;
    })
    res.redirect("/");
})


app.delete("/:id", (req, res) => {
    const idToDelete = req.params.id;
    console.log(idToDelete)
        // Execute the DELETE query on the database
        ;
    con.query(`DELETE FROM taskData WHERE taskId = ${idToDelete}`, (error, results, fields) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error deleting record from database');
        } else {
            res.status(200).send(`Record with ID ${idToDelete} deleted successfully`);
        }
    });
})

app.listen(8081, () => {
    console.log("Server has started at port 8081")
})

