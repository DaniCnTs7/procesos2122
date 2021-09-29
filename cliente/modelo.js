
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
        codigo = this.obtenerCodigo()
        // while(this.partidas[codigo]) {
        //     codigo = this.obtenerCodigo()
        // }
        
        //crear la instancia de partida
        var partida = new Partida(codigo, jugador, numJugadores)
        //asignarla a la colección partidas
        this.partidas[codigo] = partida

        return partida
    }

    this.obtenerTodasPartidas = function() {
        var lista = []

        for(each in this.partidas) {
            var partida = this.partidas[each]
            lista.push({
                propietario: partida.propietario,
                codigo: each
            })
        }
        return lista
    }

    this.unirAPartida = function(codigo, nick) {
        if (this.partidas[codigo]) {
            var jugador = this.usuarios[nick]
            this.partidas[codigo].unirAPartida(jugador)
        }
    }

    this.obtenerCodigo = function() {
        // let cadena="ABCDEFGHIJKLMNOPQRSTUVXYZ";
        // let letras=cadena.split('');
        // let maxCadena=cadena.length;
        // let codigo=[];
        // for(i=0;i<6;i++){
        //     codigo.push(letras[randomInt(1,maxCadena)-1]);
        // }
        return Date.now().toString()
    }

    this.numeroPartidas = function() {
        return Object.keys(this.partidas).length
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
        return this.juego.crearPartida(nick, numJugadores)
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
    this.fase = new Inicial()
    this.cartas = []

    this.unirAPartida = function (jugador) {
        this.fase.unirAPartida(this, jugador)
    }
    this.puedeUnirAPartida = function(jugador) {
        this.jugadores[jugador.nick] = jugador
    }

    this.numeroJugadores = function() {
        return Object.keys(this.jugadores).length
    }

    this.crearMazo = function() {
        var colores = ['azul', 'amarillo', 'rojo', 'verde']
        for(i = 0;i<colores.length;i++) {
            this.cartas.push(new Numero(0,colores[i]))
            for(j = 1;j<10;j++) {
                this.cartas.push(new Numero(j,colores[i]))
                this.cartas.push(new Numero(j,colores[i]))
            }
        }
    }
    this.crearMazo()
    this.unirAPartida(propietario)
}

//FASES
function Inicial() {
    this.nombre = "inicial"

    this.unirAPartida = function(partida, jugador) {
        //si num jugadores < numJugadores
        partida.puedeUnirAPartida(jugador)
        if (partida.numJugadores==partida.numeroJugadores()) {
            partida.fase = new Jugando()
        }
    }
}

function Jugando() {
    this.nombre = "jugando"
    
    this.unirAPartida = function(partida, jugador) {
        alert("La partida ya ha comenzado")
    }
}

function Final() {
    this.nombre = "final"
    
    this.unirAPartida = function(partida, jugador) {
        alert("La partida ha terminado")
    }
}


function Numero(valor, color) {
    this.color = color
    this.valor = valor
}