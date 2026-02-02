import React, { useState, useEffect, useRef } from 'react';
import {
    Brain,
    MessageSquare,
    ShieldAlert,
    Database,
    GitMerge,
    Gavel,
    ArrowRight,
    CheckCircle,
    XCircle,
    BookOpen,
    Layers,
    Cpu,
    Zap,
    Search,
    Menu,
    X,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

// --- Data: LEIA Stages ---
const leiaStages = [
    {
        id: 1,
        title: "Basic Syntax",
        icon: <Layers className="w-6 h-6" />,
        description: "The structural skeleton. Identifies grammar without deep meaning.",
        knowledgeUsed: [
            "External Morphological Parsers",
            "External Syntactic Parsers",
            "Gazetteers (Named Entities)",
            "Annotated Corpora"
        ],
        knowledgeProduced: [
            "Sentence Boundaries",
            "Word Lemmas",
            "POS Tags",
            "Constituency & Dependency Parses"
        ],
        example: "Input: 'The bank.' -> Noun Phrase identified."
    },
    {
        id: 2,
        title: "OntoSyntax",
        icon: <GitMerge className="w-6 h-6" />,
        description: "Mapping linguistic structure to ontological concepts.",
        knowledgeUsed: [
            "Internal Agent Lexicon",
            "Syntactic-Semantic Mapping Rules",
            "Transformation Rules (Passive -> Active)",
            "Disfluency Rules"
        ],
        knowledgeProduced: [
            "Candidate Lexical Links",
            "SynMapping Results",
            "Nascent Lexical Senses",
            "Reambiguated Decisions"
        ],
        example: "Links 'bank' to potential concepts: BANK-FINANCIAL, BANK-RIVER."
    },
    {
        id: 3,
        title: "Basic Semantics",
        icon: <Database className="w-6 h-6" />,
        description: "Disambiguation via ontological constraints.",
        knowledgeUsed: [
            "Ontological Constraints (e.g., INGEST requires FOOD)",
            "Selectional Restrictions",
            "Syntax-to-Semantics Linking Rules"
        ],
        knowledgeProduced: [
            "Word-Sense Disambiguation",
            "Semantic Dependency Structures",
            "Preliminary Unknown Word Specs"
        ],
        example: "Context 'deposit' selects BANK-FINANCIAL over BANK-RIVER."
    },
    {
        id: 4,
        title: "Procedural Semantics",
        icon: <Cpu className="w-6 h-6" />,
        description: "Executing 'code' words like pronouns and math.",
        knowledgeUsed: [
            "Meaning Procedures (Pronoun resolution)",
            "Scalar Logic (Multipliers for 'very')",
            "Set Logic"
        ],
        knowledgeProduced: [
            "Resolved Referring Expressions",
            "Modulated Scalar Values",
            "Elided Content Resolution"
        ],
        example: "'He' resolved to 'John'; 'Very tall' -> HEIGHT > 0.8."
    },
    {
        id: 5,
        title: "Extended Semantics",
        icon: <Brain className="w-6 h-6" />,
        description: "Understanding metaphor, metonymy, and indirect speech.",
        knowledgeUsed: [
            "Metaphor Microtheories",
            "Metonymy Repositories",
            "Discourse Windows"
        ],
        knowledgeProduced: [
            "Non-Literal Meaning Representations",
            "Indirect Speech Act Interpretation",
            "Culled Candidate TMRs"
        ],
        example: "'White House said' -> 'Executive Branch said' (Metonymy)."
    },
    {
        id: 6,
        title: "Situational Reasoning",
        icon: <CheckCircle className="w-6 h-6" />,
        description: "Grounding meaning in the agent's reality and memory.",
        knowledgeUsed: [
            "Episodic Memory",
            "Situation Model",
            "Mindreading Models (Theory of Mind)",
            "Multimodal Perception"
        ],
        knowledgeProduced: [
            "Final Context-Sensitive TMR",
            "Grounded Reference Resolution",
            "Actionable Intelligence"
        ],
        example: "'The car' -> TOYOTA-CAMRY-INSTANCE-001 (Specific Memory)."
    }
];

// --- Data: Dialectic Agents ---
const dialecticAgents = [
    {
        id: "user",
        name: "User / WRU",
        role: "The Spark (Thesis)",
        color: "text-blue-500",
        bgColor: "bg-blue-100",
        borderColor: "border-blue-300",
        icon: <Zap className="w-5 h-5" />,
        desc: "Injects high-entropy, creative, or chaotic ideas. Ignores constraints. Operates on 'Dream Logic'.",
        quote: "Why don't we just prompt the AI to handle all the business logic?"
    },
    {
        id: "steve",
        name: "Steve",
        role: "The Auditor (Antithesis)",
        color: "text-red-600",
        bgColor: "bg-red-100",
        borderColor: "border-red-300",
        icon: <ShieldAlert className="w-5 h-5" />,
        desc: "The Engineering Realist. Attacks structural weaknesses and state leakage. Cynical and clinical.",
        quote: "That's not engineering; that's being a novelist with a gambling addiction."
    },
    {
        id: "lenny",
        name: "Lenny",
        role: "The Anchor (Correction)",
        color: "text-slate-600",
        bgColor: "bg-slate-200",
        borderColor: "border-slate-400",
        icon: <Database className="w-5 h-5" />,
        desc: "Verifies facts and limits. Checks API costs, latency, and physics. Zero-temperature logic.",
        quote: "Latency +500ms. Reliability < 80%. Proposal Rejected."
    },
    {
        id: "sasha",
        name: "Sasha",
        role: "The Synthesizer",
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
        borderColor: "border-yellow-300",
        icon: <GitMerge className="w-5 h-5" />,
        desc: "Braids validated ideas into a coherent plan. Filters out the noise/snark of other agents.",
        quote: "Let's use code for the math and the LLM for the tone. A hybrid approach."
    },
    {
        id: "judy",
        name: "Judy",
        role: "The Executive (Judgment)",
        color: "text-purple-600",
        bgColor: "bg-purple-100",
        borderColor: "border-purple-300",
        icon: <Gavel className="w-5 h-5" />,
        desc: "Resolves indecision. Forces the collapse of the probability wave. Issues 'Go/No-Go'.",
        quote: "Judicial Order #001: Separation of Concerns Mandated. Execute."
    }
];

// --- Data: Simulation Script (Prompt Engineering) ---
const simulationScript = [
    {
        step: 1,
        agentId: "user",
        text: "I want to build a prompt that handles our entire refund policy. I'll just paste the 50-page PDF into the context window and tell the AI to 'be helpful'. It's intuitive!",
        analysis: "High Entropy Input. Relies on 'vibe-based' prompting."
    },
    {
        step: 2,
        agentId: "steve",
        text: "This is architectural laziness. You're creating a 'fragile control signal'. Text isn't code. If the model hallucinates a decimal point, we lose money. You're negotiating with a probability curve, not programming.",
        analysis: "Steve identifies 'State Leakage' and lack of determinism."
    },
    {
        step: 3,
        agentId: "lenny",
        text: "Analysis complete. Token count: 15,000. Cost per request: $0.45. Latency: 3.2 seconds. This exceeds our SLA of 200ms by 1600%. Throughput capped by human review speed. Status: NO-GO.",
        analysis: "Lenny checks constraints: Latency, Cost, Reliability."
    },
    {
        step: 4,
        agentId: "sasha",
        text: "Okay, let's normalize this. We keep the User's goal (automated refunds) but respect Steve and Lenny's constraints. We will use Python for the refund math (Deterministic) and the LLM only for parsing the customer's email (Stochastic). A Hybrid Architecture.",
        analysis: "Sasha proposes 'Neurosymbolic Integration' / Hybrid System."
    },
    {
        step: 5,
        agentId: "judy",
        text: "Reviewing Sasha's Hybrid Proposal. Latency acceptable. Risk mitigated. Proposal Approved. Judicial Order: 'Code for Logic, Tokens for Tone'.",
        analysis: "Judy collapses the wave. Decision is final."
    }
];

// --- Components ---

const Header = ({ setView, currentView }) => (
    <header className="bg-slate-900 text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView('home')}>
                <Brain className="w-8 h-8 text-cyan-400" />
                <div>
                    <h1 className="text-xl font-bold tracking-tight">COGNITIVE<span className="text-cyan-400">ARCH</span></h1>
                    <p className="text-xs text-slate-400 uppercase tracking-widest">LEIA & Dialectic Engine Explorer</p>
                </div>
            </div>

            <nav className="hidden md:flex space-x-6">
                <button
                    onClick={() => setView('leia')}
                    className={`px-3 py-1 rounded-full transition-all ${currentView === 'leia' ? 'bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-400' : 'hover:text-cyan-300'}`}
                >
                    LEIA Pipeline
                </button>
                <button
                    onClick={() => setView('dialectic')}
                    className={`px-3 py-1 rounded-full transition-all ${currentView === 'dialectic' ? 'bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-400' : 'hover:text-cyan-300'}`}
                >
                    Dialectic Engine
                </button>
                <button
                    onClick={() => setView('docs')}
                    className={`px-3 py-1 rounded-full transition-all ${currentView === 'docs' ? 'bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-400' : 'hover:text-cyan-300'}`}
                >
                    Knowledge Graph
                </button>
            </nav>

            {/* Mobile Menu Icon (Placeholder) */}
            <div className="md:hidden">
                <Menu className="w-6 h-6" />
            </div>
        </div>
    </header>
);

const Hero = ({ setView }) => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-b from-slate-50 to-slate-200 p-6 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-3xl border border-slate-100">
            <div className="flex justify-center mb-6">
                <div className="p-4 bg-cyan-100 rounded-full animate-pulse">
                    <Brain className="w-12 h-12 text-cyan-600" />
                </div>
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Engineering Truth from Chaos</h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Explore the future of Artificial Intelligence beyond stochastic generation.
                Dive into the <span className="font-semibold text-cyan-700">LEIA Architecture</span> for deep language understanding
                and the <span className="font-semibold text-red-700">Dialectic Engine</span> for robust truth verification.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
                <button
                    onClick={() => setView('leia')}
                    className="flex items-center justify-center space-x-2 bg-slate-900 text-white px-6 py-4 rounded-lg hover:bg-slate-800 transition-all shadow-lg group"
                >
                    <Layers className="w-5 h-5 group-hover:text-cyan-400" />
                    <span>Explore LEIA Pipeline</span>
                </button>
                <button
                    onClick={() => setView('dialectic')}
                    className="flex items-center justify-center space-x-2 bg-white text-slate-900 border border-slate-200 px-6 py-4 rounded-lg hover:bg-slate-50 transition-all shadow-lg group"
                >
                    <ShieldAlert className="w-5 h-5 group-hover:text-red-500" />
                    <span>Enter Dialectic Room</span>
                </button>
            </div>
        </div>
    </div>
);

const LEIAView = () => {
    const [activeStage, setActiveStage] = useState(null);

    return (
        <div className="p-8 max-w-6xl mx-auto min-h-screen">
            <div className="mb-10">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">The LEIA Pipeline</h2>
                <p className="text-slate-600">The six-stage process of converting raw text into grounded meaning (TMR).</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: The Pipeline Visual */}
                <div className="lg:col-span-5 flex flex-col space-y-4 relative">
                    <div className="absolute left-8 top-4 bottom-4 w-1 bg-slate-200 -z-10"></div>
                    {leiaStages.map((stage, index) => (
                        <div
                            key={stage.id}
                            onClick={() => setActiveStage(stage)}
                            className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all transform hover:-translate-y-1 hover:shadow-md ${activeStage?.id === stage.id ? 'border-cyan-500 bg-cyan-50' : 'border-white bg-white hover:border-cyan-200'}`}
                        >
                            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center mr-4 z-10 ${activeStage?.id === stage.id ? 'bg-cyan-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                {stage.icon}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">Stage {stage.id}: {stage.title}</h3>
                                <p className="text-xs text-slate-500 truncate w-48 md:w-64">{stage.description}</p>
                            </div>
                            {activeStage?.id === stage.id && (
                                <div className="absolute right-4 text-cyan-500 animate-pulse">
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Right: Stage Details */}
                <div className="lg:col-span-7">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 h-full overflow-hidden flex flex-col">
                        {activeStage ? (
                            <div className="flex flex-col h-full animate-fadeIn">
                                <div className="bg-cyan-600 text-white p-6">
                                    <div className="flex items-center space-x-3 mb-2">
                                        {activeStage.icon}
                                        <h3 className="text-2xl font-bold">{activeStage.title}</h3>
                                    </div>
                                    <p className="text-cyan-100">{activeStage.description}</p>
                                </div>

                                <div className="p-6 space-y-6 flex-grow overflow-y-auto">

                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Example Transformation</h4>
                                        <p className="font-mono text-sm text-slate-800">{activeStage.example}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center">
                                                <Database className="w-4 h-4 mr-2" /> Knowledge Used
                                            </h4>
                                            <ul className="space-y-2">
                                                {activeStage.knowledgeUsed.map((k, i) => (
                                                    <li key={i} className="text-sm text-slate-600 bg-blue-50 px-3 py-2 rounded border-l-2 border-blue-400">
                                                        {k}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-bold text-green-600 uppercase tracking-wider mb-3 flex items-center">
                                                <CheckCircle className="w-4 h-4 mr-2" /> Knowledge Produced
                                            </h4>
                                            <ul className="space-y-2">
                                                {activeStage.knowledgeProduced.map((k, i) => (
                                                    <li key={i} className="text-sm text-slate-600 bg-green-50 px-3 py-2 rounded border-l-2 border-green-400">
                                                        {k}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 p-12 text-center">
                                <Layers className="w-16 h-16 mb-4 opacity-50" />
                                <p className="text-lg font-medium">Select a stage from the pipeline to reveal its internal cognitive architecture.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const DialecticView = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [currentStep]);

    const handleNext = () => {
        if (currentStep < simulationScript.length) {
            setCurrentStep(curr => curr + 1);
        }
    };

    const handleReset = () => {
        setCurrentStep(0);
    };

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto min-h-screen flex flex-col">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">The Dialectic Engine</h2>
                    <p className="text-slate-600 max-w-2xl">
                        Simulating the "Prompt Engineering" verification loop. Watch as a high-entropy user request is audited, corrected, synthesized, and judged.
                    </p>
                </div>
                <div className="space-x-2">
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-50"
                    >
                        Reset
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={currentStep === simulationScript.length}
                        className={`px-4 py-2 text-sm font-medium text-white rounded shadow-sm ${currentStep === simulationScript.length ? 'bg-slate-300 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800'}`}
                    >
                        {currentStep === 0 ? "Start Simulation" : currentStep === simulationScript.length ? "Simulation Complete" : "Next Agent"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow h-[600px]">

                {/* Left Col: Agent Roster */}
                <div className="lg:col-span-1 space-y-3 overflow-y-auto pr-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Active Agents</h3>
                    {dialecticAgents.map(agent => {
                        const isActive = currentStep > 0 && simulationScript[currentStep - 1]?.agentId === agent.id;
                        return (
                            <div
                                key={agent.id}
                                className={`p-4 rounded-lg border-2 transition-all duration-300 ${isActive ? `${agent.borderColor} ${agent.bgColor} scale-105 shadow-md` : 'border-transparent bg-white shadow-sm opacity-70 hover:opacity-100'}`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                        <div className={`${agent.color}`}>{agent.icon}</div>
                                        <span className={`font-bold ${agent.color}`}>{agent.name}</span>
                                    </div>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">{agent.role}</span>
                                </div>
                                <p className="text-xs text-slate-600 leading-snug">{agent.desc}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Right Col: Chat Interface */}
                <div className="lg:col-span-2 bg-slate-50 rounded-2xl border border-slate-200 shadow-inner flex flex-col relative overflow-hidden">
                    <div className="bg-white p-4 border-b border-slate-200 flex justify-between items-center shadow-sm z-10">
                        <h3 className="font-bold text-slate-700">Simulation Log: Case #001 (Code vs. Tokens)</h3>
                        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full">
                            Status: {currentStep === 0 ? "Pending" : currentStep < 5 ? "In Progress" : "Resolved"}
                        </span>
                    </div>

                    <div
                        ref={scrollRef}
                        className="flex-grow overflow-y-auto p-6 space-y-6"
                    >
                        {currentStep === 0 && (
                            <div className="flex flex-col items-center justify-center h-full opacity-40">
                                <MessageSquare className="w-16 h-16 mb-4 text-slate-400" />
                                <p>Waiting to initialize sequence...</p>
                            </div>
                        )}

                        {simulationScript.slice(0, currentStep).map((log, idx) => {
                            const agent = dialecticAgents.find(a => a.id === log.agentId);
                            return (
                                <div key={idx} className="animate-slideUp">
                                    <div className={`flex items-start space-x-4 ${log.agentId === 'user' ? '' : ''}`}>
                                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${agent.bgColor} ${agent.color} border ${agent.borderColor}`}>
                                            {agent.icon}
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex items-baseline space-x-2 mb-1">
                                                <span className={`font-bold text-sm ${agent.color}`}>{agent.name}</span>
                                                <span className="text-xs text-slate-400 uppercase">{agent.role}</span>
                                            </div>
                                            <div className="bg-white p-4 rounded-br-xl rounded-bl-xl rounded-tr-xl shadow-sm border border-slate-100 text-slate-700 text-sm leading-relaxed">
                                                {log.text}
                                            </div>
                                            <div className="mt-2 flex items-center space-x-2 text-xs text-slate-400">
                                                <Cpu className="w-3 h-3" />
                                                <span>System Note: {log.analysis}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {idx < currentStep - 1 && (
                                        <div className="ml-5 h-6 border-l-2 border-slate-200 border-dashed my-1"></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {currentStep === simulationScript.length && (
                        <div className="p-4 bg-green-50 border-t border-green-200 text-center animate-fadeIn">
                            <p className="text-green-800 font-bold flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Process Complete. Output Verified.
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

const DocsView = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const terms = [
        { term: "Text Meaning Representation (TMR)", def: "A formal, symbolic representation of meaning grounded in ontology, distinct from surface text." },
        { term: "Ontology", def: "A structured knowledge base of concepts and their properties (e.g., world physics, logic) used for reasoning." },
        { term: "Bicameral Architecture", def: "A system design splitting cognition into a creative 'Right Hemisphere' (Generation) and a critical 'Left Hemisphere' (Verification)." },
        { term: "Promptware Crisis", def: "The reliability issue arising from using probabilistic natural language prompts for deterministic business logic." },
        { term: "State Leakage", def: "The phenomenon where an LLM 'forgets' constraints or context over long conversations due to probabilistic drift." },
        { term: "Systemic Functional Linguistics (SFL)", def: "A linguistic framework viewing language as a system of choices (Field, Tenor, Mode) for making meaning." },
        { term: "Mental Meaning Representation (MMR)", def: "The result of the Deliberation phase; the agent's internal decision on what to do." },
        { term: "Register Architecture", def: "Engineering the specific tone, vocabulary, and structure (Register) of an agent to constrain its output." }
    ];

    const filteredTerms = terms.filter(t => t.term.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="p-8 max-w-4xl mx-auto min-h-screen">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Knowledge Graph & Definitions</h2>

            <div className="relative mb-8">
                <Search className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search concepts..."
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTerms.map((item, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="font-bold text-slate-800 mb-2">{item.term}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">{item.def}</p>
                    </div>
                ))}
            </div>

            {filteredTerms.length === 0 && (
                <div className="text-center text-slate-400 mt-12">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No concepts found matching "{searchTerm}"</p>
                </div>
            )}
        </div>
    );
};

// --- Main App Component ---

const App = () => {
    const [view, setView] = useState('home');

    return (
        <div className="bg-slate-50 min-h-screen font-sans text-slate-900 selection:bg-cyan-100 selection:text-cyan-900">
            <Header setView={setView} currentView={view} />

            <main className="animate-fadeIn">
                {view === 'home' && <Hero setView={setView} />}
                {view === 'leia' && <LEIAView />}
                {view === 'dialectic' && <DialecticView />}
                {view === 'docs' && <DocsView />}
            </main>

            <footer className="bg-white border-t border-slate-200 py-8 text-center text-slate-400 text-sm mt-auto">
                <p>&copy; 2026 OntoAgent Research Simulation. Based on "Agents in the Long Game of AI".</p>
            </footer>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.4s ease-out forwards; }
      `}</style>
        </div>
    );
};

export default App;