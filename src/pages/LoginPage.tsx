import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [wachtwoord, setWachtwoord] = useState('');
  const [fout, setFout] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setFout(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password: wachtwoord });

    if (error) {
      setFout('Onjuiste inloggegevens. Probeer het opnieuw.');
    } else {
      navigate('/portaal');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img src="/images/logo.jpg" alt="Van Dinteren logo" className="mx-auto h-14 w-auto" />
          <h1 className="mt-6 text-2xl font-semibold text-[#41508C]">Medewerkerportaal</h1>
          <p className="mt-2 text-sm text-slate-500">Log in met uw werkaccount</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-lg shadow-lg border border-gray-200"
        >
          {fout && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {fout}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700">E-mailadres</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-lg text-slate-700 focus:ring-2 focus:ring-[#41508C] focus:border-transparent outline-none transition"
                placeholder="naam@vandinterenbikecenter.nl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Wachtwoord</label>
              <input
                type="password"
                required
                value={wachtwoord}
                onChange={(e) => setWachtwoord(e.target.value)}
                className="mt-1 w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-lg text-slate-700 focus:ring-2 focus:ring-[#41508C] focus:border-transparent outline-none transition"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-lg bg-[#41508C] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#41508C]/90 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Inloggen…' : 'Inloggen'}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          <a href="/" className="hover:text-[#41508C]">← Terug naar de website</a>
        </p>
      </div>
    </div>
  );
}
