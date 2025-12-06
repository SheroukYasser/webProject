// import React, { createContext, useContext, useState } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [userType, setUserType] = useState(null); // null, "member", "admin"

//   const login = (role) => {
//     setUserType(role);
//   };

//   const logout = () => {
//     setUserType(null);
//   };

  

//   return (
//     <AuthContext.Provider value={{ userType, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


// import React, { createContext, useContext, useState } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [userType, setUserType] = useState(null);

//   const login = (roleFromBackend) => {
//     console.log("ROLE FROM BACKEND:", roleFromBackend);

//     if (roleFromBackend === "librarian") {
//       setUserType("admin");
//     } else {
//       setUserType("member");
//     }

//     // خزّني نوع المستخدم في localStorage (اختياري لكنه مهم)
//     localStorage.setItem("userType", roleFromBackend);
//   };

//   const logout = () => {
//     setUserType(null);
//     localStorage.removeItem("userType");
//   };

//   return (
//     <AuthContext.Provider value={{ userType, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


// import React, { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [userType, setUserType] = useState(null);
//   const [userName, setUserName] = useState(null); // <-- إضافة مهمّة

//   const login = (roleFromBackend, nameFromBackend) => {
//     console.log("ROLE:", roleFromBackend);
//     console.log("NAME:", nameFromBackend);

//     // تحديد نوع المستخدم
//     if (roleFromBackend === "librarian") {
//       setUserType("admin");
//     } else {
//       setUserType("member");
//     }

//     // حفظ البيانات
//     setUserName(nameFromBackend);

//     // تخزين محلي
//     localStorage.setItem("userType", roleFromBackend);
//     localStorage.setItem("userName", nameFromBackend);
//   };

//   const logout = () => {
//     setUserType(null);
//     setUserName(null);

//     localStorage.removeItem("userType");
//     localStorage.removeItem("userName");
//   };

//   // تحميل البيانات عند فتح الموقع
//   useEffect(() => {
//     const savedType = localStorage.getItem("userType");
//     const savedName = localStorage.getItem("userName");

//     if (savedType) {
//       setUserType(savedType === "librarian" ? "admin" : "member");
//     }
//     if (savedName) {
//       setUserName(savedName);
//     }
//   }, []);

//   return (
//     <AuthContext.Provider value={{ userType, userName, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);






// import React, { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [userType, setUserType] = useState(null);
//   const [userName, setUserName] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);   // 🔥 إضافة مهمّة

//   const login = (roleFromBackend, nameFromBackend) => {
//     console.log("ROLE:", roleFromBackend);
//     console.log("NAME:", nameFromBackend);

//     // تحديد نوع المستخدم
//     if (roleFromBackend === "librarian") {
//       setUserType("admin");
//     } else {
//       setUserType("member");
//     }

//     // حفظ البيانات
//     setUserName(nameFromBackend);
//     setIsLoggedIn(true);  // 🔥 أصبح مستخدم داخل

//     // تخزين محلي
//     localStorage.setItem("userType", roleFromBackend);
//     localStorage.setItem("userName", nameFromBackend);
//     localStorage.setItem("isLoggedIn", "true");  // 🔥 تخزين حالة الدخول
//   };

//   const logout = () => {
//     setUserType(null);
//     setUserName(null);
//     setIsLoggedIn(false);  // 🔥 خرج

//     localStorage.removeItem("userType");
//     localStorage.removeItem("userName");
//     localStorage.removeItem("isLoggedIn");
//   };

//   // تحميل البيانات عند فتح الموقع (استرجاع الـ session)
//   useEffect(() => {
//     const savedType = localStorage.getItem("userType");
//     const savedName = localStorage.getItem("userName");
//     const savedLogin = localStorage.getItem("isLoggedIn");

//     if (savedType) {
//       setUserType(savedType === "librarian" ? "admin" : "member");
//     }
//     if (savedName) {
//       setUserName(savedName);
//     }
//     if (savedLogin === "true") {
//       setIsLoggedIn(true);   // 🔥 يرجّع المستخدم لو كان داخل قبل كده
//     }
//   }, []);

//   return (
//     <AuthContext.Provider value={{ userType, userName, isLoggedIn, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);




import React, { createContext, useContext, useState, useEffect } from "react";
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. رابط السيرفر (تأكد من البورت)
  const BASE_URL = 'http://localhost:5000'; 
  axios.defaults.baseURL = BASE_URL;
  axios.defaults.withCredentials = true; 

  // دالة لوضع التوكن في الهيدر تلقائياً
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  useEffect(() => {
    const checkLoggedIn = () => {
      const accessToken = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');

      if (accessToken && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setUserType(parsedUser.userType || parsedUser.role);
        setAuthToken(accessToken);
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  // --- دالة تسجيل الدخول (LOGIN) ---
  const login = async (email, password) => {
    try {
      const response = await axios.post(`/auth/login`, { email, password });
      const data = response.data;

      if (data.accessToken || data.token) { 
        const token = data.accessToken || data.token;
        const userData = data.user || {}; 

        localStorage.setItem('accessToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
        if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);

        setUser(userData);
        setUserType(userData.userType || userData.role || 'member'); 
        setAuthToken(token);

        return { success: true };
      } else {
        return { success: false, error: "فشل استلام التوكن من السيرفر" };
      }
    } catch (error) {
      return handleAuthError(error);
    }
  };

  // --- دالة إنشاء حساب جديد (REGISTER) ---
  const register = async (userData) => {
    try {
      // إرسال البيانات للباك اند
      const response = await axios.post(`/auth/signup`, userData);
      
      // لو العملية نجحت (200 OK أو 201 Created)
      if (response.status === 201 || response.status === 200) {
          return { success: true };
      }
    } catch (error) {
      return handleAuthError(error);
    }
    // --- دالة تجديد التوكن (Refresh Token) ---


  };
  const refreshToken = async () => {
  try {
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (!storedRefreshToken) throw new Error("No refresh token available");

    const response = await axios.post('/auth/refresh-token', {
      refreshToken: storedRefreshToken
    });

    const data = response.data;
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      setAuthToken(data.accessToken);
      return data.accessToken;
    } else {
      logout(); // if refresh fails, logout
      return null;
    }

  } catch (error) {
    console.error("Refresh token error:", error);
    logout(); // log out on any refresh error
    return null;
  }
};
  useEffect(() => {
  const interceptor = axios.interceptors.response.use(
    response => response, 
    async error => {
      const originalRequest = error.config;

      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const newAccessToken = await refreshToken();
        if (newAccessToken) {
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axios(originalRequest); // retry original request
        }
      }

      return Promise.reject(error);
    }
  );

  return () => {
    axios.interceptors.response.eject(interceptor);
  };
}, []);


  const logout = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      console.warn("No refresh token found. Logging out locally.");
    } else {
      await axios.post(
        '/auth/logout',
        {}, // body can be empty
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`, // <-- send refresh token here
            'Content-Type': 'application/json'
          }
        }
      );
    }
  } catch (error) {
    console.error("Backend logout error:", error.response?.data || error.message);
  } finally {
    // Clear frontend state
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setUserType(null);
    setAuthToken(null);

    window.location.href = '/';
  }
};

  // دالة موحدة لمعالجة الأخطاء
  const handleAuthError = (error) => {
    console.error("Auth Error:", error);
    let errorMessage = "حدث خطأ في السيرفر";
    
    if (error.response && error.response.data) {
        const resData = error.response.data;
        if (resData.errors && Array.isArray(resData.errors)) {
            // تجميع الأخطاء لو جاية من validation
            errorMessage = resData.errors.map(err => err.msg).join(" & ");
        } else if (resData.message) {
            errorMessage = resData.message;
        }
    }
    return { success: false, error: errorMessage };
  };

  return (
    <AuthContext.Provider value={{ user, userType, login, register, logout, loading ,refreshToken}}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

