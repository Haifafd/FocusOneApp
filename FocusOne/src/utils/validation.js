export const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e || "");

export const passwordIssues = (p = "") => {
  const issues = [];
  if (p.length < 8) issues.push("At least 8 characters");
  if (!/[A-Z]/.test(p)) issues.push("One uppercase letter");
  if (!/[0-9]/.test(p)) issues.push("One number");
  return issues;
};
