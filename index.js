// @NOTE
// Config.json is liable to not stick around. This is just a placeholder for certain values.
const config        = require(__dirname+'/config.json');

const express       = require('express');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
const Database      = require(config.database);
var httpServer      = require('http').createServer;
const { isRegExp }  = require('util');
var utils = {
  startPacket       : require('./utils/startpacket.js'),
  playerCreator     : require('./utils/playercreator.js'),
  taskmanager       : require('./utils/taskmgr.js'),
  adRemover         : require('./utils/adRemover.js')
}
var players = {
  "1": utils.playerCreator('Server','IN-PROGRESS',5,6969,"Welcome to the S0urce.io Private Server 0.1 Alpha!",69)
};

var socketlist = {};

const app = express();
app.use(cookieParser());

server = httpServer(app);

var io = require('socket.io')(server)

app.get('/', (req, res) => {
  res.sendFile(__dirname+"/client/index.html");
});

io.on('connection',(socket) => {
  var pkgEmit = pkgEmitCreate(socket);
  socket.on('signIn',(data) => {
    var name = data.name;
    socket.player = {
      name: name,
      rank: 0,
      level: 1,
      comms: {
        first: ".........",
        second: "........."
      }
    }
    socketlist[name] = socket;
    
    addPlayer(utils.playerCreator(
      name,
      socket.id,
      socket.player.rank,
      socket.player.level,
      "",
      Object.keys(players).length,
      [socket.player.comms.first, socket.player.comms.second]
    ), socket.id)

    socket.emit('prepareClient',socket.id);
    utils.startPacket(socket);
  })
  socket.on('disconnect',() => {
    delete socketlist[socket.id];
    delete players[socket.id];
  })
  const firewall_ports = {
    0: 'A',
    1: 'B',
    2: 'C'
  };
  socket.on('playerRequest',(data) => {
    console.log(data);
    switch (data.task) {
      case 666: // restart
        socket.player = {
          name: name,
          rank: 0,
          level: 1,
          comms: {
            first: ".........",
            second: "........."
          }
        }
        socketlist[name] = socket;
    
        addPlayer(utils.playerCreator(
          name,
          socket.id,
          socket.player.rank,
          socket.player.level,
          "",
          Object.keys(players).length,
          [socket.player.comms.first, socket.player.comms.second]
        ), socket.id)
        break;
      case 300:
        console.log("talking (case 300)");
        break;
      case 100:
        port = firewall_ports[data.port];
        console.log("player with id " + socket.id + " hacking player with id " + data.id + " on port " + port);
        socket.emit()
        ///////////////////////////////////////////////help what do i need to input to socket.emit
        break;
      case 103:
        console.log("player with id " + socket.id + " is trying to buy something with id " + data.id)
        break;
      case 102:
        port = firewall_ports[data.fid];
        console.log("something shall be upgraded (thing " + data.id + ")at port " + port);
        break;
      case 777: // eg {"task":777,"word":"left"}
        console.log("check word typed in cdm for player with id: " + socket.id)
        break;
      case 300: // send message eg {"task":300,"id":"player-id","message":"hi"}
        break;
    }
  })
})

setInterval(() => {
  for (var item in socketlist) {
    socket = socketlist[item]
    displayPlayers(socket);
  }
},4000)

function displayPlayers(socket) {
  socket.emit('mainPackage',{
    unique: [
      {
        task: 2008,
        data: Object.entries(players).map((x,y) => {return x[1]}),
        topFive: [
          utils.playerCreator('Server','IN-PROGRESS',5,6969,"Welcome to the S0urce.io Private Server 0.1 Alpha!",69)
        ]
      }
    ]
  })
}

function addPlayer(data,id) {
  players[id] = data;
}

function pkgEmitCreate(socket) {
  return function pkgEmit(...data) {
    socket.emit( { unique: data } )
  }
}


// some crazy stuff going on with MIME so i changed the position
// Okay... what from? What was happening? -Vlad
app.use('/client',express.static(__dirname+"/client"));
app.use('/ads', utils.adRemover);

server.listen(config.network.port, config.network.hostname, function() 
{
  console.log(`Server listening at http://${config.network.hostname}:${config.network.port}/`);
});
