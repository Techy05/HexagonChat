const socket = io();
let clientId = null;
let onlineCounter = null;

socket.on("clientId", (id) => {
    clientId = id;
});

socket.on("onlineCounter", (count) => {
    onlineCounter = count;
    const online = document.querySelector(".online");
    online.textContent = "People Online: " + onlineCounter;
})

const container = document.querySelector(".msgbox");

socket.on("load messages", (msgHistory) => {
    container.innerHTML = "";
    for (let i = 0; i < msgHistory.length; i++) {
        printMessages(msgHistory[i]);
    }
});

socket.on("new message", (data) => {
    printMessages(data);
    container.scrollTop = container.scrollHeight;
});

function printMessages(data) {
    const message = document.createElement("div");
    message.className = "message";

    if (data.senderId === clientId) {
        message.classList.add("mymessage", "slide-right");
    } else {
        message.classList.add("slide-left");
    }

    const avatar = document.createElement("span");
    avatar.className = "avatar";
    const color = getColorFromId(data.senderId);
    avatar.style.backgroundColor = color;

    const text = document.createElement("span");
    text.className = "text";
    text.textContent = data.text;

    message.appendChild(avatar);
    message.appendChild(text);

    container.appendChild(message);
}

function sendMessage() {
    const input = document.getElementById("text");
    const message = input.value;

    if (message.trim() !== "") {
        socket.emit("new message", message);
        input.value = "";
        sendButton.classList.add("animateButton");
    }
}

function getColorFromId(id) {
    const number = parseInt(id.substring(0, 8), 16);
    const hue = number % 360;
    return `hsl(${hue}, 70%, 60%)`;
}

const input = document.getElementById("text");
input.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
})

const sendButton = document.getElementById("sendButton");
sendButton.addEventListener("animationend", () => {
    sendButton.classList.remove("animateButton");
});

