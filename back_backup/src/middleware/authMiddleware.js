import AuthService from "../services/authService.js";

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = AuthService.verifyAccessToken(token);
    req.user = decoded; // attach decoded user info to req

    return next();

  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export const isLibrarian = (req, res, next) => {
  if (!req.user || req.user.userType !== "librarian") {
    return res.status(403).json({ success: false, message: "Forbidden: Librarian access only" });
  }
  next();
};
