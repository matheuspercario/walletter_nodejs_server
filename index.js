const express = require('express');
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {res.send('Hello world')});

/*
  Servidor propriamente dito
*/

const transactions = [
    {id: 0, value: "R$ 1000,00", date : "25/05/2021", description : "Salário Bosch", category : "income"},
    {id: 1, value: "R$ 500,00", date : "26/05/2021", description : "Presente vô", category : "income"},
    {id: 2, title: "R$ 50,00", date : "26/05/2021", description : "Game Steam", category : "expense"}
]

const endpoint = "/transactions";

app.get(endpoint, (req, res) => {
    res.send(transactions.filter(Boolean));
});

app.get(`${endpoint}/:id`, (req, res) => {
    const id = req.params.id;
    const transaction = transactions[id];

    if (!transaction){
        res.send("{}");
    } else {
        res.send(transaction);
    }   
});

app.post(endpoint, (req, res) => {
    const transaction = {
        id : transactions.length,
        value : req.body["value"],
        date : req.body["date"],
        description : req.body["description"],
        category : req.body["category"],
    };
    transactions.push(transaction);
    res.send("1");

    // Notificar todos
    notify();
});

app.put(`${endpoint}/:id`, (req, res) => {
    const id = parseInt(req.params.id);
    const transaction = {
        id : id,
        value : req.body["value"],
        date : req.body["date"],
        description : req.body["description"],
        category : req.body["category"],
    };

    transactions[id] = transaction;
    res.send("1");

    // Notificar todos
    notify();
});

app.delete(`${endpoint}/:id`, (req, res) => {
    const id = req.params.id;
    delete transactions[id];
    res.send("1");

    // Notificar todos
    notify();
});



/**
 * Criar um socket para notificar usuários das mudanças
 */

const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Comunicação
const INVALIDATE = 'invalidate';

function notify(){
    io.sockets.emit(INVALIDATE, 1);
}

server.listen(process.env.PORT || 3000);
