function ClienteRest() {
    this.agregarJugador = function(nick) {
        $.getJSON("/agregarJugador/"+ nick, function(data) {
            console.log(data)
        })
    } 

    this.crearPartida = function(nick, numJugadores) {
        $.getJSON("/crearPartida/" + nick + "/" + numJugadores, function(data) {
            console.log(data)
        })
    }

    this.unirAPartida = function(codigo, nick) {
        $.getJSON("/unirAPartida/"+codigo+"/"+nick, function(data) {
            console.log(data)
        })
    }
    
    this.partidas = function() {
        $.getJSON("/partidas/",function(data) {
            console.log(data)
        })
    }
}