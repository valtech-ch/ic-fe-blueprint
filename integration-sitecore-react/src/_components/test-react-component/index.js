// Import scss files just like you would js files
import ReactDOM from "react-dom";
import React from "react";

const helloWorld = () => {
  const element = document.getElementById('test-react-component');
  const name = 'World';

  const HelloWorld =
    <>
      <h1>Hello, {name}</h1>
      <p>Custom react component</p>
    </>;

  ReactDOM.render(HelloWorld, element);
};

helloWorld();