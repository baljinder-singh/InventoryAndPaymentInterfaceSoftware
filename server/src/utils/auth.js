import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "8h";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is required. Set it in server/.env before starting the server.");
}

export function createAuthToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      roleLabel: user.roleLabel
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function verifyAuthToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
