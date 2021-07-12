import MainPage from "./components/pages/main-page";
import { LayoutProvider } from "./contexts/layout-store";

function App() {
  return (
    <LayoutProvider>
      <MainPage></MainPage>;
    </LayoutProvider>
  );
}

export default App;
