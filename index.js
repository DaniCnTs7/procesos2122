var fs = require("fs")
var express = require("express")
var app = express()
var http = require("http").Server(app)
var { Server } = require("socket.io")
var io = new Server(http)
var bodyParser = require("body-parser")

var modelo = require("./servidor/modelo.js")
var ssrv = require("./servidor/servidorWS.js")

var juego = new modelo.Juego()
var servidorWS = new ssrv.ServidorWS()

app.set("port", process.env.PORT || 5000)

app.use(express.static(__dirname + "/"))

app.get("/", function(req, res) {
    var contenido = fs.readFileSync(__dirname + "/cliente/index.html")
    res.setHeader("Content-type", "text/html")
    res.send(contenido)
})

//agregar usuario
app.get("/agregarJugador/:nick", function(req, res) {
    var nick = req.params.nick
    var response = juego.agregarJugadores(nick)
    res.send(response)
})

//crear partida
app.get("/crearPartida/:numJug/:nick", function(req, res) {
    var nick = req.params.nick
    var numJugadores = req.params.numJug
    var ju1 = juego.usuarios[nick]
    var response = {codigo: -1}
    if(ju1) {
        var partida = ju1.crearPartida(numJugadores)
        console.log("Nueva partida con codigo: " + partida.codigo.join(""))
        response = {codigo: partida.codigo}
    }
    res.send(response)
})

//unir a partida
app.get("/unirAPartida/:codigo/:nick", function(req, res) {
    var codigo = req.params.codigo.split("")
    var nick = req.params.nick
    var ju1 = juego.usuarios[nick]
    var partida = juego.partidas[codigo]
    var response = {codigo: -1}
    if(ju1) {
        ju1.unirAPartida(codigo, nick)
        console.log("El jugador "+nick+" se ha unido a la partida: "+codigo.join(""))
        response = {codigo: partida.codigo, jugadores: partida.nombresJug}
    }
    res.send(response)
})

//obtener lista de partidas
app.get("/partidas", function(req, res) {
    if (juego) {
        var partidas = juego.obtenerTodasPartidas()
        res.send(partidas)
    }
})

app.get("/obtenerPartidasDisponibles", function(req, res) {
    if (juego) {
        var partidas = juego.obtenerTodasPartidas()
        res.send(partidas)
    }
})

http.listen(app.get("port"), function(port) {
    console.log("La app NodeJS se está ejecutando en el puerto " + app.get("port"))
})

//lanzar al servidorWS
servidorWS.lanzarServidorWS(io, juego)