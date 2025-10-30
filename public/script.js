const tableBody = document.getElementById("projectTable");
const addBtn = document.getElementById("addBtn");
const updateBtn = document.getElementById("updateBtn");
const searchInput = document.getElementById("search");

async function fetchProjects() {
  const res = await fetch("/action", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "get" }),
  });
  const { data } = await res.json();
  displayProjects(data);
}

function displayProjects(projects) {
  const searchTerm = searchInput.value.toLowerCase();
  tableBody.innerHTML = "";

  projects
    .filter(p =>
      p.studentName.toLowerCase().includes(searchTerm) ||
      p.projectTitle.toLowerCase().includes(searchTerm)
    )
    .forEach((p) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${p.id}</td>
        <td>${p.studentName}</td>
        <td>${p.projectTitle}</td>
        <td>${p.description}</td>
        <td><a href="${p.website}" target="_blank">Visit</a></td>
        <td>
          <button onclick="editProject(${p.id})">Edit</button>
          <button onclick="deleteProject(${p.id})" style="background:red;">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
}

// ✅ Add project
addBtn.addEventListener("click", async () => {
  const studentName = document.getElementById("studentName").value.trim();
  const projectTitle = document.getElementById("projectTitle").value.trim();
  const description = document.getElementById("description").value.trim();
  const website = document.getElementById("website").value.trim();

  if (!studentName || !projectTitle) {
    alert("Please fill in Student Name and Project Title!");
    return;
  }

  await fetch("/action", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "add", studentName, projectTitle, description, website }),
  });

  clearForm();
  fetchProjects();
});

// ✅ Edit project
async function editProject(id) {
  const res = await fetch("/action", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "get" }),
  });
  const { data } = await res.json();
  const project = data.find(p => p.id == id);
  if (!project) return;

  document.getElementById("projectId").value = project.id;
  document.getElementById("studentName").value = project.studentName;
  document.getElementById("projectTitle").value = project.projectTitle;
  document.getElementById("description").value = project.description;
  document.getElementById("website").value = project.website;

  addBtn.style.display = "none";
  updateBtn.style.display = "inline-block";
}

// ✅ Update project
updateBtn.addEventListener("click", async () => {
  const id = document.getElementById("projectId").value;
  const studentName = document.getElementById("studentName").value.trim();
  const projectTitle = document.getElementById("projectTitle").value.trim();
  const description = document.getElementById("description").value.trim();
  const website = document.getElementById("website").value.trim();

  await fetch("/action", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "update", id, studentName, projectTitle, description, website }),
  });

  clearForm();
  fetchProjects();
  addBtn.style.display = "inline-block";
  updateBtn.style.display = "none";
});

// ✅ Delete project
async function deleteProject(id) {
  if (confirm("Are you sure you want to delete this project?")) {
    await fetch("/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    });
    fetchProjects();
  }
}

// ✅ Clear form
function clearForm() {
  document.getElementById("projectId").value = "";
  document.getElementById("studentName").value = "";
  document.getElementById("projectTitle").value = "";
  document.getElementById("description").value = "";
  document.getElementById("website").value = "";
}

searchInput.addEventListener("input", fetchProjects);
fetchProjects();
