const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const dots = document.querySelectorAll(".dot");
const patternResult = document.getElementById("patternResult");
const container = document.querySelector(".container");

let pattern = [];
let positions = {};
let isDrawing = false;
let currentPointer = null;
let dataFolderHandle = null;

window.addEventListener("load", resizeCanvas);
window.addEventListener("resize", resizeCanvas);

function resizeCanvas(){

    const rect =
    container.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;

    setTimeout(() => {
        initPositions();
        drawLine();
    }, 50);
}


function initPositions() {
    positions = {};

    dots.forEach(dot => {

        const rect = dot.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();

        positions[dot.dataset.id] = {
            x: rect.left - canvasRect.left + rect.width / 2,
            y: rect.top - canvasRect.top + rect.height / 2
        };
    });
}

window.addEventListener("resize", initPositions);
setTimeout(initPositions, 100);

function getMiddleDot(a, b) {

    const pairs = {
        "1-3":"2",
        "3-1":"2",

        "1-7":"4",
        "7-1":"4",

        "3-9":"6",
        "9-3":"6",

        "7-9":"8",
        "9-7":"8",

        "1-9":"5",
        "9-1":"5",

        "3-7":"5",
        "7-3":"5",

        "2-8":"5",
        "8-2":"5",

        "4-6":"5",
        "6-4":"5"
    };

    return pairs[`${a}-${b}`] || null;
}

function activateDot(dot){

    const id = dot.dataset.id;

    if(pattern.length > 0){

        const last = pattern[pattern.length - 1];

        const middle = getMiddleDot(last, id);

        if(
            middle &&
            !pattern.includes(middle)
        ){

            const middleDot =
            document.querySelector(
                `.dot[data-id="${middle}"]`
            );

            pattern.push(middle);

            middleDot.classList.add("active");
        }
    }

    if(!pattern.includes(id)){

        pattern.push(id);

        dot.classList.add("active");
    }

    patternResult.textContent = pattern.join("-");

    drawLine();
}


function drawLine(){

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    if(pattern.length === 0) return;

    ctx.beginPath();

    ctx.lineWidth = 6;

    ctx.strokeStyle = "#3B82F6";

    ctx.lineCap = "round";

    pattern.forEach((id,index)=>{

        const pos = positions[id];

        if(index === 0){

            ctx.moveTo(
                pos.x,
                pos.y
            );

        }else{

            ctx.lineTo(
                pos.x,
                pos.y
            );
        }
    });

    if(
        isDrawing &&
        currentPointer
    ){

        ctx.lineTo(
            currentPointer.x,
            currentPointer.y
        );
    }

    ctx.stroke();
}

container.addEventListener(
    "pointerdown",
    e => {

        initPositions();

        isDrawing = true;

        const rect =
        canvas.getBoundingClientRect();

        const x =
        e.clientX - rect.left;

        const y =
        e.clientY - rect.top;

        currentPointer = {x,y};

        const dot =
        findNearestDot(x,y);

        if(dot){

            activateDot(dot);
        }

        container.setPointerCapture(
            e.pointerId
        );
    }
);

function findNearestDot(x, y){

    let nearest = null;

    let minDistance = Math.max(
        canvas.width * 0.15,
        45
    );

    dots.forEach(dot => {

        const pos =
        positions[dot.dataset.id];

        const distance =
        Math.hypot(
            x - pos.x,
            y - pos.y
        );

        if(distance < minDistance){

            minDistance = distance;

            nearest = dot;
        }
    });

    return nearest;
}

container.addEventListener(
    "pointermove",
    e => {

        if(!isDrawing) return;

        const rect =
        canvas.getBoundingClientRect();

        const x =
        e.clientX - rect.left;

        const y =
        e.clientY - rect.top;

        currentPointer = {x,y};

        const dot =
        findNearestDot(x,y);

        if(dot){

            activateDot(dot);
        }

        drawLine();
    }
);

function finishPattern(){

    isDrawing = false;

    currentPointer = null;

    drawLine();
}

container.addEventListener(
    "pointerup",
    finishPattern
);

container.addEventListener(
    "pointercancel",
    finishPattern
);

document.getElementById(
    "resetBtn"
).addEventListener(
    "click",
    () => {

        pattern = [];

        patternResult.textContent = "-";

        dots.forEach(dot => {
            dot.classList.remove(
                "active"
            );
        });

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );
    }
);

document.getElementById("saveBtn").addEventListener(
    "click",
    async () => {

           const namaKonsumen =
        document.getElementById("namaKonsumen").value || "Konsumen";

        const merkHp =
        document.getElementById("merkHp").value || "HP";

        const namaTeknisi =
        document.getElementById("namaTeknisi").value || "Teknisi";

        const kerusakan =
        document.getElementById("kerusakan").value || "Kerusakan";

        const tanggalInput =
        document.getElementById("tanggal").value;
        if(tanggalInput){

            const d = new Date(tanggalInput);

          tanggalFormat =
String(d.getDate()).padStart(2,"0")
+ "_"
+ String(d.getMonth()+1).padStart(2,"0")
+ "_"
+ d.getFullYear();
        }

        const finalCanvas =
        document.createElement("canvas");

       finalCanvas.width = 320;
finalCanvas.height = canvas.height + 260;

        const finalCtx =
        finalCanvas.getContext("2d");

        finalCtx.fillStyle = "#111827";
        finalCtx.fillRect(0,0,320,550);

        finalCtx.fillStyle = "white";
        finalCtx.font = "bold 18px Arial";

        finalCtx.fillText(
            "DATA SERVICE HP",
            70,
            35
        );

        finalCtx.font = "14px Arial";

        finalCtx.fillText(
            "Nama Konsumen : " + namaKonsumen,
            20,
            70
        );

        finalCtx.fillText(
            "Merk HP : " + merkHp,
            20,
            100
        );

        finalCtx.fillText(
            "Nama Teknisi : " + namaTeknisi,
            20,
            130
        );

        finalCtx.fillText(
            "Kerusakan : " + kerusakan,
            20,
            160
        );

        finalCtx.fillText(
            "Tanggal : " + tanggalFormat,
            20,
            190
        );

        finalCtx.fillText(
            "Pattern : " + pattern.join("-"),
            20,
            220
        );

        finalCtx.save();

     finalCtx.translate(0,250);

    finalCtx.drawImage(
    canvas,
    10,
    0,
    300,
    canvas.height
);

        pattern.forEach(id => {

            const pos = positions[id];

            finalCtx.beginPath();

            finalCtx.arc(
                pos.x,
                pos.y,
                14,
                0,
                Math.PI * 2
            );

            finalCtx.fillStyle = "#fcfdff";

            finalCtx.fill();
        });

        finalCtx.restore();

        const fileName =
        `${namaTeknisi}-${merkHp}-${kerusakan}-${tanggalFormat}`
        .replace(/[<>:"/\\|?*]/g,"")
        .replace(/\s+/g,"-")
        + ".png";

        finalCanvas.toBlob(async (blob) => {

            if(
                "showDirectoryPicker" in window
            ){

                await saveToFolder(
                    blob,
                    fileName
                );

            }else{

                const link =
                document.createElement("a");

                link.download =
                fileName;

                link.href =
                URL.createObjectURL(blob);

                link.click();
            }

        });

    }
);


initPositions();

async function saveToFolder(blob, fileName){

    try{

        if(!dataFolderHandle){

            const rootHandle =
            await window.showDirectoryPicker({
                mode:"readwrite"
            });

            dataFolderHandle =
            await rootHandle.getDirectoryHandle(
                "DATA POLA HP TEKNISI",
                { create:true }
            );
        }

        const fileHandle =
        await dataFolderHandle.getFileHandle(
            fileName,
            { create:true }
        );

        const writable =
        await fileHandle.createWritable();

        await writable.write(blob);

        await writable.close();

        alert(
            "Berhasil disimpan:\n" +
            fileName
        );

    }catch(err){

        console.error(err);
    }
}
