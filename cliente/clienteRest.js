function ClienteRest() {
    this.agregarJugador = function(nick) {
        $.getJSON("/agregarJugador/"+ nick, function(data) {
            console.log(data)
            if(data.nick != -1) {
                ws.nick = data.nick
                iu.mostrarEleccion()
                // rest.obtenerPartidasDisponibles()
            } else {
                iu.mostrarModal("El nick '"+nick+"' está en uso.")
                iu.mostrarAgregarJugador()
            }
        })
    } 

    this.crearPartida = function(nick, numJugadores) {
        $.getJSON("/crearPartida/" + numJugadores + "/" + nick, function(data) {
            console.log(data)
        })
    }

    this.unirAPartida = function(codigo, nick) {
        $.getJSON("/unirAPartida/"+codigo+"/"+nick, function(data) {
            console.log(data)
        })
    }
    
    this.partidas = function() {
        $.getJSON("/partidas", function(data) {
            console.log(data)
            // iu.mostrarListaPartidas(data)
        })
    }

    this.obtenerPartidasDisponibles = function() {
        $.getJSON("/obtenerPartidasDisponibles", function(data) {
            console.log(data)
            iu.mostrarListaPartidas(data)
        })
    }
}