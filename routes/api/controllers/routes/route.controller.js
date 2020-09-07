const { Route } = require('../../../../models/Route');
const _ = require('lodash');
// const { route } = require('../trips');
// const router = require('../vehicles');

// const getRoutes = (req, res, next) => {
//     // Route.find()
//     // .then(routes=>{
//     //     res.status(200).json(routes)
//     // })
//     Route.find()
//     .populate({
//         path: "fromStationId",
//         select: 'name -_id'
//     })
//     .populate({
//         path: "toStationId",
//         select: 'name -_id'
//     })
//     .then(routes => {
//         const _routes = routes.map(route => {
//             return _.chain(route)
//                     .get('_doc')
//                     .omit(['fromStationId', 'toStationId'])
//                     .assign({
//                         fromStationName: route.fromStationId.name,
//                         toStationName: route.toStationId.name
//                     })
//                     .value()
//         })
//         res.status(200).json(_routes)
//     }).catch(err => {
//         res.status(500).json(err)
//     })
// }
const getRoutes = (req, res, next) => {
    Route.find()
        .populate({
            path: "fromStationId",
            select: 'name -_id'
        })
        .populate({
            path: "toStationId",
            select: 'name -_id'
        })
        .then(routes => {
            const _routes = routes.map(route => {
                return _.chain(route)
                    .get('_doc')
                    .omit(['fromStationId', 'toStationId'])
                    .assign({
                        fromStationName: route.fromStationId.name,
                        toStationName: route.toStationId.name
                    })
                    .value()
                })
            res.status(200).json(_routes)
        }).catch(err => {
            res.status(500).json(err)
        })
}
const getRouteHot = (req,res,next) => {
    Route.find({hot:true,status:true})
    .limit(5)
    .sort({createdAt:1})
    .then(routes=>{
        res.status(200).json(routes)
    })
    .catch(err => {
        res.status(500).json(err)
    })
}
const postRoutes = (req, res, next) => {
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
            if (!route) return new Promise.reject({
                status: 404,
                message: "Route not found"
            });
            const keys = ['name', 'fromStationId', 'toStationId', 'policy', 'time', 'titleSeo', 'descriptionSeo', 'keywordSeo']
            keys.forEach(key => {
                route[key] = req.body[key]
            })
            return route.save()
        })
        .then(route => res.status(200).json(route))
        .catch(err => res.status(500).json(err));
};


const deleteRouteById = (req, res, next) => {
    const { id } = req.params;
    let _route;
    Route.findById(id)
        .then(route => {
            _route = route;
            if (!route) return Promise.reject({
                status: 404,
                message: "route not found"
            })
            return route.deleteOne({ _id: id })
        })
        .then(() => res.status(200).json(_route))
        .catch(err => res.status(500).json(err))
}

const getStatusById = (req, res, next) => {
    const { id } = req.params;
    let fromStationName = '';
    let toStationName = '';
    Route.findById(id)
        .populate({
            path: "fromStationId",
            select: 'name -_id'
        })
        .populate({
            path: "toStationId",
            select: 'name -_id'
        })
        .then(route => {
            if (!route) return Promise.reject({
                status: 404,
                message: "route not found"
            })
            route["status"] = !route["status"];
            fromStationName = route.fromStationId.name;
            toStationName = route.toStationId.name;
            return route.save();
        })
        .then(route => {
            const _route = _.chain(route)
                .get("_doc")
                .omit(['fromStationId', 'toStationId'])
                .assign({
                    fromStationName,
                    toStationName
                })
                .value()
            res.status(200).json(_route)
        })
        .catch(err => res.status(500).json(err))
}

const getHotById = (req, res, next) => {
    const { id } = req.params;
    let fromStationName = '';
    let toStationName = '';
    Route.findById(id)
        .populate({
            path: "fromStationId",
            select: 'name -_id'
        })
        .populate({
            path: "toStationId",
            select: 'name -_id'
        })
        .then(route => {
            if (!route) return Promise.reject({
                status: 404,
                message: "route not found"
            })
            route["hot"] = !route["hot"];
            fromStationName = route.fromStationId.name;
            toStationName = route.toStationId.name;
            return route.save();
        })
        .then(route => {
            const _route = _.chain(route)
                .get("_doc")
                .omit(['fromStationId', 'toStationId'])
                .assign({
                    fromStationName,
                    toStationName
                })
                .value()
            res.status(200).json(_route)
        })
        .catch(err => res.status(500).json(err))

}
module.exports = {
    getRoutes, postRoutes, putRouteById, getHotById, getStatusById, deleteRouteById, getRouteById,getRouteHot
}