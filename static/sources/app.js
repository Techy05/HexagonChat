const socket = io();
let clientId = null;
let onlineCounter = null;
let wasTextboxFocus = false;

socket.on("clientId", (id) => {
    clientId = id;
});

socket.on("online counter", (count) => {
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
    if (wasTextboxFocus) {
        input.focus();
    }
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
    const message = input.value;

    if (message.trim() !== "") {
        socket.emit("new message", message);
        input.value = "";
        input.focus();
        sendButton.classList.add("animateButton");
    }
}

function getColorFromId(id) {
    const num = id.replace(/-/g, "");

    const hue = parseInt(num.substring(0, 14), 16) % 360;
    const saturation = 55 + (parseInt(num.substring(14, 22), 16) % 25);
    const lightness = 35 + (parseInt(num.substring(22, 32), 16) % 45);

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

const input = document.getElementById("text");
input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});

input.addEventListener("focus", () => {
    wasTextboxFocus = true;
});

input.addEventListener("blur", () => {
    wasTextboxFocus = false;
});

const sendButton = document.getElementById("sendButton");
sendButton.addEventListener("mousedown", e => {
    e.preventDefault();
});

sendButton.addEventListener("animationend", () => {
    sendButton.classList.remove("animateButton");
});
