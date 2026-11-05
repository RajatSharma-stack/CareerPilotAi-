import db from "../config/db.js";

const getUserRoadmap = async (req, res) => {
  try {
    const userId = req.user.id;

    const [roadmap] = await db.query(
      "SELECT * FROM roadmaps WHERE user_id=? ORDER BY id DESC LIMIT 1",
      [userId],
    );

    if (!roadmap.length) return res.json({ roadmap: [] });

    const roadmapId = roadmap[0].id;

    const [months] = await db.query(
      "SELECT * FROM roadmap_months WHERE roadmap_id=?",
      [roadmapId],
    );

    for (let m of months) {
      const [skills] = await db.query(
        "SELECT skill_name, completed FROM skills WHERE month_id=?",
        [m.id],
      );

      const [projects] = await db.query(
        "SELECT project_name FROM projects WHERE month_id=?",
        [m.id],
      );

      m.skills = skills;
      m.projects = projects;
    }

    res.json({ roadmap: months });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch roadmap" });
  }
};

export default {
  getUserRoadmap,
};
