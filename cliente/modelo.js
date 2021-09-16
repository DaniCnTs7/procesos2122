
function Juego() {
    this.jugadores = {}

    this.agregarJugadores = (nick) => {
        if (!this.jugadores[nick]) {
            var jugador = new Jugador(nick)
            this.jugadores[nick] = jugador
        } else {
            alert("Ya existe el jugador")
        }
    }
}

function Jugador(nick) {
    this.nick = nick
}

function Partida(nombre) {
    this.nombre = nombre;
}

function Carta(color, tipo) {
    this.color = color
    this.tipo = tipo
}