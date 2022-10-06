import Swiper from "swiper";
import "swiper/css";
import "../styles/index.scss";
import $ from "jquery";
import "./app";

const swiper = new Swiper(".swiper", {
  // configure Swiper to use modules
});

$("body").css("color", "#222");

console.log("index");
