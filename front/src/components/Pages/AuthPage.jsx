import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";

const AuthPage = () => {
  const [tab, setTab] = useState("login");
  
  // - (Login States) ---
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // ---  (Register States) ---
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [role, setRole] = useState("member"); // القيمة الافتراضية member

  // --- متغيرات عامة (Loading & Errors) ---
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  
  // استدعاء دوال الاتصال بالباك إند من الـ AuthContext
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
        // التحقق من نوع المستخدم للتوجيه للداشبورد المناسبة
        // نقرأ البيانات من اللوكال ستوريج التي حفظها الـ Context
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        const userType = user?.userType || user?.role || 'member';

        if (userType === 'admin') {
           navigate("/dashboard"); // تأكدي من المسار في App.js
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

    // تجهيز البيانات لإرسالها للباك إند
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
            
            // تفريغ الحقول
            setRegName("");
            setRegEmail("");
            setRegPassword("");
            
            // الانتقال لتاب تسجيل الدخول تلقائياً بعد ثانية ونصف
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

  return (
    <div className="min-h-screen flex bg-gray-100 font-sans">

      {/* صورة جانبية (تظهر فقط في الشاشات الكبيرة) */}
      <div className="w-1/2 relative hidden md:block">
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-sm"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f')"
          }}
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white text-center px-10 leading-relaxed drop-shadow-lg">
            Welcome to Your <br /> Digital Library.
          </h1>
        </div>
      </div>

      {/* الفورم (يمين الشاشة) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-[450px]">

          {/* التبديل بين Login و Register */}
          <div className="flex border-b mb-6">
            <button
              className={`flex-1 py-2 transition-colors ${tab === "login"
                ? "border-b-2 border-blue-600 font-semibold text-blue-600"
                : "text-gray-500 hover:text-blue-500"
                }`}
              onClick={() => { setTab("login"); setError(""); setSuccessMsg(""); }}
            >
              Sign In
            </button>
            <button
              className={`flex-1 py-2 transition-colors ${tab === "register"
                ? "border-b-2 border-blue-600 font-semibold text-blue-600"
                : "text-gray-500 hover:text-blue-500"
                }`}
              onClick={() => { setTab("register"); setError(""); setSuccessMsg(""); }}
            >
              Create Account
            </button>
          </div>

          {/* عرض رسائل الخطأ أو النجاح */}
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

          {/* --- LOGIN FORM --- */}
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
                <span className="text-blue-600 cursor-pointer hover:underline">Forgot Password?</span>
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

          {/* --- REGISTER FORM (تم تفعيله الآن) --- */}
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

              {/* اختيار نوع الحساب (مهم جداً لإرساله للباك إند) */}
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
