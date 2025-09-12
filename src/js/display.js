function getData() {
  return JSON.parse(localStorage.getItem("queueData")) || { assigned: [], failed: [] };
}

function render() {
  const data = getData();
  const assignedDisplay = document.getElementById("assignedDisplay");
  const failedDisplay = document.getElementById("failedDisplay");

  assignedDisplay.innerHTML = "";
  failedDisplay.innerHTML = "";

  data.assigned.forEach(truck => {
    const div = document.createElement("div");
    div.className = "truck";
    div.innerHTML = ` ${truck.plate} → Bay <b>${truck.bay}</b>`;
    assignedDisplay.appendChild(div);
  });

  data.failed.forEach(truck => {
    const div = document.createElement("div");
    div.className = "truck";
    div.innerHTML = ` ${truck.plate} (Bay ${truck.bay})`;
    failedDisplay.appendChild(div);
  });
}

window.addEventListener("storage", render);
setInterval(render, 2000); // fallback auto-refresh
render();
