import { X } from "lucide-react";

const AdminLogin = ({ close }) => {
    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-40"></div>

            {/* Popup */}
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl shadow-xl w-[600px] flex relative animate-fade-in">

                    {/* Form section */}
                    <div className="flex-1 p-6">
                        {/* Header + Close */}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-black font-playwrite">Xin chào admin,</p>
                                <h2 className="text-xl font-bold">Đăng nhập tài khoản</h2>
                            </div>
                        </div>

                        {/* Username */}
                        <div className="mb-4">
                            <label className="text-sm">Tên đăng nhập</label>
                            <input
                                type="text"
                                className="w-full border rounded-lg px-3 py-2 mt-1"
                                placeholder="Nhập tên đăng nhập"
                            />
                        </div>

                        {/* Password */}
                        <div className="mb-4">
                            <label className="text-sm">Mật khẩu</label>
                            <input
                                type="password"
                                className="w-full border rounded-lg px-3 py-2 mt-1"
                                placeholder="Nhập mật khẩu"
                            />
                        </div>

                        {/* Login button */}
                        <button className="w-full bg-primary text-white py-2 rounded-lg font-bold mt-2 hover:opacity-75"
                        // onClick={}
                        >
                            Đăng nhập
                        </button>

                        <button className="text-sm text-primary mt-3">
                            Quên mật khẩu
                        </button>
                    </div>

                    {/* Right blue section */}
                    <div className="w-[180px] bg-primary flex items-center justify-center rounded-r-2xl">
                        <img src="/logo.jpg" alt="logo" className="w-20 h-20" />
                    </div>

                    {/* Nút X */}
                    <button
                        onClick={close}
                        className="absolute -top-6 -right-6 w-[50px] h-[50px] bg-white rounded-full shadow-2xl border-4 border-white flex items-center justify-center overflow-visible"
                    >
                        <X size={32} className="text-gray-600" />
                    </button>
                </div>
            </div>
        </>
    );
};

export default AdminLogin;
