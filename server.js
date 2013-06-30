var io = require('socket.io').listen(8000);

io.static.add('app.js', {file: 'app.js'});
io.static.add('index.html', {file: 'index.html', mime: {
        type: 'text/html',
        encoding: 'utf8',
        gzip: true
}});
io.static.add('texts.txt', {file: 'texts.txt', mime: {type: "text/plain"}});
io.static.add('js/jquery.js', {file: 'js/jquery.js'});
io.static.add('js/underscore.js', {file: 'js/underscore.js'});
io.static.add('js/backbone.js', {file: 'js/backbone.js'});

var clients = {};
var documentString = "String from server";

io.sockets.on('connection', function (socket) {
        clients[socket.id] = {socket: socket};
        socket.emit('serverUpdate', { title: documentString })

        socket.on('disconnect', function(socket) {
            delete clients[socket.id];
        });

        socket.on('clientUpdate', function (data) {
            console.log(data);
            documentString = data["title"];

            for(var client in clients) {
                    if(client != socket.id) {
                        clients[client].socket.emit('serverUpdate', { title: documentString });
                    }
            }
        });
});
