import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { login, setAuth } from "../api";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await login({ email: email.trim(), password });
      setAuth(res.token, res.user);
      navigate(res.user?.role === "admin" ? "/admin" : "/menu");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#e7f7f6] px-6 py-10 font-sans text-[#10291d]">
      <section className="w-full max-w-[560px] rounded-[2rem] bg-white px-8 py-10 shadow-2xl shadow-slate-900/10 md:px-10">
        <div className="mb-10 text-center">
          <img
            src="/Logo.png"
            alt="Fresh&Fit logo"
            className="mx-auto mb-6 h-16 w-16 object-contain"
          />

          <h1 className="text-3xl font-black tracking-[-0.03em]">
            Welcome Back!
          </h1>

          <p className="mt-3 text-lg text-slate-500">
            Log in to access your personalized meals.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <InputField
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            icon={<Mail size={21} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <InputField
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            icon={<Lock size={21} />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 transition hover:text-emerald-600"
              >
                {showPassword ? <EyeOff size={21} /> : <Eye size={21} />}
              </button>
            }
          />

          {error && (
            <p className="rounded-2xl bg-red-50 px-5 py-4 text-center font-bold text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-400 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-600/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-400/30 active:scale-95 disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {submitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-lg">
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-slate-500 transition hover:text-emerald-600"
          >
            Forgot Password?
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="font-semibold text-emerald-600 transition hover:text-emerald-700"
          >
            Create Account
          </button>
        </div>

        <p className="mt-9 text-center text-lg text-slate-500">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className=" mt-13 font-bold text-emerald-600 transition hover:text-emerald-700"
          >
            Sign Up Free
          </button>
        </p>
      </section>
    </main>
  );
}

function InputField({ label, type, placeholder, icon, rightIcon, value, onChange }) {
  return (
    <label className="block text-left">
      <span className="mb-2 block text-lg font-semibold text-slate-700">
        {label}
      </span>

      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-400 transition-all duration-300 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10">
        {icon}
        <input
          type={type}
          placeholder={placeholder}
          required
          value={value}
          onChange={onChange}
          className="w-full bg-transparent text-lg text-slate-700 outline-none placeholder:text-slate-400"
        />
        {rightIcon}
      </div>
    </label>
  );
}
