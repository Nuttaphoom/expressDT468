const express = require("express");
const app = express() ; 
const port = process.env.PORT || 3000 ;

const pgp = require('pg-promise')(/* options */)
const db = pgp('postgres://db_486database_user:KVIOOYGX8ptKnbB3PcS4AmcFlTvLE00j@dpg-cgs1r71jvhttfm683r20-a/db_486database')

const bodyParser = require('body-parser')
app.use(bodyParser.json()) 
app.use(
    bodyParser.urlencoded({
        extended : true,
    })
)

app.get('/', (req,res) =>  {
    res.send('Hello World1!!')
}) 

app.get('/students',(req,res) => {
    const {id} = req.params ;
    db.any('select * from public.student where "id" = $1',id)
    .then ((data) => {
        console.log('all student: ' , data)
        res.json(data)   
    })
    .catch((error) => {
        console.log('ERROR',error) 
        res.send("ERROR: Can't get the dataa")
    })
})

app.post('/student',(req,res) => {
    console.log('got body: ', req.body);
    const {id} = req.body ; 
    db.any('select * from public.student where "id" = $1',id)
        .then((data) => { 
            console.log('DATA',data) 
            res.json(data) 
        }) 
        .catch((error) => {
            console.log('ERROR:',error) 
            res.send("ERROR: Can't get data") 
        })
});

app.get('/cat', (req,res) =>  {
    const {color,region} = req.query;
    res.send('Cat page : color = '+color+' and region : ' + region)
}) 

app.get('/c+x', (req,res) =>  {
    res.send('get in path c+x')
}) 
app.listen(port,()=> {
    console.log('My Example app listening on port ${port}')
})

