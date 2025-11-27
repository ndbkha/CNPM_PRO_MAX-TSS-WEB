import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import AdminLogin from "./AdminLogin";

const LoginModal = () => {
    const [showAdminLogin, setShowAdminLogin] = useState(false);
    const navigate = useNavigate();

    return (
        <>
            {/* Login main UI */}
            <section className="flex flex-col items-center justify-center w-full py-8">
                <div className="flex flex-col items-center gap-3 max-w-[567px] w-full p-10 border-[6px] border-secondary rounded-3xl animate-fade-in opacity-0">
                    
                    {/* Logo + Title */}
                    <div className="flex items-center gap-4 animate-fade-in opacity-0 [--animation-delay:200ms]">
                        <img
                            src="/HCMUT_logo.png"
                            alt="BK Logo"
                            className="w-[130px] h-[130px]"
                        />
                        
                        <div>
                            <h1 className="font-extrabold text-primary text-5xl text-center">
                                BK-TSS
                            </h1>
                            <h2 className="font-bold text-primary text-3xl whitespace-nowrap animate-fade-in opacity-0 [--animation-delay:400ms]">
                                Tutor Support System
                            </h2>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-1 w-full bg-secondary my-5"></div>

                    {/* Description */}
                    <p className="font-medium text-primary text-xl text-center max-w-[550px] animate-fade-in opacity-0 [--animation-delay:600ms] mb-5">
                        Đăng nhập bằng tài khoản của bạn trên
                    </p>

                    {/* Buttons */}
                    <div className="w-full">
                        {/* HCMUT account */}
                        <button className="flex h-[48px] w-full px-10 py-4 mb-6 items-center justify-center border-[3px] border-secondary rounded-lg"
                                onClick={() => navigate("/login-SSO")}
                        >
                            <div className="flex items-center">
                                <img src="/HCMUT_logo.png" alt="Logo" className="h-5 w-5 mr-3" />
                                <span className="text-primary font-bold">
                                    Tài khoản HCMUT (HCMUT account)
                                </span>
                            </div>
                        </button>

                        {/* ADMIN */}
                        <button
                            className="flex h-[48px] w-full px-10 py-4 items-center justify-center border-[3px] border-secondary rounded-lg text-primary font-bold"
                            onClick={() => setShowAdminLogin(true)}
                        >
                            Quản trị viên
                        </button>
                    </div>
                </div>
            </section>

            {/* ADMIN POPUP */}
            {showAdminLogin && (
                <AdminLogin close={() => setShowAdminLogin(false)} />
            )}
        </>
    );
};

export default LoginModal;
