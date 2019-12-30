require('dotenv').config()
const Person = require('./models/person')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(bodyParser.json())

app.use(cors())


let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1
  } ,
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-64313122',
    id: 4
  }

]
app.use(express.static('build'))


morgan.token('type', function (req, res) { return [JSON.stringify(req.body)] })
app.use(morgan(':method :url :status  - :response-time ms :type'))


app.get('/api/persons', (request, response) => {
  Person.find({}).then(ppl => {
    response.json(ppl.map(p => p.toJSON()))
  })
})

app.get('/info', (request, response) => {
  Person.find({}).then(ppl => {
    response.send(`Phonebook has info for ${ppl.length} people
     ${new Date()}`)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person.toJSON())
      } else {
        response.status(404).end()
      }

    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = { number: body.number, }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})



app.post('/api/persons', (request, response, next) => {

  const body = request.body
  const exists = persons.find(person => person.name === body.name)

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Name or Number is missing'
    })
  } else if (exists) {
    return response.status(400).json({
      error: 'Name must be unique'
    })
  }
  const person = new Person({
    name: body.name,
    number: body.number,

  })
  person.save().then(savedPerson => {
    response.json(savedPerson.toJSON())
  })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  }else if(error.name === 'ValidationError') {
    return response.status(400).json({ error : error.message })
  }

  next(error)
}

app.use(errorHandler)



const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})