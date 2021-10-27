function ServidorWS() {
    //zona cliente del servidor WS
    this.enviarAlRemitente = function(socket, mensaje, datos) {
        socket.emit(mensaje, datos)
    }
    this.enviarATodos = function(io, codigo, mensaje, datos) {
        io.sockets.in(codigo).emit(mensaje, datos)
    }

    //zona servidor del servidor WS
    this.lanzarServidorWS = function(io, juego) {
        var cli = this
        io.on("connection", function(socket) {
            console.log("Usuario conectado")

            socket.on("crearPartida", function(num, nick) {
                var ju1 = juego.usuarios[nick]
                var res = {codigo: -1, fase: ""}
                var partida = ju1.crearPartida(num)
                console.log("Nueva partida de "+nick+" codigo: "+ju1.codigoPartida.join(""))
                res.codigo = ju1.codigoPartida
                res.fase = partida.fase
                socket.join(res.codigo)
                cli.enviarAlRemitente(socket, "partidaCreada", res)
            })

            socket.on("unirAPartida", function(codigo, nick) {
                var ju1 = juego.usuarios[nick]
                var cod = codigo.split("")
                var res = {codigo: -1}
                ju1.unirAPartida(cod)
                console.log("Jugador "+nick+" se une a partida codigo: "+ju1.codigoPartida)
                res.codigo = ju1.codigoPartida
                if(res.codigo != -1) {
                    socket.join(res.codigo)
                    var partida = juego.partidas[cod]
                    cli.enviarAlRemitente(socket, "unidoAPartida", res)
                    if (partida.fase.nombre == "jugando") {
                        cli.enviarATodos(io, codigo, "pedirCartas", {})
                    }
                } else {
                    socket.join(res)
                    cli.enviarAlRemitente(socket, "fallo", res)
                }
            })

            socket.on("manoInicial", function(nick) {
                var ju1 = juego.usuarios[nick]
                ju1.manoInicial()
                cli.enviarAlRemitente(socket, "mano", ju1.mano)
                // socket.join()
                var partida = juego.partidas[ju1.codigoPartida]
                cli.enviarAlRemitente(socket, "turno", {turno: partida.turno.nick, cartaActual: partida.mano})
            })

            socket.on("jugarCarta", function(num, nick) {
                var ju1 = juego.usuarios[nick]
                var res = {codigo: -1}
                ju1.jugarCarta(num)
                cli.enviarAlRemitente(socket, "mano", ju1.mano)
                var codigo = ju1.codigoPartida
                var partida = juego.partidas[codigo]
                res = {turno: partida.turno.nick, cartaActual: partida.mano}
                cli.enviarAlRemitente(io, "cartaJugada", res)
                if (partida.fase.nombre == "final") {
                    cli.enviarATodos(io, codigo, "final", {turno: partida.turno.nick})
                }
            })
        })
    }

}

module.exports.ServidorWS = ServidorWS