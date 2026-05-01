// ─────────────────────────────────────────
// Validator — checks that all inputs are
// present and contain valid values
// ─────────────────────────────────────────

const VALID_SKILLS = ["none", "basic", "dsa", "dev", "both"];
const VALID_GOALS  = ["faang", "product", "service", "any"];

function validateInput({ cgpa, tier, skills, goal }) {

  // CGPA must be a number between 0 and 10
  if (cgpa === undefined || typeof cgpa !== "number" || cgpa < 0 || cgpa > 10) {
    return "cgpa must be a number between 0 and 10";
  }

  // Tier must be 1, 2, or 3
  if (![1, 2, 3].includes(tier)) {
    return "tier must be 1, 2, or 3";
  }

  // Skills must be one of the allowed values
  if (!VALID_SKILLS.includes(skills)) {
    return `skills must be one of: ${VALID_SKILLS.join(", ")}`;
  }

  // Goal must be one of the allowed values
  if (!VALID_GOALS.includes(goal)) {
    return `goal must be one of: ${VALID_GOALS.join(", ")}`;
  }

  // No error — return null
  return null;
}

module.exports = { validateInput };
