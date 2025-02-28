"use client";

import { Provider } from "react-redux";
import store from "../src/redux/store";

const CustomProvider = ({ children }) => {
  return (
    <div>
      <Provider store={store}>{children}</Provider>
    </div>
  );
};

export default CustomProvider;
