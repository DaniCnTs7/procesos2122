function ControlWeb() {

    this.mostrarAgregarJugador = function() {
        var nick = $("#usr").val()
        rest.agregarJugador(nick)
        
        $("#mAJ").remove()

        var cadena = `
            <div id="divNick">
                <label>Nick:</label>
                <p class="d-inline" id="nick">`+nick+`</p>
            </div>`

        $("#agregarJugador").append(cadena)
        this.mostrarCrearPartida()
            
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
            var res = ws.crearPartida(numJug, nick)
            console.log(res)


            $("#mCP").remove()
            $("#divNick").remove()

            var cargando = `
            <div class="spinner-border text-success" role="status">
                <span class="sr-only">Loading...</span>
            </div>`

            $("#esperando").append(cargando)
        })
    }
    
    
    // Mostrar unir a partida
    this.mostrarUnirAPartida = function() {
        var cadena = `
        <div id="mUP">
            <div class="input-group mb-3">
                <input type="text" id="nick1" class="form-control" placeholder="Nick" aria-label="nick" aria-describedby="basic-addon2">
                <input type="text" id="codigo" class="form-control" placeholder="Código partida" aria-label="codigo" aria-describedby="basic-addon2">
                <div class="input-group-append">
                    <button id="btnUP" class="btn btn-outline-secondary" type="button">Unir a partida</button>
                </div>
            </div>
        </div>`
    
        $("#unirAPartida").append(cadena)

        $("#btnUP").on("click", function() {
            var codigo = $("#codigo").val()
            var nick = $("#nick1").val()
            ws.unirAPartida(codigo, nick)
        })        
    }
    
    // Mostrar todas las partidas
    this.mostrarListaPartidas = function() {
        var partidas = rest.partidas()
        // for(var partida in partidas) {
        //     $("#listaPartidas").append(partida)
        // }
    }
    
}