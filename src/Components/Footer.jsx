import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#123423] px-6 py-14 text-slate-300 md:px-10">
      <div className="mx-auto grid max-w-[1200px] gap-12 text-center md:grid-cols-3 md:text-left">
        <FooterColumn
          title="Company"
          links={[
            { label: "About Us", path: "/about" },
            { label: "Our Chefs", path: "/chefs" },
          ]}
          navigate={navigate}
        />

        <FooterColumn
          title="Services"
          links={[
            { label: "Meal Plans", path: "/meal-plans" },
            { label: "Event Catering", path: "/catering" },
            { label: "Corporate Meals", path: "/corporate" },
          ]}
          navigate={navigate}
        />

        <div>
          <h3 className="mb-5 text-xl font-bold text-cyan-400">Contact</h3>
          <p className="text-lg transition duration-300 hover:text-white">
            FreshandFit@gmail.com
          </p>
        </div>
      </div>
      <div className="mt-12 border-t border-white/10 py-8 text-center text-base font-medium text-slate-500">
                 © 2026 Fresh&Fit. All rights reserved.
      </div>
    </footer>
  );
}

function FooterColumn({ title, links, navigate }) {
  return (
    <div>
      <h3 className="mb-5 text-xl font-bold text-cyan-400">{title}</h3>

      <div className="space-y-3">
        {links.map((link) => (
          <button
            key={link.label}
            onClick={() => navigate(link.path)}
            className="block w-full text-lg transition duration-300 hover:text-white md:text-left"
          >
            {link.label}
          </button>
        ))}
      </div>
    </div>
  );
}