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
  const { id } = parseInt(req.params.index);
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

app.get('/getReservedRoom/:date/:month/:year', (req, res) => {
  const d = parseInt(req.params.date)
  const m = parseInt(req.params.month)
  const y = parseInt(req.params.year)

  db.any(`SELECT * FROM room 
  LEFT JOIN reservationform ON room.roomid = reservationform.reservationroomid 
  AND( reservationform.reservationday = ${d} AND reservationform.reservationmonth = ${m} AND reservationform.reservationyear = ${y}) 
  WHERE reservationform.reservationroomid IS NOT NULL;`)    .then((data) => {
      res.json(data)
    })
    .catch((error) => {
      console.log('ERROR:', error)
      res.send("ERROR: can't get data")
    })
})
app.get('/getServices/:packageName', (req, res) => {
  const packageName = req.params.packageName  ;  

  db.any('select * from roomservices where package = $1',packageName)
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
  const d = parseInt(req.params.date)
  const m = parseInt(req.params.month)
  const y = parseInt(req.params.year)

  
  db.any(`SELECT * FROM room 
  LEFT JOIN reservationform ON room.roomid = reservationform.reservationroomid 
  AND( reservationform.reservationday = ${d} AND reservationform.reservationmonth = ${m} AND reservationform.reservationyear = ${y}) 
  WHERE reservationform.reservationroomid IS NULL;`)
    .then((data) => {
      console.log('DATA:', data)
      res.json(data)
    })
    .catch((error) => {
      console.log('ERROR:', error)
      res.send("ERROR:Can't get data")
    })
     
    /*
  //Should fetch data 
  const date = parseInt(req.params.date);
  if (date === 1) {
    res.json({ result: freeRoom })
  } else {
    res.json({ result: freeRoom2 })

  }*/
})

app.get('/getAdminKey', (req, res) => {

  db.any(`SELECT * FROM resortadminid`) 

    .then((data) => {
      console.log('DATA:', data)
      res.json(data)
    })
    .catch((error) => {
      console.log('ERROR:', error)
      res.send("ERROR:Can't get data")
    })
 
})

app.get('/getReservedRoomFromReservationData/:date/:month/:year/:roomid', (req, res) => {
  const d = parseInt(req.params.date)
  const m = parseInt(req.params.month)
  const y = parseInt(req.params.year)
  const roomid = parseInt(req.params.roomid) 

  db.any(`SELECT * from reservationform where reservationroomid = ${roomid} and reservationday = ${d} and reservationmonth = ${m} and reservationyear = ${y}`) 

    .then((data) => {
      console.log('DATA:', data)
      res.json(data)
    })
    .catch((error) => {
      console.log('ERROR:', error)
      res.send("ERROR:Can't get data")
    })
 
})

app.get('/removeReservation/:date/:month/:year/:roomid', (req, res) => {
  const d = parseInt(req.params.date)
  const m = parseInt(req.params.month)
  const y = parseInt(req.params.year)
  const roomid = parseInt(req.params.roomid) 
  
  db.none(`DELETE from reservationform where reservationroomid = ${roomid} and reservationday = ${d} and reservationmonth = ${m} and reservationyear = ${y}`) 

    .then((data) => {
      console.log('DATA:', data)
      res.json(data)
    })
    .catch((error) => {
      console.log('ERROR:', error)
      res.send("ERROR:Can't get data")
    })
 
})


app.get('/reserve/:date/:month/:year/:personname/:personid/:personphone/:roomid', (req, res) => {
  const d = parseInt(req.params.date)
  const m = parseInt(req.params.month)
  const y = parseInt(req.params.year)
  const na = (req.params.personname)
  const id = parseInt(req.params.roomid) 
  const phone = parseInt(req.params.personphone) 
  const personID = parseInt(req.params.personid)  


  db.none(`INSERT INTO reservationform (reservationday,reservationmonth, reservationyear, personname, reservationroomid) 
  VALUES ($1,$2,$3,$4,$5)`, [d, m, y, na, id])

  db.none(`INSERT INTO person (personname,idcard,phonenumber)
  VALUES ($1,$2,$3)`, [na, personID,phone])

    .then((data) => {
      console.log('DATA:', data)
      res.json(data)
    })
    .catch((error) => {
      console.log('ERROR:', error)
      res.send("ERROR:Can't get data")
    })
  //Should fetch data 
  /*const date = parseInt(req.params.date);

  if (date === 1) {
    res.json({ result: freeRoom })
  } else {
    res.json({ result: freeRoom2 })

  }*/
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
