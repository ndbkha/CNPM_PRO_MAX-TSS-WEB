import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import { Search as SearchIcon, User } from "lucide-react";

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token") || localStorage.getItem("userToken");
        setIsLoggedIn(!!token);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userToken");
        setIsLoggedIn(false);
        navigate("/"); // redirect về home sau khi logout
    };

    return (
        <header className="w-full bg-primary shadow-[0px_4px_6px_#00000026] sticky top-0 z-50">
            <div className="flex items-center px-[18px] py-[15px] max-w-[1440px] mx-auto justify-between">
                {/* LOGO */}
                <div className="flex items-center gap-4"
                 onClick={() => navigate("/")}>
                    <img src="/logo.jpg" alt="Logo" className="w-[60px] h-[60px]" />
                    <div className="text-white">
                        <div className="italic font-bold text-sm">TRƯỜNG ĐẠI HỌC BÁCH KHOA - ĐHQG TP.HCM</div>
                        <div className="font-extrabold text-4xl">BK-TSS</div>
                    </div>
                </div>

                {/* THANH TÌM KIẾM */}
                <div className="w-[420px] mx-10">
                    <form
                        onSubmit={handleSearch}
                        className="flex items-center bg-white rounded-lg shadow-[0px_4px_4px_#00000033] h-[45px]  "
                    >
                        <div className="flex items-center justify-center w-[30px] h-[30px] bg-primary rounded-[5px] ml-2">
                            <SearchIcon className="w-5 h-5 text-white" />
                        </div>

                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Hãy tìm kiếm !"
                            className="flex-1 px-4 outline-none text-sm font-semibold text-gray-600 placeholder:text-gray-500"
                        />

                        <div className="w-px h-5 bg-gray-300 mx-2" />

                        <button
                            type="submit"
                            className="flex items-center justify-center w-[90px] h-[30px] bg-primary rounded-[5px] font-bold text-white text-xs hover:opacity-90 transition mr-2"
                        >
                            Tìm kiếm
                        </button>
                    </form>
                </div>

                {/* Đăng nhập / Đăng ký */}
                <div>
                    {!isLoggedIn ? (
                        <div className="flex items-center gap-2 bg-white rounded-lg shadow-[0px_4px_4px_#00000033] w-[280px] h-[45px] px-4">
                            <button className="flex-1 h-full text-primary font-bold text-xs"
                                    onClick={() => navigate("/login-SSO")}
                            >
                                Đăng nhập
                            </button>

                            <div className="w-px h-5 bg-gray-300" />

                            <button className="flex-2 h-full text-primary font-bold text-xs">
                                Hướng dẫn người dùng
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 bg-primary px-5 py-2 rounded-lg">
                            <div className="flex items-center gap-2 bg-white rounded-lg shadow-[0px_4px_4px_#00000033] w-[280px] h-[45px] px-4">
                                <button
                                    className="flex-1 h-full text-primary font-bold text-xs"
                                    onClick={handleLogout}
                                >
                                    Đăng xuất
                                </button>

                                <div className="w-px h-5 bg-gray-300" />

                                <button className="flex-2 h-full text-primary font-bold text-xs">
                                    Hướng dẫn người dùng
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>

    );
};

export default Header;
