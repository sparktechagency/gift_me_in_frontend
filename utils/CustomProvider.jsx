"use client";

import { Provider } from "react-redux";
import store from "../src/redux/store";
import { Toaster } from "react-hot-toast";
import AuthGuard from "../src/components/ui/auth/AuthGuard";
import { ConfigProvider } from "antd";

const CustomProvider = ({ children }) => {
  return (
    <div>
      <Provider store={store}>
        <Toaster position="top-center" />
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#b7076e",
            },
          }}
        >
          {children}
        </ConfigProvider>
      </Provider>
    </div>
  );
};

export default CustomProvider;
