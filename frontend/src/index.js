import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { RecoilRoot } from "recoil";
const theme = extendTheme({
  styles: {
    global: {
      ".gradient-text ": {
        background: "-webkit-linear-gradient(#e66465, #757edf)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      },
      ".chakra-tabs__tab[aria-selected='true']": {
        background: "-webkit-linear-gradient(#e66465, #757edf)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      },
      ".gradient-button-text:hover": {
        background: "-webkit-linear-gradient(#e66465, #757edf)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      },
    },
  },
});
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RecoilRoot>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </RecoilRoot>
  </React.StrictMode>
);
