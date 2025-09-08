// server.js
const express = require('express');
const http = require('http');
const app = express()
const fs = require('fs');
const path = require('path');
const { NebulaWebSocket, criarPairing } = require('nebuladrop'); 
const server = http.createServer(app);
const ws = new NebulaWebSocket();

ws.start(8081); // WebSocket na porta 8081
app.use(express.static(__dirname));

const paresPath = path.join(__dirname, 'pares.json');
const pares = {};

// Carregar pares do JSON
if (fs.existsSync(paresPath)) {
  try {
    const rawData = fs.readFileSync(paresPath, 'utf-8');
    if (rawData.trim()) { // só parseia se não estiver vazio
      const data = JSON.parse(rawData);
      Object.keys(data).forEach(code => {
        pares[code] = { ...data[code], client: null };
      });
    }
  } catch (err) {
    console.error('Erro ao ler pares.json, iniciando vazio:', err);
  }
}

// Salvar pares no JSON
function salvarPares() {
  const dump = {};
  Object.keys(pares).forEach(code => {
    dump[code] = { peer: pares[code].peer, user: pares[code].user };
  });
  fs.writeFileSync(paresPath, JSON.stringify(dump, null, 2));
}

// WebSocket: eventos
ws.on('message', async (data, client) => {
  try {
    const msg = typeof data === 'string' ? JSON.parse(data) : data;

    switch(msg.action) {

      case 'generatePairing':
        if (!msg.user) return;
        try {
          const code = criarPairing(msg.user);
          if (!code) throw new Error('Pairing code inválido');
          pares[code] = { peer: null, user: msg.user, client };
          salvarPares();
          client.send(JSON.stringify({ type: 'pairingCode', code }));
        } catch (err) {
          console.error('Erro ao gerar pairing:', err);
          client.send(JSON.stringify({ type: 'error', message: 'Falha ao gerar Pairing Code.' }));
        }
        break;

      case 'pair':
        const otherCode = msg.code;
        const myCode = msg.myCode;
        if (myCode && pares[otherCode]) {
          pares[myCode].peer = otherCode;
          pares[otherCode].peer = myCode;

          // notificar os dois clientes
          [pares[myCode].client, pares[otherCode].client].forEach(c => {
            if (c && c.readyState === c.OPEN) {
              c.send(JSON.stringify({ type: 'connected', peer: c === pares[myCode].client ? otherCode : myCode }));
            }
          });
        } else {
          client.send(JSON.stringify({ type: 'error', message: 'Código inválido ou já conectado.' }));
        }
        break;

      case 'message':
        const targetCode = msg.to;
        if (targetCode && pares[targetCode]) {
          const targetClient = pares[targetCode].client;
          if (targetClient && targetClient.readyState === targetClient.OPEN) {
            targetClient.send(JSON.stringify({ type: 'message', user: pares[msg.from]?.user || msg.user, text: msg.text }));
          }
        }
        break;

      default:
        console.warn('Ação desconhecida:', msg.action);
    }

  } catch(err) {
    console.error('Erro ao processar mensagem:', err);
    try { client.send(JSON.stringify({ type: 'error', message: 'Erro interno do servidor' })); } catch {}
  }
});

// Rota para verificar se já existe um código para um usuário
app.get('/getPairing/:user', (req, res) => {
  const user = req.params.user;
  const entry = Object.entries(pares).find(([code, data]) => data.user === user);
  if(entry) {
    const [code, data] = entry;
    res.json({ exists: true, code, peer: data.peer });
  } else {
    res.json({ exists: false });
  }
});

// Limpeza ao fechar servidor
process.on('exit', () => { if (fs.existsSync(paresPath)) fs.unlinkSync(paresPath); });
process.on('SIGINT', () => process.exit());
process.on('SIGTERM', () => process.exit());

server.listen(8080, () => {
  console.log('Servidor HTTP rodando em http://localhost:8080');
});
