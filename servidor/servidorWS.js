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
                    var res = {codigo: -1, fase: "", jugadores: []}
                    var partida = ju1.crearPartida(num)
                    if(partida) {
                        console.log("Nueva partida de "+nick+" codigo: "+ju1.codigoPartida)
                        res.codigo = ju1.codigoPartida
                        res.fase = partida.fase
                        res.jugadores = partida.nombresJug
                        socket.join(res.codigo)
                        var lista = juego.obtenerTodasPartidas()
                        cli.enviarAlRemitente(socket, "partidaCreada", res)
                        cli.enviarGlobal(socket, "nuevaPartida", lista)
                    } else {
                        cli.enviarAlRemitente(socket, "fallo", {msg:"La partida debe ser de 2 a 8 jugadores"})    
                    }
                } else {
                    cli.enviarAlRemitente(socket, "fallo", {msg:"El usuario no existe"})
                }
            })

            socket.on("unirAPartida", function(codigo, nick) {
                var ju1 = juego.usuarios[nick]
                var cod = codigo
                var partida = juego.partidas[cod]
                var res = {codigo: -1, jugadores: []}
                
                if (ju1 && partida) {
                        ju1.unirAPartida(cod)
                        console.log("Jugador "+nick+" se une a partida codigo: "+ju1.codigoPartida)
                        res.codigo = ju1.codigoPartida
                        if(res.codigo != -1) {
                            socket.join(res.codigo)
                            res.jugadores = partida.nombresJug
                            cli.enviarAlRemitente(socket, "unidoAPartida", res)
                            cli.enviarGlobal(socket, "nuevoMiembro", res)
                            if (partida.fase.nombre == "jugando") {
                                cli.enviarATodos(io, codigo, "pedirCartas", {})
                                cli.enviarAlRemitente(socket, "unidoAPartida", {cartaActual: partida.mesa[partida.mesa.length-1], turno: partida.turno.nick, cartasJugador: partida.turno.mano})
                                cli.enviarGlobal(socket, "partidaEmpezada", {msg: "LA PARTIDA HA COMENZADO", cartaActual: partida.mesa[partida.mesa.length-1], turno: partida.turno.nick})
                                cli.enviarAlRemitente(socket, "partidaEmpezada", {msg: "LA PARTIDA HA COMENZADO", cartaActual: partida.mesa[partida.mesa.length-1], turno:partida.turno.nick})
                                var listaJugadores = {}
                                var nombresJug = partida.nombresJug
                                for (var i = 0; i < nombresJug.length; i++) {
                                    var jugador = juego.usuarios[nombresJug[i]]
                                    listaJugadores[jugador.nick] = jugador.mano.length
                                }
                                console.log(listaJugadores)
                                cli.enviarATodos(io, codigo, "jugadoresEnPartida", listaJugadores)
                            }
                        } else {
                            socket.join(res)
                            cli.enviarAlRemitente(socket, "fallo", {msg: "El jugador no pertenece a ninguna partida"})
                        }
                } else {
                    cli.enviarAlRemitente(socket, "fallo", {msg:"El usuario o la partida no existen"})
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
                    cli.enviarAlRemitente(socket, "fallo", {msg:"El usuario no existe"})
                }
            })

            socket.on("jugarCarta", function(num, nick) {
                var ju1 = juego.usuarios[nick]
                if (ju1) {
                    var res = {codigo: -1}
                    var carta = ju1.mano[num]
                    ju1.jugarCarta(num)
                    cli.enviarAlRemitente(socket, "mano", ju1.mano)
                    var codigo = ju1.codigoPartida
                    var partida = juego.partidas[codigo]
                    res = {turno: partida.turno.nick, cartaActual: partida.mesa[partida.mesa.length-1], mazo: partida.mazo, nombreRival: ju1.nick, cartasRival: ju1.mano.length}
                    // cli.enviarAlRemitente(io, "cartaJugada", res)
                    cli.enviarATodos(io, codigo, "turno", res)
                    // cli.enviarGlobal(socket, "cartaJugada", res)
                    cli.enviarATodos(io, codigo, "cartaJugada", res)
                    if (carta.tipo == "cambiocolor") {
                        cli.enviarAlRemitente(socket, "cambioColor", {})
                    }

                    if (partida.fase.nombre == "final") {
                        cli.enviarATodos(io, codigo, "final", {msg: "La partida ha terminado.\nEl ganador es: "+partida.turno.nick})
                    }
                } else {
                    cli.enviarAlRemitente(socket, "fallo", {msg:"El usuario no existe"})
                }
            })

            socket.on("robarCarta", function(nick) {
                var ju1 = juego.usuarios[nick]
                if (ju1) {
                    var partida = juego.partidas[ju1.codigoPartida]
                    var codigo = ju1.codigoPartida
                    if (partida.turno.nick == nick) {
                        ju1.robar(1)
                        var cartaRobada = ju1.mano
                        cli.enviarAlRemitente(socket, "mano", cartaRobada)
                        cli.enviarATodos(io, codigo, "cartaRobada", {cartasRival: ju1.mano.length, nombreRival: ju1.nick})
                        if (partida.fase.nombre == "final") {
                            cli.enviarATodos(io, codigo, "final", {turno: partida.turno.nick})
                        }
                    } else {
                        cli.enviarAlRemitente(socket, "fallo", {msg: "No es tu turno"})
                    }
                }
            })

            socket.on("pasarTurno", function(nick) {
                var ju1 = juego.usuarios[nick]
                if (ju1) {
                    var partida = juego.partidas[ju1.codigoPartida]
                    if (partida.turno.nick == nick) {
                        ju1.pasarTurno(nick)
                        cli.enviarAlRemitente(socket, "turno", {turno: partida.turno.nick})
                        cli.enviarATodos(io, ju1.codigoPartida, "turno", {turno: partida.turno.nick})       
                    }else {
                     cli.enviarAlRemitente(socket, "fallo", {msg:"No es tu turno"})   
                    }
                } else {
                    cli.enviarAlRemitente(socket, "fallo", {msg:"El usuario no existe"})
                }
            })

            socket.on("abandonarPartida", function(nick) {
                var ju1 = juego.usuarios[nick]
                if (ju1) {
                    ju1.abandonarPartida()
                    var codigo = ju1.codigoPartida
                    cli.enviarATodos(io, codigo, "jugadorAbandona", {msg: "El jugador "+ju1.nick+" ha abandonado la partida"})
                }
            })
            
            socket.on("cambiarColor", function(color, nick) {
                var ju1 = juego.usuarios[nick]
                if(ju1) {
                    var codigo = ju1.codigoPartida
                    var partida = juego.partidas[codigo]
                    partida.mesa[partida.mesa.length-1].color = color
                    console.log(partida.mesa[partida.mesa.length-1].color)
                }
            })
        })
    }

}

module.exports.ServidorWS = ServidorWS