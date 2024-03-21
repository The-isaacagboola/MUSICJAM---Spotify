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
