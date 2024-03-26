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

// DROPDOWN BUTTONS

document.addEventListener("click", (e) => {
  const isDropdownButton = e.target.matches("[data-dropdown-button]");
  if (!isDropdownButton && e.target.closest("[data-dropdown]") != null) return;

  let currentDropdown;
  if (isDropdownButton) {
    currentDropdown = e.target.closest("[data-dropdown]");
    currentDropdown.classList.toggle("active-dropdown");
  }

  document
    .querySelectorAll("[data-dropdown].active-dropdown")
    .forEach((dropdown) => {
      if (dropdown === currentDropdown) return;
      else dropdown.classList.remove("active-dropdown");
    });
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
if (
  !localStorage.getItem("access_token") ||
  !localStorage.getItem("expires_in") ||
  new Date().getTime() > Number(localStorage.getItem("expires_in"))
) {
  await getToken(code);
}
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
  getDateAddExpiry();
}

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
  getDateAddExpiry();
};

function getDateAddExpiry() {
  let now = new Date().getTime();
  const oneHour = new Date(now + 3600 * 1000);
  localStorage.setItem("expires_in", oneHour.getTime());
}

document.querySelector(".notify-bell").addEventListener("click", () => {
  loadUserData(localStorage.getItem("access_token"));
});

// LOAD USER DATA
async function loadUserData(token) {
  async function fetchProfile() {
    const result = await fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const userinfo = await result.json();
    return userinfo;
  }

  const userInfo = await fetchProfile(localStorage.getItem("access_token"));
  console.log(userInfo);

  function populateUI() {
    const DomElements = {
      username: document.querySelector(".user-name"),
      id: document.querySelector(".info-id"),
      name: document.querySelector(".info-name"),
      country: document.querySelector(".info-country"),
      email: document.querySelector(".info-email"),
      spotifyLink: document.querySelector(".info-spotifyLink"),
    };

    DomElements.username.innerHTML = userInfo.display_name;
    DomElements.id.innerHTML = userInfo.id;
    DomElements.name.innerHTML = userInfo.display_name;
    DomElements.country.innerHTML = userInfo.country;
    DomElements.email.innerHTML = userInfo.email;
    DomElements.spotifyLink.innerHTML = `<a>${userInfo.external_urls.spotify}</a>`;
  }
  populateUI();
}

// SEARCH FOR SONGS
const searchBox = document.querySelector("#search");
async function searchSong(accTok) {
  const result = await fetch("https://api.spotify.com/v1/search", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accTok}`,
      q: searchBox.value,
      type: "track",
      limit: 10,
      include_external: "audio",
    },
  });
  const userinfo = await result.json();
  console.log(userinfo);
}

searchBox.addEventListener("input", () => {
  searchSong(localStorage.getItem("access_token"));
});

// GET TOP TRACKS

async function fetchWebApi(endpoint, method, body) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    method,
    body: JSON.stringify(body),
  });
  return await res.json();
}

async function getTopTracks() {
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  return (
    await fetchWebApi("v1/me/top/tracks?time_range=long_term&limit=5", "GET")
  ).items;
}

const topTracks = await getTopTracks();

let itemsToDisplay = "";
topTracks.forEach((track) => {
  const smallestImage = track.album.images.reduce((smallest, image) => {
    if (image.height < smallest.height) return image;
    return smallest;
  }, track.album.images[0]);

  console.log(smallestImage);
  let html = `<div role="button" tabindex="0" class="set-playlist" data-trackId=${track.id}>
  <img src="${track.album.images[0].url}" alt="song-cover-picture" />
  <i class="bi bi-play-circle"></i>
  <div class="artist-info" >
    <p>${track.name}</p>
    <p class="grey-text">
      by <span class="song-writer">${track.artists[0].name}</span>
    </p>
  </div>
  </div>`;
  itemsToDisplay += html;
  document.querySelector(".js-playlist").innerHTML = itemsToDisplay;
});
