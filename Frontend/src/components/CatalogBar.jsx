import React, { useState } from "react";
import { Menu as MenuIcon, ChevronDown as ChevronDownIcon, LanguagesIcon } from "lucide-react";

const categories = [
  { label: "Trang chủ", href: "/" },
  { label: "Đăng ký chương trình", href: "/dang-ky" },
  { label: "Quản lý lịch hẹn", href: "/lich-hen" },
  { label: "Tiến độ học tập", href: "/tien-do" },
  { label: "Buổi hỗ trợ", href: "/buoi-ho-tro" },
  { label: "Tài nguyên học tập", href: "/tai-nguyen" },
];

const languages = ["Vietnamese", "English"];

const CatalogBar = ({ onFilter, activeCategory }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("Vietnamese");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSelectLocation = (languages) => {
    setSelectedLanguage(languages);
    setIsDropdownOpen(false);
    if (onFilter) onFilter(languages);
  };

  return (
    <nav className="w-full bg-secondary shadow-md animate-fade-in opacity-100 [--animation-delay:200ms]">
      <div className="flex items-center justify-between max-w-[1440px] mx-auto h-[45px] px-4 sm:px-6 md:px-8">
        
        {/*Menu + Categories */}
        <div className="flex items-center gap-4 md:gap-6">
          <button className="hover:opacity-80 transition-opacity p-1">
            <MenuIcon className="w-6 h-6 text-primary " />
          </button>

          {categories.map((category, index) => {
            const isActive = activeCategory === category.label || activeCategory === category.href;

            return (
              <React.Fragment key={index}>
                {index > 0}
                <a
                  href={category.href}
                  className={`text-xs font-bold transition-all whitespace-nowrap px-5 py-1
                    ${
                      isActive
                        ? "bg-white text-myred overflow-visible h-[45px] w-full flex items-center justify-center"
                        : "text-primary hover:underline"
                    }
                  `}
                >
                  {category.label}
                </a>
              </React.Fragment>
            );
          })}
        </div>

        {/* Select Language */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <LanguagesIcon className="h-5 w-5 text-primary" />
            <span className="flex font-semibold text-white text-[11px] bg-primary px-3 py-1 rounded whitespace-nowrap">
              {selectedLanguage}
              <ChevronDownIcon className="w-4 h-4 text-white ml-3" />
            </span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 w-[150px] bg-white shadow-md rounded-md z-100">
              {languages.map((language, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectLocation(language)}
                  className="w-full text-left px-4 py-2 hover:bg-primary hover:text-white transition-colors text-sm"
                >
                  {language}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default CatalogBar;
