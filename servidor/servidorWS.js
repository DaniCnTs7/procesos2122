function ServidorWS() {
    //zona cliente del servidor WS
    this.enviarAlRemitente = function(socket, mensaje, datos) {
        socket.emit(mensaje, datos)
    }
    this.enviarATodos = function(io, codigo, mensaje, datos) {
        io.sockets.in(codigo).emit(mensaje, datos)
    }
    this.enviarGlobal=function(socket,mens,datos){
        socket.broadcast.emit(mens,datos);
    }


    //zona servidor del servidor WS
    this.lanzarServidorWS = function(io, juego) {
        var cli = this
        io.on("connection", function(socket) {
            console.log("Usuario conectado")

            socket.on("crearPartida", function(num, nick) {
                var ju1 = juego.usuarios[nick]
                if(ju1){
                    var res = {codigo: -1, fase: ""}
                    var partida = ju1.crearPartida(num)
                    if(partida) {
                        console.log("Nueva partida de "+nick+" codigo: "+ju1.codigoPartida.join(""))
                        res.codigo = ju1.codigoPartida
                        res.fase = partida.fase
                        socket.join(res.codigo)
                        cli.enviarAlRemitente(socket, "partidaCreada", res)
                    } else {
                        cli.enviarAlRemitente(socket, "fallo", "La partida no ha podido crearse")    
                    }
                } else {
                    cli.enviarAlRemitente(socket, "fallo", "El usuario no existe")
                }
            })

            socket.on("unirAPartida", function(codigo, nick) {
                var ju1 = juego.usuarios[nick]
                var cod = codigo.split("")
                var partida = juego.partidas[cod]
                var res = {codigo: -1}
                
                if (ju1 && partida) {
                        ju1.unirAPartida(cod)
                        console.log("Jugador "+nick+" se une a partida codigo: "+ju1.codigoPartida)
                        res.codigo = ju1.codigoPartida
                        if(res.codigo != -1) {
                            socket.join(res.codigo)
                            cli.enviarAlRemitente(socket, "unidoAPartida", res)
                            if (partida.fase.nombre == "jugando") {
                                cli.enviarATodos(io, codigo, "pedirCartas", {})
                                cli.enviarAlRemitente(socket, "unidoAPartida", {cartaActual: partida.mesa[partida.mesa.length-1], turno: partida.turno.nick, cartasJugador: partida.turno.mano})
                            }
                        } else {
                            socket.join(res)
                            cli.enviarAlRemitente(socket, "fallo", res)
                        }
                } else {
                    cli.enviarAlRemitente(socket, "fallo", "El usuario o la partida no existen")
                }
            })

            socket.on("manoInicial", function(nick) {
                var ju1 = juego.usuarios[nick]
                if (ju1) {
                    ju1.manoInicial()
                    cli.enviarAlRemitente(socket, "mano", ju1.mano)
                    var partida = juego.partidas[ju1.codigoPartida]
                    cli.enviarAlRemitente(socket, "turno", {turno: partida.turno.nick, cartaActual: partida.mesa[partida.mesa.length-1]})
                } else {
                    cli.enviarAlRemitente(socket, "fallo", "El usuario no existe")
                }
            })

            socket.on("jugarCarta", function(num, nick) {
                var ju1 = juego.usuarios[nick]
                if (ju1) {
                    var res = {codigo: -1}
                    ju1.jugarCarta(num)
                    cli.enviarAlRemitente(socket, "mano", ju1.mano)
                    var codigo = ju1.codigoPartida
                    var partida = juego.partidas[codigo]
                    res = {turno: partida.turno.nick, cartaActual: partida.mesa[partida.mesa.length-1], mazo: partida.mazo}
                    // cli.enviarAlRemitente(io, "cartaJugada", res)
                    cli.enviarATodos(io, codigo, "turno", res)
                    if (partida.fase.nombre == "final") {
                        cli.enviarATodos(io, codigo, "final", {turno: partida.turno.nick})
                    }
                } else {
                    cli.enviarAlRemitente(socket, "fallo", "El usuario no existe")
                }
            })

            socket.on("robarCarta", function(nick) {
                var ju1 = juego.usuarios[nick]
                var partida = juego.partidas[ju1.codigoPartida]
                ju1.robar(1)
                var cartaRobada = ju1.mano[ju1.mano.length-1]
                cli.enviarAlRemitente(socket, "mano", cartaRobada)
                if (partida.fase.nombre == "final") {
                    cli.enviarATodos(io, codigo, "final", {turno: partida.turno.nick})
                }
            })

            socket.on("pasarTurno", function(nick) {
                var ju1 = juego.usuarios[nick]
                if (ju1) {
                    var partida = juego.partidas[ju1.codigoPartida]
                    cli.enviarAlRemitente(socket, "turno", partida.turno.nick)
                    ju1.pasarTurno()
                    cli.enviarAlRemitente(socket, "turno", partida.turno.nick)
                } else {
                    cli.enviarAlRemitente(socket, "fallo", "El usuario no existe")
                }
            })
        })
    }

}

module.exports.ServidorWS = ServidorWS