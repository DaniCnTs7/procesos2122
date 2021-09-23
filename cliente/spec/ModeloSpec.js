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

});