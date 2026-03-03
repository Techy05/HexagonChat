<h1>About The Project</h1>

**HexagonChat** is a real-time anonymous chatting website without requiring login. Built with Node.JS and Socket.IO framework, which utilizes WebSockets to handle real-time requests, bypassing the need of GET requests from socket for incoming messages.

Each client (browser/device) is assigned a fixed `clientID`. This `clientID` is stored in browser cookies. This is then used to identify your messages (shown on right side) and assign a fixed avatar color. Even if you refresh, this information is preserved. 



<h1> To host this website locally </h1>

1. Install `Node.JS`
2. Clone this repositiory
3. Open terminal and CD into repository folder.
4. Run the following commands:

~~~
npm install express socket.io cookie-parser
~~~
~~~
node server.js
~~~
5. On browser, enter URL `http://localhost:8080`

<h1> Getting a temporary shareable URL </h1>

<h3>Using cloudflare tunneling</h3>

1. Install `cloudflared`
2. Open a new terminal window and run:
~~~
cloudflared --url localhost:8080
~~~
3. You will get a `https://random-words.trycloudflare.com` URL in terminal.

**NOTE:** The URL will only be active as long as terminal window is open. All requests will be handled by your PC. Your PC is the server and the website is still running locally.
