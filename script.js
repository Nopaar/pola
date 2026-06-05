const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const dots = document.querySelectorAll(".dot");
const patternResult = document.getElementById("patternResult");

let pattern = [];
let selectedDots = [];
let drawing = false;

function resizeCanvas() {
    const grid = document.getElementById("grid");

    canvas.width = grid.offsetWidth;
    canvas.height = grid.offsetHeight;

    canvas.style.width = grid.offsetWidth + "px";
    canvas.style.height = grid.offsetHeight + "px";

    drawLines();
}

window.addEventListener("resize", resizeCanvas);

function getCenter(dot) {

    const gridRect =
        document.getElementById("grid")
        .getBoundingClientRect();

    const rect =
        dot.getBoundingClientRect();

    return {
        x:
            rect.left -
            gridRect.left +
            rect.width / 2,

        y:
            rect.top -
            gridRect.top +
            rect.height / 2
    };
}

function drawLines(currentPoint = null) {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    if(selectedDots.length < 1) return;

    ctx.beginPath();

    const first =
        getCenter(selectedDots[0]);

    ctx.moveTo(first.x, first.y);

    for(let i = 1; i < selectedDots.length; i++){

        const p =
            getCenter(selectedDots[i]);

        ctx.lineTo(p.x, p.y);
    }

    if(currentPoint){

        ctx.lineTo(
            currentPoint.x,
            currentPoint.y
        );
    }

    ctx.strokeStyle = "#1a73e8";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.stroke();
}

function activateDot(dot){

    const id = dot.dataset.id;

    if(pattern.includes(id)) return;

    pattern.push(id);

    selectedDots.push(dot);

    dot.classList.add("active");

    patternResult.textContent =
        pattern.join("-");

    drawLines();
}

function getDotFromPoint(x,y){

    for(const dot of dots){

        const rect =
            dot.getBoundingClientRect();

        const centerX =
            rect.left + rect.width/2;

        const centerY =
            rect.top + rect.height/2;

        const distance =
            Math.hypot(
                x-centerX,
                y-centerY
            );

        if(distance < 40){
            return dot;
        }
    }

    return null;
}

function getTouchPos(e){

    const gridRect =
        document.getElementById("grid")
        .getBoundingClientRect();

    const touch =
        e.touches[0];

    return {
        x:
            touch.clientX -
            gridRect.left,

        y:
            touch.clientY -
            gridRect.top
    };
}

document.addEventListener(
    "touchstart",
    e=>{

        const dot =
            getDotFromPoint(
                e.touches[0].clientX,
                e.touches[0].clientY
            );

        if(!dot) return;

        e.preventDefault();

        drawing = true;

        activateDot(dot);
    },
    {passive:false}
);

document.addEventListener(
    "touchmove",
    e=>{

        if(!drawing) return;

        e.preventDefault();

        const touch =
            e.touches[0];

        const dot =
            getDotFromPoint(
                touch.clientX,
                touch.clientY
            );

        if(dot){
            activateDot(dot);
        }

        drawLines(
            getTouchPos(e)
        );
    },
    {passive:false}
);

document.addEventListener(
    "touchend",
    ()=>{
        drawing = false;
        drawLines();
    }
);

document.addEventListener(
    "mousedown",
    e=>{

        const dot =
            getDotFromPoint(
                e.clientX,
                e.clientY
            );

        if(!dot) return;

        drawing = true;

        activateDot(dot);
    }
);

document.addEventListener(
    "mousemove",
    e=>{

        if(!drawing) return;

        const dot =
            getDotFromPoint(
                e.clientX,
                e.clientY
            );

        if(dot){
            activateDot(dot);
        }

        const gridRect =
            document.getElementById("grid")
            .getBoundingClientRect();

        drawLines({
            x:e.clientX-gridRect.left,
            y:e.clientY-gridRect.top
        });
    }
);

document.addEventListener(
    "mouseup",
    ()=>{
        drawing=false;
        drawLines();
    }
);

document.getElementById("resetBtn")
.addEventListener("click",()=>{

    pattern=[];

    selectedDots=[];

    dots.forEach(dot=>{
        dot.classList.remove("active");
    });

    patternResult.textContent="-";

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
});

resizeCanvas();
