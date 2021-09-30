describe("El juego del UNO...", function() {
  var juego
  
  beforeEach(function() {
    juego = new Juego();
    juego.agregarJugadores("ana")
    juego.agregarJugadores("pepe")
    juego.agregarJugadores("maria")
  });

  it("Ana crea una partida para dos jugadores", function() {
    var ju1 = juego.usuarios["ana"]
    expect(juego.numeroPartidas()).toEqual(0);
    var partida = ju1.crearPartida(2)

    expect(partida.codigo).toBeDefined()
    //Comprobamos que la partida se haya creado correctamente
    expect(juego.numeroPartidas()).toEqual(1);
    //Comprobamos que la partida tiene un jugador
    expect(partida.numeroJugadores()).toEqual(1);
    //Comprobamos que el propietario se llama ana
    expect(partida.propietario).toEqual("ana")
    //Comprobamos si la partida aun no ha comenzado
    expect(partida.fase.nombre).toBe("inicial")
  });

  it("Ana crea la partida para dos jugadores y pepe se une a ella", function() {
    var ju1 = juego.usuarios["ana"]
    expect(juego.numeroPartidas()).toEqual(0);
    var partida = ju1.crearPartida(2)

    expect(partida.codigo).toBeDefined()
    expect(partida.propietario).toEqual("ana")

    var ju2 = juego.usuarios["pepe"]
    ju2.unirAPartida(partida.codigo, "pepe")

    expect(partida.codigo).toBeDefined()
    //Comprobamos que el número de jugadores es igual a dos
    expect(partida.numeroJugadores()).toEqual(2)
    //Comprobamos que la fase cambia a jugando
    expect(partida.fase.nombre).toBe("jugando")
  });

  it("Ana crea la partida para dos jugadores, pepe se une a ella y maría intenta unirse pero no puede", function() {
    spyOn(window, 'alert');
    var ju1 = juego.usuarios["ana"]
    expect(juego.numeroPartidas()).toEqual(0);
    var partida = ju1.crearPartida(2)

    expect(partida.codigo).toBeDefined()
    expect(partida.propietario).toEqual("ana")

    //pepe se une a la partida
    var ju2 = juego.usuarios["pepe"]
    ju2.unirAPartida(partida.codigo, "pepe")

    expect(partida.codigo).toBeDefined()
    //Comprobamos que el número de jugadores es igual a dos
    expect(partida.numeroJugadores()).toEqual(2)
    //Comprobamos que la fase cambia a jugando
    expect(partida.fase.nombre).toBe("jugando")

    //maria intenta unirse a la partida
    var ju3 = juego.usuarios["maria"]
    ju3.unirAPartida(partida.codigo, "maria")
    //salta una alerta con el mensaje "la partida ya ha comenzado"
    expect(window.alert).toHaveBeenCalledWith("La partida ya ha comenzado")
  });

  it("Obtenemos todas las partidas correctamente", function() {
    var j1 = juego.usuarios["pepe"]
    var j2 = juego.usuarios["ana"]

    j1.crearPartida(2)
    j2.crearPartida(4)

    var listaPartidas = juego.obtenerTodasPartidas()

    expect(listaPartidas.length).toEqual(2)
  });

  // it("Comprobar obtener partida", function() {
  //   var codigo = ju1.codigoPartida
  //   ju1.obtenerPartida(codigo)
  // })

  it("Comprobar mazo",function(){
    //codigo para crear partida
    var ju1 = juego.usuarios["ana"]
    var partida = ju1.crearPartida(2)

    expect(partida.mazo.length).toBe(108);
        var rojo=partida.mazo.filter(function(each){
          return each.color=="rojo";
        });
        expect(rojo.length).toBe(25);
        var verde=partida.mazo.filter(function(each){
          return each.color=="verde";
        });
        expect(verde.length).toBe(25);
        var amarillo=partida.mazo.filter(function(each){
          return each.color=="amarillo";
        });
        expect(amarillo.length).toBe(25);
        var azul=partida.mazo.filter(function(each){
          return each.color=="azul";
        });
        expect(azul.length).toBe(25);
        var comodin=partida.mazo.filter(function(each){
          return each.tipo=="cambiocolor";
        });
        expect(comodin.length).toBe(4);
        var comodin2=partida.mazo.filter(function(each){
          return each.tipo=="mas2";
        });
        expect(comodin2.length).toBe(8);
        var comodin4=partida.mazo.filter(function(each){
          return each.tipo=="mas4";
        });
        expect(comodin4.length).toBe(4);
      });




});