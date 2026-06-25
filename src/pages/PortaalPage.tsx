import { useEffect, useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, Motor } from '../lib/supabase';

type MotorFormData = Omit<Motor, 'id' | 'created_at'>;

const leegFormulier: MotorFormData = {
  merk: '',
  type: '',
  bouwjaar: new Date().getFullYear(),
  km: 0,
  prijs: 0,
  kleur: '',
  beschrijving: '',
  foto_url: null,
  beschikbaar: true,
};

export function PortaalPage() {
  const navigate = useNavigate();
  const [motoren, setMotoren] = useState<Motor[]>([]);
  const [loading, setLoading] = useState(true);
  const [toonFormulier, setToonFormulier] = useState(false);
  const [bewerkId, setBewerkId] = useState<string | null>(null);
  const [formulier, setFormulier] = useState<MotorFormData>(leegFormulier);
  const [uploading, setUploading] = useState(false);
  const [opslaan, setOpslaan] = useState(false);
  const [fout, setFout] = useState<string | null>(null);

  useEffect(() => {
    controleerSessie();
  }, []);

  async function controleerSessie() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/portaal/login');
      return;
    }
    laadMotoren();
  }

  async function laadMotoren() {
    setLoading(true);
    const { data } = await supabase
      .from('motoren')
      .select('*')
      .order('created_at', { ascending: false });
    setMotoren(data ?? []);
    setLoading(false);
  }

  async function uitloggen() {
    await supabase.auth.signOut();
    navigate('/portaal/login');
  }

  function openNieuw() {
    setFormulier(leegFormulier);
    setBewerkId(null);
    setFout(null);
    setToonFormulier(true);
  }

  function openBewerk(motor: Motor) {
    const { id, created_at, ...rest } = motor;
    setFormulier(rest);
    setBewerkId(id);
    setFout(null);
    setToonFormulier(true);
  }

  function sluitFormulier() {
    setToonFormulier(false);
    setBewerkId(null);
    setFormulier(leegFormulier);
    setFout(null);
  }

  async function uploadFoto(bestand: File): Promise<string | null> {
    setUploading(true);
    const bestandsnaam = `${Date.now()}-${bestand.name.replace(/\s/g, '_')}`;
    const { error } = await supabase.storage
      .from('motoren-fotos')
      .upload(bestandsnaam, bestand, { upsert: false });

    if (error) {
      setFout('Foto uploaden mislukt: ' + error.message);
      setUploading(false);
      return null;
    }

    const { data } = supabase.storage.from('motoren-fotos').getPublicUrl(bestandsnaam);
    setUploading(false);
    return data.publicUrl;
  }

  async function handleFotoWijziging(e: React.ChangeEvent<HTMLInputElement>) {
    const bestand = e.target.files?.[0];
    if (!bestand) return;
    const url = await uploadFoto(bestand);
    if (url) setFormulier((f) => ({ ...f, foto_url: url }));
  }

  async function handleOpslaan(e: FormEvent) {
    e.preventDefault();
    setFout(null);
    setOpslaan(true);

    const payload = {
      ...formulier,
      bouwjaar: Number(formulier.bouwjaar),
      km: Number(formulier.km),
      prijs: Number(formulier.prijs),
    };

    if (bewerkId) {
      const { error } = await supabase.from('motoren').update(payload).eq('id', bewerkId);
      if (error) { setFout(error.message); setOpslaan(false); return; }
    } else {
      const { error } = await supabase.from('motoren').insert(payload);
      if (error) { setFout(error.message); setOpslaan(false); return; }
    }

    setOpslaan(false);
    sluitFormulier();
    laadMotoren();
  }

  async function handleVerwijder(id: string, merk: string, type: string) {
    if (!confirm(`Weet u zeker dat u "${merk} ${type}" wilt verwijderen?`)) return;
    await supabase.from('motoren').delete().eq('id', id);
    laadMotoren();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <a href="/">
              <img src="/images/logo.jpg" alt="Van Dinteren logo" className="h-10 w-auto" />
            </a>
            <span className="hidden text-sm font-medium text-slate-500 sm:block">Medewerkerportaal</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={openNieuw}
              className="inline-flex items-center gap-2 rounded-lg bg-[#41508C] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#41508C]/90"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Motor toevoegen
            </button>
            <button
              onClick={uitloggen}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Uitloggen
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[#41508C]">Motorenbeheer</h1>
          <p className="mt-1 text-sm text-slate-500">Voeg motoren toe, bewerk of verwijder ze uit de voorraad.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#41508C]" />
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            {motoren.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <p className="font-medium">Nog geen motoren toegevoegd.</p>
                <button onClick={openNieuw} className="mt-4 text-sm text-[#41508C] hover:underline">
                  Voeg uw eerste motor toe
                </button>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Motor</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Jaar</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">KM</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Prijs</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Acties</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {motoren.map((motor) => (
                    <tr key={motor.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {motor.foto_url ? (
                            <img src={motor.foto_url} alt="" className="h-12 w-16 rounded object-cover" />
                          ) : (
                            <div className="flex h-12 w-16 items-center justify-center rounded bg-slate-100 text-slate-300">
                              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                              </svg>
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-slate-900">{motor.merk} {motor.type}</p>
                            <p className="text-xs text-slate-500">{motor.kleur}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">{motor.bouwjaar}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">{motor.km.toLocaleString('nl-NL')}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">€ {motor.prijs.toLocaleString('nl-NL')}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${motor.beschikbaar ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                          {motor.beschikbaar ? 'Beschikbaar' : 'Niet beschikbaar'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openBewerk(motor)}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-[#41508C] hover:text-[#41508C]"
                          >
                            Bewerken
                          </button>
                          <button
                            onClick={() => handleVerwijder(motor.id, motor.merk, motor.type)}
                            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                          >
                            Verwijderen
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>

      {toonFormulier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-[#41508C]">
                {bewerkId ? 'Motor bewerken' : 'Nieuwe motor toevoegen'}
              </h2>
              <button onClick={sluitFormulier} className="text-slate-400 hover:text-slate-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleOpslaan} className="space-y-5 px-6 py-6">
              {fout && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{fout}</div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Merk</label>
                  <input
                    required
                    value={formulier.merk}
                    onChange={(e) => setFormulier((f) => ({ ...f, merk: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-[#41508C]"
                    placeholder="Kawasaki"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Type</label>
                  <input
                    required
                    value={formulier.type}
                    onChange={(e) => setFormulier((f) => ({ ...f, type: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-[#41508C]"
                    placeholder="Z900 SE"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Bouwjaar</label>
                  <input
                    required
                    type="number"
                    min={1950}
                    max={new Date().getFullYear() + 1}
                    value={formulier.bouwjaar}
                    onChange={(e) => setFormulier((f) => ({ ...f, bouwjaar: Number(e.target.value) }))}
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-[#41508C]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Kilometerstand</label>
                  <input
                    required
                    type="number"
                    min={0}
                    value={formulier.km}
                    onChange={(e) => setFormulier((f) => ({ ...f, km: Number(e.target.value) }))}
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-[#41508C]"
                    placeholder="15000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Prijs (€)</label>
                  <input
                    required
                    type="number"
                    min={0}
                    value={formulier.prijs}
                    onChange={(e) => setFormulier((f) => ({ ...f, prijs: Number(e.target.value) }))}
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-[#41508C]"
                    placeholder="7990"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Kleur</label>
                  <input
                    required
                    value={formulier.kleur}
                    onChange={(e) => setFormulier((f) => ({ ...f, kleur: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-[#41508C]"
                    placeholder="Zwart/Groen"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Beschrijving</label>
                <textarea
                  rows={3}
                  value={formulier.beschrijving}
                  onChange={(e) => setFormulier((f) => ({ ...f, beschrijving: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-[#41508C]"
                  placeholder="Merk: Kawasaki · Type: Z900SE · Bouwjaar: 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Foto uploaden</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFotoWijziging}
                  disabled={uploading}
                  className="mt-1 w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-[#41508C]/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-[#41508C] hover:file:bg-[#41508C]/20"
                />
                {uploading && <p className="mt-1 text-xs text-slate-500">Foto uploaden…</p>}
                {formulier.foto_url && (
                  <img src={formulier.foto_url} alt="Voorvertoning" className="mt-3 h-32 w-full rounded-lg object-cover" />
                )}
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="beschikbaar"
                  checked={formulier.beschikbaar}
                  onChange={(e) => setFormulier((f) => ({ ...f, beschikbaar: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-[#41508C] focus:ring-[#41508C]"
                />
                <label htmlFor="beschikbaar" className="text-sm font-medium text-slate-700">
                  Beschikbaar in voorraad
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={opslaan || uploading}
                  className="flex-1 rounded-lg bg-[#41508C] py-3 text-sm font-semibold text-white transition hover:bg-[#41508C]/90 disabled:opacity-60"
                >
                  {opslaan ? 'Opslaan…' : bewerkId ? 'Wijzigingen opslaan' : 'Motor toevoegen'}
                </button>
                <button
                  type="button"
                  onClick={sluitFormulier}
                  className="rounded-lg border border-slate-200 px-6 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  Annuleren
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
