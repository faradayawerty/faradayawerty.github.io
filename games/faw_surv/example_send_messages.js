
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>WebRTC One-File Example</title>
  <style>
    body { font-family: sans-serif; max-width: 700px; margin: auto; padding: 1rem; }
    textarea { width: 100%; height: 120px; }
    input, button { margin: 0.5rem 0; }
    #chat { margin-top: 1rem; background: #f0f0f0; padding: 1rem; min-height: 100px; border-radius: 5px; }
  </style>
</head>
<body>

<h2>🔁 WebRTC One File (Manual Signaling)</h2>

<button onclick="createOffer()">1️⃣ Create Offer</button>
<textarea id="offer" placeholder="Offer"></textarea>

<button onclick="setRemoteOffer()">2️⃣ Set Remote Offer</button><br>

<button onclick="createAnswer()">3️⃣ Create Answer</button>
<textarea id="answer" placeholder="Answer"></textarea>

<button onclick="setRemoteAnswer()">4️⃣ Set Remote Answer</button><br>

<input id="message" placeholder="Type a message...">
<button onclick="sendMessage()">Send</button>

<div id="chat"></div>

<script>
let pc;
let channel;
let isOfferer = false;

function createPeerConnection() {
  pc = new RTCPeerConnection();

  pc.onicecandidate = (event) => {
    if (event.candidate) return; // Ждём всех кандидатов (trickle ICE off)
    if (isOfferer) {
      document.getElementById("offer").value = JSON.stringify(pc.localDescription);
    } else {
      document.getElementById("answer").value = JSON.stringify(pc.localDescription);
    }
  };

  pc.ondatachannel = (event) => {
    channel = event.channel;
    setupChannel();
  };
}

function setupChannel() {
  channel.onmessage = (e) => {
    document.getElementById("chat").innerHTML += `<div><b>Peer:</b> ${e.data}</div>`;
  };
  channel.onopen = () => {
    console.log("Data channel opened");
  };
}

async function createOffer() {
  isOfferer = true;
  createPeerConnection();
  channel = pc.createDataChannel("chat");
  setupChannel();

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
}

async function setRemoteOffer() {
  const offer = JSON.parse(document.getElementById("offer").value);
  createPeerConnection();
  await pc.setRemoteDescription(offer);
}

async function createAnswer() {
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
}

async function setRemoteAnswer() {
  const answer = JSON.parse(document.getElementById("answer").value);
  await pc.setRemoteDescription(answer);
}

function sendMessage() {
  const msg = document.getElementById("message").value;
  channel.send(msg);
  document.getElementById("chat").innerHTML += `<div><b>You:</b> ${msg}</div>`;
  document.getElementById("message").value = '';
}
</script>

</body>
</html>

