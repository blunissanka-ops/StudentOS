/* =========================================================
   StudentOS V1
   A simple student productivity operating system
   Works directly on GitHub Pages - no backend required.
========================================================= */

const APP_NAME = "StudentOS";

const defaultData = {
    user: {
        name: "Student",
        university: "University Student",
        degree: "Undergraduate",
        year: "4th Year"
    },

    tasks: [
        {
            id: 1,
            title: "Complete HRM assignment",
            subject: "Human Resource Management",
            date: "Today",
            priority: "High",
            completed: false
        },
        {
            id: 2,
            title: "Study Corporate Financial Reporting",
            subject: "CA",
            date: "Tomorrow",
            priority: "High",
            completed: false
        },
        {
            id: 3,
            title: "Review lecture notes",
            subject: "HR Analytics",
            date: "Friday",
            priority: "Medium",
            completed: false
        }
    ],

    notes: [
        {
            id: 1,
            title: "Green HRM",
            subject: "Human Resource Management",
            content: "Green HRM focuses on environmentally responsible HR practices.",
            date: "Today"
        },
        {
            id: 2,
            title: "Audit Risk",
            subject: "CA",
            content: "Audit risk is the risk that an auditor expresses an inappropriate opinion.",
            date: "Yesterday"
        }
    ],

    habits: [
        { id: 1, name: "Study 2 hours", completed: false },
        { id: 2, name: "Read lecture notes", completed: false },
        { id: 3, name: "Exercise", completed: false },
        { id: 4, name: "Plan tomorrow", completed: false }
    ],

    studyTime: 12.5
};


/* =========================================================
   STORAGE
========================================================= */

function loadData() {
    const saved = localStorage.getItem("studentOS");

    if (!saved) {
        localStorage.setItem(
            "studentOS",
            JSON.stringify(defaultData)
        );

        return JSON.parse(JSON.stringify(defaultData));
    }

    try {
        return JSON.parse(saved);
    } catch {
        return JSON.parse(JSON.stringify(defaultData));
    }
}

let data = loadData();

function saveData() {
    localStorage.setItem(
        "studentOS",
        JSON.stringify(data)
    );
}


/* =========================================================
   UTILITIES
========================================================= */

function escapeHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function generateId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

function getGreeting() {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";

    return "Good evening";
}

function getCurrentDate() {
    return new Date().toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            month: "long",
            day: "numeric"
        }
    );
}

function showToast(message, type = "success") {
    let container = document.querySelector(".toast-container");

    if (!container) {
        container = document.createElement("div");
        container.className = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");

    toast.className = `toast ${type}`;

    toast.innerHTML = `
        <span>${type === "success" ? "✓" : "!"}</span>
        <span>${escapeHTML(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("hide");

        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 2500);
}


/* =========================================================
   MAIN APPLICATION
========================================================= */

function initApp() {

    let app = document.getElementById("app");

    if (!app) {
        app = document.body;

        app.innerHTML = `
            <div id="app"></div>
        `;

        app = document.getElementById("app");
    }

    renderLayout();

    navigate("dashboard");
}


/* =========================================================
   LAYOUT
========================================================= */

function renderLayout() {

    const root = document.getElementById("app");

    root.innerHTML = `

        <div class="app-shell">

            <!-- SIDEBAR -->

            <aside class="sidebar">

                <div class="brand">
                    <div class="brand-icon">
                        🎓
                    </div>

                    <div>
                        <strong>StudentOS</strong>
                        <small>Student Life OS</small>
                    </div>
                </div>


                <nav class="side-nav">

                    <button
                        class="nav-item active"
                        data-page="dashboard"
                        onclick="navigate('dashboard')">

                        <span>⌂</span>
                        <span>Dashboard</span>

                    </button>


                    <button
                        class="nav-item"
                        data-page="tasks"
                        onclick="navigate('tasks')">

                        <span>✓</span>
                        <span>Tasks</span>

                    </button>


                    <button
                        class="nav-item"
                        data-page="notes"
                        onclick="navigate('notes')">

                        <span>📝</span>
                        <span>Notes</span>

                    </button>


                    <button
                        class="nav-item"
                        data-page="planner"
                        onclick="navigate('planner')">

                        <span>📅</span>
                        <span>Planner</span>

                    </button>


                    <button
                        class="nav-item"
                        data-page="habits"
                        onclick="navigate('habits')">

                        <span>🔥</span>
                        <span>Habits</span>

                    </button>


                    <button
                        class="nav-item"
                        data-page="focus"
                        onclick="navigate('focus')">

                        <span>⏱</span>
                        <span>Focus</span>

                    </button>


                    <button
                        class="nav-item"
                        data-page="resources"
                        onclick="navigate('resources')">

                        <span>📚</span>
                        <span>Resources</span>

                    </button>

                </nav>


                <div class="sidebar-bottom">

                    <button
                        class="nav-item"
                        data-page="profile"
                        onclick="navigate('profile')">

                        <span>👤</span>
                        <span>Profile</span>

                    </button>


                    <button
                        class="nav-item"
                        onclick="resetData()">

                        <span>↻</span>
                        <span>Reset Data</span>

                    </button>

                </div>

            </aside>


            <!-- MAIN -->

            <main class="main-content">

                <header class="topbar">

                    <button
                        class="mobile-menu"
                        onclick="toggleSidebar()">
                        ☰
                    </button>


                    <div class="topbar-search">

                        <span>⌕</span>

                        <input
                            type="text"
                            placeholder="Search StudentOS..."
                            onkeyup="globalSearch(this.value)"
                        >

                    </div>


                    <div class="topbar-actions">

                        <button
                            class="icon-button"
                            onclick="showNotifications()">
                            🔔
                        </button>


                        <button
                            class="profile-mini"
                            onclick="navigate('profile')">

                            <div class="avatar">
                                ${getInitials(data.user.name)}
                            </div>

                            <div class="profile-mini-text">

                                <strong>
                                    ${escapeHTML(data.user.name)}
                                </strong>

                                <small>
                                    ${escapeHTML(data.user.degree)}
                                </small>

                            </div>

                        </button>

                    </div>

                </header>


                <section
                    id="page-content"
                    class="page-content">
                </section>

            </main>


            <!-- MOBILE NAV -->

            <nav class="mobile-nav">

                <button onclick="navigate('dashboard')">
                    <span>⌂</span>
                    Home
                </button>

                <button onclick="navigate('tasks')">
                    <span>✓</span>
                    Tasks
                </button>

                <button onclick="navigate('notes')">
                    <span>📝</span>
                    Notes
                </button>

                <button onclick="navigate('planner')">
                    <span>📅</span>
                    Plan
                </button>

                <button onclick="navigate('profile')">
                    <span>👤</span>
                    Me
                </button>

            </nav>

        </div>

        <div id="modal-root"></div>
    `;
}


/* =========================================================
   NAVIGATION
========================================================= */

function navigate(page) {

    const content = document.getElementById("page-content");

    if (!content) return;

    document.querySelectorAll(".nav-item").forEach(item => {

        item.classList.toggle(
            "active",
            item.dataset.page === page
        );

    });


    switch (page) {

        case "dashboard":
            renderDashboard(content);
            break;

        case "tasks":
            renderTasks(content);
            break;

        case "notes":
            renderNotes(content);
            break;

        case "planner":
            renderPlanner(content);
            break;

        case "habits":
            renderHabits(content);
            break;

        case "focus":
            renderFocus(content);
            break;

        case "resources":
            renderResources(content);
            break;

        case "profile":
            renderProfile(content);
            break;

        default:
            renderDashboard(content);
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   DASHBOARD
========================================================= */

function renderDashboard(container) {

    const completedTasks =
        data.tasks.filter(t => t.completed).length;

    const totalTasks = data.tasks.length;

    const progress =
        totalTasks === 0
            ? 0
            : Math.round(
                (completedTasks / totalTasks) * 100
            );


    const pendingTasks =
        data.tasks
            .filter(t => !t.completed)
            .slice(0, 4);


    container.innerHTML = `

        <div class="page-enter">

            <div class="welcome-section">

                <div>

                    <span class="eyebrow">
                        ${getCurrentDate()}
                    </span>

                    <h1>
                        ${getGreeting()},
                        ${escapeHTML(data.user.name)} 👋
                    </h1>

                    <p>
                        Here's your student life at a glance.
                    </p>

                </div>


                <button
                    class="primary-button"
                    onclick="openAddTask()">

                    + Add Task

                </button>

            </div>


            <!-- STATS -->

            <div class="stats-grid">

                <div class="stat-card">

                    <div class="stat-icon purple">
                        ✓
                    </div>

                    <div>

                        <span>Tasks completed</span>

                        <strong>
                            ${completedTasks}/${totalTasks}
                        </strong>

                    </div>

                </div>


                <div class="stat-card">

                    <div class="stat-icon blue">
                        📝
                    </div>

                    <div>

                        <span>Notes</span>

                        <strong>
                            ${data.notes.length}
                        </strong>

                    </div>

                </div>


                <div class="stat-card">

                    <div class="stat-icon orange">
                        🔥
                    </div>

                    <div>

                        <span>Habits today</span>

                        <strong>
                            ${data.habits.filter(h => h.completed).length}/${data.habits.length}
                        </strong>

                    </div>

                </div>


                <div class="stat-card">

                    <div class="stat-icon green">
                        ⏱
                    </div>

                    <div>

                        <span>Study time</span>

                        <strong>
                            ${data.studyTime}h
                        </strong>

                    </div>

                </div>

            </div>


            <!-- GRID -->

            <div class="dashboard-grid">


                <!-- TASKS -->

                <div class="card large-card">

                    <div class="card-header">

                        <div>

                            <span class="section-label">
                                TODAY
                            </span>

                            <h2>
                                Your priorities
                            </h2>

                        </div>

                        <button
                            class="text-button"
                            onclick="navigate('tasks')">

                            View all →

                        </button>

                    </div>


                    <div class="task-list">

                        ${
                            pendingTasks.length
                                ? pendingTasks
                                    .map(task => taskHTML(task))
                                    .join("")
                                : `
                                    <div class="empty-state">
                                        <div>🎉</div>
                                        <h3>All caught up!</h3>
                                        <p>
                                            You have no pending tasks.
                                        </p>
                                    </div>
                                `
                        }

                    </div>

                </div>


                <!-- PROGRESS -->

                <div class="card">

                    <div class="card-header">

                        <div>

                            <span class="section-label">
                                PROGRESS
                            </span>

                            <h2>
                                Today's progress
                            </h2>

                        </div>

                    </div>


                    <div class="progress-circle"
                         style="--progress:${progress * 3.6}deg">

                        <div>

                            <strong>
                                ${progress}%
                            </strong>

                            <span>
                                complete
                            </span>

                        </div>

                    </div>


                    <p class="center-text">

                        ${
                            progress >= 80
                                ? "Excellent work! 🔥"
                                : progress >= 50
                                    ? "You're doing well. Keep going!"
                                    : "Let's get started!"
                        }

                    </p>

                </div>

            </div>


            <!-- QUICK ACTIONS -->

            <div class="section-heading">

                <div>

                    <span class="section-label">
                        PRODUCTIVITY
                    </span>

                    <h2>
                        Quick actions
                    </h2>

                </div>

            </div>


            <div class="quick-grid">

                <button
                    class="quick-card"
                    onclick="openAddTask()">

                    <span class="quick-icon purple">
                        ✓
                    </span>

                    <strong>
                        Add Task
                    </strong>

                    <small>
                        Organize your work
                    </small>

                </button>


                <button
                    class="quick-card"
                    onclick="openAddNote()">

                    <span class="quick-icon blue">
                        📝
                    </span>

                    <strong>
                        Create Note
                    </strong>

                    <small>
                        Capture your ideas
                    </small>

                </button>


                <button
                    class="quick-card"
                    onclick="navigate('focus')">

                    <span class="quick-icon green">
                        ⏱
                    </span>

                    <strong>
                        Start Focus
                    </strong>

                    <small>
                        Deep work session
                    </small>

                </button>


                <button
                    class="quick-card"
                    onclick="navigate('planner')">

                    <span class="quick-icon orange">
                        📅
                    </span>

                    <strong>
                        Plan Week
                    </strong>

                    <small>
                        See your schedule
                    </small>

                </button>

            </div>

        </div>
    `;
}


/* =========================================================
   TASKS
========================================================= */

function renderTasks(container) {

    container.innerHTML = `

        <div class="page-enter">

            <div class="page-title">

                <div>

                    <span class="section-label">
                        PRODUCTIVITY
                    </span>

                    <h1>
                        Tasks
                    </h1>

                    <p>
                        Everything you need to get done.
                    </p>

                </div>

                <button
                    class="primary-button"
                    onclick="openAddTask()">

                    + New Task

                </button>

            </div>


            <div class="filter-bar">

                <button
                    class="filter active"
                    onclick="filterTasks('all', this)">
                    All
                </button>

                <button
                    class="filter"
                    onclick="filterTasks('pending', this)">
                    Pending
                </button>

                <button
                    class="filter"
                    onclick="filterTasks('completed', this)">
                    Completed
                </button>

            </div>


            <div
                id="task-page-list"
                class="full-task-list">

                ${data.tasks.map(task => taskHTML(task)).join("")}

            </div>

        </div>
    `;
}


function taskHTML(task) {

    return `

        <div
            class="task-row ${task.completed ? "completed" : ""}"
            data-task-id="${task.id}">

            <button
                class="task-check"
                onclick="toggleTask(${task.id})">

                ${task.completed ? "✓" : ""}

            </button>


            <div class="task-information">

                <strong>
                    ${escapeHTML(task.title)}
                </strong>

                <span>
                    ${escapeHTML(task.subject)}
                    • ${escapeHTML(task.date)}
                </span>

            </div>


            <span class="priority ${task.priority.toLowerCase()}">
                ${escapeHTML(task.priority)}
            </span>


            <button
                class="delete-button"
                onclick="deleteTask(${task.id})">

                ×

            </button>

        </div>
    `;
}


function toggleTask(id) {

    const task = data.tasks.find(
        task => task.id === id
    );

    if (!task) return;

    task.completed = !task.completed;

    saveData();

    showToast(
        task.completed
            ? "Task completed 🎉"
            : "Task marked as pending"
    );

    navigate("tasks");
}


function deleteTask(id) {

    data.tasks = data.tasks.filter(
        task => task.id !== id
    );

    saveData();

    showToast("Task deleted");

    navigate("tasks");
}


function filterTasks(type, button) {

    document.querySelectorAll(".filter")
        .forEach(btn => btn.classList.remove("active"));

    button.classList.add("active");


    const container =
        document.getElementById("task-page-list");

    let tasks = data.tasks;

    if (type === "pending") {
        tasks = tasks.filter(task => !task.completed);
    }

    if (type === "completed") {
        tasks = tasks.filter(task => task.completed);
    }


    container.innerHTML = tasks.length
        ? tasks.map(task => taskHTML(task)).join("")
        : `
            <div class="empty-state">
                <div>✨</div>
                <h3>No tasks here</h3>
                <p>You're all clear.</p>
            </div>
        `;
}


/* =========================================================
   NOTES
========================================================= */

function renderNotes(container) {

    container.innerHTML = `

        <div class="page-enter">

            <div class="page-title">

                <div>

                    <span class="section-label">
                        KNOWLEDGE
                    </span>

                    <h1>
                        My Notes
                    </h1>

                    <p>
                        Keep your learning organized.
                    </p>

                </div>


                <button
                    class="primary-button"
                    onclick="openAddNote()">

                    + New Note

                </button>

            </div>


            <div class="notes-grid">

                ${
                    data.notes.length
                        ? data.notes
                            .map(note => noteHTML(note))
                            .join("")
                        : `
                            <div class="empty-state">
                                <div>📝</div>
                                <h3>No notes yet</h3>
                                <p>Create your first note.</p>
                            </div>
                        `
                }

            </div>

        </div>
    `;
}


function noteHTML(note) {

    return `

        <article class="note-card">

            <div class="note-top">

                <span class="note-subject">
                    ${escapeHTML(note.subject)}
                </span>

                <button
                    class="delete-button"
                    onclick="deleteNote(${note.id})">
                    ×
                </button>

            </div>


            <h3>
                ${escapeHTML(note.title)}
            </h3>


            <p>
                ${escapeHTML(note.content)}
            </p>


            <div class="note-footer">

                <span>
                    ${escapeHTML(note.date)}
                </span>

                <button
                    class="text-button"
                    onclick="viewNote(${note.id})">

                    Open →

                </button>

            </div>

        </article>
    `;
}


function deleteNote(id) {

    data.notes = data.notes.filter(
        note => note.id !== id
    );

    saveData();

    showToast("Note deleted");

    navigate("notes");
}


function viewNote(id) {

    const note = data.notes.find(
        n => n.id === id
    );

    if (!note) return;

    openModal(`

        <div class="modal-header">

            <div>

                <span class="note-subject">
                    ${escapeHTML(note.subject)}
                </span>

                <h2>
                    ${escapeHTML(note.title)}
                </h2>

            </div>

            <button
                class="modal-close"
                onclick="closeModal()">
                ×
            </button>

        </div>


        <div class="note-content">

            ${escapeHTML(note.content)}

        </div>

    `);
}


/* =========================================================
   PLANNER
========================================================= */

function renderPlanner(container) {

    const today = new Date();

    const days = [];

    for (let i = 0; i < 7; i++) {

        const date = new Date(today);

        date.setDate(
            today.getDate() + i
        );

        days.push(date);
    }


    container.innerHTML = `

        <div class="page-enter">

            <div class="page-title">

                <div>

                    <span class="section-label">
                        ORGANIZE
                    </span>

                    <h1>
                        Weekly Planner
                    </h1>

                    <p>
                        Plan your week before it plans you.
                    </p>

                </div>

                <button
                    class="primary-button"
                    onclick="openAddTask()">

                    + Add Task

                </button>

            </div>


            <div class="week-grid">

                ${days.map(date => {

                    const dayName =
                        date.toLocaleDateString(
                            "en-US",
                            { weekday: "short" }
                        );

                    const dayNumber =
                        date.getDate();

                    const isToday =
                        date.toDateString() ===
                        today.toDateString();

                    return `

                        <div
                            class="day-card ${isToday ? "today" : ""}">

                            <span>
                                ${dayName}
                            </span>

                            <strong>
                                ${dayNumber}
                            </strong>

                            ${
                                isToday
                                    ? `<small>Today</small>`
                                    : ""
                            }

                        </div>

                    `;

                }).join("")}

            </div>


            <div class="card planner-tasks">

                <div class="card-header">

                    <div>

                        <span class="section-label">
                            UPCOMING
                        </span>

                        <h2>
                            Upcoming tasks
                        </h2>

                    </div>

                </div>


                ${data.tasks
                    .filter(t => !t.completed)
                    .map(task => taskHTML(task))
                    .join("")}

            </div>

        </div>
    `;
}


/* =========================================================
   HABITS
========================================================= */

function renderHabits(container) {

    const completed =
        data.habits.filter(
            h => h.completed
        ).length;

    const percentage =
        data.habits.length
            ? Math.round(
                completed /
                data.habits.length *
                100
            )
            : 0;


    container.innerHTML = `

        <div class="page-enter">

            <div class="page-title">

                <div>

                    <span class="section-label">
                        CONSISTENCY
                    </span>

                    <h1>
                        Daily Habits
                    </h1>

                    <p>
                        Small actions become big results.
                    </p>

                </div>

            </div>


            <div class="habit-summary card">

                <div>

                    <span>
                        Today's completion
                    </span>

                    <strong>
                        ${percentage}%
                    </strong>

                </div>

                <div class="progress-bar">

                    <div
                        style="width:${percentage}%">
                    </div>

                </div>

            </div>


            <div class="habit-list">

                ${data.habits.map(habit => `

                    <div
                        class="habit-row ${habit.completed ? "completed" : ""}">

                        <button
                            class="habit-check"
                            onclick="toggleHabit(${habit.id})">

                            ${habit.completed ? "✓" : ""}

                        </button>

                        <span>
                            ${escapeHTML(habit.name)}
                        </span>

                        <small>
                            ${habit.completed ? "Done" : "Not done"}
                        </small>

                    </div>

                `).join("")}

            </div>

        </div>
    `;
}


function toggleHabit(id) {

    const habit =
        data.habits.find(
            h => h.id === id
        );

    if (!habit) return;

    habit.completed = !habit.completed;

    saveData();

    showToast(
        habit.completed
            ? "Habit completed 🔥"
            : "Habit unchecked"
    );

    navigate("habits");
}


/* =========================================================
   FOCUS TIMER
========================================================= */

let focusSeconds = 25 * 60;
let focusInterval = null;
let focusRunning = false;


function renderFocus(container) {

    container.innerHTML = `

        <div class="page-enter focus-page">

            <div class="page-title">

                <div>

                    <span class="section-label">
                        DEEP WORK
                    </span>

                    <h1>
                        Focus Mode
                    </h1>

                    <p>
                        Put distractions away and get one thing done.
                    </p>

                </div>

            </div>


            <div class="focus-card">

                <div class="focus-mode">
                    Pomodoro
                </div>


                <div
                    id="focus-timer"
                    class="focus-timer">

                    25:00

                </div>


                <p>
                    Stay focused for 25 minutes.
                </p>


                <div class="focus-controls">

                    <button
                        class="primary-button"
                        id="focus-start"
                        onclick="toggleFocus()">

                        Start Focus

                    </button>


                    <button
                        class="secondary-button"
                        onclick="resetFocus()">

                        Reset

                    </button>

                </div>

            </div>


            <div class="focus-tips">

                <div class="tip-card">
                    <span>📱</span>
                    <strong>Remove distractions</strong>
                    <p>Put your phone on silent.</p>
                </div>

                <div class="tip-card">
                    <span>🎯</span>
                    <strong>One task</strong>
                    <p>Focus on one important thing.</p>
                </div>

                <div class="tip-card">
                    <span>☕</span>
                    <strong>Take breaks</strong>
                    <p>Rest after each session.</p>
                </div>

            </div>

        </div>
    `;

    updateTimerDisplay();
}


function toggleFocus() {

    const button =
        document.getElementById("focus-start");

    if (focusRunning) {

        clearInterval(focusInterval);

        focusRunning = false;

        button.textContent =
            "Resume Focus";

        return;
    }


    focusRunning = true;

    button.textContent =
        "Pause";


    focusInterval =
        setInterval(() => {

            if (focusSeconds <= 0) {

                clearInterval(focusInterval);

                focusRunning = false;

                data.studyTime =
                    Number(
                        (
                            data.studyTime + 0.42
                        ).toFixed(1)
                    );

                saveData();

                showToast(
                    "Focus session completed! 🎉"
                );

                focusSeconds =
                    25 * 60;

                navigate("focus");

                return;
            }

            focusSeconds--;

            updateTimerDisplay();

        }, 1000);
}


function updateTimerDisplay() {

    const timer =
        document.getElementById("focus-timer");

    if (!timer) return;

    const minutes =
        Math.floor(focusSeconds / 60);

    const seconds =
        focusSeconds % 60;

    timer.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}


function resetFocus() {

    clearInterval(focusInterval);

    focusRunning = false;

    focusSeconds = 25 * 60;

    updateTimerDisplay();

    const button =
        document.getElementById("focus-start");

    if (button) {
        button.textContent =
            "Start Focus";
    }
}


/* =========================================================
   RESOURCES
========================================================= */

function renderResources(container) {

    const resources = [

        {
            icon: "📖",
            title: "Study Notes",
            text: "Keep subject notes organized."
        },

        {
            icon: "🧠",
            title: "Study Methods",
            text: "Pomodoro, active recall and spaced repetition."
        },

        {
            icon: "📅",
            title: "Planning",
            text: "Plan assignments, exams and deadlines."
        },

        {
            icon: "💼",
            title: "Career",
            text: "Track internships, skills and career goals."
        },

        {
            icon: "💰",
            title: "Finance",
            text: "Build healthy student money habits."
        },

        {
            icon: "🧘",
            title: "Wellbeing",
            text: "Balance academic performance with life."
        }

    ];


    container.innerHTML = `

        <div class="page-enter">

            <div class="page-title">

                <div>

                    <span class="section-label">
                        STUDENT TOOLKIT
                    </span>

                    <h1>
                        Resources
                    </h1>

                    <p>
                        Useful tools for your university journey.
                    </p>

                </div>

            </div>


            <div class="resource-grid">

                ${resources.map(resource => `

                    <div class="resource-card">

                        <div class="resource-icon">
                            ${resource.icon}
                        </div>

                        <h3>
                            ${resource.title}
                        </h3>

                        <p>
                            ${resource.text}
                        </p>

                        <button
                            class="text-button"
                            onclick="showToast('More resources coming soon!')">

                            Explore →

                        </button>

                    </div>

                `).join("")}

            </div>

        </div>
    `;
}


/* =========================================================
   PROFILE
========================================================= */

function renderProfile(container) {

    container.innerHTML = `

        <div class="page-enter">

            <div class="page-title">

                <div>

                    <span class="section-label">
                        ACCOUNT
                    </span>

                    <h1>
                        My Profile
                    </h1>

                    <p>
                        Personalize your StudentOS experience.
                    </p>

                </div>

            </div>


            <div class="profile-card card">

                <div class="large-avatar">
                    ${getInitials(data.user.name)}
                </div>


                <div class="profile-info">

                    <h2>
                        ${escapeHTML(data.user.name)}
                    </h2>

                    <p>
                        ${escapeHTML(data.user.university)}
                    </p>

                </div>

            </div>


            <div class="card profile-form">

                <h2>
                    Student information
                </h2>


                <label>
                    Your name

                    <input
                        id="profile-name"
                        value="${escapeHTML(data.user.name)}"
                    >

                </label>


                <label>
                    University

                    <input
                        id="profile-university"
                        value="${escapeHTML(data.user.university)}"
                    >

                </label>


                <label>
                    Degree

                    <input
                        id="profile-degree"
                        value="${escapeHTML(data.user.degree)}"
                    >

                </label>


                <label>
                    Academic year

                    <select id="profile-year">

                        ${[
                            "1st Year",
                            "2nd Year",
                            "3rd Year",
                            "4th Year",
                            "Postgraduate"
                        ].map(year => `
                            <option
                                ${data.user.year === year ? "selected" : ""}>
                                ${year}
                            </option>
                        `).join("")}

                    </select>

                </label>


                <button
                    class="primary-button"
                    onclick="saveProfile()">

                    Save Profile

                </button>

            </div>

        </div>
    `;
}


function saveProfile() {

    data.user.name =
        document.getElementById(
            "profile-name"
        ).value.trim() || "Student";

    data.user.university =
        document.getElementById(
            "profile-university"
        ).value.trim() || "University Student";

    data.user.degree =
        document.getElementById(
            "profile-degree"
        ).value.trim() || "Undergraduate";

    data.user.year =
        document.getElementById(
            "profile-year"
        ).value;


    saveData();

    renderLayout();

    navigate("profile");

    showToast("Profile updated successfully");
}


function getInitials(name) {

    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(word => word[0])
        .join("")
        .toUpperCase();
}


/* =========================================================
   MODALS
========================================================= */

function openModal(content) {

    const root =
        document.getElementById("modal-root");

    root.innerHTML = `

        <div
            class="modal-overlay"
            onclick="closeModalOutside(event)">

            <div
                class="modal"
                onclick="event.stopPropagation()">

                ${content}

            </div>

        </div>
    `;

    document.body.classList.add("modal-open");
}


function closeModal() {

    const root =
        document.getElementById("modal-root");

    if (root) {
        root.innerHTML = "";
    }

    document.body.classList.remove(
        "modal-open"
    );
}


function closeModalOutside(event) {

    if (
        event.target.classList.contains(
            "modal-overlay"
        )
    ) {
        closeModal();
    }
}


/* =========================================================
   ADD TASK
========================================================= */

function openAddTask() {

    openModal(`

        <div class="modal-header">

            <div>

                <span class="section-label">
                    PRODUCTIVITY
                </span>

                <h2>
                    Add a task
                </h2>

            </div>

            <button
                class="modal-close"
                onclick="closeModal()">
                ×
            </button>

        </div>


        <form
            onsubmit="createTask(event)"
            class="form">

            <label>
                Task title

                <input
                    id="task-title"
                    required
                    placeholder="e.g. Complete assignment"
                >

            </label>


            <label>
                Subject

                <input
                    id="task-subject"
                    placeholder="e.g. HRM"
                >

            </label>


            <label>
                Due

                <select id="task-date">

                    <option>Today</option>
                    <option>Tomorrow</option>
                    <option>This Week</option>
                    <option>Next Week</option>

                </select>

            </label>


            <label>
                Priority

                <select id="task-priority">

                    <option>High</option>
                    <option selected>Medium</option>
                    <option>Low</option>

                </select>

            </label>


            <button
                class="primary-button"
                type="submit">

                Create Task

            </button>

        </form>
    `);
}


function createTask(event) {

    event.preventDefault();

    const task = {

        id: generateId(),

        title:
            document.getElementById(
                "task-title"
            ).value.trim(),

        subject:
            document.getElementById(
                "task-subject"
            ).value.trim() || "General",

        date:
            document.getElementById(
                "task-date"
            ).value,

        priority:
            document.getElementById(
                "task-priority"
            ).value,

        completed: false

    };


    data.tasks.unshift(task);

    saveData();

    closeModal();

    showToast("Task created successfully");

    navigate("tasks");
}


/* =========================================================
   ADD NOTE
========================================================= */

function openAddNote() {

    openModal(`

        <div class="modal-header">

            <div>

                <span class="section-label">
                    KNOWLEDGE
                </span>

                <h2>
                    Create a note
                </h2>

            </div>

            <button
                class="modal-close"
                onclick="closeModal()">
                ×
            </button>

        </div>


        <form
            onsubmit="createNote(event)"
            class="form">

            <label>
                Note title

                <input
                    id="note-title"
                    required
                    placeholder="e.g. Green HRM summary"
                >

            </label>


            <label>
                Subject

                <input
                    id="note-subject"
                    required
                    placeholder="e.g. Human Resource Management"
                >

            </label>


            <label>
                Your note

                <textarea
                    id="note-content"
                    required
                    rows="7"
                    placeholder="Write your notes here..."
                ></textarea>

            </label>


            <button
                class="primary-button"
                type="submit">

                Save Note

            </button>

        </form>
    `);
}


function createNote(event) {

    event.preventDefault();

    const note = {

        id: generateId(),

        title:
            document.getElementById(
                "note-title"
            ).value.trim(),

        subject:
            document.getElementById(
                "note-subject"
            ).value.trim(),

        content:
            document.getElementById(
                "note-content"
            ).value.trim(),

        date: "Just now"

    };


    data.notes.unshift(note);

    saveData();

    closeModal();

    showToast("Note saved successfully");

    navigate("notes");
}


/* =========================================================
   NOTIFICATIONS
========================================================= */

function showNotifications() {

    openModal(`

        <div class="modal-header">

            <h2>
                Notifications
            </h2>

            <button
                class="modal-close"
                onclick="closeModal()">
                ×
            </button>

        </div>


        <div class="notification-list">

            <div class="notification">
                <span>🎓</span>
                <div>
                    <strong>
                        Welcome to StudentOS
                    </strong>
                    <p>
                        Your student productivity system is ready.
                    </p>
                </div>
            </div>


            <div class="notification">
                <span>🔥</span>
                <div>
                    <strong>
                        Build your study streak
                    </strong>
                    <p>
                        Complete your daily habits today.
                    </p>
                </div>
            </div>


            <div class="notification">
                <span>📚</span>
                <div>
                    <strong>
                        Keep your notes organized
                    </strong>
                    <p>
                        Create notes after every lecture.
                    </p>
                </div>
            </div>

        </div>

    `);
}


/* =========================================================
   SEARCH
========================================================= */

function globalSearch(query) {

    if (!query.trim()) return;

    const search =
        query.toLowerCase();

    const matchingTasks =
        data.tasks.filter(task =>
            task.title.toLowerCase().includes(search) ||
            task.subject.toLowerCase().includes(search)
        );

    const matchingNotes =
        data.notes.filter(note =>
            note.title.toLowerCase().includes(search) ||
            note.subject.toLowerCase().includes(search) ||
            note.content.toLowerCase().includes(search)
        );


    if (
        matchingTasks.length === 0 &&
        matchingNotes.length === 0
    ) {
        return;
    }

    // Search results are shown when Enter is pressed.
}


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" &&
            event.target.matches(
                ".topbar-search input"
            )
        ) {

            const query =
                event.target.value.trim();

            if (!query) return;

            showSearchResults(query);
        }

        if (event.key === "Escape") {
            closeModal();
        }

    }
);


function showSearchResults(query) {

    const search =
        query.toLowerCase();

    const tasks =
        data.tasks.filter(task =>
            `${task.title} ${task.subject}`
                .toLowerCase()
                .includes(search)
        );

    const notes =
        data.notes.filter(note =>
            `${note.title} ${note.subject} ${note.content}`
                .toLowerCase()
                .includes(search)
        );


    openModal(`

        <div class="modal-header">

            <div>

                <span class="section-label">
                    SEARCH
                </span>

                <h2>
                    Results for "${escapeHTML(query)}"
                </h2>

            </div>

            <button
                class="modal-close"
                onclick="closeModal()">
                ×
            </button>

        </div>


        <div class="search-results">

            ${
                tasks.map(task => `

                    <div class="search-result">

                        <span>✓</span>

                        <div>

                            <strong>
                                ${escapeHTML(task.title)}
                            </strong>

                            <small>
                                Task • ${escapeHTML(task.subject)}
                            </small>

                        </div>

                    </div>

                `).join("")
            }


            ${
                notes.map(note => `

                    <div class="search-result">

                        <span>📝</span>

                        <div>

                            <strong>
                                ${escapeHTML(note.title)}
                            </strong>

                            <small>
                                Note • ${escapeHTML(note.subject)}
                            </small>

                        </div>

                    </div>

                `).join("")
            }


            ${
                !tasks.length && !notes.length
                    ? `
                        <div class="empty-state">
                            <div>🔎</div>
                            <h3>No results</h3>
                            <p>
                                Try another search.
                            </p>
                        </div>
                    `
                    : ""
            }

        </div>

    `);
}


/* =========================================================
   MOBILE SIDEBAR
========================================================= */

function toggleSidebar() {

    const sidebar =
        document.querySelector(".sidebar");

    if (!sidebar) return;

    sidebar.classList.toggle("open");
}


/* =========================================================
   RESET
========================================================= */

function resetData() {

    const confirmed =
        confirm(
            "Reset StudentOS to the original demo data?"
        );

    if (!confirmed) return;

    localStorage.removeItem(
        "studentOS"
    );

    data = loadData();

    renderLayout();

    navigate("dashboard");

    showToast("StudentOS reset");
}


/* =========================================================
   START APP
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initApp
);