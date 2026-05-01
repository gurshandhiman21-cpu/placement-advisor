
import "./App.css";
import React, { useState, useRef, useEffect } from "react";

// Inline SVGs for minimal icons
const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
  </svg>
);

const BotIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
  </svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

function App() {
  const [form, setForm] = useState({
    cgpa: "",
    tier: "3",
    skills: "none",
    goal: "any"
  });

  const inputRef = useRef(null);
  const chatEndRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [typingText, setTypingText] = useState("");
  
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const [messages, setMessages] = useState([]);
  const [typingInterval, setTypingInterval] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  // Auto-scroll to bottom of chat
 useEffect(() => {
  if (autoScroll && !isTyping) {
    chatEndRef.current?.scrollIntoView({ behavior: "auto" });
  }
}, [messages, autoScroll, isTyping]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.cgpa) {
      alert("Please enter your CGPA");
      return;
    }

    
    if (typingInterval) {
      clearInterval(typingInterval);
      setTypingInterval(null);
    }
    setTypingText("");
    setIsTyping(false);

    // ✅ Step 2: Now add the user message
    const userMessage = `CGPA: ${form.cgpa}, Tier: ${form.tier}, Skills: ${form.skills}, Goal: ${form.goal}`;
    setMessages((prev) => [...prev, { type: "user", text: userMessage }]);
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:3000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          cgpa: Number(form.cgpa),
          tier: Number(form.tier),
          skills: form.skills,
          goal: form.goal
        })
      });

      const data = await res.json();
      setIsTyping(false);

      const fullText = `
${data.category}

🎯 Strategy:
${data.strategy}

🏢 Companies:
${data.companies.join(", ")}

🛣 Roadmap:
${data.roadmap.join("\n")}

🧠 Explanation:
${data.explanation}
`;

      let i = 0;

      const interval = setInterval(() => {
        setTypingText(fullText.slice(0, i + 1));
        i++;

        if (i >= fullText.length) {
          clearInterval(interval);

         
          setMessages((prev) => [...prev, { type: "ai", text: fullText }]);
          setTypingText("");
          setIsTyping(false);
        }
      }, 15);

      setTypingInterval(interval);

    } catch (err) {
      console.error(err);
      setIsTyping(false);
      setMessages((prev) => [...prev, { type: "ai", text: "Sorry, the backend is not responding properly. Please ensure it is running." }]);
    }
  };

  return (
    <div className="App-container">
      {/* Header */}
      <header className="App-header">
        <div className="App-logo-icon">
          <SparklesIcon />
        </div>
        <h1 className="App-title">Placement Advisor</h1>
      </header>

      {/* Chat Area */}
     <div
  className="chat-area"
  onScroll={(e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;

    setAutoScroll(isAtBottom);
  }}
>
        {messages.length === 0 ? (
          <div className="welcome-screen">
            <div className="welcome-logo">
              <SparklesIcon />
            </div>
            <h2>AI Career Advisor</h2>
            <p>Enter your academic details below to get a personalized strategy, targeted companies, and a roadmap for your placements.</p>
          </div>
        
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`message-wrapper ${msg.type}`}>
              {msg.type === "ai" && (
                <div className="ai-icon-wrapper">
                  <BotIcon />
                </div>
              )}
              <div className={`message-bubble ${msg.type}`}>
                {/* We render markdown pseudo-bold tags to basic bold for prettier output */}
                <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
  {msg.text}
</pre>
              </div>
            </div>
          ))
        )}
        {typingText && (
  <div className="message-wrapper ai">
    <div className="ai-icon-wrapper">
      <BotIcon />
    </div>
    <div className="message-bubble ai">
      <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
        {typingText}<span>|</span>
      </pre>
    </div>
  </div>
)}
        
        {isTyping && !typingText && (
           <div className="message-wrapper ai">
             <div className="ai-icon-wrapper">
               <BotIcon />
             </div>
             <div className="message-bubble ai" style={{ display: 'flex', alignItems: 'center', height: '56px' }}>
                <span className="typing-dot"></span>
                <span className="typing-dot" style={{animationDelay: "0.2s"}}></span>
                <span className="typing-dot" style={{animationDelay: "0.4s"}}></span>
             </div>
           </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="input-container">
        <div className="glass-form">
          <input
            className="input-field"
            ref={inputRef}
            name="cgpa"
            placeholder="Enter CGPA (e.g. 8.5)"
            value={form.cgpa}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
          />

          <select className="select-field" name="tier" value={form.tier} onChange={handleChange}>
            <option value="1">Tier 1 College</option>
            <option value="2">Tier 2 College</option>
            <option value="3">Tier 3 College</option>
          </select>

          <select className="select-field" name="skills" value={form.skills} onChange={handleChange}>
            <option value="none">No Skills</option>
            <option value="basic">Basic Skills</option>
            <option value="dsa">DSA Focus</option>
            <option value="dev">Development Focus</option>
            <option value="both">DSA + Dev</option>
          </select>

          <select className="select-field" name="goal" value={form.goal} onChange={handleChange}>
            <option value="any">Any Company</option>
            <option value="faang">FAANG / MAANG</option>
            <option value="product">Product Based</option>
            <option value="service">Service Based</option>
          </select>

          <button className="send-button" onClick={handleSubmit} title="Get Advice">
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;