const { Route } = require('../../../../models/Route');
const _ = require('lodash');

const getRoutes = (req,res,next) => {
    Route.find()
    .populate({
        path:"fromStationId",
        select: 'name -_id'
    })
    .populate({
        path:"toStationId",
        select: 'name -_id'
    })
    .then(routes=>{
        const _routes = routes.map(route=>{
            return _.chain(route)
            .get('_doc')
            .omit(['fromStationId','toStationId'])
            .assign({
                fromStation: route.fromStationId.name,
                toStation: route.toStationId.name,
            })
            .value()
        })
        res.status(200).json(_routes)
    }).catch(err=>{
        res.status(500).json(err)
    })
}

const postRoutes = (req,res,next) => {
    const newRoute = new Route(req.body);
    newRoute.save()
    .then(route => res.status(200).json(route))
    .catch(err => res.status(500).json(err));
}

const getRouteById = (req, res, next) => {
    const { id } = req.params;
    Route.findById(id)
      .then(route => res.status(200).json(route))
      .catch(err => res.status(500).json(err));
  };

  const putRouteById = (req, res, next) => {
    const { id } = req.params;
    Route.findById(id)
    .then((route) => {
      if(!route) return new Promise.reject({
        status: 404,
        message: "Route not found"
      });
      const keys = ['name', 'fromStationId', 'toStationId', 'policy', 'time','titleSeo','descriptionSeo', 'keywordSeo']
      keys.forEach(key=>{
        route[key] = req.body[key]
      })
      return route.save()
    })
    .then(route => res.status(200).json(route))
    .catch(err => res.status(500).json(err));
  };
  

  const deleteRouteById = (req,res,next) => {
    const {id} = req.params;
    let _route;
    Route.findById(id)
    .then(route=>{
        _route = route;
        if(!route) return Promise.reject({
            status: 404,
            message: "route not found"
        })
        return route.deleteOne({_id:id})
    })
    .then(()=>res.status(200).json(_route))
    .catch(err=>res.status(500).json(err))
}

const getStatusById = (req,res,next) => {
    const {id} = req.params;
    Route.findById(id)
    .then(route=>{
        if(!route) return Promise.reject({
            status: 404,
            message: "route not found"
        })
        route["status"] = !route["status"];
        return route.save();
    })
    .then(route=>res.status(200).json(route))
    .catch(err=>res.status(500).json(err))


}

const getHotById = (req,res,next) => {
    const {id} = req.params;
    Route.findById(id)
    .then(route=>{
        if(!route) return Promise.reject({
            status: 404,
            message: "route not found"
        })
        route["hot"] = !route["hot"];
        return route.save()
    })
    .then(route=>res.status(200).json(route))
    .catch(err=>res.status(500).json(err))
}
module.exports = {
    getRoutes,postRoutes,putRouteById,getHotById,getStatusById,deleteRouteById,getRouteById
}