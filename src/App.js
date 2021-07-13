import BallPage from "./components/pages/ball-page";
import MainPage from "./components/pages/main-page";
import { LayoutProvider } from "./contexts/layout-store";
import GlobalStyle from "./styles/global-style";

function App() {
  return (
    <LayoutProvider>
      <GlobalStyle />
      <BallPage></BallPage>
      {/* <MainPage></MainPage> */}
    </LayoutProvider>
  );
}

export default App;
