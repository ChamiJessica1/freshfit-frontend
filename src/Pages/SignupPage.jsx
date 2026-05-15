import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { register, login, setAuth } from "../api";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await register({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      });

      // Auto-login so the next page (preferences) has a token
      const res = await login({ email: email.trim(), password });
      setAuth(res.token, res.user);

      navigate("/preferences");
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#e7f7f6] px-6 py-10 font-sans text-[#10291d] antialiased">
      <section className="w-full max-w-[560px] rounded-[2rem] bg-white px-8 py-10 shadow-2xl shadow-slate-900/10 md:px-10">
        <div className="mb-8 text-center">
          <img
            src="/Logo.png"
            alt="Fresh&Fit logo"
            className="mx-auto mb-6 h-16 w-16 object-contain"
          />

          <h1 className="text-3xl font-black tracking-[-0.03em] text-[#10291d] md:text-4xl">
            Create Your Account
          </h1>
          <p className="mt-3 text-lg text-slate-500">
            Join Fresh&Fit and start your healthy journey today.
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <InputField
            label="Full Name"
            type="text"
            placeholder="Your full name"
            icon={<User size={21} />}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <InputField
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            icon={<Mail size={21} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <InputField
            label="Phone Number"
            type="tel"
            placeholder="+961 00 000 000"
            icon={<Phone size={21} />}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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

          <InputField
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            icon={<Lock size={21} />}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error && (
            <p className="rounded-2xl bg-red-50 px-5 py-4 text-center font-bold text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="group mt-3 w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-400 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-600/20 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-2xl hover:shadow-cyan-400/30 active:scale-95 disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {submitting ? "Creating account..." : "Create Account"}
            <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </button>
        </form>

        <p className="mt-8 text-center text-lg text-slate-500">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-bold text-emerald-600 transition hover:text-emerald-700"
          >
            Log In
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

      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-400 transition-all duration-300 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 hover:border-slate-300">
        {icon}
        <input
          required
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent text-lg text-slate-700 outline-none placeholder:text-slate-400"
        />
        {rightIcon}
      </div>
    </label>
  );
}
