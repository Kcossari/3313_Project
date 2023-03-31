const express = require('express');
const db = require('pouchdb')
const games = new db("games")
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const Timer = require('setinterval');
            

app.get('/', (req, res) => {
  res.sendFile(__dirname+'/index.html')
});

app.get('/css', (req, res) => {
  res.sendFile(__dirname+'/cover.css')
});

app.get('/images/rock.png', (req, res) => {
  res.sendFile(__dirname+'/images/rock.png')
});
app.get('/images/paper.png', (req, res) => {
  res.sendFile(__dirname+'/images/paper.png')
});
app.get('/images/scissors.png', (req, res) => {
  res.sendFile(__dirname+'/images/scissors.png')
});


app.get('/api/creategame', (req,res) => {
  var game = {
    "_id": Math.floor(100000 + Math.random() * 900000).toString(),
    "state": "waiting",
    "timeup": false,
    "restart": false,
    player1:{joined: false, played:false, option:"", id:"", playagain: false},
    player2:{joined: false, played:false, option:"", id:"", playagain: false}
  }
  games.put(game).then(() => {
  res.send(JSON.stringify({id: game._id, success: true}))
  }).catch((e) => {
res.send(JSON.stringify({error: e.toString(), success: false}))
  })

})

io.on("connection", (socket) => {
  socket.ingame = false;
  socket.gameid = undefined;
  socket.whichplayer = 0;

  socket.on("join", (gameid) => {
  
    games.get(gameid.toString()).then((game) => {
      if(game.state == "waiting") {
      if(game.player1.joined) {
        if(game.player2.joined) {
                  socket.emit("joinfail", "Unexpected Error.")
        } else {

          game.player2.joined = true;
          game.player2.id = socket.id;
         
          game.state= "started";
          games.put(game).then(() => {


            //actually start the game
            var player1socket = io.sockets.sockets.get(game.player1.id);
          socket.ingame = true;
          socket.gameid = gameid;
          socket.whichplayer = 2;
            player1socket.emit("started")
            socket.emit("started")

var t = new Timer(async () => {}, 100);
  t.setInterval()
  t.on("tick", count => {
games.get(gameid.toString()).then((game) => {
    var time = (10-(count*0.1))
    if(game.state == 'started' && !game.restart) {
                player1socket.emit("timer", time.toFixed(1))
                console.log("timer player1" + time)
            socket.emit("timer", time.toFixed(1))
            
    
            if(time == 0) {
              games.get(gameid.toString()).then((game) => {
                console.log("time up")
              game.timeup = true;
              if(!game.player1.played || !game.player2.played) {
                game.state = "ended";
                if(!game.player1.played && !game.player2.played) {
                  player1socket.emit("timeupend", 0)
                  socket.emit("timeupend", 0)
                } else if(!game.player1.played) {
                  player1socket.emit("timeupend", 1)
                  socket.emit("timeupend", 2)
                } else {
                  player1socket.emit("timeupend", 2)
                  socket.emit("timeupend", 1)
                }
  
              }
             t.clearInterval()
             t = null;
             games.put(game).catch(console.log)
              
              })
            }
    } 
})
  })



          }).catch((e) => {
            socket.emit("joinfail", "Unexpected Error. "+e.toString())
          })
        }
      } else {
        
        game.player1.joined = true;
        game.player1.id = socket.id;
        games.put(game).then(() => {
           socket.ingame = true;
          socket.gameid = gameid;
          socket.whichplayer = 1;
        socket.emit("joinsuccess")
        
        }).catch((e) => {
socket.emit("joinfail", "Unexpected Error. "+e.toString())
        })
      }
      } else {
        socket.emit("joinfail", "Game is full")
      }
    }).catch((e ) => {
      console.log(e)
      socket.emit("joinfail", "Invalid Code ")
    })
  })

  socket.on("choose", (type) => {
      if(socket.ingame) {
      games.get(socket.gameid.toString()).then((game) => {
        if(game.state == "started") {
          
                                 var player1socket = game.player1
                        var player2socket = game.player2
                    var player = (socket.whichplayer==1?player1socket:player2socket)
                    if(player.played) {
socket.emit("choosefail", "Already chosen")

                    } else {
                      if(game.timeup) {
                        socket.emit("choosefail", "Time is up!")
                      } else {
                    if(type == "rock" || type == "scissors" || type == "paper") {
                      player.played = true;
                      player.option = type;
                      if(socket.whichplayer == 1) {
                        game.player1 = player;
                      } else {
                        game.player2 = player;
                      }
                                     if(game.player1.played && game.player2.played) {
                    game.state = "ended";
                                     }
 games.put(game).then(() => {
                  socket.emit("choosesuccess")
                  if(game.player1.played && game.player2.played) {
                  
          
                    //both are played
                    var player1 = game.player1.option
                    var player2 = game.player2.option
          var player1socket = io.sockets.sockets.get(game.player1.id);
          var player2socket = io.sockets.sockets.get(game.player2.id);

                    if(player1 == player2 ) {
                    //tie

          player1socket.emit("result", player1, player2, 0)
          player2socket.emit("result", player2, player1, 0)

                  } else if((player1 == "rock" && player2 == "scissors") || (player1 == "paper" && player2 == "rock") || (player1 == "scissors" && player2 == "paper")) {
                    //player1 wins
          player1socket.emit("result", player1, player2, 2)
          player2socket.emit("result", player2, player1, 1)
                  } else {
                    //player2 wins
          player1socket.emit("result", player1, player2, 1)
          player2socket.emit("result", player2, player1, 2)
                  }
                    
                  }

          }).catch((e) => {
            console.log(e)
socket.emit("choosefail", "Unexpected Error Try again")
          })
                    } else {
                      socket.emit("choosefail", "Invalid option")
                    }
                      }
                    }


                  
        } else {
          socket.emit("choosefail", "Not in correct state to choose")
        }

          // DO END STUFF HERE
        
      }).catch((e) => {
        console.log(e)
        socket.emit("choosefail", "Game not found")
      })
      } else {
        socket.emit("choosefail", "Not in game")
      }
  })
  
  socket.on("playagain", () => {
    console.log("Got playagain")
    if(socket.ingame) {     
      console.log("In game")
      games.get(socket.gameid.toString()).then((game) => {
        console.log("got game")
        console.log(game.state)
        if(game.state == "ended") {
          console.log("State ended")
          var change = false;
          if(socket.whichplayer == 1) {
            console.log("Player 1")
            if(!game.player1.playagain) {
              console.log("Playagain true 1")
              game.player1.playagain = true;
              change = true;
            }
          } else if(socket.whichplayer == 2) {
            console.log("Player 2")
            if(!game.player2.playagain) {
              console.log("Playagain true 2")
              game.player2.playagain = true;
              change = true;
            }
          }
        if(change) {
          console.log("Change")
          game.restart = true;
          
          games.put(game).then(() => {
            games.get(socket.gameid.toString()).then((game) => {
                     var player1socket = io.sockets.sockets.get(game.player1.id);
          var player2socket = io.sockets.sockets.get(game.player2.id);
             if(game.player1.playagain && game.player2.playagain) {
               
            player1socket.emit("playagainstate", 2)
              player2socket.emit("playagainstate", 2)

              game.player1.played = false;
              game.player1.option = "";
              game.player1.playagain = false;

              game.player2.played = false;
              game.player2.option = "";
              game.player2.playagain = false;

              game.state = "started";
              game.timeup = false;

              games.put(game).then(()=> {
                player1socket.emit("started")
                player2socket.emit("started")

//timer stuff playagain
 var count = 0;
 var func = function() {setTimeout(() => {
   count += 1;
    games.get(socket.gameid.toString()).then((game) => {
      if(game.state == "started") {
    var time = (10-(count*0.1))
    if(!game.player1.played) {
                player1socket.emit("timer", time.toFixed(1))
                 console.log("time playe1 "+time)

    }
    if (!game.player2.played) {
            socket.emit("timer", time.toFixed(1))
            console.log("time playe2 " +time)
    }
            if(time == 0) {
              games.get(socket.gameid.toString()).then((game) => {
                console.log("time upy")
              game.timeup = true;
              if(!game.player1.played || !game.player2.played) {
                game.state = "ended";
                if(!game.player1.played && !game.player2.played) {
                  player1socket.emit("timeupend", 0)
                  socket.emit("timeupend", 0)
                } else if(!game.player1.played) {
                  player1socket.emit("timeupend", 1)
                  socket.emit("timeupend", 2)
                } else {
                  player1socket.emit("timeupend", 2)
                  socket.emit("timeupend", 1)
                }
  
              }

             games.put(game).catch(console.log)
              })
            } else {
              func();
            }
            
      }
    })
  
 }, 100)

 }
  func();

              }).catch(console.log)
             } else if(game.player1.playagain || game.player2.playagain) {
             player1socket.emit("playagainstate", 1)
              player2socket.emit("playagainstate", 1)
            }
          })
          }).catch(console.log)
        }
        }
     })
    }
  })


  socket.on('disconnect', () => {
    if(socket.ingame) {
      games.get(socket.gameid.toString()).then((game) => {
          game.state = "ended";
          games.put(game).then(() => {
                        var player1socket = io.sockets.sockets.get(game.player1.id);
                        var player2socket = io.sockets.sockets.get(game.player2.id);
                    (socket.whichplayer==1?player2socket:player1socket).emit("ended")
          }).catch(() => {

          })
          // DO END STUFF HERE
        
      }).catch((e) => {
        //idk
      })
    }
  });
})

server.listen(3000, () => {
  console.log('server started');
});