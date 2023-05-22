const express = require("express");
const app = express();
const cors = require('cors');

const port = process.env.PORT || 4000;
const pgp = require('pg-promise')(/* options */)
const db = pgp('postgres://db_486database_user:KVIOOYGX8ptKnbB3PcS4AmcFlTvLE00j@dpg-cgs1r71jvhttfm683r20-a.oregon-postgres.render.com/db_486database?ssl=true') 

const top3Course = [{ code: "DT160", cname: "C Programming", description: "C Dummy text for printing" },
{ code: "DT161", cname: "C++ Programming", description: "C++ Dummy text for printing " },
{ code: "DT261", cname: "Data Programming", description: "Data programming Dummy text for printing" }
]

const reservationForm = [{ roomid: 1, reservationday: 29, reservationmonth: 5, reservationyear: 2023, personname: 'Arm' },
{ roomid: 3, reservationday: 29, reservationmonth: 5, reservationyear: 2023, personname: 'May' },
{ roomid: 2, reservationday: 27, reservationmonth: 5, reservationyear: 2023, personname: 'Tony' }]


const freeRoom = [{ roomid: 1, roomcost: 650, package: 'StudioA' },
{ roomid: 2, roomcost: 650, package: 'StudioA' },
{ roomid: 3, roomcost: 650, package: 'StudioA' },
{ roomid: 4, roomcost: 650, package: 'StudioA' },
{ roomid: 5, roomcost: 650, package: 'StudioA' },
{ roomid: 6, roomcost: 650, package: 'StudioB' },
{ roomid: 7, roomcost: 650, package: 'StudioB' },
{ roomid: 8, roomcost: 650, package: 'StudioB' },
{ roomid: 9, roomcost: 650, package: 'StudioB' },
{ roomid: 10, roomcost: 650, package: 'StudioB' },]

const freeRoom2 = [
  { roomid: 2, roomcost: 650, package: 'StudioA' },
  { roomid: 3, roomcost: 650, package: 'StudioA' },
  { roomid: 4, roomcost: 650, package: 'StudioA' },]


const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  }))

app.use(cors({
  origin: '*'
}))


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/', (req, res) => {
  res.send('Post request Hello World!')
})

app.get('/cat', (req, res) => {
  const { color, region } = req.query;
  res.send('We are doing the Cat page for color = ' + color + ' and region = ' + region)
})

app.get('/cat/:subPath', (req, res) => {
  const { subPath } = req.params;
  res.send(`Accept Cat ${subPath} Sub Request.`)
})

app.get('/top23', (req, res) => {
  //Should fetch data 
  res.json({ result: top3Course })
})

app.get('/cat/:subPath/:nextSubPath', (req, res) => {
  const { subPath, nextSubPath } = req.params;
  res.send(`Accept Cat ${subPath} Sub Request. and ${nextSubPath}`)
})

app.get('/students', (req, res) => {
  db.any('select * from public.student')
    .then((data) => {
      console.log('all student: ', data)
      res.json(data)
    })
    .catch((error) => {
      console.log('ERROR:', error)
      res.send("ERROR: can't get data")
    })
})

app.get('/students/:id', (req, res) => {
  const { id } = parseInt(req.params.index) ;
  db.any('select * from public.student where "id" = $1', id)
    .then((data) => {
      console.log('all student: ', data)
      res.json(data)
    })
    .catch((error) => {
      console.log('ERROR:', error)
      res.send("ERROR: can't get data")
    })
})



app.get('/getFreeRoom/:date/:month/:year', (req, res) => {
  //Should fetch data 
  const date =  parseInt(req.params.date) ;  
 
   if ( date=== 1) {
    res.json({ result: freeRoom })
  } else {
    res.json({ result: freeRoom2 })

  }
})
app.post('/student', (req, res) => {
  console.log('Got body:', req.body);
  const { id } = req.body;
  db.any('select * from public.student where "id" = $1', id)
    .then((data) => {
      console.log('DATA:', data)
      res.json(data)
    })
    .catch((error) => {
      console.log('ERROR:', error)
      res.send("ERROR:Can't get data")
    })
});

app.get('/c*', (req, res) => {
  res.send('get in path c*')
})

app.get('*', (req, res) => {
  res.send("I don't know this request")
})

app.listen(port, () => {
  console.log(`My Example app listening on port ${port}`)
})