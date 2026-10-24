/* Syncopated Notes — Knowledgebase UI kit
   Composes design-system primitives into the real note-reader product.
   Exports <KnowledgebaseApp/> to window. */

const DS = window.SyncopatedNotesDesignSystem_f2adea;
const { Button, Badge, Tag, IconButton, Callout, CodePanel, NavItem, Tabs } = DS;

/* ---------- tiny inline icons (stroke, 1.5) ---------- */
const Ico = {
  sun: (p) => <svg width="16" height="16" viewBox="0 0 20 20" fill="none" {...p}><circle cx="10" cy="10" r="3.4" stroke="currentColor" strokeWidth="1.5"/><path d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M15.3 4.7l-1.4 1.4M6.1 13.9l-1.4 1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  moon: (p) => <svg width="16" height="16" viewBox="0 0 20 20" fill="none" {...p}><path d="M16 11.5A6.5 6.5 0 018.5 4a6.5 6.5 0 100 12 6.5 6.5 0 007.5-4.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  copy: (p) => <svg width="15" height="15" viewBox="0 0 18 18" fill="none" {...p}><rect x="6" y="6" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M12 6V4.5A1.5 1.5 0 0010.5 3h-6A1.5 1.5 0 003 4.5v6A1.5 1.5 0 004.5 12H6" stroke="currentColor" strokeWidth="1.4"/></svg>,
  hash: (p) => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" {...p}><path d="M6 2L4 14M12 2l-2 12M3 6h11M2 10h11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  cal: (p) => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" {...p}><rect x="2.5" y="3.5" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
};

/* ---------- Header ---------- */
function Header({ dark, onToggle }) {
  const nav = ["Notes", "Projects", "Wikis", "About"];
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 30, height: "var(--header-h)",
      display: "flex", alignItems: "center", gap: "20px",
      padding: "0 26px", background: "color-mix(in oklab, var(--background) 86%, transparent)",
      backdropFilter: "blur(8px)", borderBottom: "1px solid var(--border)",
    }}>
      <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "15px", color: "var(--cyan)", letterSpacing: "-0.01em" }}>
        syncopated notes
      </span>
      <nav style={{ marginLeft: "auto", display: "flex", gap: "20px" }}>
        {nav.map((n, i) => (
          <a key={n} href="#" style={{
            fontFamily: "var(--font-ui)", fontSize: "13px",
            color: i === 0 ? "var(--cyan)" : "var(--text-2)", textDecoration: "none",
          }}>{n}</a>
        ))}
      </nav>
      <IconButton size="sm" title="Toggle theme" onClick={onToggle}>
        {dark ? <Ico.sun/> : <Ico.moon/>}
      </IconButton>
    </header>
  );
}

/* ---------- Right TOC rail ---------- */
function Toc({ items, active }) {
  return (
    <aside style={{ width: "var(--toc-w)", flexShrink: 0, paddingTop: "32px" }}>
      <div className="eyebrow" style={{ marginBottom: "12px" }}>Table of contents</div>
      <div className="eyebrow" style={{ color: "var(--dim)", marginBottom: "8px", fontSize: "10px" }}>On this page</div>
      {items.map((it) => (
        <NavItem key={it.id} href={"#" + it.id} active={it.id === active} depth={it.depth}>{it.label}</NavItem>
      ))}
    </aside>
  );
}

/* ---------- The note article ---------- */
function Article({ note }) {
  return (
    <article style={{ flex: "0 1 auto", width: "100%", minWidth: 0, maxWidth: "var(--width-article)", padding: "30px 8px 80px" }}>
      <h1 style={{ fontSize: "var(--text-3xl)", marginBottom: "14px" }}>{note.title}</h1>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
        {note.tags.map((t) => <Tag key={t}>{t}</Tag>)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "7px", fontFamily: "var(--font-ui)", fontSize: "12px", color: "var(--muted)", marginBottom: "30px" }}>
        <Ico.cal/> Last modified: {note.modified}
      </div>

      <h2 id="prompt" style={{ fontSize: "var(--text-2xl)", marginBottom: "10px" }}>SFL-Structured Prompt</h2>
      <p style={pStyle}>
        Interpersonal scaffolding is essentially "relational noise" that obscures data. While derived from
        psychological theories meant to build trust, in technical contexts it becomes a hindrance.
      </p>

      <CodePanel lang="prompt" filename="prompt.md" style={{ margin: "20px 0" }}>
{`Design the AI's interaction to mirror human conversational rhythm,
emphasizing natural turn-taking and brevity. Avoid 'essay mode' and
operate under 'biological constraints' that limit response length.`}
      </CodePanel>

      <h2 id="metadata" style={{ fontSize: "var(--text-2xl)", margin: "34px 0 10px" }}>SFL Metadata</h2>
      <h3 id="field" style={{ fontSize: "var(--text-xl)", margin: "18px 0 8px" }}>Field — what is happening?</h3>
      <ul style={ulStyle}>
        <li><b>Topic:</b> Simulating natural, human-like conversational dynamics and pacing.</li>
        <li><b>Task type:</b> Generating concise, informal, interactive responses that mirror human turn-taking.</li>
        <li><b>Keywords:</b> <Tag hash={false}>conversational-rhythm</Tag> <Tag hash={false}>natural-pacing</Tag> <Tag hash={false}>turn-taking</Tag></li>
      </ul>

      <Callout type="abstract" title="The Claim vs. The Leak">
        "The orchestrator just routes tasks." But agentic systems are already accumulating capability discovery,
        context propagation, memory, policy enforcement, approval gates, tracing, identity, retries, and governance.
      </Callout>

      <h3 id="tenor" style={{ fontSize: "var(--text-xl)", margin: "24px 0 8px" }}>Tenor — who is taking part?</h3>
      <p style={pStyle}>
        AI persona: <b>Expert</b>. Audience: users expecting quick, direct, human-like interaction —
        including Radiology IT systems support engineers. Desired tone: empathetic but non-dominant.
      </p>

      <Callout type="warning" title="Caution">
        Strict prohibition against boilerplate phrases ("I hope this helps", "Let me know") and restating the
        user's question. Self-edit for brevity; offer a "full list" only when items exceed three.
      </Callout>

      <h2 id="output" style={{ fontSize: "var(--text-2xl)", margin: "34px 0 10px" }}>Example Output</h2>
      <CodePanel filename="response.txt" style={{ margin: "16px 0" }}>
{`It's basically OAuth2. You swap the API key for a bearer token in
the header. Need the docs?`}
      </CodePanel>

      <div style={{ display: "flex", gap: "10px", marginTop: "28px" }}>
        <Button variant="primary" icon={<Ico.copy/>}>Copy note</Button>
        <Button variant="secondary">Open in editor</Button>
      </div>
    </article>
  );
}

const pStyle = { fontFamily: "var(--font-body)", fontSize: "15px", lineHeight: 1.7, color: "var(--foreground)", margin: "0 0 14px", maxWidth: "62ch" };
const ulStyle = { fontFamily: "var(--font-body)", fontSize: "15px", lineHeight: 1.8, color: "var(--foreground)", paddingLeft: "20px", margin: "0 0 18px" };

/* ---------- App shell ---------- */
function KnowledgebaseApp() {
  const [dark, setDark] = React.useState(false);
  const [current, setCurrent] = React.useState("pacing");

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const notes = [
    { id: "pacing", title: "The Natural Pacing Protocol" },
    { id: "leak", title: "The Claim and The Leak" },
    { id: "ospf", title: "OSPF as a Planner" },
    { id: "bus", title: "Shared Context Bus" },
  ];
  const note = {
    title: "The Natural Pacing Protocol",
    modified: "2026-02-02 06:37:57 PM",
    tags: ["natural-language-processing", "prompt-engineering", "generative-ai"],
  };
  const toc = [
    { id: "prompt", label: "Prompt Text", depth: 0 },
    { id: "metadata", label: "SFL Metadata", depth: 0 },
    { id: "field", label: "Field", depth: 1 },
    { id: "tenor", label: "Tenor", depth: 1 },
    { id: "output", label: "Example Output", depth: 0 },
  ];

  return (
    <div style={{ background: "var(--background)", minHeight: "100vh", color: "var(--foreground)" }}>
      <Header dark={dark} onToggle={() => setDark((d) => !d)} />
      <div style={{ display: "flex", gap: "20px", maxWidth: "1760px", margin: "0 auto", padding: "0 26px", alignItems: "flex-start", justifyContent: "center" }}>
        <Article note={note} />
        <Toc items={toc} active="prompt" />
      </div>
    </div>
  );
}

window.KnowledgebaseApp = KnowledgebaseApp;
