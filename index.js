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

con.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + con.threadId);
});

// Handle the error event to catch any connection errors
con.on('error', (err) => {
    console.error('MySQL error: ' + err.message);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Attempting to reconnect to MySQL...');
        con.connect();
    }
});
app.get("/", (req, res) => {
    const tasks = [];

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

