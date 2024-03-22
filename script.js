import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";

const today = dayjs();

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

let accessToken =
  "BQB8oQO_F1mgVlNbBZIj-3kq7YxOYUObuc5pk4Wq7nCYreZSyFxSaGtWF7dF8MUwYM_wdYsEkr2PWwskBQpUuFd4GpMPzywFTsFS5NBIpnjAz9_28HI";

async function getAccessToken() {
  try {
    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${clientID}&client_secret=${clientSecret}`,
    });

    const { access_token } = await response.json();
    return access_token;
  } catch (err) {
    console.log(err);
  }
}

// const myToken = await getAccessToken();
// console.log(myToken);

// Authorization

function getUserData(token) {
  const userDataEndpoint = "https://api.spotify.com/v1/me";

  fetch(userDataEndpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
}

getUserData(accessToken);

// async function fetchProfile(token) {
//   const result = await fetch("https://api.spotify.com/v1/me", {
//     method: "GET",
//     headers: { Authorization: `Bearer ${token}` },
//   });

//   return await result.json();
// }
