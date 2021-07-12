import makeStore from "./make-store";

const initialState = {};

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_DATA":
      return {
        ...state,
        animatedArr: action.data,
      };
    default:
      return state;
  }
};

const [LayoutProvider, useLayout, useLayoutDispatch] = makeStore(reducer, initialState);
export { LayoutProvider, useLayout, useLayoutDispatch };
