import React from "react";
import { Provider } from "react-redux";
import TestComponent from "./components/TestComponent";
import { store } from "./store";
import './styles/Main.scss'

function App() {
  return (
    <Provider store={store}>
      <h1>Databases Project</h1>
      <TestComponent />
    </Provider>
  );
}

export default App;
