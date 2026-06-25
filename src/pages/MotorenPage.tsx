import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, Motor } from '../lib/supabase';

const getImageSrc = (url: string | null) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `/images/${url.replace(/^\//, '')}`;
};

export function MotorenPage() {
  const [motoren, setMotoren] = useState<Motor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function laadMotoren() {
      const { data, error } = await supabase
        .from('motoren')
        .select('*')
        .eq('beschikbaar', true)
        .order('created_at', { ascending: false });

      if (error) {
        setError('Kon de motoren niet laden. Probeer het later opnieuw.');
      } else {
        setMotoren(data ?? []);
      }
      setLoading(false);
    }
    laadMotoren();
  }, []);

  return (
    <main>
      <section className="border-t border-slate-200 bg-slate-50 py-16 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Voorraad</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#41508C] sm:text-4xl">
              Beschikbare motoren in onze showroom
            </h2>
            <p className="mt-4 max-w-2xl text-base text-slate-600">
              Bekijk onze actuele voorraad met technische details en prijzen. Neem contact op voor een proefrit of afspraak.
            </p>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-24">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#41508C]" />
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && motoren.length === 0 && (
            <div className="rounded-lg border border-slate-200 bg-white p-12 text-center text-slate-500">
              <p className="text-lg font-medium">Momenteel geen motoren beschikbaar.</p>
              <p className="mt-2 text-sm">Neem contact met ons op voor meer informatie over ons aanbod.</p>
            </div>
          )}

          {!loading && !error && motoren.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {motoren.map((motor) => (
                <article
                  key={motor.id}
                  className="flex h-full flex-col bg-white rounded-lg hover:bg-gray-100 transition border border-gray-200"
                >
                  {motor.foto_url ? (
                    <div className="overflow-hidden rounded-t-lg bg-slate-100">
                      <img
                        src={getImageSrc(motor.foto_url) ?? ''}
                        alt={`${motor.merk} ${motor.type}`}
                        className="h-60 w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-60 items-center justify-center rounded-t-lg bg-slate-100 text-slate-400">
                      <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="flex flex-col flex-1 p-6">
                    <div className="mb-4 text-sm uppercase tracking-[0.25em] text-[#41508C]">Motor</div>
                    <h3 className="text-2xl font-semibold text-[#41508C]">
                      {motor.merk} {motor.type} [{motor.bouwjaar}]
                    </h3>
                    <p className="mt-3 text-slate-600">{motor.beschrijving}</p>
                    <p className="mt-2 text-slate-500">{motor.km.toLocaleString('nl-NL')} km · {motor.kleur}</p>
                    <div className="mt-auto flex items-center justify-between gap-4 pt-4 text-slate-950">
                      <span className="text-xl font-semibold">
                        € {motor.prijs.toLocaleString('nl-NL')}
                      </span>
                      <a
                        href="/#contact"
                        className="rounded-full border border-brand-accent px-4 py-2 text-sm uppercase tracking-[0.2em] text-brand-accent transition hover:bg-brand-accent/10"
                      >
                        Meer info
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              to="/#contact"
              className="inline-flex items-center gap-2 rounded-full bg-brand-accent px-8 py-3 text-sm font-semibold text-white transition hover:bg-brand-accent/90"
            >
              Neem contact op voor een proefrit
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
