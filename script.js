const video = document.getElementById("camera");
const button = document.getElementById("capturar");
const filtroBtn = document.getElementById("filtro");
const ligarCameraBtn = document.getElementById("ligarCamera");
const desligarCameraBtn = document.getElementById("desligarCamera");
const canva = document.getElementById("foto");
const galeria = document.getElementById("galeria");

let cameraStream = null; 

async function startCamera() {
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = cameraStream;
    } catch (erro) {
        alert("Erro ao abrir a câmera: " + erro);
    }
}

function stopCamera() {
    if (cameraStream) {
        let tracks = cameraStream.getTracks();
        tracks.forEach(track => track.stop()); 
        video.srcObject = null;
        cameraStream = null;
    }
}


ligarCameraBtn.addEventListener("click", function () {
    startCamera();
});


desligarCameraBtn.addEventListener("click", function () {
    stopCamera();
});


button.addEventListener("click", function () {
    if (!cameraStream) return; 
    const contexto = canva.getContext("2d");
    canva.width = video.videoWidth;
    canva.height = video.videoHeight;
    contexto.drawImage(video, 0, 0, canva.width, canva.height);
    
    
    const novaImagem = new Image();
    novaImagem.src = canva.toDataURL("image/png");
    novaImagem.classList.add("foto-galeria");
    galeria.appendChild(novaImagem);
});


filtroBtn.addEventListener("click", function () {
    if (galeria.children.length === 0) return; 

    const contexto = canva.getContext("2d");
    const imageData = contexto.getImageData(0, 0, canva.width, canva.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const media = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = media;     // Vermelho
        data[i + 1] = media; // Verde
        data[i + 2] = media; // Azul
    }

    contexto.putImageData(imageData, 0, 0);

   
    galeria.lastChild.src = canva.toDataURL("image/png");
});
