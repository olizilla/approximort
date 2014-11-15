const test = require('tape')
const approx = require('../index.js')
const levelup = require('levelup')

const db = levelup('/does/not/matter', { db: require('memdown'),  valueEncoding: 'json' })

// @see: https://github.com/nodebots/nodebots.io/blob/164ddafc708b024b210fb16d58f2c7b4db3243dc/index.html#L151
const nodebots = [
// lat lng
  {coords:[ 51.49, -0.093], name: "NodeBots of London", url: "http://www.meetup.com/NodeBots-of-London"},
  {coords:[ 40.48, -72.74], name: "NodeBots NYC", url: "http://www.meetup.com/NodeBots-of-London"},
  {coords:[ 30.26, -97.74], name: "NodeBots Austin", url: "http://austinnodebots.com"},
  {coords:[ 6.23, -75.57], name: "NodeBots Medellín", url: "http://nodebotsmed.tumblr.com/"},
  {coords:[ -33.92, 18.42], name: "NodeBots Cape Town", url: "https://twitter.com/nodebotscpt"},
  {coords:[ -27.47, 153.02], name: "NodeBots Brisbane", url: "http://www.eventbrite.com.au/e/brisbanes-international-nodebots-day-tickets-12120977169"},
  {coords:[ 37.77,-122.41], name: "NodeBots SF", url:"http://lanyrd.com/2013/nodebotssf/"},
  {coords:[ 36.85, -76.28], name: "Norfolk.js", url:"http://www.meetup.com/NorfolkJS/events/187172562/"},
  {coords:[ 29.76, -95.36], name: "NodeBots Houston, TX", url:"https://ti.to/houstonjs/nodebotsday"},
  {coords:[ 36.16,-115.13], name: "NodeBotsLas Vegas, MV (Meowada)", url:""},
  {coords:[ 25.78, -80.20], name: "NodeBots Miami/Fort Lauderdale, FL", url:"http://www.meetup.com/NodeJS-Enthusiasts-SE-Florida/events/182676152"},
  {coords:[ 45.52,-122.67], name: "PDXNode, Portland, OR", url:"http://www.pdxnode.org/"},
  {coords:[ 33.44,-112.07], name: "NodeBots Phoenix/Mesa, AZ", url:""},
  {coords:[ 42.35, -71.05], name: "NodeBots Boston", url:"https://ti.to/bocoup/nodebotsday-2014"},
  {coords:[ 38.90, -77.03], name: "NodeBots DC", url:"https://ti.to/nodebots-dc/nodebots-day-2014"},
  {coords:[ 45.42, -75.69], name: "Ottawa.js, ON", url:"https://github.com/ottawajs/nodebots"},
  {coords:[ 15.78, -90.23], name: "NodeBots Guatemala, GT", url:"http://nodebotsgt.tumblr.com/"},
  {coords:[ 4.59, -74.07], name: "NodeBots Bogotá, CO", url:""},
  {coords:[ -23.55, -46.63], name: "NodeBots São Paulo, SP", url:""},
  {coords:[ 19.24, -99.10], name: "NodeBots Distrito Federal, México", url:""},
  {coords:[ 48.85, 2.35], name: "Les NodeBots de Paris", url:"http://www.meetup.com/Nodebots-Paris"},
  {coords:[ -37.81, 144.96], name: "NodeBots Melbourne, Australia", url:"http://www.eventbrite.com.au/e/nodebots-day-melbourne-july-2014-tickets-12121105553"},
  {coords:[ -33.86, 151.20], name: "NodeBots Sydney, Australia", url:"https://ti.to/nbdau/nodebots-sydney-2014"},
  {coords:[ 4.15, -73.63], name: "NodeBots Villavicencio", url:"http://www.meetup.com/VillavicencioJS/"}
]

nodebots.map(function (bot) { db.put(approx(bot.coords), bot) })

var box = approx.box(nodebots[0].coords, 10)

test('find near london', function (t) {
  t.plan(1);

  var results = []

  db.createReadStream({'gte': box[0], lte: box[1], limit:5 })
    .on('data', function (data) {
      results.push(data)
    })
    .on('close', function () {
      var foundParis = results.some(function (data) { return data.value.name === 'Les NodeBots de Paris'})
      t.ok(foundParis,'Les NodeBots de Paris')
    })
});

//console.log('find near:')
//console.log(nodebots[0].coords, nodebots[0].name)
//console.log('results:')
//
//db.createReadStream({'gte': box[0], lte: box[1], limit:5 })
//  .on('data', function (data) {
//    console.log(data.value.coords, /* 'demortified:', approx.revese(data.key),*/ data.value.name)
//  })