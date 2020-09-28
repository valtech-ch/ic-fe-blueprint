// Import scss files just like you would js files
import '../scss/main.scss';
import ReactDOM from "react-dom";
import React from "react";

const welcomeMessage = document.getElementById('welcome-message');

export default function() {
  welcomeMessage.innerHTML = 'Simple Webpack Boilerplate';
 }


const helloWorld = () => {
  const element = document.getElementById('hello-world');
  const name = 'World';

  const HelloWorld = <h1>Hello, {name}</h1>;

  ReactDOM.render(HelloWorld, element);
};

helloWorld();