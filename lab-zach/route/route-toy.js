'use strict'

const debug = require('debug')('http:route-toy')
const Toy = require('../model/toy')
const storage = require('../lib/storage')

module.exports = function(router) {
  router.post('/api/toy', (req, res) => {
    debug('/api/toy POST')
    try {
      let newToy = new Toy(req.body.name, req.body.desc)
      // if successful, store this thing in memory using the storage module
      storage.create('toy', newToy)
      .then(toy => {
        res.writeHead(201, {'Content-Type': 'application/json'})
        res.write(JSON.stringify(toy))
        res.end()
      })
    } catch(e) {
      console.error(e)
      res.writeHead(400, {'Content-Type': 'text/plain'})
      res.write('bad request: could not create a new toy')
      res.end()
    }
  })

  router.get('/api/toy', (req, res) => {
    debug('/api/toy GET')
    if(req.url.query._id) {
      storage.fetchOne('toy', req.url.query._id)
      .then(toy => {
        res.writeHead(200, {'Content-Type': 'application/json'})
        res.write(JSON.stringify(toy))
        res.end()
      })
      .catch(err => {
        console.error(err)
        res.writeHead(400, {'Content-Type': 'text/plain'})
        res.write('bad request; could not find record')
        res.end()
      })
      return
    }

    res.writeHead(400, {'Content-Type': 'text/plain'})
    res.write('bad request; item id required to get record')
    res.end()
  })

  router.put('api/toy', (req, res) => {
    debug('/api/toy PUT')
    try {
      if(req.url.query._id) {
      let putToy = new Toy(req.body.name, req.body.desc)
        storage.fetchOne(req.url.query._id)
        storage.create('toy', putToy)
        .then(toy => {
          res.writeHead(204, {'Content-Type' : 'application/json'})
          res.write(JSON.stringify(toy))
          res.end()
        })
      }
    } catch(e) {
      console.error(e)
      res.writeHead(400, {'Content-Type' : 'text/plain'})
      res.write('bad request : no request item body included')
      res.end()
    }
  })

  router.delete('api/toy', (req, res) => {
    debug('/api/toy DELETE')
    try { storage.fetchOne(toy, req.url.query.id)
      .then(toy => {
        res.writeHead(204, 'valid source id, its deleted')
        res.delete(memory[toy][req.url.query.id])
        res.end()
      })
    }
    catch(e) {
      console.error(e)
      res.writeHead(400, {'Content-Type' : 'application/json'})
      res.write('bad request : no source id provided')
    }
  })
}
