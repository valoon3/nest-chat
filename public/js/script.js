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
    drawMessage(`me : ${message}`);
    e.target.elements[0].value = '';
  }
};

// functions
function helloUser() {
  const userName = prompt('What is your name?');
  socket.emit('new_user', userName, (data) => {
    console.log(data);
    drawHelloStranger(data);
  }); // emit('event', data, callback)
}

function drawHelloStranger(username) {
  helloStrangerEl.innerText = `Hello ${username}!`;
}

const drawMessage = (message, isMe = false) => {
  const wrapperChatBox = document.createElement('div');
  wrapperChatBox.className = 'clearfix';
  let chatBox;
  if (!isMe)
    chatBox = `
    <div class='bg-gray-300 w-3/4 mx-4 my-2 p-2 rounded-lg clearfix break-all'>
      ${message}
    </div>
    `;
  else
    chatBox = `
    <div class='bg-white w-3/4 ml-auto mr-4 my-2 p-2 rounded-lg clearfix break-all'>
      ${message}
    </div>
    `;

  wrapperChatBox.innerHTML = chatBox;
  chattingBoxEl.append(wrapperChatBox);
};

// global socket handler
socket.on('user_connected', (data) => {
  console.log(`${data} connected`);
  drawMessage(`${data} connected!`, true);
});

socket.on('hello_user', (data) => {
  console.log(data);
  drawHelloStranger(data);
});

socket.on('new_chat', (res) => {
  const { message, username } = res;
  drawMessage(`${username} : ${message}`, true);
});

socket.on('disconnected_user', (username) =>
  drawMessage(`${username} bye .....`, true),
);

// init
function init() {
  helloUser();
  // 이벤트 연결
  chatFormEl.addEventListener('submit', handleSubmit);
}

init();
