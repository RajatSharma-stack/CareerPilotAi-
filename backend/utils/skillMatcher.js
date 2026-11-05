const findMissingSkills = (resumeText, requiredSkills) => {
  const present = requiredSkills.filter((skill) =>
    resumeText.includes(skill.toLowerCase()),
  );

  const missing = requiredSkills.filter(
    (skill) => !resumeText.includes(skill.toLowerCase()),
  );

  return { present, missing };
};

export default findMissingSkills;
