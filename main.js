// main.js

// Mostrar/ocultar mensaje
function mostrarMensaje() {
  const mensaje = document.getElementById("mensajeInteractivo");
  mensaje.style.display = mensaje.style.display === "none" || mensaje.style.display === "" ? "block" : "none";
}

// Pausar/Reproducir canción
function toggleAudio() {
  const audio = document.getElementById("audioReproducir");
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}