const socket = io();
let clientId = null;

socket.on("clientId", (id) => {
    clientId = id;
});

const container = document.querySelector(".msgbox");

socket.on("load messages", (msgHistory) => {
    for (let i = 0; i < msgHistory.length; i++) {
        printMessages(msgHistory[i]);
    }
});

socket.on("send message", (data) => {
    printMessages(data);
    container.scrollTop = container.scrollHeight;
});

function printMessages(data) {
    const message = document.createElement("div");
    message.className = "message";

    if (data.senderId === clientId) {
        message.classList.add("mymessage");
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
        socket.emit("send message", message);
        input.value = "";
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
