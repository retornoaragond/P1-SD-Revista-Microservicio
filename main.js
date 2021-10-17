// main.js
const fs = require('fs')
const express = require('express')

const app = express()
app.use(express.json())
const port = process.env.PORT || 8085
let revistas = []

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Content-Type', 'application/json');
    next();
});

const loadRevistas = () => {
    fs.readFile(__dirname + '/' + 'revistas.json', 'utf8', (err, data) => {
        revistas = JSON.parse(data)
    });
}
loadRevistas()

const saveRevistas = () => {
    let data = JSON.stringify(revistas)
    fs.writeFileSync(__dirname + '/' + 'revistas.json', data)
}

app.get('/revista', (req, res) => {
    res.json(revistas);
})

app.get('/revista/:id', (req, res) => {
    let revista = revistas.find(i => i.id == req.params.id);
    if (revista == undefined)
        res.status(404).send('Revista not found');
    else
        res.json(revista);
})

app.get('/revistaass', (req, res) => {
    let com = [];
    for (let c of revistas) {
        if (c.ilustrador_id === '' || c.ilustrador_id === 0 || c.ilustrador_id === '0' || c.ilustrador_id === "0") {
            com.push(c);
        } else {
            res.send('We dont have comics to assign');
        }
    }
    res.json(com);
})

app.post('/revista', (req, res) => {
    let index = revistas.findIndex(i => i.id == req.body.id);
    if (index != -1)
        res.status(404).send('Revista already exits');
    else {
        revistas.push(req.body);
        saveRevistas();
    }
    res.status(200).send('Revista added');
})

app.put('/revista/:id', (req, res) => {
    let index = revistas.findIndex(i => i.id == req.params.id);
    if (index == -1)
        res.status(404).send('Revista not found');
    else {
        revistas[index] = req.body;
        saveRevistas();
    }
    res.status(200).send('Revista updated');
})

app.post('/revista/delete/:id', (req, res) => {
    let index = revistas.findIndex(i => i.id == req.params.id);
    if (index == -1)
        res.status(404).send('Revista not found');
    else {
        revistas = revistas.filter(i => i.id != req.params.id);
        saveRevistas();
    }
    res.status(200).send('Revista deleted');
})

app.listen(port, () =>
    console.log(`Revistas Server listening on port ${port}`)
)