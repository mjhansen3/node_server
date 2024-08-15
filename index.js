const express = require("express")
const mongoose = require("mongoose")
require('dotenv').config()

const app = express()

const User = require('./schema/user')

//mongodb + srv://<username>:<password>@cluster0.557ib.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_KEY}@cluster0.557ib.mongodb.net/event_finder`

app.use(express.json())
app.use(express.urlencoded({extended: true}))


// CONNECT TO MONGOOSE
mongoose.connect(connectionString)
    .then((res) => {
        if(res) {
            console.log('MongoDB connected successfully')

            // CREATE NEW USER API
            app.post("/api/create_user", async (req, res) => {
                console.log("Result", req.body)

                let data = User(req.body)

                try {
                    let dataStore = await data.save()

                    res.status(200).json(dataStore)
                } catch (e) {
                    res.status(400).json({
                        'status': e.message
                    })
                }

                /*const uData = {
                    "id": userData.length + 1,
                    "email": req.body.email,
                    "password": req.body.password,
                }

                userData.push(uData)
                console.log("Final", uData)

                res.status(200).send({
                    "status_code": 200,
                    "message": "User created successfully",
                    "user": uData
                })*/
            })

            // GET ALL USER API
            // To get a specific user do this in the route:
            // "/api/get_user/:id" then
            // await User.findById(req.params.id)
            app.get("/api/get_user", async (req, res) => {
                try {
                    let data = await User.find()

                    res.status(200).json(data)
                } catch (e) {
                    res.status(500).json(e.message)
                }

                /*if (userData.length > 0) {
                    res.status(200).send({
                        "status_code": 200,
                        "user": userData,
                    });
                } else {
                    res.status(200).send({
                        "status_code": 200,
                        "user": [],
                    });
                }*/
            })

            // UPDATE USER API
            // Patch method updates a specific field in the table
            // Put or Post methods require stating all fields in the table
            app.patch("/api/update_user/:id", async (req, res) => {
                let id = req.params.id
                let updatedUser = req.body
                let options = {new: true}

                try {
                    const userData = await User.findByIdAndUpdate(id, updatedUser, options)

                    res.send(userData)
                } catch (e) {
                    res.send(e.message)
                }
                
                /*let id = req.params.id * 1
                let updateUser = userData.find(u => u.id === id)
                let index = userData.indexOf(updateUser)

                userData[index] = req.body

                res.status(200).send({
                    "status": "Successful",
                    "message": "User updated",
                });*/               
            })

            // DELETE API
            app.delete("/api/delete_user/:id", async (req, res) => {
                let id = req.params.id

                try {
                    const userData = await User.findByIdAndDelete(id)

                    res.json({
                        'status': "Deleted user ${userData.email} successfully"
                    })
                } catch (e) {
                    res.json(e.message)
                }

                /*let id = req.params.id * 1
                let deleteUser = userData.find(u => u.id === id)
                let index = userData.indexOf(deleteUser)

                await deleteUser.splice(index, 1)

                res.status(200).send({
                    "status": "Successful",
                    "message": "User deleted",
                });*/
            })

        } else {
            console.error('MongoDB connection failed for an unknown reason')
        }
    })
    .catch(err => console.error('MongoDB connection error: ', err))

const userData = []

// START SERVER
app.listen(2000, () => {
    console.log('Server connected at 2000')
})