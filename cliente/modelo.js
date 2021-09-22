
function Juego() {
    this.jugadores = {}
    this.partidas = {}

    this.agregarJugadores = (nick) => {
        if (!this.jugadores[nick]) {
            var jugador = new Jugador(nick, this)
            this.jugadores[nick] = jugador
        } else {
            alert("Ya existe el jugador")
        }
    }
}

function Jugador(nick, juego) {
    this.nick = nick
    this.juego = juego

    this.crearPartida = (numJugadores) => {
        this.juego.crearPartida(nick, numJugadores)
    }
}

function Partida(nombre) {
    this.nombre = nombre;
}

function Carta(color, tipo) {
    this.color = color
    this.tipo = tipo
}