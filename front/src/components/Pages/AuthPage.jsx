import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import axios from "axios";


// Configure axios to send cookies with requests
axios.defaults.withCredentials = true;


const AuthPage = () => {
  const [tab, setTab] = useState("login");
  
  // - (Login States) ---
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // ---  (Register States) ---
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [role, setRole] = useState("member");

  // --- Forgot Password States ---
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStep, setForgotStep] = useState(0); // 0: email, 1: code, 2: new password
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // --- متغيرات عامة (Loading & Errors) ---
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  
  const { login, register } = useAuth(); 

  // --- دالة معالجة تسجيل الدخول ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const result = await login(loginEmail, loginPassword);

      if (result.success) {
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        const userType = user?.userType || user?.role || 'member';

        if (userType === 'admin') {
           navigate("/dashboard");
        } else {
           navigate("/");
        }
      } else {
        setError(result.error || "البريد الإلكتروني أو كلمة المرور غير صحيحة");
      }
    } catch (err) {
      setError("حدث خطأ غير متوقع، حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  // --- دالة معالجة إنشاء حساب جديد ---
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    const userData = {
        full_name: regName,
        email: regEmail,
        password: regPassword,
        role: role 
    };

    try {
        const result = await register(userData);

        if (result.success) {
            setSuccessMsg("تم إنشاء الحساب بنجاح! يمكنك تسجيل الدخول الآن.");
            setRegName("");
            setRegEmail("");
            setRegPassword("");
            setTimeout(() => {
                setTab("login");
                setSuccessMsg("");
            }, 1500);
        } else {
            setError(result.error || "فشل إنشاء الحساب، تأكد من البيانات.");
        }
    } catch (err) {
        setError("حدث خطأ أثناء محاولة التسجيل.");
    } finally {
        setLoading(false);
    }
  };

  // --- Forgot Password: Step 1 - Request Code ---
  const handleForgotPasswordRequest = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      console.log('=== STEP 1: Requesting verification code ===');
      console.log('Email:', forgotEmail);
      console.log('Request URL will be:', '/auth/forgot');
      
      const res = await axios.post('/auth/forgot', { email: forgotEmail },{ withCredentials: true });

      console.log('Response:', res.data);
      console.log('Response headers:', res.headers);
      console.log('Set-Cookie header:', res.headers['set-cookie']);
      console.log('Cookies after request:', document.cookie);
      console.log('Request config:', res.config);
      
      setSuccessMsg(res.data.message || "Verification code sent to your email!");
      setForgotStep(1);
    } catch (err) {
      const errorMessage = err.response?.data?.message 
        || err.response?.data?.error 
        || err.message 
        || "Error requesting password reset";
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // --- Forgot Password: Step 2 - Verify Code ---
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      console.log('=== STEP 2: Verifying code ===');
      console.log('Verification code:', verificationCode);
      
      const res = await axios.post('/auth/verify-code', { code: verificationCode },{ withCredentials: true });

      console.log('Verify response:', res.data);
      setSuccessMsg(res.data.message || "Code verified! Enter your new password.");
      setForgotStep(2);
    } catch (err) {
      console.error('Verify code error:', err.response?.data);
      console.error('Full error:', err);
      const errorMessage = err.response?.data?.message 
        || err.response?.data?.error
        || (err.response?.data?.errors ? err.response.data.errors.map(e => e.msg).join(', ') : '')
        || "Invalid or expired code";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // --- Forgot Password: Step 3 - Reset Password ---
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await axios.post('/auth/reset', { newPassword });

      setSuccessMsg(res.data.message || "Password reset successfully!");
      
      // Reset all forgot password states
      setTimeout(() => {
        setForgotStep(0);
        setVerificationCode("");
        setNewPassword("");
        setForgotEmail("");
        setTab("login");
        setSuccessMsg("");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  // --- Reset Forgot Password Flow ---
  const resetForgotPasswordFlow = () => {
    setTab("login");
    setForgotStep(0);
    setForgotEmail("");
    setVerificationCode("");
    setNewPassword("");
    setError("");
    setSuccessMsg("");
  };

  return (
    <div className="min-h-screen flex bg-gray-100 font-sans">

      <div className="w-1/2 relative hidden md:block">
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-sm"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f')" }}
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white text-center px-10 leading-relaxed drop-shadow-lg">
            Welcome to Your <br /> Digital Library.
          </h1>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-[450px]">

          {/* Tab Navigation */}
          <div className="flex border-b mb-6">
            <button
              className={`flex-1 py-2 transition-colors ${tab === "login"
                ? "border-b-2 border-blue-600 font-semibold text-blue-600"
                : "text-gray-500 hover:text-blue-500"
                }`}
              onClick={() => { 
                setTab("login"); 
                setError(""); 
                setSuccessMsg(""); 
                setForgotStep(0);
              }}
            >
              Sign In
            </button>
            <button
              className={`flex-1 py-2 transition-colors ${tab === "register"
                ? "border-b-2 border-blue-600 font-semibold text-blue-600"
                : "text-gray-500 hover:text-blue-500"
                }`}
              onClick={() => { 
                setTab("register"); 
                setError(""); 
                setSuccessMsg(""); 
                setForgotStep(0);
              }}
            >
              Create Account
            </button>
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded border border-red-200 text-center">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 text-sm rounded border border-green-200 text-center">
              {successMsg}
            </div>
          )}

          {/* LOGIN FORM */}
          {tab === "login" && (
            <form onSubmit={handleLogin} className="animate-fade-in">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                <input
                  className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  type="email"
                  placeholder="name@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                <input
                  className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  type="password"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-between text-sm mb-6">
                <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                  <input type="checkbox" className="rounded text-blue-600" /> Remember Me
                </label>
                <span
                  className="text-blue-600 cursor-pointer hover:underline"
                  onClick={() => setTab("forgot")}
                >
                  Forgot Password?
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full text-white py-3 rounded-lg font-semibold transition duration-200 ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD FLOW */}
          {tab === "forgot" && (
            <div className="animate-fade-in">
              {/* Step 0: Enter Email */}
              {forgotStep === 0 && (
                <form onSubmit={handleForgotPasswordRequest}>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Reset Password</h2>
                  <p className="text-sm text-gray-600 mb-4">Enter your email address and we'll send you a verification code.</p>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                    <input
                      type="email"
                      className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full text-white py-3 rounded-lg font-semibold transition duration-200 mb-3 ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
                  >
                    {loading ? "Sending..." : "Send Verification Code"}
                  </button>

                  <button
                    type="button"
                    onClick={resetForgotPasswordFlow}
                    className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition duration-200"
                  >
                    Back to Login
                  </button>
                </form>
              )}

              {/* Step 1: Enter Verification Code */}
              {forgotStep === 1 && (
                <form onSubmit={handleVerifyCode}>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Enter Verification Code</h2>
                  <p className="text-sm text-gray-600 mb-4">We sent a 6-digit code to <strong>{forgotEmail}</strong></p>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Verification Code</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-center text-2xl tracking-widest"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="000000"
                      maxLength={6}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full text-white py-3 rounded-lg font-semibold transition duration-200 mb-3 ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
                  >
                    {loading ? "Verifying..." : "Verify Code"}
                  </button>

                  <button
                    type="button"
                    onClick={resetForgotPasswordFlow}
                    className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition duration-200"
                  >
                    Cancel
                  </button>
                </form>
              )}

              {/* Step 2: Enter New Password */}
              {forgotStep === 2 && (
                <form onSubmit={handleResetPassword}>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Password</h2>
                  <p className="text-sm text-gray-600 mb-4">Enter your new password below.</p>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">New Password</label>
                    <input
                      type="password"
                      className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full text-white py-3 rounded-lg font-semibold transition duration-200 ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* REGISTER FORM */}
          {tab === "register" && (
            <form onSubmit={handleRegister} className="animate-fade-in">
              <div className="mb-4">
                <input
                    className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-blue-500"
                    placeholder="Full Name"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                />
              </div>
              
              <div className="mb-4">
                <input
                    className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-blue-500"
                    placeholder="Email Address"
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                />
              </div>

              <div className="mb-4">
                <input
                    className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-blue-500"
                    type="password"
                    placeholder="Create Password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-2">Register as:</label>
                <div className="flex gap-4">
                    <label className={`flex-1 flex items-center justify-center gap-2 p-2 border rounded cursor-pointer transition ${role === 'member' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-gray-50'}`}>
                        <input
                            type="radio"
                            name="role"
                            value="member"
                            checked={role === "member"}
                            onChange={() => setRole("member")}
                            className="hidden"
                        />
                        <span className="text-sm font-medium">Member</span>
                    </label>
                    <label className={`flex-1 flex items-center justify-center gap-2 p-2 border rounded cursor-pointer transition ${role === 'admin' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-gray-50'}`}>
                        <input
                            type="radio"
                            name="role"
                            value="admin"
                            checked={role === "admin"}
                            onChange={() => setRole("admin")}
                            className="hidden"
                        />
                        <span className="text-sm font-medium">Admin</span>
                    </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full text-white py-3 rounded-lg font-semibold transition duration-200 ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default AuthPage;