function getData() {
  return JSON.parse(localStorage.getItem("queueData")) || { assigned: [], failed: [] };
}

function saveData(data) {
  localStorage.setItem("queueData", JSON.stringify(data));
  window.dispatchEvent(new Event("storage")); // force update in same browser
}

function render() {
  const data = getData();
  const assignedList = document.getElementById("assignedList");
  assignedList.innerHTML = "";

  data.assigned.forEach((truck, index) => {
    const div = document.createElement("div");
    div.className = "truck";
    div.innerHTML = `
      <b>${formatDateTime(truck.time)}<b> | Plate: <b>${truck.plate}</b> → Bay <b>${truck.bay}</b>
      <button style='width: 40%' onclick="markFailed(${index})">Mark Failed</button>
      <button style='width: 40%' onclick="done(${index})">Reached</button>
    `;
    assignedList.appendChild(div);
  });
}

function markFailed(index) {
  const data = getData();
  const truck = data.assigned.splice(index, 1)[0];
  if (truck) data.failed.unshift(truck);
  if (data.failed.length > 5) data.failed.pop(); 
  saveData(data);
  render();
}

function done(index) {
  const data = getData();
  data.assigned.splice(index, 1);
  saveData(data);
  render();
}

function clearAllStorage() {
    if (confirm("Are you sure you want to clear all data?")){

    localStorage.clear(); // Clears everything in localStorage
    alert("All data has been cleared!");
    location.reload();

    } else {
        return;
    }
}

document.getElementById("clearStorageBtn").addEventListener("click", clearAllStorage);

function openNewDisplay() {
  window.open("display.html", 'popup');
}

document.getElementById("openDisplay").addEventListener("click", openNewDisplay);

function formatDateTime(ms) {
  const d = new Date(ms);

  // Extract date parts
  let year = d.getFullYear();
  let month = d.getMonth() + 1; // months are 0-indexed
  let day = d.getDate();

  // Extract time parts
  let hours = d.getHours();
  let minutes = d.getMinutes();

  // Pad with leading zeros
  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}


document.getElementById("truckForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const plate = document.getElementById("plate").value.trim();
  const bay = document.getElementById("bay").value.trim();

  if (!plate || !bay) return;

  const data = getData();
  data.assigned.unshift({ plate, bay, time: Date.now() });
  if (data.assigned.length > 15) data.assigned.pop(); 
  saveData(data);

  document.getElementById("plate").value = "";
  document.getElementById("bay").value = "";
  render();
});

function autoFail(minutes) {
  const data = getData();
  const now = Date.now();
  const threshold = minutes * 60 * 1000; // convert minutes to milliseconds

  for (let i = data.assigned.length - 1; i >= 0; i--) {
    if (now - data.assigned[i].time >= threshold) {
      const truck = data.assigned.splice(i, 1)[0];
      if (truck) data.failed.unshift(truck);
    if (data.failed.length > 5) data.failed.pop(); 
    }
  }

  saveData(data);
  render(); // update UI
}

function getFailTime() {
  const input = document.getElementById("failTime");
  return parseInt(input.value, 10) || 5; // fallback = 5 minutes
}

// Run auto-fail check every 30 seconds
setInterval(() => {
  const minutes = getFailTime();
  autoFail(minutes);
}, 30000);

window.addEventListener("storage", render);
render();