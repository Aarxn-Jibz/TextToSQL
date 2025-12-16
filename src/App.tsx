import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function App() {
  const [output, setOutput] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const examplePrompts = [
    "Find users who joined last month",
    "Calculate total revenue by product category",
    "Show active customers with orders > $1000",
    "List employees sorted by hire date"
  ];

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
          <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <span className="material-symbols-outlined">database</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Text2SQL</span>
            </div>
            <div className="hidden md:block"></div>
          </div>
        </header>

        <main className="flex-1 w-full">
          <div className="mx-auto max-w-[1400px] px-6 py-8 md:py-12 h-full flex flex-col">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-3xl font-black leading-tight tracking-tight text-white md:text-4xl">
                Plain Text to <span className="text-primary">SQL</span>
              </h1>
              <p className="mx-auto max-w-2xl text-base text-secondary">
                Describe your data needs in English, get optimized SQL instantly.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-stretch">
              
              <div className="flex-1 flex flex-col gap-4">
                <div className="bg-surface border border-secondary/20 rounded-xl p-1 shadow-xl flex-1 flex flex-col">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-secondary/10">
                    <span className="material-symbols-outlined text-secondary text-[20px]">edit_note</span>
                    <span className="text-sm font-bold text-secondary">Input Query</span>
                  </div>
                  
                  <div className="relative flex-1 group">
                    <textarea
                      className="font-nerd w-full h-full min-h-[300px] resize-none bg-transparent p-6 text-base text-primary placeholder:text-secondary/40 focus:outline-none"
                      id="prompt-input"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g., Find all users who signed up last month..."
                    ></textarea>
                    
                    {prompt && (
                      <button 
                        onClick={() => setPrompt("")}
                        className="absolute top-4 right-4 rounded-lg p-2 text-secondary hover:bg-white/5 hover:text-primary transition-colors" 
                        title="Clear"
                      >
                        <span className="material-symbols-outlined text-[20px]">restart_alt</span>
                      </button>
                    )}
                  </div>

                  <div className="p-4 border-t border-secondary/10 bg-surface-highlight/30 rounded-b-xl">
                    <button
                      onClick={generateSQL}
                      disabled={isLoading}
                      className="w-full group flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-3 px-8 text-sm font-bold text-black shadow-lg shadow-primary/20 transition-all hover:bg-[#51b34b] hover:shadow-primary/30 active:translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
              </div>

              <div className="flex-1 flex flex-col">
                <div className="bg-[#1e1e1e] border border-secondary/20 rounded-xl shadow-xl flex flex-col h-full min-h-[400px] overflow-hidden">
                  <div className="flex items-center justify-between border-b border-secondary/20 bg-surface-highlight px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[18px]">code</span>
                      <span className="text-xs font-bold uppercase tracking-wider text-secondary">Generated SQL</span>
                    </div>
                    <button 
                      onClick={handleCopy}
                      disabled={!output}
                      className="flex items-center gap-1.5 rounded-md bg-secondary/10 border border-secondary/20 px-3 py-1.5 text-xs font-medium text-primary hover:bg-secondary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {isCopied ? 'check' : 'content_copy'}
                      </span>
                      {isCopied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>

                  <div className="relative flex-1 bg-[#1e1e1e]">
                    {output ? (
                      <SyntaxHighlighter 
                        language="sql" 
                        style={vscDarkPlus}
                        customStyle={{
                          margin: 0,
                          padding: '1.5rem',
                          background: 'transparent',
                          fontSize: '0.9rem',
                          lineHeight: '1.6',
                          height: '100%'
                        }}
                        showLineNumbers={true}
                        lineNumberStyle={{ minWidth: '2.5em', paddingRight: '1em', color: '#666', textAlign: 'right' }}
                      >
                        {output}
                      </SyntaxHighlighter>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                         {isLoading ? (
                            <div className="flex flex-col items-center gap-4">
                               <div className="h-2 w-48 bg-secondary/20 rounded animate-pulse"></div>
                               <div className="h-2 w-32 bg-secondary/20 rounded animate-pulse"></div>
                               <div className="h-2 w-64 bg-secondary/20 rounded animate-pulse"></div>
                            </div>
                         ) : (
                           <>
                              <p className="text-secondary/50 text-sm mb-6">Select an example to get started:</p>
                              <div className="flex flex-wrap justify-center gap-3 max-w-md">
                                {examplePrompts.map((ex, i) => (
                                  <button
                                    key={i}
                                    onClick={() => setPrompt(ex)}
                                    className="text-xs text-secondary border border-secondary/20 bg-white/5 rounded-full px-4 py-2 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-200"
                                  >
                                    {ex}
                                  </button>
                                ))}
                              </div>
                           </>
                         )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>

            <div className="mt-8 px-4 text-center">
              <p className="text-xs text-secondary/40">
                Educational demo. Not responsible for database issues. Do not use for exams.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}