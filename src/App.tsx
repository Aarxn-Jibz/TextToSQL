import { useState } from 'react';

export default function App() {
  const [output, setOutput] = useState("");
  const [prompt, setPrompt] = useState("");

  const generateSQL = async () => {
    if (!prompt) return;
    
    setOutput("Generating..."); 

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

      let sqlText = data.message || "";
      
      sqlText = sqlText.replace(/^SQL:\s*/, '');
      
      setOutput(sqlText || JSON.stringify(data, null, 2));
      
    } catch (error) {
      console.error("API Error details:", error);
      setOutput(`Error: ${error.message}. Check console (F12) for details.`);
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
                    className="group flex min-w-[180px] cursor-pointer items-center justify-center gap-2 rounded-full bg-primary py-3 px-8 text-base font-bold text-black shadow-lg shadow-primary/30 transition-all hover:bg-[#51b34b] hover:shadow-primary/40 hover:-translate-y-0.5"
                  >
                    <span>Generate SQL</span>
                  </button>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-xl bg-code-bg shadow-inner border border-secondary/20">
                <div className="flex items-center justify-between border-b border-secondary/20 bg-surface-highlight px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">code</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-secondary">Generated Code</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1.5 rounded-md bg-secondary/10 border border-secondary/20 px-3 py-1.5 text-xs font-medium text-primary hover:bg-secondary/20 transition-colors">
                      <span className="material-symbols-outlined text-[16px]">content_copy</span>
                      Copy
                    </button>
                  </div>
                </div>
                <div className="relative min-h-[200px] w-full p-0">
                  <div className="font-nerd absolute left-0 top-0 bottom-0 w-12 bg-code-bg border-r border-secondary/10 py-6 text-right pr-3 text-xs text-secondary/50 select-none">
                    1<br />2<br />3
                  </div>
                  <textarea
                    className="font-nerd h-full w-full min-h-[200px] resize-none bg-code-bg pl-16 pr-6 py-6 text-sm text-primary focus:outline-none selection:bg-primary/20 placeholder:text-secondary/40"
                    readOnly
                    value={output}
                    placeholder="Output will be generated here..."
                  ></textarea>
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