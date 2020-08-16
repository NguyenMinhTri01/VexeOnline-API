const express = require('express');
const mongoose = require('mongoose');
const config = require('./config')

const mongoUri = process.env.MONGO_URI || config.mongoUri 
mongoose.connect(mongoUri,{
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("connect mongodb ok");
})
const app = express();


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
  res.header("Access-Control-Allow-Methods", "GET", "POST", "PUT", "DELETE", "PATCH");
  next();
});

app.use(express.json());
app.use("/api/stations", require("./routes/api/controllers/stations"));
app.use("/api/trips", require("./routes/api/controllers/trips"));
app.use("/api/users", require("./routes/api/controllers/users"));
app.use("/api/tickets", require("./routes/api/controllers/tickets"));

app.use('/uploads', express.static("./uploads"));

// app.get('/api/stations', stations.getStations);
// app.get('/api/stations/:id', stations.getStationsById);
// app.post('/api/stations', stations.postStations);
// app.put('/api/stations/:id', stations.putStationById);
// app.patch('/api/stations/:id', stations.patchStationById);
// app.delete('/api/stations/:id', stations.deleteStationsById);
const port = process.env.PORT || config.port 
app.listen(port, ()=> {
  console.log(`app is running is port ${port}`);
});