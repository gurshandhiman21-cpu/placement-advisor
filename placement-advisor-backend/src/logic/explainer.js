require("dotenv").config();
console.log("EXPLAINER FILE LOADED");
// ── STEP 1: AI CALLER (placeholder) ──────────────────────────────
// Right now this returns a mock string.
// When you get an API key, replace the body of this function only.
// The rest of the code doesn't need to change at all.

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function callAI(prompt) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return response.text();
  } catch (err) {
    console.error("GEMINI ERROR:", err);
    return "MOCK_AI_RESPONSE";
  }
}


// ── STEP 2: PROMPT BUILDER ────────────────────────────────────────
// Converts the result + input into a clear, specific prompt.
// A good prompt = a good AI response. Garbage in = garbage out.
// This is the most important function in this file.

function buildPrompt(result, input) {
  const { cgpa, tier, skills, goal } = input;
  const { category, strategy, companies } = result;

  // Convert internal values to readable labels for the AI
  const tierLabel   = tier === 1 ? "Tier 1 (IIT/NIT/BITS)" : tier === 2 ? "Tier 2 college" : "Tier 3 college";
  const skillsLabel = { none: "no real skills yet", basic: "only basic knowledge", dsa: "DSA / Leetcode", dev: "web/app development", both: "DSA + web development" }[skills];
  const goalLabel   = { faang: "FAANG companies", product: "product-based companies", service: "service-based companies", any: "any good job" }[goal];

  // Build a detailed, specific prompt so the AI gives a useful response
  const prompt = `
You are a brutally honest Indian placement advisor. No motivational fluff. No vague advice.

A student has the following profile:
- College: ${tierLabel}
- CGPA: ${cgpa}
- Skills: ${skillsLabel}
- Goal: ${goalLabel}
- Profile category: "${category}"
- Top target companies: ${companies.slice(0, 3).join(", ")}
- Current strategy summary: "${strategy.slice(0, 120)}..."

Write a short explanation (80 to 120 words) that:
1. Tells them honestly where they stand
2. Points out the biggest gap or risk in their profile
3. Gives one specific action they should do this week
4. Ends with a realistic expectation (not "you can do it!" fluff)

Tone: direct, slightly strict, like a senior engineer giving real advice. Call out weak points clearly. Avoid generic advice.
Do NOT repeat the strategy word for word. Add new perspective.
`;

  return prompt.trim();
}


// ── STEP 3: MAIN FUNCTION ─────────────────────────────────────────
// This is the only function imported and used outside this file.
// It takes result + input, builds the prompt, calls AI, returns explanation.

async function generateExplanation(result, input) {
  // Build the prompt using the result + user's original inputs
  const prompt = buildPrompt(result, input);

  // Call the AI (mock for now, real later)
  const rawResponse = await callAI(prompt);

  // If AI returns a mock — replace with a rule-based fallback explanation
  // This keeps the API working even without a real AI key
  if (rawResponse === "MOCK_AI_RESPONSE") {
    return buildFallbackExplanation(result, input);
  }

  // Clean up the real AI response (trim whitespace, remove extra newlines)
  return rawResponse.trim();
}


// ── STEP 4: FALLBACK EXPLANATION (rule-based) ─────────────────────
// Used when callAI() returns the mock response.
// Writes a realistic, specific explanation using just if/else logic.
// This means your API response always has a real explanation —
// even before you integrate a real AI key.

function buildFallbackExplanation(result, input) {
  const { cgpa, tier, skills, goal } = input;
  const { category, companies }      = result;

  const noSkills    = skills === "none" || skills === "basic";
  const strongSkills = skills === "dsa" || skills === "dev" || skills === "both";
  const topCompany  = companies[0] || "your target company";

  // ── Case 1: FAANG goal + weak profile ─────────────────────────
  if (goal === "faang" && (noSkills || tier === 3)) {
    return `Your profile is labeled "${category}" — which means FAANG is not a short-term target right now. The biggest gap is ${noSkills ? "the complete absence of strong technical skills" : "your college brand, which matters more than you think for FAANG screening"}. This week: open Leetcode and solve 5 array problems. Not tomorrow — today. Realistically, you're 6-8 months away from being a competitive FAANG applicant. Companies like ${topCompany} should be your actual near-term target.`;
  }

  // ── Case 2: Product goal + decent profile ─────────────────────
  if (goal === "product" && strongSkills && cgpa >= 6.5) {
    return `You're in "${category}" which is a workable position for product companies. The risk in your profile is ${tier === 3 ? "that product companies rarely visit your campus — off-campus is 90% of your path" : "overconfidence. Having skills is not the same as having interview-ready skills"}. This week: apply to ${topCompany} directly on their careers page and solve 10 Leetcode mediums. Expect 2-4 months before you see solid interview calls. The pipeline is slower than people think — start now.`;
  }

  // ── Case 3: Service goal ───────────────────────────────────────
  if (goal === "service") {
    if (cgpa < 6.0) {
      return `Your CGPA of ${cgpa} is below the 6.0 cutoff that TCS, Infosys, and Wipro enforce automatically. You won't pass their resume screen — this is not opinion, it's how their system works. The biggest issue is that you're applying to the wrong companies. This week: go to Mphasis, Hexaware, and Persistent careers pages and register. These companies hire without strict CGPA cutoffs. Aptitude prep on PrepInsta daily will matter more than anything else right now.`;
    }
    return `Profile: "${category}." For service companies your CGPA of ${cgpa} passes the basic filter. The real eliminator is the aptitude test — most students fail it without specific prep. This week: take one full TCS NQT mock test on PrepInsta and find out where you actually stand. Don't assume you'll pass it cold. Companies like ${topCompany} reject 60-70% of applicants at the aptitude stage. Know your weaknesses before the actual test.`;
  }

  // ── Case 4: No clear goal or low profile ──────────────────────
  if (noSkills) {
    return `Your current profile — Tier ${tier}, ${cgpa} CGPA, no solid skills — puts you in a position where applying to companies right now is not useful. Recruiters will see nothing to act on. The single biggest risk is wasting 3 months applying and getting nowhere, then panicking. This week: pick one resource (Striver's DSA sheet or a dev tutorial) and commit to it. Not both. One. Check back on applications in 60 days. ${topCompany} is realistic — but not yet.`;
  }

  // ── Default fallback ───────────────────────────────────────────
  return `Your profile falls under "${category}." Based on your CGPA of ${cgpa} from a Tier ${tier} college with ${skills} skills, you have a realistic shot at ${topCompany} and similar companies. The gap most students at your level miss: applications without preparation don't convert. This week — do one thing: either apply to 5 companies or solve 15 Leetcode problems. Not both. Focus beats volume at this stage. Set a 90-day timeline and track every application.`;
}

console.log("EXPORTING generateExplanation");
module.exports = { generateExplanation };
