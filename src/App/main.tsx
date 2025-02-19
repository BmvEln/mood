import { createRoot } from "react-dom/client";
import "./index.less";
import App from "./App.tsx";
import { store } from "../redux/store.tsx";
import { Provider } from "react-redux";

createRoot(document.getElementById("app")!).render(
  <Provider store={store}>
    <App />
  </Provider>,
);
