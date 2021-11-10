function ControlWeb() {

    
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

    this.mostrarModal = function(msg) {
        $("#cM").remove()
        var cadena = `<p id="cM">`+msg+`</p>`
        $("#contenidoModal").append(cadena)
        $("#myModal").modal("show")
    }

    this.mostrarMano = function(lista) {
        $("#mM").remove()
        var cadena = `
        <div id="mM" class="card-columns row">`
        
        for (var i = 0; i<lista.length; i++) {
            var carta = lista[i].valor + "_" + lista[i].color+".png"
            cadena += `
            <div id="`+i+`" class="cardcol">
                <a onclick="ws.jugarCarta(`+i+`)"><img class="card-img border border-dark" src="/cliente/img/`+carta+`" alt=""></a>
            </div>`
        }
        cadena += '</div>'
        $("#mano").append(cadena)
    }

    this.mostrarCartaActual = function(lista) {
        $("#cartaActual").remove()
        var cartaActual = lista.cartaActual
        var carta = cartaActual.valor + "_" + cartaActual.color+".png"
        var cadena = `
        <div id="cartaActual" class="cardcol">
            <img class="card-img border border-dark" src="/cliente/img/`+carta+`" alt="">
        </div>`
        $("#actual").append(cadena)
    }

    this.mostrarTablero = function() {
        $("#c1").remove()
        $("#bienvenido").remove()
    }

    this.mostrarCartasRival = function(lista) {
        //mostrar las cartas del rival
        var cadena
        Object.entries(lista).forEach(([key, value]) => {
            cadena = `
            <div id="cartas_`+key+`" class="card-columns row">`
            
                for(var j = 0; j<value; j++) {
                    cadena += `
                    <div id="carta`+j+`_`+key+`" class="cardcol">
                    <a onclick="ws.jugarCarta(`+j+`)"><img class="card-img border border-dark" src="/cliente/img/cartarival.png" alt=""></a>
                    </div>`
                }
        })
        cadena += '</div>'
        $("#rivales").append(cadena)
    }
    
}