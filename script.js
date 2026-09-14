// ============================================
// MI LISTA DE COMPRA
// ============================================


// --------------------------------------------
// ELEMENTOS DE LA PÁGINA
// --------------------------------------------

const productInput =
    document.getElementById("productInput");

const addButton =
    document.getElementById("addButton");

const shoppingList =
    document.getElementById("shoppingList");

const productCount =
    document.getElementById("productCount");

const completedButton =
    document.getElementById("completedButton");

const emptyMessage =
    document.getElementById("emptyMessage");

const successMessage =
    document.getElementById("successMessage");


// --------------------------------------------
// LISTA DE PRODUCTOS
// --------------------------------------------

let products = [];


// --------------------------------------------
// CARGAR LISTA GUARDADA
// --------------------------------------------

const savedProducts =
    localStorage.getItem("miListaCompra");

if (savedProducts) {

    try {

        products = JSON.parse(savedProducts);

        // Compatibilidad con productos creados
        // en la versión anterior.

        products = products.map(product => ({

            name: product.name,

            completed:
                product.completed || false,

            quantity:
                product.quantity || 1

        }));

    } catch (error) {

        products = [];

    }

}


// --------------------------------------------
// GUARDAR
// --------------------------------------------

function saveProducts() {

    localStorage.setItem(
        "miListaCompra",
        JSON.stringify(products)
    );

}


// --------------------------------------------
// MOSTRAR PRODUCTOS
// --------------------------------------------

function renderProducts() {

    // Eliminamos los productos actuales.

    const existingProducts =
        shoppingList.querySelectorAll(
            ".product-item"
        );

    existingProducts.forEach(product => {

        product.remove();

    });


    // Si la lista está vacía...

    if (products.length === 0) {

        emptyMessage.style.display =
            "block";

    } else {

        emptyMessage.style.display =
            "none";


        // Creamos cada producto.

        products.forEach((product, index) => {

            const productElement =
                document.createElement("div");

            productElement.className =
                "product-item";


            // --------------------------------
            // CHECKBOX
            // --------------------------------

            const checkbox =
                document.createElement("input");

            checkbox.type = "checkbox";

            checkbox.className =
                "product-checkbox";

            checkbox.checked =
                product.completed;


            // --------------------------------
            // NOMBRE
            // --------------------------------

            const name =
                document.createElement("span");

            name.className =
                "product-name";

            name.textContent =
                product.name;


            // --------------------------------
            // CONTROLES DE CANTIDAD
            // --------------------------------

            const quantityControls =
                document.createElement("div");

            quantityControls.className =
                "quantity-controls";


            // BOTÓN MENOS

            const decreaseButton =
                document.createElement("button");

            decreaseButton.className =
                "quantity-button";

            decreaseButton.textContent =
                "−";

            decreaseButton.title =
                "Reducir cantidad";


            // NÚMERO

            const quantityNumber =
                document.createElement("span");

            quantityNumber.className =
                "quantity-number";

            quantityNumber.textContent =
                product.quantity;


            // BOTÓN MÁS

            const increaseButton =
                document.createElement("button");

            increaseButton.className =
                "quantity-button";

            increaseButton.textContent =
                "+";

            increaseButton.title =
                "Aumentar cantidad";


            // Añadimos controles.

            quantityControls.appendChild(
                decreaseButton
            );

            quantityControls.appendChild(
                quantityNumber
            );

            quantityControls.appendChild(
                increaseButton
            );


            // --------------------------------
            // BOTÓN BORRAR
            // --------------------------------

            const deleteButton =
                document.createElement("button");

            deleteButton.className =
                "delete-button";

            deleteButton.textContent =
                "🗑️";

            deleteButton.title =
                "Eliminar producto";


            // --------------------------------
            // MARCAR PRODUCTO
            // --------------------------------

            checkbox.addEventListener(
                "change",
                () => {

                    products[index].completed =
                        checkbox.checked;

                    saveProducts();

                    renderProducts();

                }
            );


            // --------------------------------
            // REDUCIR CANTIDAD
            // --------------------------------

            decreaseButton.addEventListener(
                "click",
                () => {

                    if (
                        products[index].quantity > 1
                    ) {

                        products[index].quantity--;

                        saveProducts();

                        renderProducts();

                    }

                }
            );


            // --------------------------------
            // AUMENTAR CANTIDAD
            // --------------------------------

            increaseButton.addEventListener(
                "click",
                () => {

                    products[index].quantity++;

                    saveProducts();

                    renderProducts();

                }
            );


            // --------------------------------
            // ELIMINAR PRODUCTO
            // --------------------------------

            deleteButton.addEventListener(
                "click",
                () => {

                    products.splice(index, 1);

                    saveProducts();

                    renderProducts();

                }
            );


            // --------------------------------
            // MONTAR PRODUCTO
            // --------------------------------

            productElement.appendChild(
                checkbox
            );

            productElement.appendChild(
                name
            );

            productElement.appendChild(
                quantityControls
            );

            productElement.appendChild(
                deleteButton
            );

            shoppingList.appendChild(
                productElement
            );

        });

    }


    // Actualizamos contador.

    updateCounter();

}


// --------------------------------------------
// CONTADOR
// --------------------------------------------

function updateCounter() {

    const total =
        products.length;

    if (total === 1) {

        productCount.textContent =
            "1 producto";

    } else {

        productCount.textContent =
            `${total} productos`;

    }

}


// --------------------------------------------
// AÑADIR PRODUCTO
// --------------------------------------------

function addProduct() {

    const name =
        productInput.value.trim();


    // Evitamos productos vacíos.

    if (name === "") {

        productInput.focus();

        return;

    }


    // Creamos el producto.

    products.push({

        name: name,

        completed: false,

        quantity: 1

    });


    // Guardamos.

    saveProducts();


    // Actualizamos.

    renderProducts();


    // Limpiamos el campo.

    productInput.value = "";

    productInput.focus();

}


// --------------------------------------------
// BOTÓN AÑADIR
// --------------------------------------------

addButton.addEventListener(
    "click",
    addProduct
);


// --------------------------------------------
// ENTER PARA AÑADIR
// --------------------------------------------

productInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            addProduct();

        }

    }
);


// --------------------------------------------
// COMPRA HECHA
// --------------------------------------------

completedButton.addEventListener(
    "click",
    () => {

        // Si no hay productos...

        if (products.length === 0) {

            productInput.focus();

            return;

        }


        // Vaciar lista.

        products = [];


        // Guardar lista vacía.

        saveProducts();


        // Actualizar pantalla.

        renderProducts();


        // Mostrar mensaje.

        successMessage.classList.add(
            "show"
        );


        // Ocultar mensaje después.

        setTimeout(() => {

            successMessage.classList.remove(
                "show"
            );

        }, 3500);

    }
);


// --------------------------------------------
// INICIAR APLICACIÓN
// --------------------------------------------

renderProducts();