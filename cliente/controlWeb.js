function ControlWeb() {
    this.mostrarAgregarJugador = function() {
        var cadena = `
        <div id="mAJ">
            <div class="input-group mb-3">
                <input type="text" id="usr" class="form-control" placeholder="Nick" aria-label="Nick" aria-describedby="basic-addon2">
                <div class="input-group-append">
                    <button id="btnAJ" class="btn btn-outline-secondary" type="button">Button</button>
                </div>
            </div>
        </div>`

    $("#agregarJugador").append(cadena)

    $("#btnAJ").on("click", function() {
        var nick = $("#usr").val()
        $("#mAJ").remove()
        rest.agregarJugador(nick)
    })

    // Mostrar crear partida
    // Mostrar unir a partida
    // Mostrar todas las partidas
    
    
    }
}