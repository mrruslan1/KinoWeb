const burgerMenu = document.querySelector(".header__menu-burger");
const listMenu = document.querySelector(".header__menu-list");

burgerMenu.addEventListener("click", function(e){
    e.stopPropagation();
    listMenu.classList.toggle("header__menu-active");
    listMenu.classList.toggle("header__menu-list");
})

