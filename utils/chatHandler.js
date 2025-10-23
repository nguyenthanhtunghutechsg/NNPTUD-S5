var { Server } = require('socket.io')
let userSchema = require('../schemas/users');
let meessageSchema = require('../schemas/messages')
let jwt = require('jsonwebtoken')



module.exports = {
    createServerSocket: function (server) {
        let io = new Server(server);
        io.on('connection', async (socket) => {
            let token = socket.handshake.auth.token;
            let uid = jwt.decode(token)._id;
            socket.join(uid);
            let user = await userSchema.findById(uid);
            socket.emit('welcome', {
                uid: uid,
                username: user.username
            })
            socket.on('chat', async (data) => {
                console.log(data);
                let newMess = new meessageSchema({
                    from:data.from,
                    to:data.to,
                    text:data.text
                })
                await newMess.save();
                io.to(data.to).emit("newMessage");
                io.to(data.from).emit("newMessage");
            })
        });
    }
}