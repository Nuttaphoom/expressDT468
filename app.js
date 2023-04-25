const express = require("express");
const app = express() ; 
const port = process.env.PORT || 3000 ;

app.get('/', (req,res) =>  {
    res.send('Hello World1!!')
}) 
app.listen(port,()=> {
    console.log('My Example app listening on port ${port}')
})

