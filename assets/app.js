function $(s){return document.querySelector(s)}
function $all(s){return Array.from(document.querySelectorAll(s))}

// Jahr
(function year(){
  const y = $("#year");
  if(y) y.textContent = new Date().getFullYear();
})();

// Theme init
(function themeInit(){
  const saved = localStorage.getItem("kbm_theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = saved || (prefersDark ? "dark" : "light");
  document.documentElement.dataset.theme = theme;

  const sw = $("#themeSwitch");
  if(sw) sw.setAttribute("aria-checked", theme === "dark" ? "true" : "false");
})();

function setTheme(next){
  document.documentElement.dataset.theme = next;
  localStorage.setItem("kbm_theme", next);
  const sw = $("#themeSwitch");
  if(sw) sw.setAttribute("aria-checked", next === "dark" ? "true" : "false");
}

// Drawer + Dark toggle
(function drawer(){
  const openBtn = $("#drawerOpen");
  const closeBtn = $("#drawerClose");
  const overlay = $("#drawerOverlay");
  const themeSwitch = $("#themeSwitch");

  function open(){ document.body.classList.add("drawer-open"); }
  function close(){ document.body.classList.remove("drawer-open"); }

  openBtn?.addEventListener("click", open);
  closeBtn?.addEventListener("click", close);
  overlay?.addEventListener("click", close);

  window.addEventListener("keydown", (e)=>{
    if(e.key === "Escape") close();
  });

  $all(".drawerLink").forEach(a => a.addEventListener("click", close));

  themeSwitch?.addEventListener("click", ()=>{
    const current = document.documentElement.dataset.theme || "light";
    setTheme(current === "dark" ? "light" : "dark");
  });

  themeSwitch?.addEventListener("keydown", (e)=>{
    if(e.key === "Enter" || e.key === " "){
      e.preventDefault();
      themeSwitch.click();
    }
  });
})();

// Fake Bewerbungsformular (statisch)
(function applyForm(){
  const form = $("#applyForm");
  if(!form) return;

  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get("name") || "unbekannt";
    alert(`Danke, ${name}. Deine Anfrage wurde aufgenommen (In-World).`);
    form.reset();
  });
})();

// Dummy Portal Login
(function portalLogin(){
  const form = $("#portalLoginForm");
  if(!form) return;

  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const user = $("#user")?.value?.trim() || "";
    const pass = $("#pass")?.value?.trim() || "";

    const allowed = [
      { user:"leitung", pass:"klinikum123", role:"Ärztliche Direktion" },
      { user:"pflege",  pass:"station42",  role:"Pflege" },
      { user:"admin",   pass:"admin",      role:"Verwaltung" }
    ];

    const hit = allowed.find(x => x.user === user && x.pass === pass);
    if(!hit){
      alert("Login fehlgeschlagen: Benutzer oder Passwort stimmt nicht.");
      return;
    }

    sessionStorage.setItem("kbm_auth", "1");
    sessionStorage.setItem("kbm_user", user);
    sessionStorage.setItem("kbm_role", hit.role);
    window.location.href = "portal.html";
  });
})();

// Portal Guard
(function portalGuard(){
  const isPortal = document.body?.dataset?.page === "portal";
  if(!isPortal) return;

  if(sessionStorage.getItem("kbm_auth") !== "1"){
    window.location.href = "portal-login.html";
    return;
  }

  const u = sessionStorage.getItem("kbm_user") || "-";
  const r = sessionStorage.getItem("kbm_role") || "-";
  const who = $("#whoami");
  if(who) who.textContent = `${u} · ${r}`;

  $("#logoutBtn")?.addEventListener("click", (e)=>{
    e.preventDefault();
    sessionStorage.removeItem("kbm_auth");
    sessionStorage.removeItem("kbm_user");
    sessionStorage.removeItem("kbm_role");
    window.location.href = "index.html";
  });
})();

