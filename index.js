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
app.get('/', (req, res) => {
  console.log("working");
  res.send("working");
})
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
                    
                  socket.on('chat', (msg) => {
                    console.log(msg)
                    io.to(local_users_db[msg.receiver_email]).emit('chat',msg);
                    io.to(local_users_db[msg.sender_email]).emit('chat',msg);
                  
                    const convo_key=`${msg.sender_email}->${msg.receiver_email}`
                    if(convo_key in local_chat_db){
                      local_chat_db[convo_key].push(msg)
                    }
                    else{
                      local_chat_db[convo_key]=[msg];
                    }
                    const convo_key1=`${msg.receiver_email}->${msg.sender_email}`
                    if(convo_key1 in local_chat_db){
                      local_chat_db[convo_key1].push(msg)
                    }
                    else{
                      local_chat_db[convo_key1]=[msg];
                    }
                    console.log(local_chat_db)
                    // io.emit('chat', msg);
                  });
                  socket.on("setusers",(data)=>{
                    local_users_db[data.email]=data.id;
                    console.log(local_users_db)
                  })
                  socket.on("contact",(msg)=>{
                    console.log("oncontact");
                    console.log("contact",msg);
                    const convo_key=`${msg.sender_email}->${msg.receiver_email}`
                    const conversation=convo_key in local_chat_db?local_chat_db[convo_key]:[];
                    io.to(local_users_db[msg.sender_email]).emit('convo',conversation);
                  
                  })
});

server.listen(3001, () => {
  console.log('listening on *:3000');
});