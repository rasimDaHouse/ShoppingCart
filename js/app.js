// variables

const shoppingCar = document.querySelector("#cart");
const contanierCart = document.querySelector("#cart-list tbody");
const cartEmptyBtn = document.querySelector("#cart-empty");
const cartList = document.querySelector("#course-list");
let cartArticles = [];

loadEventListeners();
function loadEventListeners() {
  //Cuando agregas un curso presionando "agregar al carrito"
  cartList.addEventListener("click", addCourse);

  //elimina cursos del carrito
  shoppingCar.addEventListener("click", courseDelete);

  //muestra los cursos en el local storage
  document.addEventListener("DOMContentLoaded", () => {
    cartArticles = JSON.parse(localStorage.getItem("cart")) || [];

    cartHTML();
  });

  //vaciar carrito
  cartEmptyBtn.addEventListener("click", () => {
    cartArticles = []; //reseteamos el arreglo

    cleanHtml(); // eliminamos todo el html
  });
}

//Funciones

function addCourse(e) {
  e.preventDefault();

  if (e.target.classList.contains("add-cart")) {
    const selectCourse = e.target.parentElement.parentElement;

    readDateCourse(selectCourse);
  }
}

//Elimina un curso del carrito
function courseDelete(e) {
  if (e.target.classList.contains("delete-course")) {
    const courseId = e.target.getAttribute("data-id");

    //elimina del arreglo de cartArticles por el data-id
    cartArticles = cartArticles.filter((e) => e.Id !== courseId);

    cartHTML(); //iterar sobre el carrito y mostrar su html
  }
}

//Lee el contenido del HTML al que le dimos click y extrae la informacion del curso
function readDateCourse(course) {
  //Crear un objeto con el contenido del curso
  const infoCourse = {
    Image: course.querySelector("img").src,
    Tittle: course.querySelector("h4").textContent,
    Price: course.querySelector(".price span").textContent,
    Id: course.querySelector("a").getAttribute("data-id"),
    Quantity: 1,
  };

  //Revisa si un elemento ya existe en el carrito
  const exists = cartArticles.some((e) => e.Id === infoCourse.Id);
  if (exists) {
    //actualizamos la cantidad
    const courses = cartArticles.map((e) => {
      if (e.Id === infoCourse.Id) {
        e.Quantity++;
        return e; //retorna el objeto actualizado
      } else {
        return e; // retorna el obejto no duplicados
      }
    });
    cartArticles = [...courses];
  } else {
    //Agrega elementos al arreglo del carrito
    cartArticles = [...cartArticles, infoCourse];
  }

  // console.log(cartArticles);

  cartHTML();
}

//muestra el carrito de compras en el HTML

function cartHTML() {
  //limpiar el html
  cleanHtml();
  //recorre el carrito y genera el html
  cartArticles.forEach((e) => {
    const { Image, Tittle, Price, Quantity, Id } = e;
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>
        <img src="${Image}" width="100"
    </td>
    <td>${Tittle}</td>
    <td> ${Price}</td>
    <td>${Quantity}</td>
    <td>
        <a href="#" class="delete-course" data-id="${Id}" > X
    </td>
        `;

    //agrega el hmtl del carrito en el Tbody

    contanierCart.appendChild(row);
  });

  //Agregar carrito al local storage
  sincronizarStorage();
}

function sincronizarStorage() {
  localStorage.setItem("cart", JSON.stringify(cartArticles));
}

//elimina los cursos del tbody

function cleanHtml() {
  while (contanierCart.firstChild) {
    contanierCart.removeChild(contanierCart.firstChild);
  }
}
