export const getMe = (req, res) => {
  try {
    // auth middleware sets req.user after verifying JWT
    const user = req.user || null;
    if (!user) return res.status(401).json({ message: "Not authenticated" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to get user" });
  }
};
