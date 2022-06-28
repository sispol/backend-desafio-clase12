const express = require('express')
const app = express()
const path = require('path')
const { Server: IOServer } = require('socket.io')
const expressServer = app.listen(8000, () => console.log('server ok !!!'))
const io = new IOServer(expressServer)
const fs = require('fs');
const fileName = 'chat.txt';

let id;
const producto = []

class Contenedor {

    constructor () {
        this.producto = producto
    }

    getAll() {
            return this.producto
    }
    
    getById(id) {
        return this.producto.find(x => x.id == id)    
    }

    deleteAll() {
            productos = []
            return this.producto
    }

    allItems() {
            return (Object.keys(this.producto).length)
    }

    lastId() {
        let newItem = this.allItems()
        if (newItem === 0) {
            return(1)
        } else {
            return this.producto[newItem-1].id+1
        }
    }

}
const messages = [] 

const db = new Contenedor();
db.producto = [
    {"id":1,"title":"Tablero","price":15000,"thumbnail":"https://cdn3.iconfinder.com/data/icons/education-209/64/board-math-class-school-128.png"},
    {"id":2,"title":"Microscopio","price":64500,"thumbnail":"https://cdn3.iconfinder.com/data/icons/education-209/64/microscope-lab-science-school-128.png"},
    {"id":3,"title":"Lapiz","price":260,"thumbnail":"https://cdn3.iconfinder.com/data/icons/education-209/64/pencil-pen-stationery-school-128.png"},
    {"id":4,"title":"Escuadra","price":480,"thumbnail":"https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-128.png"}]

app.use(express.static(path.join(__dirname, '../public')))

io.on('connection', async socket => {
    console.log('Se conecto un usuario nuevo')
    socket.emit('server:chat', messages)

    socket.emit('server:products', db.producto)

    socket.on('server:products', newProduct => {
        id = db.lastId()
        db.producto.push({id: id,title: newProduct.title,price: newProduct.price, thumbnail: newProduct.thumbnail})
        io.emit('server:products', db.producto)
    })

    socket.emit('server:chat', messages)

    socket.on('server:chat', inputMessage => {
        messages.push({
                        dateMark: inputMessage.dateMark,
                        mail: inputMessage.mail,
                        message: inputMessage.message,
                        })
        saveMessages()
        io.emit('server:chat', messages)
    })
})

async function saveMessages() {
    try {
        await fs.promises.writeFile(fileName, JSON.stringify(messages));
        }
    catch(e) {
        console.log("Hubo un error de escritura: ", e);
    }
}

( () => {
    let temp
    let error
    fs.readFile('./chat.txt','utf-8',(err,temp) => {
        if (err) {
            return console.log(err);
        } else {
            if (temp != "") {
            temp = JSON.parse(temp)
            temp.forEach(element => {
                messages.push(element)
            });
            }
        }
    })
})();
