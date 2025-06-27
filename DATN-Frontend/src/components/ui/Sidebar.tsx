import {
  Home,
  Users,
  PackageCheck,
  PackagePlus,
  ListOrdered,
  LayoutGrid,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-gray-800 text-gray-100 fixed top-0 left-0 shadow-lg">
      <div className="p-4 text-xl font-bold border-b border-gray-700">Dashboard</div>
      <nav className="p-4 flex flex-col gap-4">
        <a href="/dashboard" className="flex items-center gap-2 hover:text-yellow-400">
          <Home size={20} /> Tổng quan
        </a>
        <a href="/list-user" className="flex items-center gap-2 hover:text-yellow-400">
          <Users size={20} /> Người dùng
        </a>
        <a href="/order-manage" className="flex items-center gap-2 hover:text-yellow-400">
          <PackageCheck size={20} /> Quản lý đơn hàng
        </a>
        <a href="/add-product" className="flex items-center gap-2 hover:text-yellow-400">
          <PackagePlus size={20} /> Thêm sản phẩm
        </a>
        <a href="/product-admin" className="flex items-center gap-2 hover:text-yellow-400">
          <ListOrdered size={20} /> Danh sách sản phẩm
        </a>
        <a href="/category" className="flex items-center gap-2 hover:text-yellow-400">
          <LayoutGrid size={20} /> Quản lý danh mục
        </a>
      </nav>
    </aside>
  );
}
