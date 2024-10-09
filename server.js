const express = require("express")
const mysql = require('mysql2')
const dotenv = require('dotenv')

const app = express()
dotenv.config();

//middeware to parse json
app.use(express.json());

//connecting to the mysql database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

//testing the connection
db.connect((err) =>{
    if(err){
        console.error("Error connecting to the database", err.message);
        return;
    }
    console.log("Connected to the MySql database");
})

//QUESTION 1 - GET endpoint for patients
app.get('/patients', (req,res) =>{
    const getPatients = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';

    db.query(getPatients, (err, results) =>{
        if(err){
            res.status(500).json({"error" : err.message});
        }
        res.status(200).send(results)
    })
    
})

//QUESTION 2 - GET endpoint for providers
app.get('/providers', (req,res) =>{
    const getProviders = 'SELECT first_name, last_name, provider_specialty FROM providers';

    db.query(getProviders, (err, results) =>{
        if(err){
            res.status(500).json({"error" : err.message});
        }
        res.status(200).send(results)
    })
    
})

//QUESTION 3 - To filter firstname
app.get('/filter', (req,res) =>{
    
    const filter = 'SELECT * FROM patients ORDER BY first_name';

    db.query(filter, (err, results) =>{
        if(err){
            res.status(500).json({"error" : err.message});
        }
        if (results.length === 0) {
            return res.status(404).json({ "message": "No patients found." });
        }
        res.status(200).json(results)
    })
    
})

//QUESTION 4 - GET endpoint to retrieve all providers by their specialty
app.get('/specialty', (req,res) =>{
    const providerSpecialty = 'SELECT provider_specialty, COUNT(*) AS num_of_providers  FROM providers GROUP BY provider_specialty';

    db.query(providerSpecialty, (err, results) =>{
        if(err){
            res.status(500).json({"error" : err.message});
        }
        res.status(200).send(results)
    })
    
})



// listen to the server
const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)

})