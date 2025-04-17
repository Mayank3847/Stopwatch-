let hours = 0, minutes = 0, seconds = 0, milliseconds = 0;
let timer = null;
let running = false;
let laps = [];

const hoursSpan = document.getElementById("hours");
const minutesSpan = document.getElementById("minutes");
const secondsSpan = document.getElementById("seconds");
const millisecondsSpan = document.getElementById("milliseconds");

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resumeBtn = document.getElementById("resumeBtn");
const lapBtn = document.getElementById("lapBtn");
const resetBtn = document.getElementById("resetBtn");

const lapsBody = document.getElementById("lapsBody");

// Function to update display
function updateDisplay() {
    hoursSpan.textContent = String(hours).padStart(2, "0");
    minutesSpan.textContent = String(minutes).padStart(2, "0");
    secondsSpan.textContent = String(seconds).padStart(2, "0");
    millisecondsSpan.textContent = String(milliseconds).padStart(3, "0");
}

// Function to update time
function updateTime() {
    milliseconds += 10;
    if (milliseconds >= 1000) {
        milliseconds = 0;
        seconds++;
    }
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
    }
    if (minutes >= 60) {
        minutes = 0;
        hours++;
    }
    updateDisplay();
}

// Start Timer
function startTimer() {
    if (!running) {
        running = true;
        timer = setInterval(updateTime, 10);
        console.log("Started");

        startBtn.style.display = "none";
        stopBtn.style.display = "inline-block";
        lapBtn.style.display = "inline-block";
        resetBtn.style.display = "inline-block";
        resumeBtn.style.display = "none";
    }
}

// Stop Timer
function stopTimer() {
    if (running) {
        clearInterval(timer);
        running = false;
        console.log("Stopped");

        stopBtn.style.display = "none";
        lapBtn.style.display = "none";
        resumeBtn.style.display = "inline-block";
        resetBtn.style.display = "inline-block";
    }
}

// Resume Timer
function resumeTimer() {
    if (!running) {
        running = true;
        timer = setInterval(updateTime, 10);
        console.log("Resumed");

        resumeBtn.style.display = "none";
        stopBtn.style.display = "inline-block";
        lapBtn.style.display = "inline-block";
    }
}

function resetTimer() {
    clearInterval(timer);
    running = false;
    hours = 0;
    minutes = 0;
    seconds = 0;
    milliseconds = 0;
    updateDisplay();
    laps = [];
    lapsBody.innerHTML = "";
    console.log("Reset");

    document.querySelector('.table-wrapper').style.display = 'none';

    startBtn.style.display = "inline-block";
    stopBtn.style.display = "none";
    resumeBtn.style.display = "none";
    lapBtn.style.display = "none";
    resetBtn.style.display = "none";
}

// Record Lap
function recordLap() {
    if (running) {
        const totalTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(milliseconds).padStart(3, "0")}`;

        let lapTime = totalTime; 

        if (laps.length > 0) {
            const lastLap = laps[laps.length - 1].rawTime;
            lapTime = calculateLapDifference(lastLap, { hours, minutes, seconds, milliseconds });
        }

        laps.push({
            lap: laps.length + 1,
            lapTime: lapTime,
            totalTime: totalTime,
            rawTime: { hours, minutes, seconds, milliseconds }
        });

        const row = document.createElement("tr");
        row.innerHTML = `<td>Lap ${laps.length}</td><td>${lapTime}</td><td>${totalTime}</td>`;
        lapsBody.appendChild(row);

        const tableWrapper = document.querySelector('.table-wrapper');
        tableWrapper.style.display = 'block'; // <-- Add this line

        tableWrapper.scrollTop = tableWrapper.scrollHeight;

        console.log(`Lap ${laps.length} recorded`);
    }
}


function calculateLapDifference(prev, current) {
    let ms = current.milliseconds - prev.milliseconds;
    let sec = current.seconds - prev.seconds;
    let min = current.minutes - prev.minutes;
    let hr = current.hours - prev.hours;

    if (ms < 0) {
        ms += 1000;
        sec--;
    }
    if (sec < 0) {
        sec += 60;
        min--;
    }
    if (min < 0) {
        min += 60;
        hr--;
    }

    return `${String(hr).padStart(2, "0")}:${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}:${String(ms).padStart(3, "0")}`;
}

startBtn.addEventListener("click", startTimer);
stopBtn.addEventListener("click", stopTimer);
resumeBtn.addEventListener("click", resumeTimer);
resetBtn.addEventListener("click", resetTimer);
lapBtn.addEventListener("click", recordLap);

stopBtn.style.display = "none";
resumeBtn.style.display = "none";
lapBtn.style.display = "none";
resetBtn.style.display = "none";

updateDisplay();
