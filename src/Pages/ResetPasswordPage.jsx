import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../api";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!token) {
      setError("Missing reset token. Request a new reset link.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword(token, password);
      setInfo("Password reset successfully. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err.message || "Failed to reset password");
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
            Set a New Password
          </h1>

          <p className="mt-3 text-lg text-slate-500">
            Choose a strong password with upper and lower case letters.
          </p>
        </div>

        {!token && (
          <p className="mb-6 rounded-2xl bg-red-50 px-5 py-4 text-center font-bold text-red-500">
            Missing reset token. Use the link from the forgot-password page.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <PasswordField
            label="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            show={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
          />

          <PasswordField
            label="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            show={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
          />

          {error && (
            <p className="rounded-2xl bg-red-50 px-5 py-4 text-center font-bold text-red-500">
              {error}
            </p>
          )}

          {info && (
            <p className="rounded-2xl bg-emerald-50 px-5 py-4 text-center font-semibold text-emerald-600">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !token}
            className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-400 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-600/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-400/30 active:scale-95 disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {submitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="mt-9 text-center text-lg text-slate-500">
          <button
            onClick={() => navigate("/login")}
            className="font-bold text-emerald-600 transition hover:text-emerald-700"
          >
            Back to Login
          </button>
        </p>
      </section>
    </main>
  );
}

function PasswordField({ label, value, onChange, show, onToggle }) {
  return (
    <label className="block text-left">
      <span className="mb-2 block text-lg font-semibold text-slate-700">
        {label}
      </span>

      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-400 transition-all duration-300 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10">
        <Lock size={21} />
        <input
          type={show ? "text" : "password"}
          placeholder="••••••••"
          required
          value={value}
          onChange={onChange}
          className="w-full bg-transparent text-lg text-slate-700 outline-none placeholder:text-slate-400"
        />
        <button
          type="button"
          onClick={onToggle}
          className="text-slate-400 transition hover:text-emerald-600"
        >
          {show ? <EyeOff size={21} /> : <Eye size={21} />}
        </button>
      </div>
    </label>
  );
}
