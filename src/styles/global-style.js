import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        outline: 0;
    }

    html {
        width: 100%;
        height: 100%;
    }

    div#root {
        height: 100%;
    }

    body {
        width: 100%;
        height: 100%;
    }
`;

export default GlobalStyle;
