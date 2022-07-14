let etiqueta = document.getElementById('etiqueta')
let ShoppingCart = document.getElementById('shopping-cart')


/**
 * ? Operadores condicionales
 */
let cesta = JSON.parse(localStorage.getItem("carrito")) || []

/**
 * ! Suma la cantidad de items para mostrarlos en el icono carrito
 **/

let calculation = () => {
    let cartIcon = document.getElementById("carritoCantidad")
    cartIcon.innerHTML = cesta.map((x) => x.item).reduce((x, y) => x + y, 0)
}
calculation()

/**
 * ! Crea el HTML y lo completa con los datos almacenados en el storage
 **/

let generateCartItems = () => {
    if (cesta.length !== 0) {
        return (ShoppingCart.innerHTML = cesta
            .map((x) => {
                /**
                 * ? Destructuración
                 */
                let { id, item } = x
                /**
                 * ? Operadores condicionales
                 */
                let search = shopItemsData.find((x) => x.id === id) || []
                let { img, name, price } = search
                return `
            <div class="cart-item">
                <img class="cart-img" src="${search.img}" alt="" />
            <div class="details">
            

                    <div class="tittle-price-x">
                    <h4 class="tittle-price">
                    <p>${name}</p>
                    <p class="cart-item-price">$ ${price}</p>
                    </h4>
                    <i onclick="removeItem(${id})"class="bi bi-x-circle"></i>
                </div>

                <div class="buttons">
                        <i onclick="increment(${id})" class="bi bi-plus-circle"></i>
                        <div id=${id} class="quantity">${item}</div>
                        <i onClick="decrement(${id})" class="bi bi-dash-circle"></i>
                    </div>
                <h3>$ ${item*price}</h3>
                </div>
            </div>
            `
            })
            .join(""))
    } else {
        /**
         * ! En caso de carrito vacio o que se eliminen todos los items 
         **/
        ShoppingCart.innerHTML = ``
        etiqueta.innerHTML = `
        <h2>Carrito Vacio!</h2>
        <a href="index.html">
        <button class="HomeBtn">Back to Home!</button>
        </a>
    `
    }
}

/**
 * ! Si se agregan o eliminan cantidades de items actualiza carrito 
 **/

generateCartItems()
let increment = (id) => {
    let selectedItem = id
    let search = cesta.find((x) => x.id === selectedItem.id)

    if (search === undefined) {
        cesta.push({
            id: selectedItem.id,
            item: 1,
        })
    } else {
        search.item += 1
    }
    generateCartItems()
    update(selectedItem.id)
    localStorage.setItem("carrito", JSON.stringify(cesta))

}

/**
 * ! Al oprimir el botón disminuye la cantidad y la introduce en la cesta 
 **/

let decrement = (id) => {
    let selectedItem = id
    let search = cesta.find((x) => x.id === selectedItem.id)

    if (search === undefined) return;
    else if (search.item === 0) return;
    else {
        search.item -= 1;
    }
    update(selectedItem.id)
    cesta = cesta.filter((x) => x.item !== 0)
    generateCartItems()
    localStorage.setItem("carrito", JSON.stringify(cesta))
}

/**
 * ! Actualiza la cantidad de items en el producto seleccionado
 **/

let update = (id) => {
    let search = cesta.find((x) => x.id === id)
    document.getElementById(id).innerHTML = search.item
    calculation(id)
    totalAmount()
}

/**
 * ! Elimina items del carrito
 **/

let clearCart = () => {
        cesta = []
        generateCartItems()
        calculation()
        localStorage.setItem("carrito", JSON.stringify(cesta))
    }
    /**
     * ! Seewt alert aqui
     */
let alerta = () => {
        Swal.fire({
            title: '¿Desea Liminr items del carrito?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Si, eliminar',
            denyButtonText: `No, conservar`,
        }).then((result) => {
            if (result.isConfirmed) {
                clearCart()
                Swal.fire('Eliminado!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Volver al carrito', '', '')
            }
        })
    }
    /**
     * ! Elimina TODOS los items del carrito
     **/

let removeItem = (id) => {
    let selectedItem = id
    cesta = cesta.filter((x) => x.id !== selectedItem.id)
    generateCartItems()
    totalAmount()
    calculation()
    localStorage.setItem("carrito", JSON.stringify(cesta))
}

/**
 * ! calcula la sumatoria total a pagar
 **/

let totalAmount = () => {
    if (cesta.length !== 0) {
        let amount = cesta.map((x) => {
                let { item, id } = x
                /**
                 * ? Operadores condicionales
                 */
                let search = shopItemsData.find((x) => x.id === id) || []
                return item * search.price
            })
            .reduce((x, y) => x + y, 0)
        return (etiqueta.innerHTML = `
        <h2>Total Bill: $ ${amount}</h2>
        <button class="checkout">Checkout!</button>
        <button onclick="alerta()" class="removeAll">Limpiar carrito!</button>
        `)
    } else return
}

totalAmount()