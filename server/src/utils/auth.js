import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "inventory-payment-secret";
const JWT_EXPIRES_IN = "8h";

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
