let shop = document.getElementById('shop')
let loader = document.getElementById('loader')
let error = document.getElementById('error')

/**
 * ? Operadores condicionales
 **/

let cesta = JSON.parse(localStorage.getItem("carrito")) || []
    /**
     * ! Crea el HTML y lo completa con los datos del JSON 
     **/

let generateShop = () => {
    return (shop.innerHTML = shopItemsData
        .map((x) => {
            let { id, name, price, desc, img } = x
            /**
             * ? Operadores condicionales
             */
            let search = cesta.find((x) => x.id === id) || []
            return `
        <div id=product-id-${id} class="item">
            <img src=${img} alt="">
            <div class="details">
                <h3>${name}</h3>
                <p>${desc}</p>
                <div class="price-quantity">
                    <h2>$ ${price}</h2>
                    <div class="buttons">
                        <i onClick="increment(${id})" class="bi bi-plus-circle"></i>
                        <div id=${id} class="quantity">
                        ${x.item === undefined ? 0 : search.item}
                        </div>
                        <i onClick="decrement(${id})" class="bi bi-dash-circle"></i>
                    </div>
                </div>

            </div>
        </div>
    `
        })
        .join(""))
}


// generateShop()
/**
 * ! Al oprimir el botón incrementa la cantidad y la introduce en la cesta 
 **/
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
    update(selectedItem.id)

    /**
     * ! Almacena en la cesta LOCALSTORAGE
     **/

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
    localStorage.setItem("carrito", JSON.stringify(cesta))

}

/**
 * ! Actualiza la cantidad de items en el producto seleccionado
 **/

let update = (id) => {
    let search = cesta.find((x) => x.id === id)
    document.getElementById(id).innerHTML = search.item
    calculation()
}

/**
 * ! Actualiza el valor en el carrito del Navbar
 **/

let calculation = () => {
    let cartIcon = document.getElementById("carritoCantidad")
    cartIcon.innerHTML = cesta.map((x) => x.item).reduce((x, y) => x + y, 0)
}
calculation()

/**
 * ! a Partir de Aqui AJAX y FETCH
 * ? Al finalizar esta otro comentario igual a este
 **/

const URL = `js/data.json`

let gestionadorLoader = () => {
    loader.innerHTML = `
    <div class="d-flex align-items-center">
        <strong>Loading...</strong>
        <div class="spinner-border ms-auto" role="status" aria-hidden="true"></div>
    </div>
`
    setTimeout(() => {
        loader.innerHTML = ``
    }, 1500)
}

let errorGenerador = () => {
    return error.innerHTML = `
 <div>
     <h1> Four </h1>
     <h1> Oh! </h1>
     <h1> Four </h1>
     <p>No puedo encontrar el contenido</p>
     <img  width="400" src="images/cheems.jpg" alt="">
 </div>
 `
}


let manejadorDeErrores = () => {
    gestionadorLoader()
    let shop = ""
    fetch(URL)
        .then((response) => response.json())
        .then((data) => {
            shopItemsData = data
            generateShop()
        })
        .catch((error) => {
            errorGenerador()
        })
}
manejadorDeErrores()