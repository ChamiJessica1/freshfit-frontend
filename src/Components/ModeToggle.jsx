import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button
      onClick={() => setDark((prev) => !prev)}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle dark mode"
      className="fixed bottom-6 right-6 z-[100] flex h-12 w-12 items-center justify-center rounded-full bg-white text-emerald-600 shadow-lg ring-1 ring-slate-200 transition hover:scale-110 hover:bg-emerald-50 dark:bg-[#14201a] dark:text-emerald-400 dark:ring-white/10 dark:hover:bg-[#1a2620]"
    >
      {dark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
