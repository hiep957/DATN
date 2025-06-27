import { ReactNode, use, useEffect } from "react";
import Sidebar from "../../ui/Sidebar";
import Header from "./Header";
import CategoryBar from "../Client/CategoryBar";


const DashBoardLayout = ({ children }: { children: ReactNode }) => {
  
  return (
    <div className="flex">
      <Sidebar></Sidebar>
      <div className="ml-64 w-full min-h-screen bg-gray-100">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashBoardLayout;
