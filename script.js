if (!window.location.search) {
  getAuthorization();
}

selectNavOption();
function selectNavOption() {
  const navItems = document.getElementById("nav").querySelector("ul").children;

  for (const nav of navItems) {
    nav.addEventListener("click", () => {
      for (let i = 0; i < navItems.length; i++) {
        navItems[i].classList.remove("active-nav");
      }
      nav.classList.add("active-nav");
    });
  }
}

const lightModeElement = document.querySelectorAll(".light");
const colorModeButton = document.querySelector(".color_btn");

colorModeButton.addEventListener("click", () => {
  lightModeElement.forEach((element) => {
    element.classList.toggle("light");
  });
  colorModeButton.textContent === "Light Mode"
    ? (colorModeButton.innerHTML = `<i class="bi bi-brightness-high">Dark Mode</i>`)
    : (colorModeButton.innerHTML = `<i class="bi bi-brightness-high">Light Mode</i>`);
});

// SPOTIFY API
const clientID = "1d7a3c5bd8f44d82896028c754d7898a";
const clientSecret = "b1d908257adc4865be1f88b343bc58f7";
const tokenEndpoint = "https://accounts.spotify.com/api/token";
const redirectLocation = "http://127.0.0.1:5500/index.html";

// Authorization
async function getAuthorization() {
  //step1
  const generateRandomString = (length) => {
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  };

  const codeVerifier = generateRandomString(64);

  //step2
  const sha256 = async (plain) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest("SHA-256", data);
  };

  //step3
  const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  };

  //step4
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);

  // ACTUAL IMPLEMENTATTION
  const clientId = clientID;
  const redirectUri = redirectLocation;

  const scope =
    "user-read-private user-read-email streaming playlist-read-private user-follow-read user-top-read";
  const authUrl = new URL("https://accounts.spotify.com/authorize");

  // generated in the previous step
  window.localStorage.setItem("code_verifier", codeVerifier);

  const params = {
    response_type: "code",
    client_id: clientId,
    scope,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
  };

  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString();
}

// INVOKE SPOTIFY REDIRECTION

document.getElementById("connect").addEventListener("click", () => {
  getAuthorization();
});

const urlParams = new URLSearchParams(window.location.search);
let code = urlParams.get("code");

// We then get an Access Token
async function getToken(code) {
  // stored in the previous step
  let codeVerifier = localStorage.getItem("code_verifier");

  const message = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientID,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectLocation, //redirectUri
      code_verifier: codeVerifier,
    }),
  };

  const body = await fetch(tokenEndpoint, message);
  const response = await body.json();
  console.log(response);

  localStorage.setItem("access_token", response.access_token);
  localStorage.setItem("refresh_token", response.refresh_token);
}
getToken(code);

// REFRESH TOKEN
const getRefreshToken = async () => {
  // refresh token that has been previously stored
  const refreshToken = localStorage.getItem("refresh_token");
  const url = "https://accounts.spotify.com/api/token";

  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: clientID,
    }),
  };
  const resBody = await fetch(url, payload);
  const response = await resBody.json();

  console.log(response);
  localStorage.setItem("access_token", response.access_token);
  localStorage.setItem("refresh_token", response.refresh_token);
};

document.querySelector(".notify-bell").addEventListener("click", () => {
  fetchProfile(localStorage.getItem("access_token"));
});

// LOAD USER DATA
async function fetchProfile(token) {
  const result = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const info = await result.json();
  console.log(info);
}

function populateUI() {}
