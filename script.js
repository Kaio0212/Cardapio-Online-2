const menu = document.getElementById("menu")
const cartBotao = document.getElementById("cart-botao")
const modeloCart = document.getElementById("Modal-cart")
const cartItensContainer = document.getElementById("cart-itens")
const cartTotal = document.getElementById("cart-total")
const checkoutBotao = document.getElementById("checkout-botao")
const fecharCartBotao = document.getElementById("fechar-modelo-botao")
const cartContagem = document.getElementById("cart-count")
const enderecoInput = document.getElementById("address")
const avisoEndereco = document.getElementById("address-warn")

let cart = [];

/* Abrir o modelo do carrinho */
cartBotao.addEventListener("click", function () {
    AtualizacaoCartModal()
    modeloCart.style.display = "flex"
})

/* Fechar o modelo do carrinho quando clicar fora dele */
modeloCart.addEventListener("click", function (event) {
    if (event.target === modeloCart) {
        modeloCart.style.display = "none"
    }
})

/* Fechar o modelo do carrinho quando clicar no botao fechar */
fecharCartBotao.addEventListener("click", function () {
    modeloCart.style.display = "none"
})



/* Encontrar a ação quando clicar no botao ao lado dos produtos */
menu.addEventListener("click", function (event) {

    let botaoPai = event.target.closest(".add-cart-botao")

    if (botaoPai) {
        const name = botaoPai.getAttribute("data-name")
        const preco = parseFloat(botaoPai.getAttribute("data-preco"))

        /* Adicionar no carrinho */
        AddNoCarrinho(name, preco)

    }
})



/* Função para adicionar no carrinho */
function AddNoCarrinho(name, preco) {
    const itemExistente = cart.find(item => item.name === name)

    /* aumentar a quantidade se o item ja estiver no carrinho */
    if (itemExistente) {
        itemExistente.quantidade += 1;

    } else {

        cart.push({
            name,
            preco,
            quantidade: 1,
        })
    }

    AtualizacaoCartModal()
}

/* Atualiza o carrinho */
function AtualizacaoCartModal() {
    cartItensContainer.innerHTML = "";
    let total = 0;


    cart.forEach(item => {
        const cartItemElements = document.createElement("div");
        cartItemElements.classList.add("Cart-Js")
        cartItemElements.innerHTML = `
             
        <div class="Div-AtualizacaoCartModal">

         <div>
           <p class="Name-AtualizacaoCartModal"> ${item.name} </p>
           <p> Qtd: ${item.quantidade}</p>
           <p class="Preco-AtualizacaoCartModa"> R$ ${item.preco.toFixed(2)} </p>
          </div>
        
        
          <button class="Remove-botao-Cart" data-name="${item.name}">Remover</button>
         

        </div>
        `
        total += item.preco * item.quantidade;

        cartItensContainer.appendChild(cartItemElements);

    })
    /*  colocando a moeda brasileira no valor do total */
    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    /* Mudando o numero entre parenteses do footer */
    cartContagem.innerHTML = cart.length;

}


/* Remover o item do carrinho */

cartItensContainer.addEventListener('click', function (event) {

    if (event.target.classList.contains("Remove-botao-Cart")) {
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

/* Funçâo para remover */
function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];

        if (item.quantidade > 1) {
            item.quantidade -= 1;
            AtualizacaoCartModal();
            return;
        }

        cart.splice(index, 1);
        AtualizacaoCartModal();

    }
}

/* retirar o aviso de endereço incompleto */
enderecoInput.addEventListener("input", function (event) {
    let ValorInput = event.target.value;

    if (ValorInput !== "") {
        enderecoInput.style.border = (" 1px solid black");
        avisoEndereco.style.display = ("none");

    }
})

/* colocar o aviso de indereço incompleto e finalizar pedido */
checkoutBotao.addEventListener("click", function () {

    if (cart.length == 0) return;

    if (enderecoInput.value === "") {
        avisoEndereco.style.display = "block";
        enderecoInput.style.border = "2px solid rgb(237, 15, 15)";
        return;
    }

    /* Enviar o pedido para a Api do Whatszap */
    const cartItems = cart.map((item) => {
        return (
            `${item.name} Quantidade:(${item.quantidade}) Preço: R$${item.preco} |`
        )
    }).join("")

    const mensagem = encodeURIComponent(cartItems)
    const telefone = "5585989079394"

    window.open(`https://wa.me/${telefone}?text=${mensagem} Endereço: ${enderecoInput.value}`, "_blank")

})


/* Verificar se o estabelecimento estar aberto */
function CheckRestauranteAberto() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22; /* true, restaurante esta aberto */
}

/* span do header, sobre os horarios abertos */
const spanItem = document.getElementById("data-span")
const estaAberto = CheckRestauranteAberto();


if (estaAberto) {
    spanItem.style.backgroundColor = ("rgb(2, 175, 2)");
} else {
    spanItem.style.backgroundColor = ("rgb(237, 15, 15)");
}

/*     const estaAberto = CheckRestauranteAberto();
        if (!estaAberto) {
            alert("RESTAURANTE ESTA FECHADO NESTE MOMENTO")
            return;
        } */

