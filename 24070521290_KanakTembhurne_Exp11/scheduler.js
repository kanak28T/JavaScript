
import { formatTime } from "./timer.js";

const currentTime = document.getElementById("currentTime");
const countdown = document.getElementById("countdown");
const status = document.getElementById("status");
const message = document.getElementById("message");
const classTime = document.getElementById("classTime");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

let intervalId = null;
let timeoutId = null;
let targetTime = null;
let scheduledAt = null;
let notified = false;

// Update the live clock every second
function updateClock() {
    currentTime.textContent =
        new Date().toLocaleTimeString();
}

updateClock();
setInterval(updateClock, 1000);

// Clear scheduled timers
function stopTimers() {
    clearInterval(intervalId);
    clearTimeout(timeoutId);
    intervalId = null;
    timeoutId = null;
}

// Update the countdown and progress display
function updateCountdown() {
    const now = Date.now();
    const remaining = targetTime - now;

    if (remaining <= 0) {
        countdown.textContent = "00:00:00";
        progressBar.style.width = "100%";
        progressText.textContent = "100%";
        status.textContent = "Class Started!";
        status.className = "tag finished";

        if (!notified) {
            notified = true;
            message.textContent =
                "🔔 Your scheduled class has started!";
        }

        stopTimers();
        startBtn.disabled = false;
        return;
    }

    countdown.textContent = formatTime(remaining);

    const totalDuration = targetTime - scheduledAt;
    const elapsed = Math.max(0, now - scheduledAt);

    const progress = totalDuration > 0
        ? Math.min(100, (elapsed / totalDuration) * 100)
        : 0;

    progressBar.style.width = progress + "%";
    progressText.textContent = Math.floor(progress) + "%";
}

// Start the class countdown
function startCountdown() {
    stopTimers();

    if (!classTime.value) {
        message.textContent =
            "Please select a class date and time.";
        return;
    }

    targetTime = new Date(classTime.value).getTime();

    if (!Number.isFinite(targetTime) || targetTime <= Date.now()) {
        message.textContent =
            "Please select a valid future date and time.";
        return;
    }

    scheduledAt = Date.now();
    notified = false;

    status.textContent = "Scheduled";
    status.className = "tag active";
    message.textContent = "Your class countdown is running.";
    startBtn.disabled = true;

    updateCountdown();

    // Real-time update every second
    intervalId = setInterval(updateCountdown, 1000);

    // Trigger a callback when the class is scheduled to begin
    timeoutId = setTimeout(() => {
        updateCountdown();
    }, Math.min(targetTime - Date.now(), 2147483647));
}

// Reset all countdown information
function resetCountdown() {
    stopTimers();

    targetTime = null;
    scheduledAt = null;
    notified = false;

    countdown.textContent = "00:00:00";
    status.textContent = "Not scheduled";
    status.className = "tag";
    message.textContent =
        "Select a future time to schedule your class.";

    progressBar.style.width = "0%";
    progressText.textContent = "0%";
    classTime.value = "";
    startBtn.disabled = false;
}

startBtn.addEventListener("click", startCountdown);
resetBtn.addEventListener("click", resetCountdown);
