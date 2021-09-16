
function Juego() {
    this.jugadores = {}

    this.agregarJugadores = (nick) => {
        console.log(this.jugadores[nick])
        if (!this.jugadores[nick]) {
            var jugador = new Jugador(nick)
            this.jugadores[nick] = jugador
        }
    }
}

function Jugador(nick) {
    
}