const port = 5000
const { response, request } = require('express')
const uuid = require('uuid')
const bodyParser = require('body-parser')

const express = require('express')

const app = express()
app.use(bodyParser.json())


const arrayOrder = []

const typeRequisition = (request, response, next) => {
    console.log(request.method)
    console.log(request.url)
  
    next()
  }

const checkOrderId = (request, response, next) => {
    const { id } = request.params

    const index = arrayOrder.findIndex(user => user.id === id)
    
    if (index < 0) {
        return response.status(404).json({ message: "order not found"})
    }

    request.userIndex = index
    request.userId = id

    next()
}

// app.use(checkOrderId)

app.get('/orders', typeRequisition, (request, response) => {

    return response.status(200).json(arrayOrder)
  })


app.post('/orders', typeRequisition, (request, response) => {
    const { name, order, price } = request.body

    const orderClient = { id:uuid.v4(), name, order, price, "status": "Em preparação" }

    arrayOrder.push(orderClient)

    return response.status(201).json(orderClient)
})

app.put('/orders/:id', checkOrderId, typeRequisition, (request, response) => {
    const {name, order, price } = request.body
    const index = request.userIndex
    const id = request.userId

    const upDateOrder = { id, name, order, price, "status": "Em preparação" }

    arrayOrder[index] = upDateOrder
    console.log(index)

    return response.json(upDateOrder)
})

app.delete('/orders/:id', checkOrderId, typeRequisition, (request, response) => {
    const index = request.userIndex

    arrayOrder.splice(index, 1)

    return response.status(202).json({ message: "Pedido cancelado"})
})


app.patch('/orders/:id', checkOrderId, typeRequisition, (request, response) => {

    const index = request.userIndex

    arrayOrder[index].status = "Pronto"

    return response.status(200).json(arrayOrder[index])
})

app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}`)
})