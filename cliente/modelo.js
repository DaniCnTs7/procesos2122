
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
        while(this.partidas[codigo]) {
            codigo = this.obtenerCodigo()
        }
        jugador.codigoPartida = codigo
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
                codigo: each,
                numjugadores: partida.numeroJugadores() +'/'+partida.numJugadores
            })
        }
        return lista
    }

    this.obtenerPartida = function(codigo) {
        return this.partidas[codigo]
    }

    this.unirAPartida = function(codigo, nick) {
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

        return codigo
        // return Date.now().toString()
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
    this.mano = []
    this.codigoPartida

    this.crearPartida = function(numJugadores) {
        return this.juego.crearPartida(nick, numJugadores)
    }

    this.unirAPartida = function(codigo, nick=this.nick) {
        this.juego.unirAPartida(codigo, nick)
    }

    this.dameCartas = function(num) {
        var partida = this.obtenerPartida(this.codigoPartida)
        this.mano.push(...partida.dameCartas(num))
    }

    this.robar = function(num) {
        var partida = this.obtenerPartida(this.codigoPartida)
        this.mano = this.mano.concat(partida.dameCartas(num))
    }

    this.manoInicial = function() {
        var partida = this.obtenerPartida(this.codigoPartida)
        this.mano = partida.dameCartas(7)
    }

    this.obtenerPartida = function(codigo) {
        return this.juego.obtenerPartida(codigo)
    }

    this.pasarTurno = function() {
        var partida = this.obtenerPartida(this.codigoPartida)
        partida.pasarTurno(this.nick)
    }

    this.jugarCarta = function(carta) {
        var partida = this.obtenerPartida(this.codigoPartida)
        var index = this.mano.indexOf(carta)
        if (this.nick == partida.turno.nick) {
            this.mano.splice(index, 1)
            partida.jugarCarta(carta)
            partida.pasarTurno(this.nick)
        } else {
            alert("No es tu turno")
        }
    }

}

function Partida(codigo, propietario, numJugadores) {
    this.codigo = codigo
    this.propietario = propietario.nick
    this.numJugadores = numJugadores
    this.jugadores = {}
    this.fase = new Inicial()
    this.mazo = []
    this.nombresJug = []
    this.ronda = 1
    this.turno = undefined
    this.mesa = []

    this.unirAPartida = function (jugador) {
        this.fase.unirAPartida(this, jugador)
    }
    this.puedeUnirAPartida = function(jugador) {
        this.jugadores[jugador.nick] = jugador
        this.nombresJug.push(jugador.nick)
        jugador.codigoPartida = this.codigo
    }

    this.numeroJugadores = function() {
        return Object.keys(this.jugadores).length
    }

    this.obtenerMazo = function() {
        return this.mazo
    }

    this.crearMazo = function() {
        var colores = ['azul', 'amarillo', 'rojo', 'verde']
        //Se crean 76 cartas. Del 0 al 9 de cada color. 1 al 9 dos por cada color
        for(i = 0;i<colores.length;i++) {
            this.mazo.push(new Numero(0,colores[i]))
            for(j = 1;j<10;j++) {
                this.mazo.push(new Numero(j,colores[i]))
                this.mazo.push(new Numero(j,colores[i]))
            }
            
        }

        //Crear carta de bloqueo
        //Valor 10 para las cartas de bloqueo
        for(i = 0; i < colores.length; i++) {
            this.mazo.push(new Bloqueo(colores[i]))
            this.mazo.push(new Bloqueo(colores[i]))
        }

        //Crear carta de cambio de sentido
        //Valor 11 para las cartas de cambio de sentido
        for(i = 0; i < colores.length; i++) {
            this.mazo.push(new Sentido(colores[i]))
            this.mazo.push(new Sentido(colores[i]))
        }

        //Crear 8 cartas mas2 de cada color
        //Valor 20 para cada una
        for(i = 0; i < colores.length; i++) {
            this.mazo.push(new Mas2(colores[i]))
            this.mazo.push(new Mas2(colores[i]))
        }

        //Crear comodines y comodines+4
        for(i = 0; i < 4; i++) {
            this.mazo.push(new CambioColor())
        }

        for(i = 0; i < 4; i++) {
            this.mazo.push(new Mas4())
        }

    }

    this.dameCartas = function(num) {
        var cartas = []
        for(i=0;i<num;i++) {
            cartas.push(this.asignarUnaCarta())
        }
        return cartas
    }


    this.asignarUnaCarta = function() {
        var longitudMazo = this.mazo.length
        var random = Math.random() * (longitudMazo - 0) + 0
        var carta = this.mazo.splice(random, 1)
        return carta[0]
    }

    this.turnoInicial = function() {
        this.turno = propietario
    }

    this.pasarTurno = function(nick) {
        if(nick == this.turno.nick) {
            this.ronda += 1
            var indice = (this.nombresJug.indexOf(this.turno.nick) + 1) % this.numeroJugadores()
            this.turno = this.jugadores[this.nombresJug[indice]]
            this.turno
            // if(this.ronda < this.numeroJugadores()-1) {
            //     this.ronda += 1
            //     this.turno = this.jugadores[this.nombresJug[this.ronda]]
            // } else {
            //     this.ronda += 1
            //     this.turno = this.jugadores[this.nombresJug[this.ronda%this.numeroJugadores()]]
            // }
        } else {
            alert("No es tu turno")
        }
    }

    this.cartaInicial = function() {
        var longitudMazo = this.mazo.length
        var random = Math.random() * (longitudMazo - 0) + 0
        var carta = this.mazo.splice(random, 1)
        this.mesa.push(carta[0])
    }

    this.cartaActual = function() {
        return this.mesa[this.mesa.length-1]
    }

    this.jugarCarta = function(carta) {
        this.mesa.push(carta)
    }

    this.crearMazo()
    this.cartaInicial()
    this.turnoInicial()
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


function Numero(valor, color = "nocolor", tipo = "numero") {
    this.color = color
    this.valor = valor
    this.tipo = tipo
}

function Bloqueo(color, tipo = "bloqueo") {
    this.color = color
    this.tipo = tipo
    this.valor = 10
}

function Sentido(color, tipo = "sentido") {
    this.color = color
    this.tipo = tipo
    this.valor = 15
}

function CambioColor(tipo = "cambiocolor") {
    this.tipo = tipo
    this.valor = 40
}

function Mas2(color, tipo = "mas2") {
    this.tipo = tipo
    this.color = color
    this.valor = 20
}

function Mas4(tipo = "mas4") {
    this.tipo = tipo
    this.valor = 50
}