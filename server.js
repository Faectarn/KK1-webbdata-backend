const http = require("http");
const fs = require("fs");
const crypto = require("crypto");

const port = 5000;
const JSONfile = "./todos.json";

let todos = []

const loadTodo = () => {
  fs.readFile(`${JSONfile}`, (err, data) => {
    if (err) throw err;
    todos = JSON.parse(data);
    console.log(todos);
  });
}

const saveTodo = () => {
  fs.writeFile(`${JSONfile}`, JSON.stringify(todos), (err) => {
    if (err) throw err;
  });
}

const app = http.createServer((req, res) => {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET, PATCH, DELETE, OPTIONS, POST, PUT");

  const items = req.url.split("/");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method === "GET") {
    if (items[1] === "todos") {
      if (items[2]) {
        const id = parseInt(items[2]);
        const data = todos.find((todo) => {
          return todo.id === id;
        });
        if (data === undefined) {
          res.statusCode = 404;
          res.end(`${res.statusCode}: ID not found`);
        } else {
          res.setHeader("Content-Type", "application/json");
          res.statusCode = 200;
          res.end(JSON.stringify(data));
        }
      } else {
        res.setHeader("Content-Type", "application/json");
        res.statusCode = 200;
        res.end(JSON.stringify(todos));
      }
    } else {
      res.statusCode = 404;
      res.end(`${res.statusCode}: Page not found`);
    }
  }

  if (req.method === "POST") {
    let rawdata = "";
    let newItem;
    req.on("data", (chunk) => {
      rawdata += chunk
    });
    req.on("end", () => {
      newItem = JSON.parse(rawdata);
      newItem.id = crypto.randomInt(1, 10000);
      newItem.isComplete = false;
      todos.push(newItem);
      res.setHeader("Content-Type", "application/json");
      res.statusCode = 201;
      console.log(`${res.statusCode}: ${newItem.item} added to list`);
      res.end(JSON.stringify(newItem));
      saveTodo();
    });
  }

  if (req.method === "PUT") {
    const todoId = parseInt(items[2]);
    const todoIndex = todos.findIndex((todo) => todo.id === todoId);

    let rawdata = "";
    req.on("data", (chunk) => {
      rawdata += chunk
    });
    req.on("end", () => {
      todos[todoIndex] = JSON.parse(rawdata);
      res.statusCode = 200;
      res.end(JSON.stringify(todos[todoIndex]));
      saveTodo();
    });
  }

  if (req.method === "PATCH") {
    const todoId = parseInt(items[2]);
    const todoIndex = todos.findIndex((todo) => todo.id === todoId);

    let rawdata = ""
    req.on("data", (chunk) => {
      rawdata += chunk
    });
    req.on("end", () => {
      const currentTodo = todos[todoIndex];
      const updatedTodo = JSON.parse(rawdata);
      todos[todoIndex] = { ...currentTodo, ...updatedTodo };
      res.statusCode = 200;
      if (!currentTodo.isComplete) {
        console.log(`${res.statusCode}: ${currentTodo.item} is now completed`);
      } else {
        console.log(`${res.statusCode}: ${currentTodo.item} is not yet completed`);
      }
      res.end(JSON.stringify(todos[todoIndex]));
      saveTodo();
    });
  }

  if (req.method === "DELETE") {
    const todoId = parseInt(items[2]);
    const todoIndex = todos.findIndex((todo) => todo.id === todoId);
    todos.splice(todoIndex, 1);
    res.statusCode = 204;
    console.log(`${res.statusCode}: Task ${todoId} has been deleted`);
    res.end();
    saveTodo();
  }
});

app.listen(port, () => {
  console.log(`Servern lyssnar på port ${port}`);
});

loadTodo();