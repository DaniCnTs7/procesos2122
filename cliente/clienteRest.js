function ClienteRest() {
    this.agregarJugador = function(nick) {
        $.getJSON("/agregarJugador/"+ nick, function(data) {
            console.log(data)
            if(data.nick != -1) {
                ws.nick = data.nick
                $.cookie("nick",ws.nick)
                iu.mostrarEleccion()
                // rest.obtenerPartidasDisponibles()
            } else {
                iu.mostrarModal({msg: "El nick '"+nick+"' está en uso."})
            }
        })
    } 

    this.crearPartida = function(numJugadores, nick) {
        $.getJSON("/crearPartida/" + numJugadores + "/" + nick, function(data) {
            console.log(data)
            if(data.codigo != -1) {
                ws.codigo = data.codigo
                iu.mostrarCargando(data)
            } else {
                iu.mostrarModal("El número de jugadores debe ser de 2-8")
            }
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
            ws.estado = 'buscandoPartida'
            iu.mostrarListaPartidas(data)
        })
    }
}