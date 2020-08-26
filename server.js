const express = require('express');
const mongoose = require('mongoose');
const config = require('./config')

const mongoUri = process.env.MONGO_URI || config.mongoUri
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("connect mongodb ok");
  })
const app = express();


// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, token"
//   );
//   res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH");
//   next();
// });

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
  "Access-Control-Allow-Headers",
  "Authorization, X-Mashape-Authorization, Origin, X-Requested-With, Content-Type, Accept, token"
  );
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH");
  next();
});


app.use(express.json());
app.use("/api/stations", require("./routes/api/controllers/stations"));
app.use("/api/trips", require("./routes/api/controllers/trips"));
app.use("/api/users", require("./routes/api/controllers/users"));
app.use("/api/tickets", require("./routes/api/controllers/tickets"));
app.use("/api/blogs", require("./routes/api/controllers/blogs"));
app.use("/api/contacts", require("./routes/api/controllers/contacts"));
app.use("/api/pagestatics", require("./routes/api/controllers/pageStatics"));
app.use("/api/vehicles", require("./routes/api/controllers/vehicles"));

app.use('/uploads', express.static("./uploads"));
const port = process.env.PORT || config.port
app.listen(port, () => {
  console.log(`app is running is port ${port}`);
});