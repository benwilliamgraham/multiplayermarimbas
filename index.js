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
    peer.on("connection", (conn) => {
      conn.on("data", (data) => {
        console.log(data);
      });
    });
  } else {
    const conn = peer.connect(hostId);
    conn.on("open", () => {
      conn.send("Hello!");
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
}

init();
