function $(s){return document.querySelector(s)}
function $all(s){return Array.from(document.querySelectorAll(s))}

(function year(){
  const y = $("#year");
  if(y) y.textContent = new Date().getFullYear();
})();

(function nav(){
  const btn = $("#menuBtn");
  const nav = $("#navLinks");
  if(!btn || !nav) return;

  btn.addEventListener("click", ()=> nav.classList.toggle("open"));
  $all('a[data-close="1"]').forEach(a => a.addEventListener("click", ()=> nav.classList.remove("open")));
})();

// Fake-Formular (ohne Backend)
(function initForms(){
  const apply = $("#applyForm");
  if(apply){
    apply.addEventListener("submit", (e)=>{
      e.preventDefault();
      const data = new FormData(apply);
      const name = data.get("name") || "unbekannt";
      showToast("Gesendet", `Danke, ${name}. Deine Anfrage wurde aufgenommen (intern).`);
      apply.reset();
    });
  }
})();

// Dummy-Login
(function initPortalLogin(){
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
      showToast("Login fehlgeschlagen", "Benutzer oder Passwort stimmt nicht.");
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

  const auth = sessionStorage.getItem("kbm_auth");
  if(auth !== "1"){
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
