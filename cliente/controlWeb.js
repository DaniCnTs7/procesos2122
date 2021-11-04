function ControlWeb() {

    
    this.mostrarAgregarJugador = function() {
        $("#btnAJ").on("click", function(){
            var nick = $("#usr").val()
            var cadena = `
            <p id="nick" class="d-none">`+nick+`</p>
            <div id="elecciones">
                <button id="crear" class="btn btn-danger">CREAR PARTIDA</button>
                <button id="unirse" class="btn btn-primary">UNIRSE A PARTIDA</button>
            </div>`

            if(nick) {
                
                $("#agregarJugador").remove()
                
                $("#contenedor").append(cadena)
                
                rest.agregarJugador(nick)
                iu.mostrarControl()
                iu.mostrarEleccion()
            }
        })
            
    }

    this.mostrarEleccion = function() {
        var cadena = `
            <div id="col-izq" class="col-md-4">
            
            </div>
            <div id="col-centro" class="col-md-4 text-center">
            
            </div>
            <div id="col-derecha" class="col-md-4">
            
            </div>`

        $("#crear").on("click", function() {
            $("#elecciones").remove()
            $("#contenedor").append(cadena)
            iu.mostrarCrearPartida()
        })

        $("#unirse").on("click", function() {
            $("#elecciones").remove()
            iu.mostrarListaPartidas()
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

    this.mostrarCargando = function() {
        var cadena = `
        <div id="cabecera" class="col p-5 text-center">
            <div class="spinner-border text-light p-5" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>`

        var cadena2 = `
        <div class="row justify-content-center mb-2">
                <h3>JUGADORES</h3>
            </div>
            <div class="row justify-content-center">
                <p>Jugador 1</p>
            </div>
            <div class="row justify-content-center">
                <p>Jugador 2</p>
            </div>
            <div class="row justify-content-center">
                <p>Jugador 3</p>
        </div>`

        $("#cabecera").remove()
        $("#mCP").remove()
        $("#bienvenido").append(cadena)  
        $("#c1").append(cadena2)
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
    this.mostrarListaPartidas = function() {
        var cadena = `
        <h3 class="text-center mb-3 pb-3">Lista de partidas</h3>
        <div class="list-group">
            <button type="button" class="list-group-item list-group-item-action">
                <div class="row">
                    <div class="col-2">
                        <img src="" alt="IMAGEN">
                    </div>
                    <div class="col-5 d-flex justify-content-center">
                        PARTIDA 1
                    </div>
                    <div class="col-5 d-flex justify-content-end">
                        2/5 JUGADORES
                    </div>
                </div>
            </button>
            <button type="button" class="list-group-item list-group-item-action">
                <div class="row">
                    <div class="col-2">
                        <img src="" alt="IMAGEN">
                    </div>
                    <div class="col-5 d-flex justify-content-center">
                        PARTIDA 1
                    </div>
                    <div class="col-5 d-flex justify-content-end">
                        2/5 JUGADORES
                    </div>
                </div>
            </button>
        </div>`

        rest.partidas()
        var partidas = {}
        partidas = $("#partidas")
        console.log("Partidas: " + partidas)
        $("#c1").append(cadena)        
    }
    
}