const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://pradhu:pradhu1005@cluster0.y1olsku.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err))

const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
})
const Expense = mongoose.model("Expense", expenseSchema)

app.post('/addExpense', insertExpense)
app.get('/getExpenses', getExpense)
app.delete('/deleteExpense/:id', deleteExpense)
app.put('/updateExpense/:id', updateExpense)   

async function insertExpense(req, res) {
  try {
    const newExpense = new Expense(req.body)
    await newExpense.save()
    res.send("Expense Added")
  } catch (error) {
    res.status(500).send("Error in adding expense")
  }
}

async function getExpense(req, res) {
  try {
    const expenses = await Expense.find()
    res.send(expenses)
  } catch (error) {
    res.status(500).send("Error in fetching expenses")
  }
}

async function deleteExpense(req, res) {
  try {
    const { id } = req.params
    await Expense.findByIdAndDelete(id)
    res.send("Expense Deleted")
  } catch (error) {
    res.status(500).send("Error in deleting expense")
  }
}

async function updateExpense(req, res) {
  try {
    const { id } = req.params
    const { title, amount } = req.body
    await Expense.findByIdAndUpdate(id, { title, amount }, { new: true })
    res.send("Expense Updated")
  } catch (error) {
    res.status(500).send("Error in updating expense")
  }
}

app.listen(3000, () => console.log("Server running on port 3000"))
