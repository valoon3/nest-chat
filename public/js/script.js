const socket = io('/chats'); // namespace

const getElementById = (id) => document.getElementById(id) || null;

// get Dom Elements
const helloStrangerEl = getElementById('hello_stranger');
const chattingBoxEl = getElementById('chatting_box');
const chatFormEl = getElementById('chat_form');

// event callback function
const handleSubmit = (e) => {
  e.preventDefault();
  const message = e.target.elements[0].value;
  if (message.length) {
    socket.emit('send_message', message);
    // 화면에다가 그리기
    drawMessage(message);
    e.target.elements[0].value = '';
  }
};

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

const drawMessage = (message) => {
  const wrapperChatBox = document.createElement('div');
  const chatBox = `
  <div>
    ${message}
  </div>
  `;

  wrapperChatBox.innerHTML = chatBox;
  chattingBoxEl.append(wrapperChatBox);
};

// global socket handler
socket.on('user_connected', (data) => {
  console.log(`${data} connected`);
});

socket.on('hello_user', (data) => {
  console.log(data);
  drawHelloStranger(data);
});

socket.on('new_chat', (res) => {
  const { message, username } = res;
  // console.log(message, username);
  drawMessage(message);
});

// init
function init() {
  // helloUser();
  // 이벤트 연결
  chatFormEl.addEventListener('submit', handleSubmit);
}

init();
