const socket = io('/chats'); // namespace

const getElementById = (id) => document.getElementById(id) || null;

// get Dom Elements
const helloStrangerEl = getElementById('hello_stranger');
const chattingBoxEl = getElementById('chatting_box');
const chatFormEl = getElementById('chat_form');

// functions
const helloUser = () => {
  const userName = prompt('What is your name?');
  socket.emit('new_user', userName); // emit('event', data)
  console.log(userName);
  socket.on('hello_user', (data) => {
    console.log(data);
  });
};

// init
function init() {
  helloUser();
}

init();
