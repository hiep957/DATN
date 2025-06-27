import DashBoardLayout from "../../../components/layout/Dashboard/LayoutDB";
import ProductForm from "./ProductForm";


const AddProduct = () => {
  return (
    <DashBoardLayout>
      <div className="flex flex-col px-6 py-4">
        <div className="text-xl font-medium mb-4">Tạo sản phẩm mới</div> 
        <div className="bg-white rounded shadow">
          <ProductForm />
        </div>
 
      </div>
    </DashBoardLayout>
  );
};

export default AddProduct;
