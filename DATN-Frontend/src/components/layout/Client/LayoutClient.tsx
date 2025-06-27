import { ReactNode, use, useEffect } from "react";

import Header from "./Header";
import CategoryBar from "./CategoryBar";
import Footer from "./Footer";

const LayoutClient = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative container mx-auto ">
      <Header />
      <CategoryBar />
      <div>
        <main>{children}</main>
      </div>
      <Footer/>
    </div>
  );
};

export default LayoutClient;
