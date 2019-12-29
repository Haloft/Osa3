const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')


app.use(express.static('build'))
app.use(bodyParser.json())
app.use(cors())


let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-64313122",
        id: 4
    }

]

morgan.token('type', function (req, res) { return [JSON.stringify(req.body)] })
app.use(morgan(':method :url :status  - :response-time ms :type'))
app.get('/api/persons', (request, response) => {
    response.json(persons)
})


app.get('/info', (request, response) => {
  
    response.send(`Phonebook has info for ${persons.length} people
     ${new Date()}`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if(person) {
        response.json(person)
    }else {
        response.status(404).end()
    }
})

const generateId = (max) => {
    const id = Math.floor(Math.random() * Math.floor(max));

    return id
}

app.post('/api/persons', (request, response) => {
   
    const body = request.body
    const exists = persons.find(person => person.name === body.name)

    if(!body.name || !body.number) {
        return response.status(400).json({
            error: 'Name or Number is missing'
        })
    }else if(exists) {
        return response.status(400).json({
            error: 'Name must be unique'
        })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: generateId(355),
    }
    persons = persons.concat(person)

    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
   
        response.status(204).end()
     
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})