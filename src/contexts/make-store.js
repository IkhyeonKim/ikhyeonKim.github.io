import { createContext, useContext, useReducer } from "react";

export default function makeStore(reducer, initialState) {
  const dispatchContext = createContext();
  const storeContext = createContext();

  const StoreProvider = ({ children }) => {
    const [store, dispatch] = useReducer(reducer, initialState);

    return (
      <dispatchContext.Provider>
        <storeContext.Provider>{children}</storeContext.Provider>
      </dispatchContext.Provider>
    );
  };

  const useDispatch = () => useContext(dispatchContext);
  const useStore = () => useContext(storeContext);

  return [StoreProvider, useDispatch, useStore];
}
