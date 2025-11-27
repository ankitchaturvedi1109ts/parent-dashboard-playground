const concerns = [
  {
    ParentName: "Maria Gonzalez",
    StudentName: "Isabella Gonzalez",
    Stage: "New",
    Severity: "High",
    IssueCategory: "Safety",
    TMName: "L. Bennett",
    Comments: "Concerned about bus drop-off location and supervision after school.",
  },
  {
    ParentName: "James Carter",
    StudentName: "Noah Carter",
    Stage: "In Progress",
    Severity: "Medium",
    IssueCategory: "Academics",
    TMName: "A. Patel",
    Comments: "Requesting additional reading support and progress updates bi-weekly.",
  },
  {
    ParentName: "Priya Desai",
    StudentName: "Anya Desai",
    Stage: "Resolved",
    Severity: "Low",
    IssueCategory: "Technology",
    TMName: "S. Osei",
    Comments: "Laptop charging issue resolved after replacement charger provided.",
  },
  {
    ParentName: "Robert Chen",
    StudentName: "Ethan Chen",
    Stage: "Escalated",
    Severity: "High",
    IssueCategory: "Behavior",
    TMName: "J. Kim",
    Comments: "Repeated classroom disruptions; meeting scheduled with dean next week.",
  },
  {
    ParentName: "Alicia Brown",
    StudentName: "Liam Brown",
    Stage: "In Progress",
    Severity: "Low",
    IssueCategory: "Transportation",
    TMName: "R. Lee",
    Comments: "Verifying new bus route after recent address change.",
  },
  {
    ParentName: "Samuel Johnson",
    StudentName: "Ava Johnson",
    Stage: "New",
    Severity: "Medium",
    IssueCategory: "Health",
    TMName: "K. Nguyen",
    Comments: "Parent shared updated allergy plan; needs confirmation it's on file.",
  },
  {
    ParentName: "Hannah Kim",
    StudentName: "Mason Kim",
    Stage: "Resolved",
    Severity: "Medium",
    IssueCategory: "Attendance",
    TMName: "C. Rivera",
    Comments: "Attendance letter sent and follow-up call completed; attendance improving.",
  },
  {
    ParentName: "Erin Walsh",
    StudentName: "Sophie Walsh",
    Stage: "Escalated",
    Severity: "High",
    IssueCategory: "Academic Placement",
    TMName: "D. Flores",
    Comments: "Parent requesting acceleration review; forwarded to academic committee.",
  },
  {
    ParentName: "Omar Ali",
    StudentName: "Yusuf Ali",
    Stage: "In Progress",
    Severity: "Medium",
    IssueCategory: "Communication",
    TMName: "L. Bennett",
    Comments: "Prefers weekly email updates on class activities; establishing cadence.",
  },
];

const stageFilter = document.getElementById("stageFilter");
const severityFilter = document.getElementById("severityFilter");
const searchInput = document.getElementById("searchInput");
const concernContainer = document.getElementById("concernContainer");

function renderConcerns(list) {
  concernContainer.innerHTML = "";

  if (list.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No concerns match your filters.";
    concernContainer.appendChild(empty);
    return;
  }

  list.forEach((concern) => {
    const card = document.createElement("article");
    card.className = "concern-card";

    const header = document.createElement("div");
    header.className = "card-header";

    const names = document.createElement("div");
    names.className = "names";
    names.innerHTML = `
      <div class="name-primary">${concern.ParentName}</div>
      <div class="name-secondary">Student: ${concern.StudentName}</div>
    `;

    const badges = document.createElement("div");
    badges.className = "badges";
    badges.innerHTML = `
      <span class="badge stage-${concern.Stage}">${concern.Stage}</span>
      <span class="badge severity-${concern.Severity}">${concern.Severity}</span>
    `;

    header.appendChild(names);
    header.appendChild(badges);

    const detailRows = document.createElement("div");
    detailRows.className = "detail-row";
    detailRows.innerHTML = `
      <div><span class="detail-label">Issue Category:</span> ${concern.IssueCategory}</div>
      <div><span class="detail-label">TM:</span> ${concern.TMName}</div>
    `;

    const comments = document.createElement("div");
    comments.className = "comments";
    comments.textContent = concern.Comments;

    card.appendChild(header);
    card.appendChild(detailRows);
    card.appendChild(comments);

    concernContainer.appendChild(card);
  });
}

function applyFilters() {
  const stageValue = stageFilter.value;
  const severityValue = severityFilter.value;
  const searchValue = searchInput.value.toLowerCase().trim();

  const filtered = concerns.filter((concern) => {
    const matchesStage = stageValue === "All" || concern.Stage === stageValue;
    const matchesSeverity = severityValue === "All" || concern.Severity === severityValue;
    const matchesSearch = !searchValue ||
      concern.ParentName.toLowerCase().includes(searchValue) ||
      concern.StudentName.toLowerCase().includes(searchValue);

    return matchesStage && matchesSeverity && matchesSearch;
  });

  renderConcerns(filtered);
}

[stageFilter, severityFilter].forEach((select) => {
  select.addEventListener("change", applyFilters);
});

searchInput.addEventListener("input", applyFilters);

renderConcerns(concerns);
