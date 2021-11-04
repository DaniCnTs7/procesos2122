function ClienteRest() {
    this.agregarJugador = function(nick) {
        $.getJSON("/agregarJugador/"+ nick, function(data) {
            console.log(data)
        })
    } 

    this.crearPartida = function(nick, numJugadores) {
        $.getJSON("/crearPartida/" + numJugadores + "/" + nick, function(data) {
            console.log(data)
        })
    }

    this.unirAPartida = function(codigo, nick) {
        $.getJSON("/unirAPartida/"+codigo+"/"+nick, function(data) {
            console.log(data)
        })
    }
    
    this.partidas = function() {
        $.getJSON("/partidas", function(data) {
            var partidas = []
            $.each(data, function(key, val) {
                console.log(val)
                partidas.push("<li id='" + key + "'>" + val.numjugadores + "</li>")
                partidas.push("<li id='" + key + "'>" + val.codigo + "</li>")
                partidas.push("<li id='" + key + "'>" + val.propietario + "</li>")
            })
            $("<ul/>", {
                "class": "my-new-list",
                html: partidas.join( "" )
              }).appendTo( "#c1" );
        })
    }
}