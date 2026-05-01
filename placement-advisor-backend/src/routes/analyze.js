// ─────────────────────────────────────────
// Route: POST /analyze
// Receives student profile, returns strategy
// ─────────────────────────────────────────

const express = require("express");
const router = express.Router();
const { validateInput } = require("../logic/validator");
const { generateResult } = require("../logic/advisor");
const explainer = require("../logic/explainer");
console.log("DEBUG EXPLAINER:", explainer);

router.post("/", async (req, res) => {
  const { cgpa, tier, skills, goal } = req.body;

  // Step 1: Validate the incoming data
  const error = validateInput({ cgpa, tier, skills, goal });
  if (error) {
    return res.status(400).json({ error });
  }

  // Step 2: Run the advisor logic and get the result
  const result = generateResult({ cgpa, tier, skills, goal });



// Step 3: Generate explanation + send response
let explanation;

try {
  explanation = await explainer.generateExplanation(result, { cgpa, tier, skills, goal });
} catch (err) {
  console.error("EXPLANATION ERROR:", err);
  explanation = "Error generating explanation";
}

return res.status(200).json({...result,explanation});

});

module.exports = router;
