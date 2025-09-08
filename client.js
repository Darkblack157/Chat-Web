const usernameInput = document.getElementById('username');
const generateBtn = document.getElementById('generate');
const connectCodeInput = document.getElementById('connect-code');
const connectBtn = document.getElementById('connect');
const info = document.getElementById('info');
const chat = document.getElementById('chat');
const messageInput = document.getElementById('message');
const sendBtn = document.getElementById('send');
const qrCodeDiv = document.getElementById('qrCode');

let username, myPairing, peerCode;
let ws = new WebSocket('ws://localhost:8081');

ws.onopen = () => console.log('WS conectado');

ws.onmessage = (event) => {
  let msg;
  try { msg = JSON.parse(event.data); } catch{return;}

  if(msg.type === 'pairingCode') {
    myPairing = msg.code;
    info.textContent = `Seu Pairing Code: ${msg.code}`;
  } else if(msg.type === 'connected') {
    peerCode = msg.peer;
    info.textContent = `Conectado com ${msg.peer}`;
    messageInput.disabled = false;
    sendBtn.disabled = false;
  } else if(msg.type === 'message') {
    addMessage(msg.user, msg.text, msg.user === username ? 'self' : 'other');
  } else if(msg.type === 'qr') {
    qrCodeDiv.innerHTML = '';
    new QRCode(qrCodeDiv, { text: msg.qr, width: 200, height: 200 });
  }
};

function sendMessage(){
  const text = messageInput.value.trim();
  if(!text || !peerCode) return;
  ws.send(JSON.stringify({ action:'message', from:myPairing, to:peerCode, text, user:username }));
  addMessage('Você', text, 'self');
  messageInput.value = '';
}

function addMessage(user, text, type){
  const div = document.createElement('div');
  div.classList.add('message', type);
  div.textContent = `${user}: ${text}`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', e => { if(e.key==='Enter') sendMessage(); });

generateBtn.addEventListener('click', () => {
  username = usernameInput.value.trim();
  if(!username) return alert('Digite seu nome!');
  ws.send(JSON.stringify({ action:'generatePairing', user:username }));
});

connectBtn.addEventListener('click', () => {
  const code = connectCodeInput.value.trim();
  if(!code || !myPairing) return alert('Digite os códigos!');
  ws.send(JSON.stringify({ action:'pair', myCode:myPairing, code }));
});