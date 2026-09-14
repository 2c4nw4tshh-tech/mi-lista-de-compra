// ============================================
// MI LISTA DE COMPRA + SUPABASE
// ============================================


// --------------------------------------------
// CONFIGURACIÓN DE SUPABASE
// --------------------------------------------

const SUPABASE_URL =
    "https://kaptaotwfsxhldrmuage.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_vTZpBPCkgNW6hG6EYotv4A_p2znAPGG";


const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


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
// CARGAR PRODUCTOS DESDE SUPABASE
// --------------------------------------------

async function loadProducts() {

    const { data, error } =
        await supabaseClient
            .from("products")
            .select("*")
            .order("created_at", {
                ascending: true
            });

    if (error) {

        console.error(
            "Error cargando productos:",
            error
        );

        return;
    }

    products = data || [];

    renderProducts();
}


// --------------------------------------------
// MOSTRAR PRODUCTOS
// --------------------------------------------

function renderProducts() {

    const existingProducts =
        shoppingList.querySelectorAll(
            ".product-item"
        );

    existingProducts.forEach(product => {
        product.remove();
    });


    if (products.length === 0) {

        emptyMessage.style.display =
            "block";

    } else {

        emptyMessage.style.display =
            "none";


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


            const decreaseButton =
                document.createElement("button");

            decreaseButton.className =
                "quantity-button";

            decreaseButton.textContent =
                "−";

            decreaseButton.title =
                "Reducir cantidad";


            const quantityNumber =
                document.createElement("span");

            quantityNumber.className =
                "quantity-number";

            quantityNumber.textContent =
                product.quantity;


            const increaseButton =
                document.createElement("button");

            increaseButton.className =
                "quantity-button";

            increaseButton.textContent =
                "+";

            increaseButton.title =
                "Aumentar cantidad";


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
                async () => {

                    const { error } =
                        await supabaseClient
                            .from("products")
                            .update({
                                completed:
                                    checkbox.checked
                            })
                            .eq(
                                "id",
                                product.id
                            );

                    if (error) {

                        console.error(
                            "Error actualizando producto:",
                            error
                        );

                    }

                }
            );


            // --------------------------------
            // REDUCIR CANTIDAD
            // --------------------------------

            decreaseButton.addEventListener(
                "click",
                async () => {

                    if (
                        product.quantity > 1
                    ) {

                        const newQuantity =
                            product.quantity - 1;

                        const { error } =
                            await supabaseClient
                                .from("products")
                                .update({
                                    quantity:
                                        newQuantity
                                })
                                .eq(
                                    "id",
                                    product.id
                                );

                        if (error) {

                            console.error(
                                "Error reduciendo cantidad:",
                                error
                            );

                            return;
                        }

                        product.quantity =
                            newQuantity;

                        quantityNumber.textContent =
                            newQuantity;

                    }

                }
            );


            // --------------------------------
            // AUMENTAR CANTIDAD
            // --------------------------------

            increaseButton.addEventListener(
                "click",
                async () => {

                    const newQuantity =
                        product.quantity + 1;

                    const { error } =
                        await supabaseClient
                            .from("products")
                            .update({
                                quantity:
                                    newQuantity
                            })
                            .eq(
                                "id",
                                product.id
                            );

                    if (error) {

                        console.error(
                            "Error aumentando cantidad:",
                            error
                        );

                        return;
                    }

                    product.quantity =
                        newQuantity;

                    quantityNumber.textContent =
                        newQuantity;

                }
            );


            // --------------------------------
            // ELIMINAR PRODUCTO
            // --------------------------------

            deleteButton.addEventListener(
                "click",
                async () => {

                    const { error } =
                        await supabaseClient
                            .from("products")
                            .delete()
                            .eq(
                                "id",
                                product.id
                            );

                    if (error) {

                        console.error(
                            "Error eliminando producto:",
                            error
                        );

                        return;
                    }

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

async function addProduct() {

    const name =
        productInput.value.trim();


    if (name === "") {

        productInput.focus();

        return;

    }


    const { error } =
        await supabaseClient
            .from("products")
            .insert({
                name: name,
                completed: false,
                quantity: 1
            });


    if (error) {

        console.error(
            "Error añadiendo producto:",
            error
        );

        return;
    }


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
    async () => {

        if (products.length === 0) {

            productInput.focus();

            return;

        }


        const { error } =
            await supabaseClient
                .from("products")
                .delete()
                .neq("id", 0);


        if (error) {

            console.error(
                "Error vaciando la lista:",
                error
            );

            return;
        }


        successMessage.classList.add(
            "show"
        );


        setTimeout(() => {

            successMessage.classList.remove(
                "show"
            );

        }, 3500);

    }
);


// --------------------------------------------
// ACTUALIZACIONES EN TIEMPO REAL
// --------------------------------------------

supabaseClient
    .channel("products-changes")
    .on(
        "postgres_changes",
        {
            event: "*",
            schema: "public",
            table: "products"
        },
        payload => {

            console.log(
                "Cambio recibido:",
                payload
            );

            loadProducts();

        }
    )
    .subscribe();


// --------------------------------------------
// INICIAR APLICACIÓN
// --------------------------------------------

loadProducts();
