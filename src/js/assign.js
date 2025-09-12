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
      <b>${truck.time}<b> | Plate: <b>${truck.plate}</b> → Bay <b>${truck.bay}</b>
      <button onclick="markFailed(${index})">Mark Failed</button>
      <button onclick="done(${index})">Done</button>
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


function getCurrentTime() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();

  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;

  return `${hours}:${minutes}`;
}


document.getElementById("truckForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const plate = document.getElementById("plate").value.trim();
  const bay = document.getElementById("bay").value.trim();

  if (!plate || !bay) return;

  const data = getData();
  data.assigned.unshift({ plate, bay, time: getCurrentTime() });
  if (data.assigned.length > 15) data.assigned.pop(); 
  saveData(data);

  document.getElementById("plate").value = "";
  document.getElementById("bay").value = "";
  render();
});

window.addEventListener("storage", render);
render();