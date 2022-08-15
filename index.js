const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
var cors = require('cors')
app.use(cors())

app.use(express.json());

const local_users_db={}
const local_chat_db={}
// const { Server } = require("socket.io");

// const io = new Server(server);
const io = require('socket.io')(server, {cors: {origin: "*"}});

//start
app.post('/contact', (req, res) => {
console.log(req.body);
res.send(JSON.stringify({a:"j"}))
});
app.post('/adduser', (req, res) => {
  console.log(req.body);
  res.send(JSON.stringify({a:"j"}))
  });
  
//end
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
                    console.log('user disconnected');
                  });
                  io.to(socket.id).emit('getdata',socket.id);
                    
                  socket.on('chat', (msg) => {
                    console.log(msg)
                    io.emit('chat', msg);
                  });
                  socket.on("setusers",(data)=>{
                    local_users_db[data.email]=data.id;
                    console.log(local_users_db)
                  })
});

server.listen(3001, () => {
  console.log('listening on *:3000');
});