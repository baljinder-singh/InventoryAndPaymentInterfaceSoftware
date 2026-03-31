import bcrypt from "bcryptjs";
import { Router } from "express";
import { users } from "../data/users.js";
import { createAuthToken } from "../utils/auth.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const user = users.find(
    (entry) => entry.email === String(email).trim().toLowerCase()
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const token = createAuthToken(user);
  const { passwordHash: _passwordHash, ...safeUser } = user;

  return res.json({
    token,
    user: safeUser
  });
});

export default router;
