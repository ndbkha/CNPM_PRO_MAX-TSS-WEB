import React from "react";

const Footer = () => {
  const technicianInfo = {
    email: "ddthu@hcmut.edu.vn",
    supportEmail: "dl-cntt@hcmut.edu.vn",
    phone: "(84-8) 38647256 - 7200",
  };

  const regulations = [
    { text: "Điều khoản & Điều kiện" },
    { text: "Chính sách bảo vệ người dùng" },
  ];

  const contactInfo = [
    { text: "Hotline: 033.33.333" },
    { text: "Chatbot hỗ trợ" },
  ];

  const infoLinks = [
    { text: "Thông báo" },
    { text: "About us" },
    { text: "FAQs" },
    { text: "Góp ý" },
  ];

  const socialMedia = [
    {
      src: "https://c.animaapp.com/mhfr4mzcpTXBLq/img/rectangle-53.svg",
      alt: "Social 1",
      link: "https://facebook.com",
    },
    {
      src: "https://c.animaapp.com/mhfr4mzcpTXBLq/img/rectangle-56.svg",
      alt: "Social 2",
      link: "https://threads.com",
    },
    {
      src: "https://c.animaapp.com/mhfr4mzcpTXBLq/img/rectangle-57.svg",
      alt: "Social 3",
      link: "https://instagram.com",
    },
    {
      src: "https://c.animaapp.com/mhfr4mzcpTXBLq/img/rectangle-58.svg",
      alt: "Social 4",
      link: "https://tiktok.com",
    },
  ];

  return (
    <footer className="bg-primary mt-10 ">
      {/* Top sections */}
      <div className=" max-w-[1440px] mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 text-white text-xs">
        {/* Technician */}
        <div>
          <h2 className="font-extrabold mb-3">TỔ KỸ THUẬT/ TECHNICIAN</h2>
          <address className="not-italic font-semibold italic text-[10px] space-y-2">
            <p>
              Email:{" "}
              <a href={`mailto:${technicianInfo.email}`} className="hover:underline">
                {technicianInfo.email}
              </a>
            </p>
            <p>
              Quý Thầy/Cô chưa có tài khoản (hoặc quên mật khẩu) nhà trường vui lòng liên hệ
            </p>
            <p>
              Trung tâm Dữ liệu & Công nghệ Thông tin, phòng 109 nhà A5 để được hỗ trợ.
            </p>
            <p>
              (For HCMUT account, please contact: Data and Information Technology Center)
            </p>
            <p>
              Email:{" "}
              <a href={`mailto:${technicianInfo.supportEmail}`} className="hover:underline">
                {technicianInfo.supportEmail}
              </a>
            </p>
            <p>
              ĐT (Tel.):{" "}
              <a href={`tel:${technicianInfo.phone.replace(/[^0-9+]/g, "")}`} className="hover:underline">
                {technicianInfo.phone}
              </a>
            </p>
          </address>
        </div>

        {/* Follow us */}
        <div>
          <h2 className="font-extrabold mb-3 text-center">FOLLOW US</h2>
          <div className="flex justify-center gap-4 mt-4">
            {socialMedia.map((social, index) => (
              <a key={index} href={social.link} aria-label={social.alt} target="_blank" rel="noopener noreferrer">
                <img className="w-10 h-10 object-cover hover:opacity-80 transition-opacity" src={social.src} alt={social.alt} />
              </a>
            ))}
          </div>
        </div>

        {/* Regulations */}
        <div>
          <h2 className="font-extrabold mb-3 text-center">QUY ĐỊNH</h2>
          <div className="flex flex-col items-center space-y-2 mt-4">
            {regulations.map((r, i) => (
              <a key={i} href="#" className="hover:underline font-semibold text-[10px]">
                {r.text}
              </a>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h2 className="font-extrabold mb-3 text-center">LIÊN HỆ</h2>
          <div className="flex flex-col items-center space-y-2 mt-4">
            {contactInfo.map((c, i) => (
              <a key={i} href="#" className="hover:underline font-semibold text-[10px]">
                {c.text}
              </a>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <h2 className="font-extrabold mb-3 text-center">THÔNG TIN</h2>
          <div className="flex flex-col items-center space-y-2 mt-4">
            {infoLinks.map((l, i) => (
              <a key={i} href="#" className="hover:underline font-semibold text-[10px]">
                {l.text}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-[#062251] py-3 mt-4 text-center text-white font-extrabold text-xs">
        <p>Copyright 2007-2023 BK-TSS</p>
        <p>Bản quyền thuộc Trường Đại học Bách khoa - ĐHQG-HCM</p>
      </div>
    </footer>
  );
};

export default Footer;
