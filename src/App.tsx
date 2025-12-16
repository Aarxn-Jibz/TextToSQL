import { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function App() {
  const [output, setOutput] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const examplePrompts = [
    "Find users who joined last month",
    "Calculate total revenue by product category",
    "Show active customers with orders > $1000",
    "List employees sorted by hire date"
  ];

  const loadingLogs = [
    "INITIALIZING_NEURAL_UPLINK...",
    "PARSING_NATURAL_LANGUAGE_VECTOR...",
    "IDENTIFYING_ENTITIES_AND_INTENTS...",
    "MAPPING_SCHEMA_RELATIONSHIPS...",
    "OPTIMIZING_QUERY_PERFORMANCE...",
    "GENERATING_SQL_SYNTAX...",
    "FINALIZING_OUTPUT_STREAM..."
  ];

  useEffect(() => {
    let interval;
    if (isLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < loadingLogs.length - 1 ? prev + 1 : prev));
      }, 600);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const generateSQL = async () => {
    if (!prompt) return;

    setIsLoading(true);
    setOutput("");

    try {
      const response = await fetch('https://speakspacevoicetosql.onrender.com/process-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt, note_id: Date.now().toString() }),
      });

      if (!response.ok) throw new Error(`Server Error: ${response.status}`);

      const data = await response.json();
      let sqlText = data.message || data.result || data.sql_query || "";
      sqlText = sqlText.replace(/^SQL:\s*/, '');

      setOutput(sqlText || JSON.stringify(data, null, 2));

    } catch (error) {
      console.error(error);
      setOutput(`Error: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
        setOutput(""); 
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="font-display bg-[#09090b] text-zinc-100 min-h-screen selection:bg-emerald-500/30 selection:text-emerald-200">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">

        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#09090b]/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <span className="material-symbols-outlined text-[20px]">database</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Text2SQL</span>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full">
          <div className="mx-auto max-w-[1400px] px-6 py-10 md:py-16 h-full flex flex-col">

            <div className="mb-10 text-center space-y-4">
              <h1 className="text-4xl font-black leading-tight tracking-tight text-white md:text-5xl lg:text-6xl drop-shadow-2xl">
                Plain Text to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">SQL</span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-zinc-400">
                Transform natural language into optimized database queries instantly.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-stretch h-full min-h-[500px]">

              <div className="flex-1 flex flex-col">
                <div className="bg-black border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full ring-1 ring-white/5 hover:ring-white/10 transition-all duration-300 relative">
                  <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10 bg-white/[0.02]">
                    <span className="material-symbols-outlined text-emerald-500 text-[20px]">
                      edit_note
                    </span>
                    <span className="ml-3 text-xs font-mono font-medium text-zinc-500 uppercase tracking-widest">Input Query</span>
                  </div>

                  <div className="relative flex-1 group">
                    <textarea
                      className="font-mono w-full h-full min-h-[300px] resize-none bg-transparent p-6 text-base text-zinc-300 placeholder:text-zinc-700 focus:outline-none focus:bg-white/[0.01] transition-colors"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Enter your data requirement here..."
                    ></textarea>

                    {prompt && (
                      <button
                        onClick={() => setPrompt("")}
                        className="absolute top-4 right-4 p-2 text-zinc-600 hover:text-zinc-200 transition-colors"
                        title="Clear"
                      >
                        <span className="material-symbols-outlined text-[20px]">restart_alt</span>
                      </button>
                    )}
                  </div>

                  <div className="p-5 border-t border-white/10 bg-black">
                    <button
                      onClick={generateSQL}
                      disabled={isLoading}
                      className="w-full relative group overflow-hidden rounded-xl bg-emerald-500 py-3.5 px-8 text-sm font-bold text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isLoading ? (
                          <>
                            <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                            <span>PROCESSING_REQUEST</span>
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[18px]">bolt</span>
                            <span>GENERATE SQL</span>
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <div className="bg-black border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full ring-1 ring-white/5 relative">
                  <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-500 text-[18px]">terminal</span>
                      <span className="text-xs font-mono font-medium text-emerald-500/80 uppercase tracking-widest">Console Output</span>
                    </div>
                    <button
                      onClick={handleCopy}
                      disabled={!output}
                      className="flex items-center gap-1.5 rounded-lg bg-white/5 border border-white/5 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-0"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {isCopied ? 'check' : 'content_copy'}
                      </span>
                      {isCopied ? 'COPIED' : 'COPY'}
                    </button>
                  </div>

                  <div className="relative flex-1 bg-black p-0 overflow-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {isLoading ? (
                      <div className="absolute inset-0 p-8 font-mono text-sm">
                        <div className="flex flex-col gap-1 text-emerald-500/70">
                          {loadingLogs.map((log, index) => (
                            <div
                              key={index}
                              className={`flex items-center gap-3 transition-opacity duration-300 ${index > loadingStep ? 'opacity-0' : 'opacity-100'} ${index === loadingStep ? 'text-emerald-400' : ''}`}
                            >
                              <span className="text-emerald-500/30">[{new Date().toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })}]</span>
                              <span>{"> " + log}</span>
                              {index === loadingStep && (
                                <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse ml-1"></span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : output ? (
                      <SyntaxHighlighter
                        language="sql"
                        style={vscDarkPlus}
                        customStyle={{
                          margin: 0,
                          padding: '1.5rem',
                          background: 'transparent',
                          fontSize: '0.9rem',
                          lineHeight: '1.6',
                          height: '100%',
                          width: '100%'
                        }}
                        showLineNumbers={true}
                        lineNumberStyle={{ minWidth: '3em', paddingRight: '1.5em', color: '#444', textAlign: 'right', borderRight: '1px solid #222', marginRight: '1.5em' }}
                      >
                        {output}
                      </SyntaxHighlighter>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                        <div className="w-full max-w-md space-y-6">
                          <p className="text-zinc-700 text-xs font-mono uppercase tracking-widest text-center">System Ready // Select Preset</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {examplePrompts.map((ex, i) => (
                              <button
                                key={i}
                                onClick={() => setPrompt(ex)}
                                className="group relative flex items-start gap-3 p-3 text-left rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-emerald-500/30 transition-all duration-200"
                              >
                                <span className="mt-0.5 flex size-1.5 rounded-full bg-zinc-700 group-hover:bg-emerald-500 transition-colors shadow-[0_0_5px_rgba(0,0,0,0)] group-hover:shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                                <span className="text-xs text-zinc-400 group-hover:text-zinc-200 font-mono leading-relaxed">{ex}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>

            <div className="mt-12 text-center">
              <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-wider">
                System Status: <span className="text-emerald-500">Online</span>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}