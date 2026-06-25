import { contact, openingHours } from '../data';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faLocationDot } from '@fortawesome/free-solid-svg-icons';

export function ContactPage() {
  const phone1Href = `tel:${contact.phone1.replace(/[^+\d]/g, '')}`;
  const phone2Href = `tel:${contact.phone2.replace(/[^+\d]/g, '')}`;
  const emailHref = `mailto:${contact.email}`;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`;
  const mapsAddressEmbed = encodeURIComponent(contact.address.replace(/,\s*/g, ' '));
  const mapsEmbedUrl = `https://maps.google.com/maps?output=embed&q=${mapsAddressEmbed}&t=&z=15&ie=UTF8&iwloc=`;

  return (
    <main id="contact" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <section>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div data-reveal>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Contact</p>
            <h2 className="mt-4 text-4xl font-semibold sm:text-5xl text-[#41508C]">Neem contact op met Bike Center Van Dinteren</h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Voor onderhoud, aankoop of vragen over onze voorraad kunt u ons bellen, mailen of het contactformulier gebruiken.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-1">
              <div className="">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Bereikbaarheid</p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#41508C] text-white">
                    <FontAwesomeIcon icon={faPhone} className="h-6 w-6" />
                  </div>
                  <p className="text-slate-600">
                    <a href={phone1Href} className="font-medium text-[#41508C] hover:underline">{contact.phone1}</a> of{' '}
                    <a href={phone2Href} className="font-medium text-[#41508C] hover:underline">{contact.phone2}</a>
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#41508C] text-white">
                    <FontAwesomeIcon icon={faEnvelope} className="h-6 w-6" />
                  </div>
                  <p className="text-slate-600">
                    <a href={emailHref} className="font-medium text-[#41508C] hover:underline">{contact.email}</a>
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#41508C] text-white">
                    <FontAwesomeIcon icon={faLocationDot} className="h-6 w-6" />
                  </div>
                  <p className="text-slate-600">
                    <a href={mapsHref} target="_blank" rel="noreferrer" className="font-medium text-[#41508C] hover:underline">
                      {contact.address}
                    </a>
                  </p>
                </div>

                <div className="bg-white mt-8 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition">
                  <iframe
                    title="Google Maps locatie Bike Center Van Dinteren"
                    src={mapsEmbedUrl}
                    className="h-56 w-full border-0"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>

          <form data-reveal data-delay="2" className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700">Naam</label>
                <input className="w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition" placeholder="Uw Naam" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">E-mail</label>
                <input className="w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition" placeholder="uw@e-mail.nl" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Telefoon</label>
                <input className="w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition" placeholder="06-12345678" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Bericht</label>
                <textarea rows={5} className="w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition" placeholder="Stel hier uw vraag of schrijf een bericht" />
              </div>
              <button className="inline-flex w-full items-center justify-center rounded-lg bg-brand-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-accent/90">
                Verstuur bericht
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-2">
        {openingHours.map((period, i) => (
          <div key={period.period} data-reveal data-delay={String(i + 1)} className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition">
            <h3 className="text-xl font-semibold text-slate-950">{period.period}</h3>
            <ul className="mt-5 space-y-3 text-slate-600">
              {period.details.map((line) => (
                <li key={line} className="leading-7">{line}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </main>
  );
}
