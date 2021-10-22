function ServidorWS() {
    //zona cliente del servidor WS
    this.enviarAlReminente = function(socket, mensaje, datos) {
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

            socket.on("crearPartida", function(num, nick="nada") {
                var ju1 = juego.usuarios[nick]
                var res = {codigo: -1}
                var partida = ju1.crearPartida(num)
                console.log("Nueva partida de "+nick+" codigo: "+ju1.codigoPartida.join(""))
                res.codigo = ju1.codigoPartida
                socket.join(res.codigo)
                cli.enviarAlReminente(socket, "partidaCreada", res)
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
                    cli.enviarAlReminente(socket, "unidoAPartida", res)
                    if (partida.fase.nombre == "jugando") {
                        cli.enviarATodos(io, codigo, "pedirCartas", {})
                    }
                } else {
                    cli.enviarAlReminente(socket, "fallo", res)
                }
            })

            socket.on("manoInicial", function(nick) {
                var ju1 = juego.usuarios[nick]
                ju1.manoInicial()
                cli.enviarAlReminente(socket, "mano", ju1.mano)
            })
        })
    }

}

module.exports.ServidorWS = ServidorWS