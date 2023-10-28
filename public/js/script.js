const socket = io('/chats'); // namespace

const getElementById = (id) => document.getElementById(id) || null;

// get Dom Elements
const helloStrangerEl = getElementById('hello_stranger');
const chattingBoxEl = getElementById('chatting_box');
const chatFormEl = getElementById('chat_form');

// functions
function helloUser() {
  const userName = prompt('What is your name?');
  socket.emit('new_user', userName, (data) => {
    console.log(data);
  }); // emit('event', data, callback)
}

function drawHelloStranger(username) {
  helloStrangerEl.innerText = `Hello ${username}!`;
}

// global socket handler
socket.on('user_connected', (data) => {
  console.log(`${data} connected`);
});

socket.on('hello_user', (data) => {
  console.log(data);
  drawHelloStranger(data);
});

// init
function init() {
  helloUser();
}

init();
