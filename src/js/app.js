"use strict";

import $ from "jquery";
import jQuery from "jquery";
window.$ = jQuery;
import "bootstrap";
import "./greetings";
import React from "react";
import ReactDom from "react-dom";
import Title from "./components/Title";

// React
ReactDom.render(<Title />, document.querySelector("#init"));

//jQuery starts here
$(document).ready(() => {
  particlesJS.load("particles-js", "./particles-dark.json");
  $("#light").on("click", () => {
    $(".init").addClass("dark");
    $(".toggle-light-dark").removeClass("light");
    $(".toggle-light-dark").addClass("dark");
    $(".title").addClass("dark");
    particlesJS.load("particles-js", "./particles.json");
    $(".branding").addClass("dark");
  });

  $("#dark").on("click", () => {
    $(".init").removeClass("dark");
    $(".toggle-light-dark").removeClass("dark");
    $(".toggle-light-dark").addClass("light");
    $(".title").removeClass("dark");
    particlesJS.load("particles-js", "./particles-dark.json");
    $(".branding").removeClass("dark");
  });
});
