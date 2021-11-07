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

        var cadena = `
            <div id="col-izq" class="col-md-4">
            
            </div>
            <div id="col-centro" class="col-md-4 text-center">
            
            </div>
            <div id="col-derecha" class="col-md-4">
            
            </div>`

        var cad = `
            <p id="nick" class="d-none">`+nick+`</p>
            <div id="elecciones">
                <button id="crear" class="btn btn-danger">CREAR PARTIDA</button>
                <button id="unirse" class="btn btn-primary">UNIRSE A PARTIDA</button>
            </div>`

        
        $("#contenedor").append(cad)

        $("#crear").on("click", function() {
            $("#elecciones").remove()
            $("#contenedor").append(cadena)
            iu.mostrarCrearPartida()
        })

        $("#unirse").on("click", function() {
            $("#elecciones").remove()
            var div= `
            <h3 class="text-center mb-3 pb-3">Lista de partidas</h3>
            <div id="listaPartidas"></div>`
            $("#c1").append(div)
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
        var jugadores = data.jugadores
        var cadena = `
        <div id="cabecera" class="col p-5 text-center">
            <div class="spinner-border text-light p-5" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
        <div class="mb-2 text-center">
            <h3>JUGADORES</h3>
        </div>`
        for (var i = 0; i < jugadores.length; i++) {
            console.log(jugadores[i])
            var cad = `
            <div id="listaJugadores">
                <h5>`+jugadores[i]+`</h5>
            </div>`
            $("#c1").append(cad)
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
    
        $("#col-centro").append(cadena)
    
        $("#btnCP").on("click", function() {
            var numJug = $("#numJug").val()
            var nick = $("#nick").text()

            if(numJug) {
                ws.crearPartida(numJug, nick)    
            }
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
        $("#c1").append(div)
        for (var i = 0; i < data.length; i++) {
            var codigo = data[i].codigo
            var propietario = data[i].propietario 
            var numJug = data[i].numjugadores
            var cadena = `
            <div id="`+data[i].codigo+`" class="list-group">
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
        <div id="mM" class="card-columns">`

        for (var i = 0; i<lista.length; i++) {
            cadena += `
            <div class="card bg-light">
                  <div class="card-body text-center">
                    <p class="card-text">`+ lista[i].tipo +' '+ lista[i].color +' '+ lista[i].valor +`</p>
                  </div>
            </div>`
        }
        cadena += '</div>'
        $("#mano").append(cadena)
    }
    
}