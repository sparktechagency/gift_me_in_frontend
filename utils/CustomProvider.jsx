"use client";

import { Provider } from "react-redux";
import store from "../src/redux/store";
import { Toaster } from "react-hot-toast";

const CustomProvider = ({ children }) => {
  return (
    <div>
      <Provider store={store}>
        <Toaster position="top-center" />
        {children}
      </Provider>
    </div>
  );
};

export default CustomProvider;
