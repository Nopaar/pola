const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const dots = document.querySelectorAll(".dot");
const patternResult = document.getElementById("patternResult");

let pattern = [];
let selectedDots = [];
let drawing = false;

/* =========================
   RESIZE CANVAS
========================= */
function resizeCanvas() {
    const grid = document.getElementById("grid");

    canvas.width = grid.offsetWidth;
    canvas.height = grid.offsetHeight;

    canvas.style.width = grid.offsetWidth + "px";
    canvas.style.height = grid.offsetHeight + "px";

    drawLines();
}

window.addEventListener("resize", resizeCanvas);

/* =========================
   GET CENTER DOT
========================= */
function getCenter(dot) {

    const gridRect =
        document.getElementById("grid")
        .getBoundingClientRect();

    const rect =
        dot.getBoundingClientRect();

    return {
        x: rect.left - gridRect.left + rect.width / 2,
        y: rect.top - gridRect.top + rect.height / 2
    };
}

/* =========================
   DRAW LINE
========================= */
function drawLines(currentPoint = null) {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (selectedDots.length < 1) return;

    ctx.beginPath();

    const first = getCenter(selectedDots[0]);
    ctx.moveTo(first.x, first.y);

    for (let i = 1; i < selectedDots.length; i++) {
        const p = getCenter(selectedDots[i]);
        ctx.lineTo(p.x, p.y);
    }

    if (currentPoint) {
        ctx.lineTo(currentPoint.x, currentPoint.y);
    }

    ctx.strokeStyle = "#1a73e8";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
}

/* =========================
   ACTIVATE DOT
========================= */
function activateDot(dot) {

    const id = dot.dataset.id;

    if (pattern.includes(id)) return;

    pattern.push(id);
    selectedDots.push(dot);

    dot.classList.add("active");

    patternResult.textContent = pattern.join("-");
    drawLines();
}

/* =========================
   DETECT DOT
========================= */
function getDotFromPoint(x, y) {

    for (const dot of dots) {

        const rect = dot.getBoundingClientRect();

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distance = Math.hypot(x - centerX, y - centerY);

        if (distance < 40) {
            return dot;
        }
    }

    return null;
}

/* =========================
   TOUCH POSITION
========================= */
function getTouchPos(e) {

    const gridRect =
        document.getElementById("grid")
        .getBoundingClientRect();

    const touch = e.touches[0];

    return {
        x: touch.clientX - gridRect.left,
        y: touch.clientY - gridRect.top
    };
}

/* =========================
   TOUCH EVENTS
========================= */
document.addEventListener("touchstart", e => {

    const dot = getDotFromPoint(
        e.touches[0].clientX,
        e.touches[0].clientY
    );

    if (!dot) return;

    e.preventDefault();

    drawing = true;
    activateDot(dot);
}, { passive: false });

document.addEventListener("touchmove", e => {

    if (!drawing) return;

    e.preventDefault();

    const touch = e.touches[0];

    const dot = getDotFromPoint(
        touch.clientX,
        touch.clientY
    );

    if (dot) {
        activateDot(dot);
    }

    drawLines(getTouchPos(e));

}, { passive: false });

document.addEventListener("touchend", () => {
    drawing = false;
    drawLines();
});

/* =========================
   MOUSE SUPPORT
========================= */
document.addEventListener("mousedown", e => {

    const dot = getDotFromPoint(e.clientX, e.clientY);

    if (!dot) return;

    drawing = true;
    activateDot(dot);
});

document.addEventListener("mousemove", e => {

    if (!drawing) return;

    const dot = getDotFromPoint(e.clientX, e.clientY);

    if (dot) {
        activateDot(dot);
    }

    const gridRect =
        document.getElementById("grid")
        .getBoundingClientRect();

    drawLines({
        x: e.clientX - gridRect.left,
        y: e.clientY - gridRect.top
    });
});

document.addEventListener("mouseup", () => {
    drawing = false;
    drawLines();
});

/* =========================
   RESET BUTTON
========================= */
document.getElementById("resetBtn")
.addEventListener("click", () => {

    pattern = [];
    selectedDots = [];

    dots.forEach(dot => {
        dot.classList.remove("active");
    });

    patternResult.textContent = "-";

    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

/* =========================
   SAVE PNG (NEW FIXED)
========================= */
document.getElementById("saveBtn").addEventListener("click", async () => {

    const namaTeknisi =
        document.getElementById("namaTeknisi").value.trim();

    const merkHp =
        document.getElementById("merkHp").value.trim();

    const kerusakan =
        document.getElementById("kerusakan").value.trim();

    const tanggalInput =
        document.getElementById("tanggal").value;

    if (!namaTeknisi || !merkHp || !kerusakan || !tanggalInput) {
        alert("Lengkapi data terlebih dahulu!");
        return;
    }

    const t = new Date(tanggalInput);

    const d = t.getDate();
    const m = t.getMonth() + 1;
    const y = String(t.getFullYear()).slice(-2);

    const fileName =
        `${namaTeknisi}-${merkHp}-${kerusakan}-${d}-${m}-${y}.png`
        .replace(/\s+/g, '-')
        .toLowerCase();

    const target = document.getElementById("captureArea");

    if (!target) {
        alert("captureArea tidak ditemukan!");
        return;
    }

    try {

        const canvas = await html2canvas(target, {
            backgroundColor: "#ffffff",
            scale: 3,
            useCORS: true,
            allowTaint: true,
            logging: true,
            scrollX: 0,
            scrollY: 0
        });

        canvas.toBlob((blob) => {

            if (!blob) {
                alert("Gagal membuat gambar");
                return;
            }

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = fileName;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setTimeout(() => URL.revokeObjectURL(url), 1000);

        }, "image/png");

    } catch (err) {
        console.log("ERROR SAVE:", err);
        alert("Save gagal, cek console");
    }

});

/* =========================
   INIT
========================= */
resizeCanvas();
