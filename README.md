# Chat Web com NebulaDrop

![Chat Screenshot](https://files.catbox.moe/xj7z9e.png)  
*Exemplo de interface do chat web.*

Este projeto é um **chat web simples** que utiliza o módulo [NebulaDrop](https://www.npmjs.com/package/nebuladrop) para comunicação em tempo real entre clientes web. Ele permite que dois usuários se conectem usando um **código de pareamento (pairing code)** e troquem mensagens diretamente no navegador.

---

## Funcionalidades

- 🔹 Gerar um **Pairing Code** para se conectar com outro usuário.  
- 🔹 Conectar-se a outro usuário usando o código fornecido.  
- 🔹 Enviar e receber mensagens em tempo real entre dois clientes web.  
- 🔹 Suporte a múltiplos pares simultâneos.  
- 🔹 Interface web responsiva e simples, adaptada para desktop e mobile.  
- 🔹 Armazenamento temporário dos pares em um arquivo `pares.json`.  

![GIF do Chat](https://i.imgur.com/SeuLinkDoGIF.gif)  

---

## Tecnologias usadas
 
![NebulaDrop](https://img.shields.io/badge/NebulaDrop-Blue?style=for-the-badge)  ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) 
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)  ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)  ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)  ![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white) 


- HTML, CSS e JavaScript para interface do chat  
- JSON para armazenamento dos pares de usuários  

---

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Darkblack157/Chat-Web.git
```

2.Acesse a pasta:
```bash
cd Chat-Web
```

3. Instale as dependências:
```bash
npm install
```

4. Inicie o servidor:
```bash
node server.js
```

5. Abra o navegador e acesse:
```bash
http://localhost:8080
```

