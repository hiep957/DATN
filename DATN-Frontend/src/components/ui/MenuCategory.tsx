type MenuCategoryProps = {
  setOpenMenu: (open: boolean) => void;
  openMenu: boolean;
};

const MenuCategory = ({ setOpenMenu }: MenuCategoryProps) => {
  return (
    <>
      {/* Backdrop mờ, click vào để đóng */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={() => setOpenMenu(false)}
      />

      {/* Menu trượt từ trái */}
      <div className="fixed top-0 left-0 w-[70%] h-full bg-white shadow-lg z-50 p-4 transition-transform transform md:hidden">
        <button className="mb-4 text-xl" onClick={() => setOpenMenu(false)}>
          ✕
        </button>
        <nav className="space-y-4 text-lg">
          <div className="cursor-pointer hover:text-blue-600">Nam</div>
          <div className="cursor-pointer hover:text-blue-600">Nữ</div>
          <div className="cursor-pointer hover:text-blue-600">Trẻ em</div>
          <div className="cursor-pointer hover:text-blue-600">Phụ kiện</div>
        </nav>
      </div>
    </>
  );
};

export default MenuCategory;
