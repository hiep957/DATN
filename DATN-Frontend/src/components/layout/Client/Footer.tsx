const Footer = () => {
  return (
    <footer className="bg-blue-500 text-white px-32 py-10 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Giới thiệu */}
        <div>
          <h2 className="text-xl font-bold mb-4">Smart Fashion</h2>
          <p className="text-sm text-black">
            Nền tảng mua sắm trực tuyến đa dạng, nhanh chóng và đáng tin cậy.
            Mang sản phẩm tốt đến tay bạn.
          </p>
        </div>

        {/* Liên kết nhanh */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Liên kết</h3>
          <ul className="space-y-2 text-sm text-black">
            <li>
              <a href="/products" className="hover:text-white">
                Sản phẩm
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-white">
                Về chúng tôi
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-white">
                Liên hệ
              </a>
            </li>
            <li>
              <a href="/blog" className="hover:text-white">
                Tin tức
              </a>
            </li>
          </ul>
        </div>

        {/* Hỗ trợ */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Hỗ trợ</h3>
          <ul className="space-y-2 text-sm text-black">
            <li>
              <a href="/faq" className="hover:text-white">
                Câu hỏi thường gặp
              </a>
            </li>
            <li>
              <a href="/shipping" className="hover:text-white">
                Chính sách vận chuyển
              </a>
            </li>
            <li>
              <a href="/returns" className="hover:text-white">
                Đổi trả & Hoàn tiền
              </a>
            </li>
            <li>
              <a href="/terms" className="hover:text-white">
                Điều khoản sử dụng
              </a>
            </li>
          </ul>
        </div>

        {/* Kết nối */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Kết nối với chúng tôi</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-400">
              Facebook
            </a>
            <a href="#" className="hover:text-pink-400">
              Instagram
            </a>
            <a href="#" className="hover:text-blue-300">
              Zalo
            </a>
          </div>
          <p className="mt-4 text-sm text-black">Hotline: 1900 123 456</p>
          <p className="text-sm text-black">Email: support@yourshop.vn</p>
        </div>
      </div>

      <hr className="my-6 border-gray-700" />

      <p className="text-center text-xs text-black">
        &copy; {new Date().getFullYear()} Smart Fashion. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
