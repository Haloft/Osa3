const mongoose = require('mongoose')




if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]



const url =
  `mongodb+srv://fullstakkaaja:${password}@cluster0-iyovd.mongodb.net/puhelinluettelo-app?retryWrites=true&w=majority`

mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,

})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
})

if(process.argv.length === 3) {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(ppl => {

      console.log(`${ppl.name} ${ppl.number}`)
    })
    mongoose.connection.close()
  })
}else if(process.argv.length> 3) {
  person.save().then(response => {
    console.log(`added ${person.name} number ${person.number} to phonebook `)
    mongoose.connection.close()
  })
}


