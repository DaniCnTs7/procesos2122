function ControlWeb() {
    
    this.comprobarUsuario = function() {
        if ($.cookie("nick")) {
            ws.nick=$.cookie("nick")
            iu.mostrarEleccion()
        } else {
            iu.mostrarAgregarJugador()
        }
    }

    this.limpiar = function() {
    }
    
    this.mostrarAgregarJugador = function() {
        
        $("#btnAJ").on("click", function(){
            var nick = $("#usr").val()
            if(nick) {
                
                // $("#agregarJugador").remove()
                rest.agregarJugador(nick)
                // iu.mostrarControl()
                // iu.mostrarEleccion()
            }
        })
            
    }

    this.mostrarEleccion = function() {
        var nick = $("#usr").val()
        $("#agregarJugador").remove()

        var nick = '<p id="nick" class="d-none">'+nick+'</p>'
        $("body").append(nick)

        var cad = `
            <div id="elecciones">
                <button id="crear" class="btn btn-danger">CREAR PARTIDA</button>
                <button id="unirse" class="btn btn-primary">UNIRSE A PARTIDA</button>
            </div>`
        
        $("#elegirAccion").append(cad)

        $("#crear").on("click", function() {
            $("#elegirAccion").remove()
            iu.mostrarCrearPartida()
        })

        $("#unirse").on("click", function() {
            $("#elegirAccion").remove()
            var div= `
            <h3 id="tituloLP" class="text-center mb-3 pb-3">Lista de partidas</h3>
            <div id="listaPartidas"></div>
            <div id="spinner" class="col p-5 text-center">
                <div class="spinner-border text-dark p-5" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>`
            $("#mostrarPartidas").append(div)
            rest.obtenerPartidasDisponibles()
        })


    }

    this.mostrarControl = function() {
        var nick = $("#nick").text()
        var cadena = `
        <div id="divNick">
            <label>Nick:</label>
            <p class="d-inline" id="nick">`+nick+`</p>
        </div>`

        $("#col-izq").append(cadena)
    }

    this.mostrarCargando = function(data) {
        console.log('JUGADORES: ' + data.jugadores)
        $("#crearPartida").remove()
        $("#mostrarPartidas").remove()
        $("#listaJugadores").remove()
        $("#tituloLP").remove()
        var lj = '<div id="listaJugadores" class="container scroll mb-5"></div>'
        $("#c1").append(lj)
        var div= `
        <h3 class="text-center mb-3 pb-3">Lista de jugadores</h3>`
        $("#listaJugadores").append(div)
        var div1= `<div id="lJ" class="container"></div>`
        $("#listaJugadores").append(div1) 
        var jugadores = data.jugadores
        var cadena = `
        <div id="cabecera" class="col p-5 text-center">
            <div class="spinner-border text-light p-5" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>`
        for (var i = 0; i < jugadores.length; i++) {
            console.log(jugadores[i])
            var cad = `
            <div class="d-flex flex-row justify-content-center" id="jugador_`+jugadores[i]+`">
                <h5>`+jugadores[i]+`</h5>
            </div>`
            $("#lJ").append(cad)
        }
        

        $("#bienvenido").append(cadena)  
        $("#cabecera").remove()
        $("#mCP").remove()
    }

    // Mostrar crear partida
    this.mostrarCrearPartida = function() {
        var cadena = `
        <div id="mCP">
            <div class="input-group mb-3">
                <input type="number" id="numJug" class="form-control" placeholder="Número jugadores (2-8)" aria-label="NumJug" aria-describedby="basic-addon2">
                <div class="input-group-append">
                    <button id="btnCP" class="btn btn-outline-secondary" type="button">Crear partida</button>
                </div>
            </div>
        </div>`

        
        $("#crearPartida").append(cadena)
        
        $("#btnCP").on("click", function() {
            var numJug = $("#numJug").val()
            var nick = $("#nick").text()
            ws.crearPartida(numJug, nick)    
        })
    }
    
    
    // Mostrar unir a partida
    this.mostrarUnirAPartida = function() {
        var cadena = `
        <div id="mCP">
            <div class="input-group mb-3">
                <input type="text" id="codigo" class="form-control" placeholder="Código de la partida" aria-label="codigo" aria-describedby="basic-addon2">
                <div class="input-group-append">
                    <button id="btnUP" class="btn btn-outline-secondary" type="button">Crear partida</button>
                </div>
            </div>
        </div>`
    
        $("#col-centro").append(cadena)

        $("#btnUP").on("click", function() {
            var codigo = $("#codigo").val()
            var nick = $("#nick").text()

            if(codigo) {
                ws.unirAPartida(codigo, nick)
            }
        })        
    }
    
    // Mostrar todas las partidas
    this.mostrarListaPartidas = function(data) {
        $("#listaPartidas").remove()
        var div= `<div id="listaPartidas"></div>`
        $("#mostrarPartidas").append(div)
        for (var i = 0; i < data.length; i++) {
            $("#spinner").remove()
            var codigo = data[i].codigo
            var propietario = data[i].propietario 
            var numJug = data[i].numjugadores
            var cadena = `
            <div id="`+data[i].codigo+`" class="list-group mb-2">
                <button type="button" onclick="ws.unirAPartida(`+codigo+`)" class="list-group-item list-group-item-action">
                    <div class="row">
                        <div class="col-2">
                            <img src="" alt="IMAGEN">
                        </div>
                        <div class="col-4 d-flex justify-content-center">
                            <label>Código:</label>
                            <p>`+codigo+`</p>
                        </div>
                        <div class="col-4 d-flex justify-content-center">
                            <label>Propietario:</label>`+ propietario +`
                        </div>
                        <div class="col-2 d-flex justify-content-end">
                            `+numJug+`
                        </div>
                    </div>
                </button>
            </div>`
            $("#listaPartidas").append(cadena)        
        }
    }

    this.mostrarListaJugadores = function(jugadores) {

    }

    this.mostrarModal = function(data) {
        $("#cM").remove()
        var cadena = `<p id="cM">`+data.msg+`</p>`
        $("#contenidoModal").append(cadena)
        $("#myModal").modal("show")
    }

    this.mostrarModalCambioColor = function(data) {
        $("#cM").remove()
        var cadena = `
        <div class="text-center" id="cM">
            <button class="btn btn-primary" type="button" onclick="ws.cambiarColor("azul")" data-dismiss="modal">Azul</button>
            <button class="btn btn-warning" type="button" onclick="ws.cambiarColor("amarillo")" data-dismiss="modal">Amarillo</button>
            <button class="btn btn-danger" type="button" onclick="ws.cambiarColor("rojo")" data-dismiss="modal">Rojo</button>
            <button class="btn btn-success" type="button" onclick="ws.cambiarColor("verde")" data-dismiss="modal">Verde</button>
        </div>`
        $("#contenidoModal").append(cadena)
        $(".modal-title").text("Cambio de color")
        $("#myModal").modal("show")
    }

    this.mostrarMano = function(lista) {
        $("#mM").remove()
        var cadena = `
        <div id="mM" class="card-columns row">`
        
        for (var i = 0; i<lista.length; i++) {
            var carta = lista[i].img+".png"
            cadena += `
            <div id="`+i+`" class="cardcol pb-1 mb-2 misCartas">
                <a onclick="ws.jugarCarta(`+i+`)"><img class="card-img border border-dark" src="/cliente/img/`+carta+`" alt=""></a>
            </div>`
        }
        cadena += '</div>'
        $("#mano").append(cadena)
    }

    this.mostrarCartaActual = function(lista) {
        $("#cartaActual").remove()
        var cartaActual = lista.cartaActual
        var carta = cartaActual.img+".png"
        var cadena = `
        <div id="cartaActual" class="cardcol p-2 my-5 mx-4">
            <img class="card-img border border-dark" src="/cliente/img/`+carta+`" alt="">
        </div>`
        $("#actual").append(cadena)
    }

    this.mostrarTablero = function(data) {
        $("#c1").remove()
        var muestraNick = '<p id="turno" class="d-inline">Turno: '+data.turno+'</p>'
        $("#muestraTurno").append(muestraNick)
        $("#bienvenido").remove()
        var div = `<button class="btn btn-warning" onclick="ws.pasarTurno()">Pasar turno</button>
                   <button class="btn btn-primary" onclick="ws.robarCarta()">Robar carta</button>
                   <button class="btn btn-danger" onclick="ws.abandonarPartida()">Abandonar partida</button>`
        $("#pasarTurno").append(div)
    }

    this.mostrarCartasRival = function(lista) {
        //mostrar las cartas del rival
        $("#mR").remove()
        var cadena = `
        <div id="mR" class="card-columns row mx-5">`
        
        for (var i = 0; i<lista.cartasRival; i++) {
            cadena += `
            <div id="`+i+`" class="cardcol pb-1 mb-2">
                <img class="card-img border border-dark" src="/cliente/img/cartarival.png" alt="">
            </div>`
        }
        cadena += '</div>'
        $("#rivales").append(cadena)
    }

    this.mostrarTurnoActual = function(data) {
        $("#turno").remove()
        var turnoActual = data.turno
        var muestraNick = '<p id="turno" class="d-inline">Turno: '+turnoActual+'</p>'
        $("#muestraTurno").append(muestraNick)
    }
    
}