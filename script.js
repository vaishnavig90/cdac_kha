/*
  FILE: script.js  →  DATA + BEHAVIOUR of the page

  ===================== DATA DESCRIPTION =====================
  APP_VERSION : string
                Shown in the hero badge. Change it on every release
                (v1.0 → v1.1) to prove the new code is live on EC2.

  course      : object
                name      (string)  short course name
                fullName  (string)  full course name
                centre    (string)  training centre
                batch     (string)  batch name

  modules     : array of objects, one per module
                code   (string)  module code, e.g. "M01"
                title  (string)  module name
                weeks  (number)  duration in weeks
                tag    (string)  category used by the filter buttons

  team        : array of objects, one per contributor
                name   (string)  student name
                role   (string)  Developer / Tester / Reviewer ...

  GIT EXERCISE: each student creates a branch (git switch -c add-<name>),
  adds ONE line at the end of the team array, commits, pushes and opens a PR.
  ============================================================
*/

const APP_VERSION = "v1.0";

const course = {
  name: "PG-DBDA",
  fullName: "PG Diploma in Big Data Analytics",
  centre: "C-DAC Kharghar, Navi Mumbai",
  batch: "Batch 2026"
};

const modules = [
  { code: "M01", title: "Linux & Cloud Computing",        weeks: 3, tag: "Infra" },
  { code: "M02", title: "Python Programming",             weeks: 3, tag: "Programming" },
  { code: "M03", title: "Database Technologies (MySQL)",  weeks: 3, tag: "Data" },
  { code: "M04", title: "Java Programming",               weeks: 2, tag: "Programming" },
  { code: "M05", title: "Big Data Technologies",          weeks: 4, tag: "Data" },
  { code: "M06", title: "Statistics & Machine Learning",  weeks: 4, tag: "AI" },
  { code: "M07", title: "Data Visualization",             weeks: 2, tag: "Data" },
  { code: "M08", title: "Git, DevOps & AWS Deployment",   weeks: 1, tag: "Infra" }
];

const team = [
  { name: "Faculty", role: "Repository owner" },
  { name: "Student A", role: "Developer" }
  // add your line here →  ,{ name: "Riya Sharma", role: "Developer" }
];


/* ---------- 1. Fill the hero ---------- */
document.getElementById("version").textContent = APP_VERSION;
document.getElementById("course-title").textContent = course.fullName;
document.getElementById("course-subtitle").textContent =
  course.name + " · " + course.batch + " · " + course.centre;

// totals are calculated from the data, not typed by hand
let totalWeeks = 0;
modules.forEach(function (m) { totalWeeks += m.weeks; });
document.getElementById("stat-modules").textContent = modules.length;
document.getElementById("stat-weeks").textContent = totalWeeks;
document.getElementById("stat-team").textContent = team.length;


/* ---------- 2. Module cards with search + filter ---------- */
const grid = document.getElementById("module-grid");
const searchBox = document.getElementById("search");
const filterBox = document.getElementById("filters");
let activeTag = "All";

// draw the cards that match the search text and the selected tag
function showModules() {
  const text = searchBox.value.toLowerCase();
  grid.innerHTML = "";
  let count = 0;

  modules.forEach(function (m) {
    const matchText = m.title.toLowerCase().includes(text);
    const matchTag = activeTag === "All" || m.tag === activeTag;
    if (matchText && matchTag) {
      grid.innerHTML +=
        '<div class="card">' +
          '<span class="code">' + m.code + '</span>' +
          '<h3>' + m.title + '</h3>' +
          '<div class="meta"><span>' + m.weeks + (m.weeks === 1 ? ' week' : ' weeks') + '</span><span class="tag">' + m.tag + '</span></div>' +
        '</div>';
      count++;
    }
  });
  document.getElementById("empty-msg").hidden = count > 0;
}

// make one filter button per unique tag: All, Infra, Programming, Data, AI
const tags = ["All"];
modules.forEach(function (m) { if (!tags.includes(m.tag)) tags.push(m.tag); });
tags.forEach(function (tag) {
  const btn = document.createElement("button");
  btn.className = "filter" + (tag === "All" ? " active" : "");
  btn.textContent = tag;
  btn.addEventListener("click", function () {
    activeTag = tag;
    document.querySelectorAll(".filter").forEach(function (b) { b.classList.remove("active"); });
    btn.classList.add("active");
    showModules();
  });
  filterBox.appendChild(btn);
});

searchBox.addEventListener("input", showModules);   // re-filter on every key press
showModules();


/* ---------- 3. Team cards with initials avatar ---------- */
const colours = ["#0f766e", "#7c3aed", "#db2777", "#ea580c", "#2563eb", "#16a34a"];
const teamGrid = document.getElementById("team-grid");

team.forEach(function (person, i) {
  const initials = person.name.split(" ").map(function (w) { return w[0]; }).join("").slice(0, 2).toUpperCase();
  teamGrid.innerHTML +=
    '<div class="member">' +
      '<div class="avatar" style="background:' + colours[i % colours.length] + '">' + initials + '</div>' +
      '<div><b>' + person.name + '</b><small>' + person.role + '</small></div>' +
    '</div>';
});


/* ---------- 4. Light / dark theme button ---------- */
document.getElementById("theme-btn").addEventListener("click", function () {
  document.body.classList.toggle("dark");
  this.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});


/* ---------- 5. Where is the page running? ---------- */
const host = window.location.hostname;
let source;
if (host === "") source = "💻 Opened as a file on your laptop";
else if (host === "localhost" || host === "127.0.0.1") source = "💻 Live Server on your laptop";
else if (host.includes("s3")) source = "🪣 Amazon S3 static website";
else source = "☁️ EC2 web server · " + host;
document.getElementById("served-from").textContent = source;

document.getElementById("year").textContent = new Date().getFullYear();
