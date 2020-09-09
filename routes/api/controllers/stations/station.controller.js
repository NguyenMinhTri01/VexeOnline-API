const { Station } = require('../../../../models/Station');
const { uploadImageToCloudinary, removeImageFromCloudinary } = require('../../../../middlewares/uploadImageToCloudinary');



const getStations = (req, res, next) => {
  Station.find()
    .then((stations) => {
      res.status(200).json(stations);
    })
    .catch((err) => {
      res.status(500).json(err);
    })
};

const postStation = (req, res, next) => {
  const newStation = new Station(req.body);
  newStation.save()
    .then(station => {
      res.status(200).json(station);
    })
    .catch(err => res.status(500).json(err));
};

const getStationById = (req, res, next) => {
  const { id } = req.params;
  Station.findById(id)
    .then(station => res.status(200).json(station))
    .catch(err => res.status(500).json(err));
};

const putStationById = (req, res, next) => {
  const { id } = req.params;
  Station.findById(id)
    .then((station) => {
      if (!station) return new Promise.reject({
        status: 404,
        message: "Station not found"
      });
      const keys = ['name', 'address', 'province', 'titleSeo', 'descriptionSeo', 'keywordSeo']
      keys.forEach(key => {
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
      if (!station) return new Promise.reject({
        status: 404,
        message: "Station not found"
      });
      Object.keys(req.body).forEach(key => {
        station[key] = req.body[key];
      })
      // const { name, address, province } = req.body;
      // station.name = name || station.name;
      // station.address = address ? address : station.address;
      // if(province) station.province = province;
      return station.save()
    })
    .then(station => { res.status(200).json(station) })
    .catch(err => res.status(500).json(err));
};


const deleteStationById = (req, res, next) => {
  const { id } = req.params;
  Station.findById(id)
    .then(async station => {
      if (!station) return res.status(404).json({
        status: 404,
        message: "Station not found"
      })
      if (station.avatar && station.avatar != 'VexeOnlineMedia/imageDefault/no-image_ljozla') {
        await removeImageFromCloudinary(station.avatar);
      }
      return Station.deleteOne({ _id: id })
    })
    .then(result => {
      if (result.deletedCount == 0) return res.status(404).json({
        status: 404,
        message: "Station not found"
      })
      return res.status(200).json(result);
    })
    .catch(err => res.status(500).json(err));
};


const updateStationStatus = (req, res, next) => {
  const { id } = req.params;
  Station.findById(id)
    .then(station => {
      if (!station) return new Promise.reject({
        status: 404,
        message: "Station not found"
      });
      station.status = !station.status;
      return station.save()
    })
    .then(station => res.status(200).json(station))
    .catch(err => res.status(500).json(err));
}


const updateStationHot = (req, res, next) => {
  const { id } = req.params;
  Station.findById(id)
    .then(station => {
      if (!station) return new Promise.reject({
        status: 404,
        message: "Station not found"
      });
      station.hot = !station.hot;
      return station.save()
    })
    .then(station => res.status(200).json(station))
    .catch(err => res.status(500).json(err));
};

const uploadAvatar = (req, res, next) => {
  const { id } = req.params;
  let station
  Station.findById(id)
    .then(_station => {
      if (!_station) return new Promise.reject({
        status: 404,
        message: "Station not found"
      });
      station = _station;
      return uploadImageToCloudinary(req.file.path, 'station/avatar');
    })
    .then(async result => {
      if (station.avatar && station.avatar != 'VexeOnlineMedia/imageDefault/no-image_ljozla') {
        await removeImageFromCloudinary(station.avatar);
      }
      station.avatar = result.public_id
      return station.save()
    })
    .then(station => res.status(200).json(station))
    .catch(err => res.status(500).json(err));
};

const getStationsHot = (req, res, next) => {
  Station.find({hot : true, status : true})
  .then (stations => res.status(200).json(stations))
  .catch(err => res.status(500).json(err))
}

module.exports = {
  getStations,
  postStation,
  getStationById,
  putStationById,
  patchStationById,
  deleteStationById,
  updateStationStatus,
  updateStationHot,
  uploadAvatar,
  getStationsHot
}