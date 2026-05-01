// ─────────────────────────────────────────
// Advisor Logic — the brain of the app
// Takes student profile → returns strategy
// ─────────────────────────────────────────

function generateResult({ cgpa, tier, skills, goal }) {

  // ── Step 1: Figure out the student's category ──────────────────
  const category = getCategory(cgpa, tier);

  // ── Step 2: Get target companies based on goal + profile ────────
  const companies = getCompanies(goal, tier, cgpa, skills);

  // ── Step 3: Build the honest strategy message ───────────────────
  const strategy = getStrategy(cgpa, tier, skills, goal, category);

  // ── Step 4: Build the action roadmap ────────────────────────────
  const roadmap = getRoadmap(cgpa, tier, skills, goal);

  return { category, companies, strategy, roadmap };
}


// ── CATEGORY ─────────────────────────────────────────────────────
// Labels the student based on college tier + cgpa combined

function getCategory(cgpa, tier) {
  if (cgpa < 6) return "High Risk — Very limited opportunities, focus on survival";

  if (tier === 1 && cgpa >= 8.5) return "Elite Tier 1 — Top product companies & FAANG possible";
  if (tier === 1 && cgpa >= 7.5) return "Strong Tier 1 — Product companies within reach";
  if (tier === 1) return "Tier 1 — Average profile, skills will decide outcomes";

  if (tier === 2 && cgpa >= 8) return "Top Tier 2 — Product + service both possible";
  if (tier === 2 && cgpa >= 7) return "Tier 2 — Needs strong skills for product companies";
  if (tier === 2) return "Tier 2 — Service companies + off-campus grind";

  if (tier === 3 && cgpa >= 8) return "Top Tier 3 — Off-campus product opportunities possible";
  if (tier === 3 && cgpa >= 7) return "Tier 3 — Off-campus + strong skills required";
  
  return "Tier 3 — High risk, focus on skill-building + off-campus";
}


// ── COMPANIES ─────────────────────────────────────────────────────
// Returns realistic target companies based on the student's profile

function getCompanies(goal, tier, cgpa, skills) {
  const strongSkills = skills === "dsa" || skills === "dev" || skills === "both";

  if (tier === 3 && cgpa < 7 && goal === "product") {
  return ["Startups (via LinkedIn)", "AngelList roles", "Early-stage companies", "Internships first"];
}

  if (goal === "faang") {
    // FAANG is possible from any tier but needs strong skills
    if (strongSkills) return ["Google", "Microsoft", "Amazon", "Meta", "Uber", "Goldman Sachs Tech"];
    return ["Amazon (associate roles)", "Microsoft (non-SDE)", "Accenture Innovation"];
  }

  if (goal === "product") {
    if (tier === 1 && cgpa >= 7.0) return ["Flipkart", "Swiggy", "Razorpay", "CRED", "PhonePe", "Zepto", "Meesho"];
    if (tier === 2 && strongSkills) return ["Swiggy", "Zomato", "PhonePe", "Freshworks", "Zoho", "Postman"];
    return ["Zoho", "Freshworks", "Hasura", "Chargebee", "Postman", "Juspay"];
  }

  if (goal === "service") {
    return ["TCS", "Infosys", "Wipro", "Cognizant", "HCL", "Capgemini", "Tech Mahindra"];
  }

  // goal === "any" — suggest realistically based on profile
  if (tier === 1) return ["Flipkart", "Swiggy", "TCS Digital", "Infosys SP", "Amazon"];
  if (tier === 2) return ["Zoho", "Freshworks", "TCS", "Infosys", "Wipro", "Capgemini"];
  return ["TCS", "Infosys", "Wipro", "Cognizant", "HCL", "Mphasis"];
}


// ── STRATEGY ──────────────────────────────────────────────────────
// Honest 2-3 line assessment — no sugarcoating

function getStrategy(cgpa, tier, skills, goal, category) {
  const noSkills  = skills === "none" || skills === "basic";
  const hasStrong = skills === "dsa" || skills === "dev" || skills === "both";

  // Reality check layer
if (goal === "faang" && cgpa < 7) {
  return "Brutal truth: FAANG is not realistic right now with this CGPA. Focus on building strong DSA + getting into a good startup first, then switch later.";
}

  // FAANG goal
  if (goal === "faang") {
    if (noSkills)  return "FAANG with no strong skills right now is unrealistic in the short term. Start with DSA daily — 2 problems a day minimum. Give yourself 6-8 months before targeting these companies. Referrals from LinkedIn will matter more than cold applications.";
    if (tier === 3) return "FAANG from Tier 3 is possible but the path is longer. Strong DSA + internship at a known company first. Then use that internship to get a referral into FAANG. Skip direct applications — they rarely work without college brand.";
    return "You have the skills, now it's about consistency. 300+ Leetcode problems, mock interviews, and one strong referral can get you in the door. Focus on Amazon and Microsoft first — they hire more broadly than Google.";
  }

  // Product company goal
  if (goal === "product") {
    if (tier === 3 && noSkills) return "Product companies rarely visit Tier 3 campuses. Off-campus is your only real path. Build 2 solid projects, get to 150 Leetcode problems, and start applying on LinkedIn and Unstop. It takes 4-6 months of consistent effort.";
    if (hasStrong) return "You're on the right track. Product companies want people who can code AND have shipped something real. Polish your GitHub, add a proper README to your projects, and start networking with engineers at target companies on LinkedIn.";
    return "Bridge the skill gap first. Pick either DSA or a dev framework and go deep for 2 months. Product companies run technical rounds — without this foundation, you'll clear HR but fail the coding test.";
  }

  // Service company goal
  if (goal === "service") {
    if (cgpa < 6.0) return "Most service companies have a 6.0 CGPA cutoff — this will filter you automatically. Focus on companies like Mphasis, Hexaware, or Persistent that have lower bars. Also prepare hard for aptitude tests as that's the main filter.";
    return "Service companies are achievable. Focus on aptitude (TCS NQT, Infosys test), communication skills, and HR prep. Register directly on company portals — don't only wait for campus drives. TCS Next Step and Infosys Careers are your starting points.";
  }

  // goal === "any"
  if (tier === 3 && cgpa < 6.5) return "Be realistic — campus placements will be limited. Register for TCS, Infosys, Wipro off-campus immediately. In parallel, pick one skill (web dev or DSA) and build for 3 months. Your skill profile matters more than your college here.";
  return "You have options. Use campus drives as your safety net while simultaneously applying off-campus. Don't put all eggs in one basket. Service companies are your floor — now aim higher with skills.";
}


// ── ROADMAP ───────────────────────────────────────────────────────
// 4 actionable steps the student should take RIGHT NOW

function getRoadmap(cgpa, tier, skills, goal) {
  const noSkills  = skills === "none" || skills === "basic";
  const hasDSA    = skills === "dsa"  || skills === "both";
  const hasDev    = skills === "dev"  || skills === "both";

  const roadmap = [];

  // Step 1 — Skill foundation (most important, always first)
  if (noSkills) {
    roadmap.push("Start DSA today — arrays, strings, sorting. Use Striver's A2Z sheet. 2 problems per day, no skipping.");
  } else if (hasDSA && !hasDev) {
    roadmap.push("Build one real project using your DSA knowledge — a mini app, not just a console program. Put it on GitHub.");
  } else if (hasDev && !hasDSA) {
    roadmap.push("Add DSA to your skillset — you have dev skills but companies test DSA. Start with Blind 75 on Leetcode.");
  } else {
    roadmap.push("You have both skills — now refine. Pick one project, make it production-ready. Clean code, good README, deployed link.");
  }

  // Step 2 — Platform specific action
  if (goal === "faang" || goal === "product") {
    roadmap.push("Create profiles on Unstop, Leetcode, and LinkedIn. Apply to 5 companies per week minimum. Track applications in a spreadsheet.");
  } else {
    roadmap.push("Register on TCS Next Step, Infosys Careers, and Wipro job portal today. Apply even if you feel unready — deadlines won't wait.");
  }

  // Step 3 — CGPA specific advice
  if (cgpa < 6.5) {
    roadmap.push("Your CGPA will be auto-rejected by many filters. Target companies with no cutoff — startups, service companies like Mphasis and Hexaware, and off-campus roles on LinkedIn.");
  } else if (cgpa >= 8.0) {
    roadmap.push("High CGPA is your advantage — mention it prominently. Apply to shortlisting rounds that filter by CGPA first (many product companies do this). You'll get more interview calls than average.");
  } else {
    roadmap.push("CGPA is decent — it won't block you but won't open doors either. Let your skills and projects do the talking. Focus on a strong resume and GitHub.");
  }

  // Step 4 — Networking / final push
  if (tier === 3) {
    roadmap.push("Off-campus is your main route. Message 10 engineers per week on LinkedIn — not asking for jobs, asking for advice. Referrals come from relationships. Start now, not when placements start.");
  } else {
    roadmap.push("Attend every company PPT on campus even if you're unsure about them. Pre-placement talks give you insider info and sometimes direct shortlists. Never skip them.");
  }
    
  roadmap.push("Apply consistently — minimum 20 applications per week. Track everything in a spreadsheet."); 
  
  return roadmap;
}


module.exports = { generateResult };
