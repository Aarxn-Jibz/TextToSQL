import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function App() {
  const [output, setOutput] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const generateSQL = async () => {
    if (!prompt) return;
    
    setIsLoading(true);
    setOutput(""); 

    try {
      const response = await fetch('https://speakspacevoicetosql.onrender.com/process-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          note_id: Date.now().toString()
        }),
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      let sqlText = data.message || data.result || data.sql_query || "";
      sqlText = sqlText.replace(/^SQL:\s*/, '');
      
      setOutput(sqlText || JSON.stringify(data, null, 2));
      
    } catch (error) {
      console.error("API Error details:", error);
      setOutput(`Error: ${(error as Error).message}. Check console (F12) for details.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="font-display bg-background-page text-primary antialiased selection:bg-primary/20 selection:text-primary min-h-screen">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">

        <header className="sticky top-0 z-50 w-full border-b border-secondary/20 bg-background-page/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <span className="material-symbols-outlined">database</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Text2SQL</span>
            </div>

            <div className="hidden md:block"></div>

          </div>
        </header>

        <main className="flex-1">
          <div className="mx-auto max-w-[960px] px-6 py-12 md:py-20">
            <div className="mb-12 text-center">
              <h1 className="mb-4 text-4xl font-black leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
                Plain Text to <span className="text-primary">SQL</span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-secondary">
                Stop writing complex queries manually. Describe what you need in plain English.
              </p>
            </div>

            <div className="rounded-xl bg-surface border border-secondary/20 p-2 shadow-2xl shadow-black md:p-4">
              <div className="relative mb-6">
                <label className="mb-2 block px-4 text-sm font-bold text-secondary" htmlFor="prompt-input">
                  Describe your query
                </label>
                <div className="group relative overflow-hidden rounded-xl bg-surface-highlight border-2 border-transparent focus-within:border-primary/50 transition-colors">
                  <textarea
                    className="font-nerd h-40 w-full resize-none bg-transparent p-6 text-base text-primary placeholder:text-secondary/60 focus:outline-none"
                    id="prompt-input"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., Find all users who signed up last month..."
                  ></textarea>
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <button 
                      onClick={() => setPrompt("")}
                      className="rounded-lg p-2 text-secondary hover:bg-white/5 hover:text-primary transition-colors" 
                      title="Clear"
                    >
                      <span className="material-symbols-outlined text-[20px]">restart_alt</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="relative mb-8 flex items-center justify-center">
                <div aria-hidden="true" className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-secondary/20"></div>
                </div>
                <div className="relative z-10 bg-surface px-4">
                  <button
                    onClick={generateSQL}
                    disabled={isLoading}
                    className="group flex min-w-[180px] cursor-pointer items-center justify-center gap-2 rounded-full bg-primary py-3 px-8 text-base font-bold text-black shadow-lg shadow-primary/30 transition-all hover:bg-[#51b34b] hover:shadow-primary/40 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>Generate SQL</span>
                    )}
                  </button>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-xl bg-[#1e1e1e] shadow-inner border border-secondary/20">
                <div className="flex items-center justify-between border-b border-secondary/20 bg-surface-highlight px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">code</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-secondary">Generated Code</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 rounded-md bg-secondary/10 border border-secondary/20 px-3 py-1.5 text-xs font-medium text-primary hover:bg-secondary/20 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {isCopied ? 'check' : 'content_copy'}
                      </span>
                      {isCopied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
                <div className="relative min-h-[200px] w-full bg-[#1e1e1e]">
                  {output ? (
                    <SyntaxHighlighter 
                      language="sql" 
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        padding: '1.5rem',
                        background: 'transparent',
                        fontSize: '0.875rem',
                        lineHeight: '1.5',
                        minHeight: '200px'
                      }}
                      showLineNumbers={true}
                      lineNumberStyle={{ minWidth: '2.5em', paddingRight: '1em', color: '#666', textAlign: 'right' }}
                    >
                      {output}
                    </SyntaxHighlighter>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-secondary/40 select-none pointer-events-none">
                      <span className="text-sm">Output will be generated here...</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 px-4 text-center">
                <p className="text-sm text-secondary">
                  This is a demo application made for educational purposes. We are not viable for any bad things that might happen to your database if the AI(Qwen) messes up. Also please don't use this tool to cheat in exams(wink wink).
                </p>
              </div>

            </div>
          </div>
        </main>

        <footer className="mt-auto border-t border-secondary/20 bg-black py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">

            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}