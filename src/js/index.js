import "./app";
import "../styles/index.scss";

$(function ($) {
  const swiper = new Swiper(".swiper", {
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  $(".phone").mask("+7 (999) 999–99–99");
});
