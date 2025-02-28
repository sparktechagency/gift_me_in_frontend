import CustomProvider from "../../utils/CustomProvider";

const mainLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <CustomProvider>{children}</CustomProvider>
      </body>
    </html>
  );
};

export default mainLayout;
