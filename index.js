const emojis = [
  "🤣",
  "😭",
  "🙏",
  "😘",
  "🥰",
  "😍",
  "😊",
  "🎉",
  "😁",
  "💕",
  "🥺",
  "😅",
  "🔥",
  "🤦",
  "🤷",
  "🙄",
  "😌",
  "💓",
  "🤩",
  "🙃",
  "😬",
  "😱",
  "😴",
  "🤭",
  "😐",
  "🌞",
  "😇",
  "🌸",
  "😈",
  "🎶",
  "🎊",
  "🥵",
  "😞",
  "💚",
  "🖤",
  "💰",
  "😚",
  "👑",
  "🎁",
  "💥",
];

function init() {
  // Make body take up full screen
  document.body.style.margin = "0";
  document.body.style.padding = "0";
  document.body.style.width = "100%";
  document.body.style.height = "100%";
  document.body.style.background = "#333333";

  // Make center of screen say "Connecting..."
  const connectingText = document.createElement("div");
  connectingText.style.position = "absolute";
  connectingText.style.top = "50%";
  connectingText.style.left = "50%";
  connectingText.style.transform = "translate(-50%, -50%)";
  connectingText.style.color = "#FFFFFF";
  connectingText.style.fontSize = "3rem";
  connectingText.style.fontWeight = "bold";
  connectingText.innerHTML = "Connecting...";
  document.body.appendChild(connectingText);

  // Create peer and call main
  const peer = new Peer();

  peer.on("open", () => {
    // Remove "Connecting..." text
    document.body.removeChild(connectingText);

    // Call main
    main(peer);
  });
}

function main(peer) {
  // Determine whether we're the host or the client (if no `s` in URL, we're the host)
  const isHost = window.location.href.indexOf("?s") === -1;

  // If we're not the host, determine the host's ID from the URL
  const hostId = isHost ? peer.id : window.location.href.split("?s=")[1];

  // Split behavior based on whether we're the host or the client
  if (isHost) {
    const connections = new Set();
    peer.on("connection", (conn) => {
      connections.add(conn);

      conn.on("data", (data) => {
        // Send data to all other connections
        for (const otherConn of connections) {
          if (otherConn !== conn) {
            otherConn.send(data);
          }
        }
      });

      conn.on("close", () => {
        connections.delete(conn);
      });
    });
  } else {
    const conn = peer.connect(hostId);
    conn.on("open", () => {
      conn.on("data", (data) => {});
    });
  }

  // Create title bar
  const topBar = document.createElement("div");
  topBar.style.top = "0";
  topBar.style.left = "0";
  topBar.style.width = "100%";
  topBar.style.height = "4rem";
  topBar.style.background = "#444444";
  topBar.style.color = "#FFFFFF";
  topBar.style.textAlign = "center";
  document.body.appendChild(topBar);

  // Add user icon
  const userIcon = document.createElement("button");
  userIcon.style.position = "absolute";
  userIcon.style.top = "0.5rem";
  userIcon.style.left = "0.5rem";
  userIcon.style.height = "3rem";
  userIcon.style.width = "3rem";
  userIcon.style.background = "#555555";
  userIcon.style.border = "none";
  userIcon.style.borderRadius = "50%";
  userIcon.style.fontSize = "1.5rem";
  userIcon.title = "Click to change emoji";
  userIcon.style.cursor = "pointer";
  function randomEmoji() {
    return emojis[Math.floor(Math.random() * emojis.length)];
  }
  userIcon.innerHTML = randomEmoji();
  userIcon.onclick = () => {
    userIcon.innerHTML = randomEmoji();
  };
  topBar.appendChild(userIcon);

  // Add invite button
  const inviteButton = document.createElement("button");
  inviteButton.style.position = "absolute";
  inviteButton.style.top = "0.5rem";
  inviteButton.style.right = "0.5rem";
  inviteButton.style.height = "3rem";
  inviteButton.style.width = "15rem";
  const inviteButtonDefaultColor = "#555555";
  const inviteButtonClickedColor = "#666666";
  inviteButton.style.background = inviteButtonDefaultColor;
  inviteButton.style.color = "#FFFFFF";
  inviteButton.style.border = "none";
  inviteButton.style.borderRadius = "0.5rem";
  inviteButton.style.fontSize = "1.5rem";
  inviteButton.style.fontWeight = "bold";
  inviteButton.style.cursor = "pointer";
  const inviteButtonText = "Invite friends";
  inviteButton.innerHTML = inviteButtonText;
  inviteButton.onclick = () => {
    // Add invite code to clipboard
    const inviteURL = window.location.href.split("?s=")[0] + "?s=" + hostId;
    navigator.clipboard.writeText(inviteURL);

    // Change button text until mouse leaves and it's been more than 1/2 second
    inviteButton.innerHTML = "Copied!";
    inviteButton.style.background = inviteButtonClickedColor;
    inviteButton.onmouseleave = () => {
      setTimeout(() => {
        inviteButton.innerHTML = inviteButtonText;
        inviteButton.style.background = inviteButtonDefaultColor;
      }, 500);
    };
  };
  topBar.appendChild(inviteButton);

  // Add marimba bars
  const marimbaBarInfo = [
    { note: "C", octave: 5 },
    { note: "C#", octave: 5 },
    { note: "D", octave: 5 },
    { note: "D#", octave: 5 },
    { note: "E", octave: 5 },
    { note: "F", octave: 5 },
    { note: "F#", octave: 5 },
    { note: "G", octave: 5 },
    { note: "G#", octave: 5 },
    { note: "A", octave: 5 },
    { note: "A#", octave: 5 },
    { note: "B", octave: 5 },
    { note: "C", octave: 6 },
    { note: "C#", octave: 6 },
    { note: "D", octave: 6 },
    { note: "D#", octave: 6 },
    { note: "E", octave: 6 },
    { note: "F", octave: 6 },
    { note: "F#", octave: 6 },
    { note: "G", octave: 6 },
    { note: "G#", octave: 6 },
    { note: "A", octave: 6 },
    { note: "A#", octave: 6 },
    { note: "B", octave: 6 },
    { note: "C", octave: 7 },
    { note: "C#", octave: 7 },
    { note: "D", octave: 7 },
    { note: "D#", octave: 7 },
    { note: "E", octave: 7 },
    { note: "F", octave: 7 },
    { note: "F#", octave: 7 },
    { note: "G", octave: 7 },
  ];
  const marimbaBars = [];
  for (const [i, barInfo] of marimbaBarInfo.entries()) {
    const bar = document.createElement("div");
    bar.style.position = "absolute";
    bar.style.top = "4rem";
    bar.style.left = `${i * 3.5}rem`;
    bar.style.width = "3rem";
    bar.style.height = "calc(100vh - 4rem)";
    bar.style.background = "#444444";
    bar.style.border = "0.1rem solid #555555";
    bar.style.borderRadius = "0.5rem";
    bar.style.boxShadow = "0 0 0.5rem #000000";
    bar.style.cursor = "pointer";
    bar.style.userSelect = "none";
    bar.style.webkitUserSelect = "none";
    bar.style.mozUserSelect = "none";
    bar.style.msUserSelect = "none";
    bar.style.oUserSelect = "none";
    bar.style.transition = "background 0.1s";
    bar.onmouseenter = () => {
      bar.style.background = "#555555";
    };
    bar.onmouseleave = () => {
      bar.style.background = "#444444";
    };
    bar.onclick = () => {};
    marimbaBars.push(bar);
    document.body.appendChild(bar);
  }
}

init();
