var fs = require("fs")
var express = require("express")
var app = express()
var server = require("http").Server(app)
var bodyParser = require("body-parser")

app.set("port", process.env.PORT || 5000)

app.use(express.static(__dirname + "/"))

app.get("/", function(req, res) {
    var contenido = fs.readFileSync(__dirname + "/cliente/index.html")
    res.setHeader("Content-type", "text/html")
    res.send(contenido)
})

// app.get("/agregarJugador/nick", function(req, res) {

// })

//crear partida

//unir a partida


app.listen(app.get("port"), function(port) {
    console.log("La app NodeJS se está ejecutando en el puerto " + app.get("port"))
})