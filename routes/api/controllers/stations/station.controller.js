const { Station } = require('../../../../models/Station');
const _ = require('lodash');

const getStations = (req, res, next) => {
  Station.find()
    .then((stations) => {
      res.status(200).json(stations);
    })
    .catch((err) => {
      res.status(500).json(err);
    })
};

const postStations = (req, res, next) => {
  const newStation = new Station(req.body);
  newStation.save()
    .then(station => {
      res.status(200).json(station);
    })
    .catch(err => res.status(500).json(err));
};

const getStationsById = (req, res, next) => {
  const { id } = req.params;
  Station.findById(id)
    .then(station => res.status(200).json(station))
    .catch(err => res.status(500).json(err));
};

const putStationById = (req, res, next) => {
  const { id } = req.params;
  Station.findById(id)
  .then((station) => {
    if(!station) return new Promise.reject({
      status: 404,
      message: "Station not found"
    });
    const keys = ['name', 'address', 'province', 'titleSeo', 'descriptionSeo', 'keywordSeo']
    keys.forEach(key=>{
      station[key] = req.body[key]
    })
    return station.save()
  })
  .then(station => res.status(200).json(station))
  .catch(err => res.status(500).json(err));
};

const patchStationById = (req, res, next) => {
  const { id } = req.params;
  Station.findById(id)
  .then((station) => {
    if(!station) return new Promise.reject({
      status: 404,
      message: "Station not found"
    });
    Object.keys(req.body).forEach( key => {
      station[key] = req.body[key];
    })
    // const { name, address, province } = req.body;
    // station.name = name || station.name;
    // station.address = address ? address : station.address;
    // if(province) station.province = province;
    return station.save()
  })
  .then(station => {res.status(200).json(station)})
  .catch(err => res.status(500).json(err));
};


const deleteStationsById = (req, res, next) => {
  const { id } = req.params;
  Station.deleteOne({_id : id})
  .then(station => {
    if (station.deletedCount == 0) return res.status(404).json({
      status: 404,
      message: "Station not found"
    })
    return res.status(200).json(station);
  })
  .catch(err => res.status(500).json(err));
};


const updateStationStatus = (req, res, next) => {
  const { id } = req.params;
  Station.findById(id)
  .then (station => {
    station.status = !station.status;
    return station.save()
  })
  .then(station => res.status(200).json(station))
  .catch(err => res.status(500).json(err));
}


const updateStationHot = (req, res, next) => {
  const { id } = req.params;
  Station.findById(id)
  .then (station => {
    station.hot = !station.hot;
    return station.save()
  })
  .then(station => res.status(200).json(station))
  .catch(err => res.status(500).json(err));
}

module.exports = {
  getStations,
  postStations,
  getStationsById,
  putStationById,
  patchStationById,
  deleteStationsById,
  updateStationStatus,
  updateStationHot
}