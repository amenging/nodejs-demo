var io = require('socket.io')(),
		users = [];
    // io.set('reconnection delay',50000);

io.on('connection', function (socket) {
	socket.on('testEvent',function(msg, username){
		socket.broadcast.emit('newMsg', msg, username);
	});
	socket.on('get_userList',function(username){
		if(users.indexOf(username) == -1){
      socket.username = username;
			users.push(username);
      socket.userIndex = users.indexOf(username);
      console.log("新增用户索引：" + socket.userIndex, 
        "新增用户名：" + socket.username,
        "所有用户：" + users);
		}else{
      console.log('存在');
    }
    ///////////////////////////////////////////////
    // io.sockets.emit('login_logout',username,'进入聊天室');
    io.sockets.emit('post_userList',users);
		console.log(users + "of post_userList");
		
	});
	socket.on('disconnect',function(){
    users.splice(socket.userIndex, 1, ''); //通过用户索引删除离线用户并插入空字符串
                                           //防止出现删错用户的情况
                                           //存在问题:数组出现多个空值
    socket.broadcast.emit('logout', users);
    // socket.broadcast.emit('login_logout',socket.username,'退出聊天室');
	});
});
// io.sockets.on('connection', function(socket) {
//		 //new user login
//		 socket.on('login', function(nickname) {
//				 if (users.indexOf(nickname) > -1) {
//						 socket.emit('nickExisted');
//				 } else {
//						 socket.userIndex = users.length;
//						 socket.nickname = nickname;
//						 users.push(nickname);
//						 socket.emit('loginSuccess');
//						 io.sockets.emit('system', nickname, users.length, 'login');
//				 };
//		 });
//		 //user leaves
//		 socket.on('disconnect', function() {
//				 users.splice(socket.userIndex, 1);
//				 socket.broadcast.emit('system', socket.nickname, users.length, 'logout');
//		 });
//		 //new message get
//		 socket.on('postMsg', function(msg, color) {
//				 socket.broadcast.emit('newMsg', socket.nickname, msg, color);
//		 });
//		 //new image get
//		 socket.on('img', function(imgData, color) {
//				 socket.broadcast.emit('newImg', socket.nickname, imgData, color);
//		 });
// });
exports.listen = function (_server) {
		return io.listen(_server);
};