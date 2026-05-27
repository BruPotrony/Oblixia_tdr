const appData = {
  pages: {
    dashboard: {
      title: "Dashboard",
      subtitle: "Quick view of what is done, pending and blocked"
    },
    timeline: {
      title: "Calendar / Timeline",
      subtitle: "Events by day and legal sequence in one view"
    },
    library: {
      title: "Obligations Library",
      subtitle: "Choose an obligation and open its detail"
    },
    obligation: {
      title: "Obligation Detail",
      subtitle: "What it is, deadline, participants and risk"
    },
    wizard: {
      title: "Workflow",
      subtitle: "Step-by-step checklist with owners and blockers"
    },
    vault: {
      title: "Document Vault",
      subtitle: "Uploaded and missing files by obligation"
    },
    team: {
      title: "Roles / Team",
      subtitle: "Who must act now and who is waiting"
    }
  },
  notifications: [
    "Minutes still need to be signed",
    "Annual accounts filing is blocked",
    "Filing receipt has not been uploaded yet"
  ],
  workflow: [
    {
      step: "Accounts prepared",
      status: "Done",
      owner: "Back office",
      doc: "annual_accounts_2026.pdf",
      note: "Annual accounts are already prepared."
    },
    {
      step: "Ordinary general meeting held",
      status: "Done",
      owner: "Administrator",
      doc: "meeting_minutes_draft.pdf",
      note: "Meeting has been held."
    },
    {
      step: "Minutes signed",
      status: "Waiting",
      owner: "Administrator",
      doc: "signed_minutes.pdf",
      note: "Process is blocked until minutes are signed.",
      template: "Ordinary general meeting minutes template"
    },
    {
      step: "Certificate of approval prepared",
      status: "Not started",
      owner: "Back office",
      doc: "certificate_of_approval.pdf",
      note: "Cannot start until signed minutes are available."
    },
    {
      step: "Filing submitted to Registry",
      status: "Blocked",
      owner: "External advisor",
      doc: "filing_submission.pdf",
      note: "Registry filing depends on signed minutes and certificate."
    },
    {
      step: "Filing receipt uploaded",
      status: "Pending",
      owner: "External advisor",
      doc: "filing_receipt.pdf",
      note: "Final step once filing is submitted."
    }
  ],
  libraryObligations: [
    { order: 1, obligation: "Formulate annual accounts", status: "Done" },
    { order: 2, obligation: "Hold ordinary general meeting", status: "Done" },
    { order: 3, obligation: "Approve annual accounts", status: "Done" },
    { order: 4, obligation: "Decide profit allocation", status: "Done" },
    { order: 5, obligation: "Deposit annual accounts", status: "Pending" },
    { order: 6, obligation: "Legalise mandatory books", status: "Pending" },
    { order: 7, obligation: "Keep shareholders’ register book updated", status: "Done" },
    { order: 8, obligation: "Keep minutes book updated", status: "Pending" },
    { order: 9, obligation: "Determine audit requirement", status: "Pending" }
  ],
  vault: [
    { name: "annual_accounts_2026.pdf", state: "uploaded" },
    { name: "meeting_minutes_draft.pdf", state: "uploaded" },
    { name: "signed_minutes.pdf", state: "missing" },
    { name: "certificate_of_approval.pdf", state: "missing" },
    { name: "filing_receipt.pdf", state: "missing" }
  ],
  team: [
    {
      role: "Administrator",
      status: "Action required",
      responsibility: "Sign the shareholders' meeting minutes"
    },
    {
      role: "Back office",
      status: "Waiting",
      responsibility: "Prepare the certificate of approval once the minutes are signed"
    },
    {
      role: "External advisor",
      status: "Blocked",
      responsibility: "Submit the annual accounts filing to the Mercantile Registry"
    },
    {
      role: "Shareholders",
      status: "Done",
      responsibility: "Approved the annual accounts and profit allocation"
    },
    {
      role: "Company",
      status: "In progress",
      responsibility: "Store final documents in the Document Vault"
    }
  ],
  calendar: {
    monthLabel: "July 2025",
    weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    daysInMonth: 31,
    firstWeekdayOffset: 1,
    events: {
      12: [{ text: "Minutes to sign", status: "waiting", route: "wizard" }],
      16: [{ text: "Certificate not started", status: "pending", route: "wizard" }],
      22: [{ text: "Registry filing blocked", status: "blocked", route: "wizard" }],
      30: [{ text: "Deposit legal deadline", status: "deadline", route: "obligation" }]
    }
  }
};

const links = document.querySelectorAll(".menu-link");
const views = document.querySelectorAll(".view");
const titleEl = document.getElementById("pageTitle");
const subtitleEl = document.getElementById("pageSubtitle");
const notifToggle = document.getElementById("notifToggle");
const notifPanel = document.getElementById("notifPanel");
const notifList = document.getElementById("notifList");
const notifCount = document.getElementById("notifCount");
const calendarMonthLabel = document.getElementById("calendarMonthLabel");
const calendarGrid = document.getElementById("calendarGrid");
const timelineList = document.getElementById("timelineList");
const libraryGrid = document.getElementById("libraryGrid");
const startWorkflowBtn = document.getElementById("startWorkflowBtn");
const workflowList = document.getElementById("workflowList");
const vaultList = document.getElementById("vaultList");
const teamGrid = document.getElementById("teamGrid");

function statusClass(status) {
  return "badge-" + status.toLowerCase().replace(/\s+/g, "-");
}

function routeTo(route) {
  links.forEach((link) => {
    link.classList.toggle("active", link.dataset.route === route);
  });

  views.forEach((view) => {
    view.classList.toggle("active", view.id === "view-" + route);
  });

  const page = appData.pages[route];
  titleEl.textContent = page ? page.title : "Oblixia";
  subtitleEl.textContent = page ? page.subtitle : "";
}

function renderNotifications() {
  notifList.innerHTML = "";
  appData.notifications.forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    notifList.appendChild(li);
  });
  notifCount.textContent = String(appData.notifications.length);
}

function renderTimeline() {
  timelineList.innerHTML = "";

  appData.workflow.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="timeline-top">
        <strong>${index + 1}. ${item.step}</strong>
        <span class="badge ${statusClass(item.status)}">${item.status}</span>
      </div>
      <p>Owner: ${item.owner}</p>
      <p>Dependency: ${index === 0 ? "Start" : "Step " + index}</p>
    `;
    timelineList.appendChild(li);
  });
}

function renderCalendar() {
  const calendar = appData.calendar;
  calendarMonthLabel.textContent = calendar.monthLabel;
  calendarGrid.innerHTML = "";

  calendar.weekdays.forEach((weekday) => {
    const head = document.createElement("div");
    head.className = "calendar-weekday";
    head.textContent = weekday;
    calendarGrid.appendChild(head);
  });

  for (let i = 0; i < calendar.firstWeekdayOffset; i += 1) {
    const empty = document.createElement("div");
    empty.className = "calendar-day is-empty";
    calendarGrid.appendChild(empty);
  }

  for (let day = 1; day <= calendar.daysInMonth; day += 1) {
    const dayCell = document.createElement("article");
    dayCell.className = "calendar-day";

    const number = document.createElement("p");
    number.className = "calendar-day-number";
    number.textContent = String(day);
    dayCell.appendChild(number);

    const eventsWrap = document.createElement("div");
    eventsWrap.className = "calendar-events";
    const events = calendar.events[day] || [];

    events.forEach((event) => {
      const eventNode = document.createElement("button");
      eventNode.className = `calendar-event ${event.status}`;
      eventNode.type = "button";
      eventNode.textContent = event.text;

      if (event.route) {
        eventNode.addEventListener("click", () => routeTo(event.route));
      } else {
        eventNode.disabled = true;
      }

      eventsWrap.appendChild(eventNode);
    });

    dayCell.appendChild(eventsWrap);
    calendarGrid.appendChild(dayCell);
  }
}

function renderLibrary() {
  libraryGrid.innerHTML = "";

  const accordion = document.createElement("div");
  accordion.className = "obligation-accordion";

  appData.libraryObligations.forEach((item) => {
    const details = document.createElement("details");
    details.className = "obligation-item";

    const isFifth = item.order === 5;
    const summaryStatus = isFifth ? "Pending · High risk" : item.status;
    const summaryStatusClass = isFifth ? "badge-blocked" : statusClass(item.status);

    details.innerHTML = `
      <summary>
        <span class="obligation-order">${item.order}</span>
        <span class="obligation-name">${item.obligation}</span>
        <span class="badge ${summaryStatusClass}">${summaryStatus}</span>
      </summary>
      <div class="obligation-content">
        ${isFifth
          ? `
          <div class="obligation-feature-box">
            <h3>Annual Accounts Deposit</h3>
            <p class="obligation-feature-status">Pending · High risk</p>
            <p><strong>Deadline:</strong><br />Within 1 month after approval</p>
            <button type="button" class="btn btn-primary library-start-workflow">Start workflow →</button>
          </div>

          <article>
            <h4>When does it apply?</h4>
            <p>
              Applies every year once the accounts have been
              prepared by the directors and approved by the
              shareholders.
            </p>
          </article>

          <article>
            <h4>Who is involved?</h4>
            <p>Administrator · Back office · External advisor</p>
          </article>

          <article>
            <h4>Required documents:</h4>
            <ul class="doc-checklist">
              <li>Annual accounts</li>
              <li>Signed shareholders' meeting minutes</li>
              <li>Certificate of approval</li>
              <li>Profit allocation resolution</li>
              <li>Filing submission document</li>
              <li>Registry filing receipt</li>
            </ul>
          </article>

          <article>
            <h4>Risks:</h4>
            <p>
              Registry closure, possible financial penalties,
              and lack of transparency before third parties.
            </p>
          </article>
          `
          : `
          <article>
            <h4>${item.obligation}</h4>
            <p>Status: ${item.status}</p>
          </article>
          `}
      </div>
    `;

    if (isFifth) {
      const startBtn = details.querySelector(".library-start-workflow");
      if (startBtn) {
        startBtn.addEventListener("click", () => routeTo("wizard"));
      }
    }

    accordion.appendChild(details);
  });

  libraryGrid.appendChild(accordion);
}

function renderWorkflow() {
  workflowList.innerHTML = "";

  appData.workflow.forEach((item, index) => {
    const workflowItem = document.createElement("article");
    workflowItem.className = "workflow-item";

    const templateHtml = item.template
      ? `
      <div class="template-box">
        <div>
          <strong>Template available</strong>
          <p>${item.template}</p>
        </div>
        <button class="btn btn-secondary" type="button">Download template</button>
      </div>
      `
      : "";

    workflowItem.innerHTML = `
      <div class="workflow-title">
        <div>
          <strong>${index + 1}. ${item.step}</strong>
        </div>
        <span class="badge ${statusClass(item.status)}">${item.status}</span>
      </div>
      <div class="workflow-meta">
        <span>Responsible: ${item.owner}</span>
        <span>Document: ${item.doc}</span>
        <span>${item.note}</span>
      </div>
      ${templateHtml}
    `;

    workflowList.appendChild(workflowItem);
  });
}

function renderVault() {
  vaultList.innerHTML = "";

  appData.vault.forEach((doc) => {
    const li = document.createElement("li");
    const stateClass = `doc-state-${doc.state}`;
    li.innerHTML = `
      <span>${doc.name}</span>
      <span class="${stateClass}">${doc.state}</span>
    `;
    vaultList.appendChild(li);
  });
}

function renderTeam() {
  teamGrid.innerHTML = "";

  const tableWrap = document.createElement("div");
  tableWrap.className = "team-table-wrap";

  const table = document.createElement("table");
  table.className = "team-table";
  table.innerHTML = `
    <thead>
      <tr>
        <th>Role</th>
        <th>Status</th>
        <th>Main responsibility</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = table.querySelector("tbody");
  appData.team.forEach((person) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${person.role}</td>
      <td><span class="badge ${statusClass(person.status)}">${person.status}</span></td>
      <td>${person.responsibility}</td>
    `;
    tbody.appendChild(row);
  });

  tableWrap.appendChild(table);
  teamGrid.appendChild(tableWrap);
}

links.forEach((link) => {
  link.addEventListener("click", () => {
    routeTo(link.dataset.route);
  });
});

document.querySelectorAll("[data-route]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    routeTo(trigger.dataset.route);
  });
});

startWorkflowBtn.addEventListener("click", () => routeTo("wizard"));

notifToggle.addEventListener("click", () => {
  const isExpanded = notifToggle.getAttribute("aria-expanded") === "true";
  notifToggle.setAttribute("aria-expanded", String(!isExpanded));
  notifPanel.classList.toggle("hidden", isExpanded);
});

renderNotifications();
renderCalendar();
renderTimeline();
renderLibrary();
renderWorkflow();
renderVault();
renderTeam();
routeTo("dashboard");
