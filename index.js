const emojis = [
  "🤣",
  "😭",
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

const audioMap = {};

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

function playNote(emojiId, noteId) {
  // Play note
  const audio = audioMap[noteId];
  const newAudio = new Audio(audio.src);
  newAudio.play();

  // Play emoji animation on key
  const emoji = emojis[emojiId];
  const emojiDiv = document.createElement("div");
  const barDiv = document.getElementById(noteId);
  emojiDiv.style.position = "absolute";
  emojiDiv.style.top = barDiv.offsetTop + barDiv.offsetHeight / 2 + "px";
  emojiDiv.style.left = barDiv.offsetLeft + "px";
  emojiDiv.style.width = barDiv.offsetWidth + "px";
  emojiDiv.style.textAlign = "center";
  emojiDiv.style.fontSize = "1.5rem";
  emojiDiv.style.userSelect = "none";
  emojiDiv.style.pointerEvents = "none";
  // fade out font
  emojiDiv.style.transition = "all 0.5s";
  emojiDiv.innerHTML = emoji;
  document.body.appendChild(emojiDiv);

  setTimeout(() => {
    emojiDiv.style.opacity = "0";
    emojiDiv.style.transform = "translateY(-100px)";
    setTimeout(() => {
      document.body.removeChild(emojiDiv);
    }, 500);
  }, 100);
}

function main(peer) {
  // Determine whether we're the host or the client (if no `s` in URL, we're the host)
  const isHost = window.location.href.indexOf("?s") === -1;

  // If we're not the host, determine the host's ID from the URL
  const hostId = isHost ? peer.id : window.location.href.split("?s=")[1];

  // Split behavior based on whether we're the host or the client
  const connections = new Set();
  if (isHost) {
    peer.on("connection", (conn) => {
      connections.add(conn);

      conn.on("data", (data) => {
        // Send data to all other connections
        for (const otherConn of connections) {
          if (otherConn !== conn) {
            otherConn.send(data);
          }
        }

        // Parse data
        const [icon, noteId] = data.split(" ");

        // Play note
        playNote(icon, noteId);
      });

      conn.on("close", () => {
        connections.delete(conn);
      });
    });
  } else {
    const conn = peer.connect(hostId);
    conn.on("open", () => {
      connections.add(conn);

      conn.on("data", (data) => {
        // Parse data
        const [icon, noteId] = data.split(" ");

        // Play note
        playNote(icon, noteId);
      });

      conn.on("close", () => {
        connections.delete(conn);
      });
    });
  }

  // Create title bar
  const topBar = document.createElement("div");
  topBar.style.top = "0";
  topBar.style.left = "0";
  topBar.style.width = "100%";
  topBar.style.height = "4rem";
  topBar.style.background = "#444444";
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
  userIcon.style.userSelect = "none";
  userIcon.title = "Click to change emoji";
  userIcon.style.cursor = "pointer";
  function randomEmojiId() {
    return Math.floor(Math.random() * emojis.length);
  }
  let emojiId = randomEmojiId();
  userIcon.innerHTML = emojis[emojiId];
  userIcon.onclick = () => {
    emojiId = randomEmojiId();
    userIcon.innerHTML = emojis[emojiId];
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
  const marimbaNoteInfo = [
    { note: "C", octave: 4 },
    { note: "C#", octave: 4 },
    { note: "D", octave: 4 },
    { note: "D#", octave: 4 },
    { note: "E", octave: 4 },
    { note: "F", octave: 4 },
    { note: "F#", octave: 4 },
    { note: "G", octave: 4 },
    { note: "G#", octave: 4 },
    { note: "A", octave: 4 },
    { note: "A#", octave: 4 },
    { note: "B", octave: 4 },
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
  ];
  const numNaturalNotes = marimbaNoteInfo.filter(
    (barInfo) => barInfo.note[1] !== "#"
  ).length;

  let barOffset = 0;
  for (const barInfo of marimbaNoteInfo) {
    const isNaturalNote = barInfo.note[1] !== "#";

    const bar = document.createElement("div");
    bar.id = `${barInfo.note}${barInfo.octave}`;
    bar.style.position = "absolute";
    if (isNaturalNote) {
      bar.style.top = "calc(50vh)";
      bar.style.height = `calc(${
        30 + 20 * (1 - barOffset / numNaturalNotes)
      }vh - 0.5rem)`;
      bar.style.zIndex = "-1";
    } else {
      bar.style.top = `calc(${(20 * barOffset) / numNaturalNotes}vh + 4rem)`;
      bar.style.height = `calc(${
        30 + 20 * (1 - barOffset / numNaturalNotes)
      }vh)`;
      bar.style.zIndex = "0";
    }
    bar.style.left = `${
      ((barOffset + 0.1 - (isNaturalNote ? 0 : 0.5)) / numNaturalNotes) * 100
    }%`;
    barOffset += isNaturalNote ? 1 : 0;
    bar.style.width = `${(0.8 / numNaturalNotes) * 100}%`;
    const barDefaultColor = "#99503a";
    const barHoverColor = "#8a4537";
    bar.style.background = barDefaultColor;
    bar.style.borderRadius = "0.5rem";
    bar.style.boxShadow = "0 0 0.5rem #000000";
    bar.style.cursor = "pointer";
    bar.style.userSelect = "none";
    bar.style.transition = "background 0.1s";
    bar.onmouseenter = () => {
      bar.style.background = barHoverColor;
    };
    bar.onmouseleave = () => {
      bar.style.background = barDefaultColor;
    };
    bar.onclick = () => {
      playNote(emojiId, bar.id);

      // Send note to all connections
      for (const connection of connections) {
        connection.send(emojiId + " " + bar.id);
      }
    };
    document.body.appendChild(bar);

    audioMap[bar.id] = new Audio(`./sounds/${bar.id.replace("#", "s")}.wav`);
  }

  // Add keyboard controls
  document.onkeydown = (event) => {};

  // Add hidden CBAT function
  function playCBAT() {
    const notesAndDurations = [
      { note: "B5", duration: 0.5 },
      { note: "C#6", duration: 0.3 },
      { note: "A#5", duration: 0.5 },
      { note: "B5", duration: 0.4 },
      { note: "A5", duration: 0.2 },
      { note: "A5", duration: 0.2 },
      { note: "A5", duration: 0.3 },
      { note: "G5", duration: 0.7 },
      // Break
      { note: "G#5", duration: 0.5 },
      { note: "A#5", duration: 0.3 },
      { note: "G5", duration: 0.5 },
      { note: "G#5", duration: 0.4 },
      { note: "F#5", duration: 0.2 },
      { note: "F#5", duration: 0.2 },
      { note: "F#5", duration: 0.3 },
      { note: "F5", duration: 0.05 },
      { note: "E5", duration: 0.05 },
      { note: "D#5", duration: 0.05 },
      { note: "D5", duration: 0.05 },
      { note: "C#5", duration: 0.05 },
      { note: "C5", duration: 0.05 },
      { note: "B4", duration: 0.7 },
    ];
    notesAndDurations.push(...notesAndDurations);

    let time = 0;
    for (const noteAndDuration of notesAndDurations) {
      setTimeout(() => {
        playNote(emojiId, noteAndDuration.note);
      }, time * 1000);
      time += noteAndDuration.duration;
    }
  }
  window.playCBAT = playCBAT;
}

init();
