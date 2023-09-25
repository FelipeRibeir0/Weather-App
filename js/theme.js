let icon = document.getElementById("themeChanger");
let body = document.body;

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    setDarkTheme();
} else {
    setLightTheme();
}

icon.addEventListener("click", toggleTheme);
function toggleTheme() {
    if (body.classList.contains("darkTheme")) {
        setLightTheme();
    } else {
        setDarkTheme();
    }
}

function setDarkTheme() {
    body.classList.add("darkTheme");
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");    
    localStorage.setItem("theme", "dark");
}

function setLightTheme() {
    body.classList.remove("darkTheme");
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");    
    localStorage.setItem("theme", "light");
}