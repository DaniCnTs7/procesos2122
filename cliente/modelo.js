
function Juego() {
    this.usuarios = {}
    this.partidas = {}

    this.agregarJugadores = function(nick) {
        if (!this.usuarios[nick]) {
            var jugador = new Jugador(nick, this)
            this.usuarios[nick] = jugador
        } else {
            alert("El nick está en uso")
        }
    }

    this.crearPartida = function(nick, numJugadores) {
        //crear código único
        var codigo = "-1"
        var jugador = this.usuarios[nick]
        while(this.partidas[codigo]) {
            codigo = this.obtenerCodigo()
        }
        
        //crear la instancia de partida
        var partida = new Partida(codigo, jugador, numJugadores)
        //asignarla a la colección partidas
        this.partidas[codigo] = partida
    }

    this.unirAPartida = function (codigo, nick) {
        if (this.partidas[codigo]) {
            var jugador = this.usuarios[nick]
            this.partidas[codigo].unirAPartida(jugador)
        }
    }

    this.obtenerCodigo = function() {
        let cadena="ABCDEFGHIJKLMNOPQRSTUVXYZ";
        let letras=cadena.split('');
        let maxCadena=cadena.length;
        let codigo=[];
        for(i=0;i<6;i++){
            codigo.push(letras[randomInt(1,maxCadena)-1]);
        }
        return codigo.join('');
    }
}

//funcion random
function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}


function Jugador(nick, juego) {
    this.nick = nick
    this.juego = juego

    this.crearPartida = function(numJugadores) {
        this.juego.crearPartida(nick, numJugadores)
    }

    this.unirAPartida = function(codigo, nick) {
        this.juego.unirAPartida(codigo, nick)
    }
}

function Partida(codigo, propietario, numJugadores) {
    this.codigo = codigo
    this.propietario = propietario.nick
    this.numJugadores = numJugadores
    this.jugadores = {}

    this.jugadores[propietario.nick] = propietario

    this.unirAPartida = function(jugador) {
        this.jugadores[jugador.nick] = jugador
    }
}

function Carta(color, tipo) {
    this.color = color
    this.tipo = tipo
}