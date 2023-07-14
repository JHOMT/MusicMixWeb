// Obtener referencias a los elementos del DOM
var audioElement = document.getElementById('audio');
var prevButton = document.getElementById('prevButton');
var playButton = document.getElementById('playButton');
var nextButton = document.getElementById('nextButton');
var songListElement = document.getElementById('songList');
var range = document.getElementById('range');
var startDiv = document.querySelector('.start');
var endDiv = document.querySelector('.end');
var endmusic= document.querySelector('.end-music');
var cambioReproductor = document.getElementById(".index-reproductor");

// Array de canciones
var songs = [
  "001 IN DA GETTO - J BALVIN, SKRILLEX.mp3",
  "0001 Maluma - Hawái (Official Video).mp3"
];

function loadSong(){
  songList.forEach((song, index)=>{
    const li= document.createElement("li");
    const link = document.createElement("a");
    link.textContent= song.title;
    link.href ="# style='text-decoration: none;'";
    link.addEventListener("click", () => loadSongs(index))
    li.appendChild(link);
    songs.appendChild(li);
  })
}
// Generar los elementos de la lista de canciones
for (var i = 0; i < songs.length; i++) {
  var song = songs[i];
  var listItem = document.createElement('li');
  var link = document.createElement('a');
  link.href = '#';
  link.textContent = song;
  listItem.appendChild(link);
  songListElement.appendChild(listItem);

  // Agregar la clase "active" a la canción actual
  if (i === currentSongIndex) {
    listItem.classList.add('active');
  }
}
// Agregar un evento de clic a cada enlace de canción
var songLinks = songListElement.getElementsByTagName('a');
for (var i = 0; i < songLinks.length; i++) {
  songLinks[i].addEventListener('click', function(e) {
    e.preventDefault(); // Evitar la navegación por defecto

    // Remover la clase "active" de la canción anterior
    var currentActive = songListElement.querySelector('.active');
    if (currentActive) {
      currentActive.classList.remove('active');
    }

    var clickedIndex = Array.from(songLinks).indexOf(this);
    if (clickedIndex !== -1) {
      currentSongIndex = clickedIndex;
      loadSong();
      audioElement.play();

      // Agregar la clase "active" a la canción actual
      this.parentNode.classList.add('active');
    }
  });
}


// Índice de la canción actual
var currentSongIndex = 0;

// Almacenar el estado de reproducción en el almacenamiento de sesión del navegador
function savePlaybackState() {
  sessionStorage.setItem('currentSongIndex', currentSongIndex);
  sessionStorage.setItem('currentTime', audioElement.currentTime);
}

// Restaurar el estado de reproducción desde el almacenamiento de sesión
function restorePlaybackState() {
  currentSongIndex = parseInt(sessionStorage.getItem('currentSongIndex')) || 0;
  audioElement.currentTime = parseFloat(sessionStorage.getItem('currentTime')) || 0;
}

// Función para cargar y reproducir la canción actual
function loadSong() {
  var currentSong = songs[currentSongIndex];
  var songPath = 'musica/' + currentSong; // Ruta relativa a la carpeta donde se encuentran las canciones
  audioElement.src = songPath;

  audioElement.addEventListener('loadedmetadata', function() {
    const audioName = decodeURIComponent(audioElement.src.split('/').pop().replace('.mp3', ''));
    // Asignar el nombre del artista y de la canción a los elementos h2
    const artistElement = document.querySelector('.player__artist');
    const songElement = document.querySelector('.player__song');

    // Dividir el nombre del archivo en artista y canción
    const [artist, song] = audioName.split('-');

    // Asignar los valores a los elementos h2
    artistElement.textContent = artist.trim();
    if (song.length > 0){
        songElement.textContent = song.trim();
    }
  });

  // Activar la clase "active" en la canción actual
  var songs = songListElement.querySelectorAll('li');
  songs.forEach(function(song, i) {
    song.classList.remove('active');
    if (i === currentSongIndex) {
      song.classList.add('active');
    }
  });

  // Verificar si se debe reproducir automáticamente
  if (sessionStorage.getItem('autoplay') === 'true') {
    audioElement.play();
  }
}


// Evento clic en el botón de reproducción/pausa
playButton.addEventListener('click', function() {
  const playIcon = playButton.querySelector('.play-btn');
  const pauseIcon = playButton.querySelector('.pause-btn');

  if (audioElement.paused) {
    audioElement.play();
    playIcon.classList.add('hide');
    pauseIcon.classList.remove('hide');
    savePlaybackState();
  } else {
    audioElement.pause();
    playIcon.classList.remove('hide');
    pauseIcon.classList.add('hide');
    savePlaybackState();
  }
});

// Evento clic en el botón anterior
prevButton.addEventListener('click', function() {
  currentSongIndex--;
  if (currentSongIndex < 0) {
    currentSongIndex = songs.length - 1;
  }
  if (audioElement.play) {
    loadSong();
    audioElement.play();
  }
});

range.addEventListener('input', function() {
  var seekTime = audioElement.duration * (range.value / 100);
  audioElement.currentTime = seekTime;

  var currentTime = formatTime(seekTime);
  startDiv.textContent = currentTime;

  savePlaybackState(); // Guardar el estado de reproducción al cambiar la posición del rango
});

function formatTime(time) {
  var minutes = Math.floor(time / 60);
  var seconds = Math.floor(time % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Evento clic en el botón siguiente
nextButton.addEventListener('click', function() {
  currentSongIndex++;
  if (currentSongIndex >= songs.length) {
    currentSongIndex = 0;
  }
  if (audioElement.play) {
    loadSong();
    audioElement.play();
  }
});

// Cargar y reproducir la canción actual
function loadSong() {
  var currentSong = songs[currentSongIndex];
  var songPath = 'musica/' + currentSong;
  audioElement.src = songPath;

  audioElement.addEventListener('loadedmetadata', function() {
    const audioName = decodeURIComponent(audioElement.src.split('/').pop().replace('.mp3', ''));
    const artistElement = document.querySelector('.player__artist');
    const songElement = document.querySelector('.player__song');
    const cantante= document.querySelector('.artist')
    const cancion= document.querySelector('.song')
    const [artist, song] = audioName.split('-');
    cantante.textContent = artist.trim();
    artistElement.textContent = artist.trim();
    if (song.length > 0) {
      songElement.textContent = song.trim();
      cancion.textContent= song.trim();
    }
  });

  // Verificar si se debe reproducir automáticamente
  if (sessionStorage.getItem('autoplay') === 'true') {
    audioElement.play();
  }

  savePlaybackState(); // Guardar el estado de reproducción al cargar una nueva canción
}

audioElement.addEventListener('timeupdate', function() {
  var progress = (audioElement.currentTime / audioElement.duration) * 100;
  range.value = progress;

  var currentTime = formatTime(audioElement.currentTime);
  var duration = formatTime(audioElement.duration);
  startDiv.textContent = currentTime;
  endDiv.textContent = duration;
  endmusic.textContent = duration
  savePlaybackState(); // Guardar el estado de reproducción al actualizar el tiempo
});

// Almacenar el estado de reproducción al cambiar de página
window.addEventListener('beforeunload', function() {
  savePlaybackState();
});

// Restaurar el estado de reproducción al cargar la página
window.addEventListener('DOMContentLoaded', function() {
  restorePlaybackState();
  loadSong();
  audioElement.play();
});

var cambioReproductor = document.getElementById("cambioReproductor");
cambioReproductor.addEventListener("click", function() {
  loadSong();
  audioElement.play();
});




// Mostrar la ventana modal al hacer clic en el botón
openModalButton.addEventListener('click', function() {
  songListModal.style.display = 'block';
});

// Ocultar la ventana modal al hacer clic fuera de ella
window.addEventListener('click', function(event) {
  if (event.target === songListModal) {
    songListModal.style.display = 'none';
  }
});

// Generar los elementos de la lista de canciones
for (var i = 0; i < songs.length; i++) {
  var song = songs[i];
  var listItem = document.createElement('div');
  listItem.classList.add('song-item.active');
  listItem.textContent = song;
  songListElement.appendChild(listItem);

  // Agregar un evento de clic a cada canción
  listItem.addEventListener('click', function() {
    var songItems = Array.from(songListElement.getElementsByClassName('song-item'));

    // Eliminar la clase 'active' de todos los elementos de la lista de canciones
    songItems.forEach(function(item) {
      item.classList.remove('active');
    });

    // Agregar la clase 'active' al elemento de la lista de canciones actual
    this.classList.add('active');

    var clickedIndex = songItems.indexOf(this);
    if (clickedIndex !== -1) {
      currentSongIndex = clickedIndex;
      loadSong();
      audioElement.play();
      songListModal.style.display = 'none';
    }
  });
}

