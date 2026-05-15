import { useState } from "react";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setSubmitting(true);

    try {
      const res = await forgotPassword(email.trim());
      if (res.resetToken) {
        navigate(`/reset-password?token=${encodeURIComponent(res.resetToken)}`);
      } else {
        setInfo(
          res.message || "If the email exists, a reset link has been sent."
        );
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
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
            Forgot Password?
          </h1>

          <p className="mt-3 text-lg text-slate-500">
            Enter your email and we'll get you back into your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block text-left">
            <span className="mb-2 block text-lg font-semibold text-slate-700">
              Email Address
            </span>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-400 transition-all duration-300 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10">
              <Mail size={21} />
              <input
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-lg text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>
          </label>

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
            disabled={submitting}
            className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-400 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-600/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-400/30 active:scale-95 disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {submitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="mt-9 text-center text-lg text-slate-500">
          Remembered it?{" "}
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
