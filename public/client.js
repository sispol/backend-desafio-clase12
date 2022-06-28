const socket = io()

const formProduct = document.querySelector('#formProduct')
const titleInput = document.querySelector('#titleInput')
const priceInput = document.querySelector('#priceInput')
const thumbnailInput = document.querySelector('#thumbnailInput')

const formMessage = document.querySelector('#formMessage')
const mailInput = document.querySelector('#mailInput')
const messageInput = document.querySelector('#messageInput')

async function renderProducts(products) {
        
    const response = await fetch('./productos.ejs')
    const plantilla = await response.text()

    products.forEach(product => {
        const html = ejs.render(plantilla, product)
        document.querySelector('#productos').innerHTML += html
    })
}

function renderChat(messageInput) {
    try {
        const html = messageInput.map(messageValue => {
            return(`<div>
                <div><span class=text-primary style='font-size:0.65rem; font-weight: bold'>${messageValue.dateMark} - 
                <span style='font-size:0.75rem; color: brown;font-weight: normal'>${messageValue.mail}: </span></span>
                <em class="text-success text-wrap" style="width: 24rem;">${messageValue.message}</em>`)
        }).join(" ");

        areaChat.innerHTML = html
    } catch(error) {
        console.log(`Hubo un error ${error}`)
    }
}

formProduct.addEventListener('submit', eventAddProduct => {
    eventAddProduct.preventDefault()
    submitProduct()
})

formMessage.addEventListener('submit', eventChat => {
    eventChat.preventDefault()
    submitMessage()
})

function submitProduct() {
    try {
        const title = titleInput.value
        const price = priceInput.value
        const thumbnail = thumbnailInput.value
        
        socket.emit('server:products', { title, price, thumbnail})
    } catch(error) {
        console.log(`Hubo un error ${error}`)
    }
}

socket.on('server:products', products => {
    document.querySelector('#productos').innerHTML="" 
    renderProducts(products)
})

function submitMessage() {
    try {
        const newDate = new Date();
        const dateMark = newDate.toLocaleString()
        const mail = mailInput.value
        const message = messageInput.value

        socket.emit('server:chat', {dateMark,mail,message})
    } catch(error) {
        console.log(`Hubo un error ${error}`)
    }
}
socket.on('server:chat', messageInput => {
    document.querySelector('#areaChat').innerHTML=""
    renderChat(messageInput)
})
