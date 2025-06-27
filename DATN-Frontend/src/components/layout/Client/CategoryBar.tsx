import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { fetchCategories } from "../../../redux/slice/categorySlice";
import { useBreakdown } from "../../../hooks/useBreakdown";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
const CategoryBar = () => {
  const { categories } = useAppSelector((state) => state.category);
  const { isDesktop } = useBreakdown();
  const [activeCategory, setActiveCategory] = useState(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryHover = (categoryId: any) => {
    setActiveCategory(categoryId);
  };

  const handleMouseLeave = () => {
    setActiveCategory(null);
  };

  const getCategoryLevelTwo = () => {
    const category = categories.find((cat) => cat.id === activeCategory);
    return category ? category.children : [];
  };

  // console.log("categories trong category bar", categories);

  return (
    <div className="relative">
      {isDesktop && (
        <>
          <nav className="bg-white shadow-sm p-4">
            <div className="flex items-center justify-center space-x-16">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="hoverable"
                  onMouseEnter={() => handleCategoryHover(category.id)}
                  onClick={() => {
                    navigate(`/products?category=${category.slug}`);
                  }}
                >
                  <span
                    className={`cursor-pointer font-semibold ${
                      activeCategory === category.id
                        ? "text-red-500"
                        : "hover:text-red-500"
                    }`}
                  >
                    {category.name}
                  </span>
                </div>
              ))}
            </div>
          </nav>

          {activeCategory !== null && (
            <div
              className="absolute left-0 w-full bg-white shadow-lg z-50"
              onMouseLeave={handleMouseLeave}
            >
              <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-4 gap-8">
                {getCategoryLevelTwo()?.map((subcat, index) => (
                  <div key={subcat.id ?? index}>
                    <div
                      className="cursor-pointer hover:text-red-500 flex flex-row space-x-2"
                      onClick={() => {console.log("Click", subcat);navigate(`/products?category=${subcat.slug}`)}}
                    >
                      <Avatar
                        alt="Remy Sharp"
                        src="/static/images/avatar/1.jpg"
                      />
                      <div className="flex items-center">
                        <span className="text-sm font-bold text-gray-700">
                          {subcat.name}
                        </span>
                      </div>
                    </div>
                    {subcat.children?.map((subcat2, index) => (
                      <div
                        key={subcat2.id ?? index}
                        className="cursor-pointer hover:text-red-500 "
                        onClick={() => {
                          console.log("Click", subcat2);
                          navigate(`/products?category=${subcat2.slug}`);
                        }}
                      >
                        <div className="flex items-center">
                          <span className="text-sm font-light text-gray-700">
                            {subcat2.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryBar;
