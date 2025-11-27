import React from 'react';

const languageLinks = [
    { href: '#', label: 'Tiếng Việt' },
    { href: '#', label: 'English' },
];

const SSO = () => {
    return (
        <>
            <div className="bg-[#eeeeee] w-full min-h-screen flex flex-col">
                <div className="bg-white shadow-3xl mx-20 rounded-b-lg">
                    <div className="bg-[#210f7a] px-8 py-3 flex items-center gap-4 mt-4">
                        <a href="/" className="flex items-center gap-4">
                            <img
                                className="w-[55px] h-14 object-cover"
                                alt="Logo"
                                src="/logo.jpg"
                            />
                            <h1 className="font-bold text-white text-[26px] tracking-[0] leading-[normal]">
                                DỊCH VỤ XÁC THỰC TẬP TRUNG
                            </h1>
                        </a>
                    </div>
                    <main className="flex-1 px-5 py-5">
                        <div className="flex gap-6">
                            <div className="w-[394px] bg-white rounded-lg shadow-lg border border-gray-200">
                                <div className="p-4">
                                    <div className="space-y-4">
                                        <div>
                                            <h2 className="font-bold text-myred text-lg tracking-[0] leading-[normal] mb-2  ">
                                                Nhập thông tin tài khoản của bạn
                                            </h2>
                                            <hr className="border-t border-gray-300" />
                                        </div>
                                        <form className="space-y-4 mt-6">
                                            <input type="hidden" name="lt" value="LT-..." />
                                            <input type="hidden" name="execution" value="e1s1" />
                                            <input type="hidden" name="_eventId" value="submit" />
                                            <div className="space-y-2">
                                                <label className="font-bold text-[#777777] text-xs tracking-[0] leading-[normal]">
                                                    Tên tài khoản
                                                </label>
                                                <input
                                                    name="username"
                                                    className="w-full h-[27px] bg-[#FFFFDD] rounded-[3px] border border-solid border-[#e0e0e0] focus:border-[#9c050c] focus:outline-none px-2 text-sm"
                                                    type="text"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="font-bold text-[#777777] text-xs tracking-[0] leading-[normal]">
                                                    Mật khẩu
                                                </label>
                                                <input
                                                    name="password"
                                                    type="password"
                                                    className="w-full h-[27px] bg-[#FFFFDD] rounded-[3px] border border-solid border-[#e0e0e0] focus:border-[#9c050c] focus:outline-none px-2 text-sm"
                                                    required
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    id="warning"
                                                    type="checkbox"
                                                    className="w-3 h-3 bg-white rounded-[3px] border border-solid border-[#858585] accent-[#9c050c]"
                                                />
                                                <label
                                                    htmlFor="warning"
                                                    className="font-semibold text-[#777777] text-[10px] tracking-[0] leading-[normal] cursor-pointer"
                                                >
                                                    Cảnh báo trước khi tôi đăng nhập vào các trang web khác.
                                                </label>
                                            </div>
                                            <hr className="border-t border-gray-300" />
                                            <div className="flex gap-2">
                                                <button
                                                    type="submit"
                                                    className="h-[27px] bg-[#006dcc] rounded-[3px] border border-solid border-[#005299] hover:bg-[#005299] px-4 flex-1"
                                                >
                                                    <span className="font-bold text-white text-xs text-center tracking-[0] leading-[normal] flex items-center justify-center">
                                                        Đăng nhập
                                                    </span>
                                                </button>
                                                <button
                                                    type="reset"
                                                    className="h-[27px] bg-[#006dcc] rounded-[3px] border border-solid border-[#005299] hover:bg-[#005299] px-4 flex-1"
                                                >
                                                    <span className="font-bold text-white text-xs text-center tracking-[0] leading-[normal] flex items-center justify-center">
                                                        Xóa
                                                    </span>
                                                </button>
                                            </div>
                                            <a
                                                href="#"
                                                className="block font-semibold text-[#0000ee] text-[10px] tracking-[0] leading-[normal] underline text-center mt-2"
                                            >
                                                Thay đổi mật khẩu?
                                            </a>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 space-y-6 mt-3">
                                <section>
                                    <h3 className="[ font-bold text-[#9c050c] text-base tracking-[0] leading-[normal] mb-2">
                                        Ngôn ngữ
                                    </h3>
                                    <div className="flex justify-start gap-5 text-xs ml-4">
                                        {languageLinks.map((link, index) => (
                                            <React.Fragment key={index}>
                                                <a
                                                    href={link.href}
                                                    className=" font-medium text-[#0000ee] tracking-[0] leading-[normal] underline"
                                                >
                                                    {link.label}
                                                </a>
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </section>
                                <section>
                                    <h3 className=" font-bold text-[#9c050c] text-base tracking-[0] leading-[normal] mb-4">
                                        Lưu ý
                                    </h3>
                                    <div className="space-y-4 ml-4">
                                        <p className="font-medium text-black text-xs tracking-[0] leading-[normal]">
                                            Trang đăng nhập này cho phép đăng nhập một lần đến nhiều hệ thống web ở Trường Đại học Bách Khoa-ĐHQG-HCM. Điều này có nghĩa là bạn chỉ đăng nhập một lần cho những hệ thống web đã đăng ký với hệ thống xác thực quản lý truy cập tập trung.
                                            <br />Bạn cần dùng tài khoản HCMUT để đăng nhập. Tài khoản HCMUT cho phép truy cập đến nhiều tài nguyên bao gồm hệ thống thông tin, thư điện tử, ..
                                            <br />Vì lý do an ninh, bạn hãy Thoát khỏi trình duyệt Web khi bạn kết thúc việc truy cập các dịch vụ đòi hỏi xác thực!
                                        </p>
                                    </div>
                                </section>
                                <section>
                                    <h3 className="font-bold text-[#9c050c] text-base tracking-[0] leading-[normal] mb-2">
                                        Hỗ trợ kỹ thuật
                                    </h3>
                                    <div className="flex gap-5 text-xs ml-4"> 
                                        <p className="font-medium tracking-[0] leading-[normal]">
                                            <span className="text-black">Email: </span>
                                            <a
                                                href="mailto:support@hcmut.edu.vn"
                                                className="text-[#0000ee] underline"
                                            >
                                                support@hcmut.edu.vn
                                            </a>
                                        </p>
                                        <p className="font-medium text-black tracking-[0] leading-[normal]">
                                            ĐT: (84-8) 38647256 - 7204
                                        </p>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </main>
                </div>

                <div className="px-[106px] py-6">
                    <p className="[font-semibold text-[13px] tracking-[0] leading-[normal]">
                        <span className="text-[#777777]">
                            Bản quyền @ 2011 - 2012 Trường Đại học Bách khoa - ĐHQG-HCM.
                            <br />
                            Được hỗ trợ bởi{" "}
                        </span>
                        <span className="text-[#5f1e8b] underline">Jasig CAS 3.5.1</span>
                    </p>
                </div>
            </div>
        </>
    );
};

export default SSO;