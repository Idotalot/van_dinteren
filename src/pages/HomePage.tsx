import { clientLogos, features, heroImage, galleryImages, openingHours, contact, inventory } from '../data';
import { useEffect, useRef, useState } from 'react';
import TextSlider from '../utils/SlidingText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMotorcycle, faWrench, faShuttleVan } from '@fortawesome/free-solid-svg-icons';
const slideWords = ['motoren', 'scooters', 'onderhoud'];

const getGalleryImageSrc = (src: string) => {
  if (src.startsWith('/images/')) return src;
  return `/images/${src.replace(/^\//, '')}`;
};

const featureIcons: Record<string, any> = {
  motorcyclist: faMotorcycle,
  maintenance: faWrench,
  van: faShuttleVan,
};

export function HomePage() {
    const [activeWord, setActiveWord] = useState(0);
    const galleryTrackRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number>();
    const offsetRef = useRef(0);

    useEffect(() => {
        const interval = setInterval(() => {
        setActiveWord((current) => (current + 1) % slideWords.length);
        }, 2200);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const track = galleryTrackRef.current;
        if (!track) return;

        let lastTime = performance.now();
        const speed = 0.22; // pixels per millisecond

        const step = (time: number) => {
            const delta = time - lastTime;
            lastTime = time;
            const halfWidth = track.scrollWidth / 2;

            if (halfWidth > 0) {
                offsetRef.current = (offsetRef.current + speed * delta) % halfWidth;
                track.style.transform = `translateX(-${offsetRef.current}px)`;
            }

            animationRef.current = requestAnimationFrame(step);
        };

        animationRef.current = requestAnimationFrame(step);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    const texts = [
        "motoren",
        "scooters",
        "onderhoud",
        "motorkleding"
    ];

    const workshopImages = [
      'werkplaats/werkplaats1.jpg',
      'werkplaats/werkplaats2.jpg',
      'werkplaats/werkplaats3.jpg',
    ];
    const [workshopImageIndex, setWorkshopImageIndex] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setWorkshopImageIndex((current) => (current + 1) % workshopImages.length);
      }, 4000);

      return () => clearInterval(interval);
    }, [workshopImages.length]);

    const previousWorkshopImage = () => {
      setWorkshopImageIndex((current) => (current - 1 + workshopImages.length) % workshopImages.length);
    };

    const nextWorkshopImage = () => {
      setWorkshopImageIndex((current) => (current + 1) % workshopImages.length);
    };

    return (
        <main>
        <section id="home" className="relative -mt-40 pt-20 overflow-hidden bg-transparent text-slate-900">
            <div className="relative">
            <img src={getGalleryImageSrc(heroImage)} alt="Voorzijde Bike Center Van Dinteren" className="h-[72vh] w-full object-cover" />
            <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-white to-transparent" style={{ height: 'calc(var(--navbar-height) * 2)' }} />
            <div className="absolute inset-0 flex items-center justify-center px-4">
                <div className="flex flex-col items-center gap-4 sm:flex-row">
                <a className="inline-flex min-w-[220px] items-center justify-center rounded-lg bg-brand-accent px-8 py-4 text-base font-semibold text-white transition hover:bg-brand-accent/90" href="#contact">
                    Neem contact op
                </a>
                <a className="inline-flex min-w-[220px] items-center justify-center rounded-lg border border-brand-accent bg-white px-8 py-4 text-base font-semibold text-brand-accent transition hover:bg-white/90" href="#inventory">
                    Bekijk voorraad
                </a>
                </div>
            </div>
            </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className='flex flex-col md:flex-row md:gap-2 md:items-center text-[#41508C] font-semibold'>
                <p className='text-5xl'>Uw specialist in</p>
                <div className='overflow-hidden h-10 text-3xl'>
                    <TextSlider texts={texts} interval={2000} />
                </div>
            </div>
            <p className="mt-2 mb-12 max-w-3xl text-base text-slate-600">
                Bike Center Van Dinteren helpt u graag met deskundig onderhoud, aantrekkelijke motoren en een persoonlijke service met haal/breng service.
            </p>
            <div className="grid gap-8 lg:grid-cols-3">
            {features.map((feature) => (
                <article key={feature.title} className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition">
                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#41508C] text-white">
                        <FontAwesomeIcon icon={featureIcons[feature.icon]} className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#41508C]">{feature.title}</h3>
                    <p className="mt-3 leading-7">{feature.description}</p>
                </article>
            ))}
            </div>
        </section>
        <section id="inventory" className="border-t border-slate-200 bg-slate-50 py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Nieuwe motoren</p>
                <h2 className="mt-3 text-3xl font-semibold text-[#41508C] sm:text-4xl">Rijd vandaag nog weg met een nieuwe droommotor</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {inventory.map((item) => (
                <article key={item.title} className="flex h-full flex-col bg-white rounded-lg hover:bg-gray-100 transition border border-gray-200">
                    {item.image ? (
                    <div className="overflow-hidden rounded-t-lg bg-slate-100">
                        <img src={getGalleryImageSrc(item.image)} alt={item.title} className="h-60 w-full object-cover" />
                    </div>
                    ) : null}
                    <div className="flex flex-col flex-1 p-6">
                        <div className="mb-4 text-sm uppercase tracking-[0.25em] text-[#41508C]">Motor</div>
                        <h3 className="text-2xl font-semibold text-[#41508C]">{item.title}</h3>
                        <p className="mt-3 text-slate-600">{item.description}</p>
                        <p className="mt-2 text-slate-500">{item.specs}</p>
                        <div className="mt-auto flex items-center justify-between gap-4 text-slate-950">
                            <span className="text-xl font-semibold">{item.price}</span>
                            <a className="rounded-full border border-brand-accent px-4 py-2 text-sm uppercase tracking-[0.2em] text-brand-accent transition hover:bg-brand-accent/10 hover:text-brand-accent" href={item.link}>
                                Meer info
                            </a>
                        </div>
                    </div>
                </article>
                ))}
            </div>
            <div className="mt-10 text-center">
                <a className="inline-flex w-full items-center justify-center rounded-lg bg-brand-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-accent/90" href="/motoren">
                    Bekijk alle motoren
                </a>
            </div>
            </div>
        </section>

        <section id="clothing" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 bg-white text-slate-950">
            <div className="mb-10 text-center">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Kleding</p>
                <h2 className="mt-3 text-3xl font-semibold text-[#41508C] sm:text-4xl">Motorkleding voor elk seizoen</h2>
                <p className="mt-4 mx-auto max-w-2xl text-base text-slate-600">
                    Wij hebben een selectie van helmen, jassen en handschoenen die comfort, veiligheid en stijl combineren.
                </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
                <article className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition">
                    <h3 className="text-xl font-semibold text-[#41508C]">Helmen</h3>
                    <p className="mt-3 text-slate-600">Veilige en comfortabele helmen van topmerken voor dagelijks gebruik en lange ritten.</p>
                </article>
                <article className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition">
                    <h3 className="text-xl font-semibold text-[#41508C]">Jassen</h3>
                    <p className="mt-3 text-slate-600">Lichtgewicht en waterdichte jassen met ventilatie en bescherming voor alle weersomstandigheden.</p>
                </article>
                <article className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition">
                    <h3 className="text-xl font-semibold text-[#41508C]">Handschoenen</h3>
                    <p className="mt-3 text-slate-600">Handschoenen met goede grip en comfort, geschikt voor straat- en sportgebruik.</p>
                </article>
            </div>
        </section>

        <section id="workshop" className="border-t border-slate-200 bg-slate-50 py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-start">
                    <div>
                      <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-sm">
                          <div className="relative h-[420px] w-full overflow-hidden">
                              {workshopImages.map((image, index) => (
                                <img
                                  key={image}
                                  src={getGalleryImageSrc(image)}
                                  alt={`Werkplaats van Bike Center Van Dinteren ${index + 1}`}
                                  className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-in-out ${index === workshopImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                                />
                              ))}
                          </div>
                      </div>
                      <div className="mt-4 flex justify-center gap-2">
                          {workshopImages.map((_, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => setWorkshopImageIndex(index)}
                              className={`h-3 w-3 rounded-full border border-slate-300 transition-all duration-300 ${index === workshopImageIndex ? 'bg-brand-accent' : 'bg-white/70 hover:bg-white'}`}
                              aria-label={`Ga naar afbeelding ${index + 1}`}
                            />
                          ))}
                      </div>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Werkplaats</p>
                            <h2 className="mt-3 text-3xl font-semibold text-[#41508C] sm:text-4xl">Onderhoud en reparatie met zekerheid</h2>
                            <p className="mt-3 text-slate-600">
                                Wij werken in een modern ingerichte werkplaats waar service en kwaliteit altijd voorop staan.
                            </p>
                        </div>
                        <div>
                            <p className="text-base text-slate-600">
                                Door onze jarenlange ervaring kunt u zowel met een motor op leeftijd als met een nieuwe motor bij ons terecht voor (onder andere):
                            </p>
                            <ul className="mt-4 list-disc space-y-1 pl-5 text-base text-slate-600">
                                <li>Periodiek onderhoud</li>
                                <li>Reparaties</li>
                                <li>Carburateurs ultrasoon reinigen</li>
                                <li>Afhandeling en reparaties van schade</li>
                                <li>Banden</li>
                                <li>Professioneel poetsen</li>
                                <li>Winterklaar maken</li>
                                <li>(winter) stalling</li>
                                <li>Customizen / verbouwen</li>
                            </ul>
                        </div>
                        <p className="text-base text-slate-600">
                            Voor als deze werkzaamheden kunt u ook gebruik maken van onze haal- en brengservice!
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <section id="about" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 bg-white text-slate-950">
            <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
            <div>
                <div className="mb-8">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Over ons</p>
                <h2 className="mt-3 text-3xl font-semibold text-[#41508C] sm:text-4xl">Uw partner voor motoronderhoud en accessoires</h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                    Bij Bike Center Van Dinteren vindt u een breed assortiment motoren, scooters, kleding en helmen. Wij verzorgen vakkundig onderhoud en bieden service met een persoonlijke benadering.
                </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                {openingHours.map((period) => (
                    <div key={period.period} className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition">
                    <h3 className="text-xl font-semibold text-[#41508C]">{period.period}</h3>
                    <ul className="mt-4 space-y-2 text-slate-600">
                        {period.details.map((line) => (
                        <li key={line}>{line}</li>
                        ))}
                    </ul>
                    </div>
                ))}
                </div>
            </div>

            <aside className="bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition">
                <div className="space-y-6">
                <div className="rounded-t-lg overflow-hidden bg-slate-100">
                    <img src="/images/joop.jpg" alt="Binnenkant Bike Center Van Dinteren" className="h-80 w-full object-cover" />
                </div>
                <div className="space-y-3 text-slate-950 px-4 pb-4">
                    <p className="text-sm uppercase tracking-[0.3em] text-brand-accent">Contact</p>
                    <p className="text-base leading-7">{contact.address}</p>
                    <p className="text-base leading-7">
                        <a className="text-brand-accent transition hover:text-blue-600" href={`mailto:${contact.email}`}>{contact.email}</a>
                    </p>
                    <p className="text-base leading-7">{contact.phone1}</p>
                    <p className="text-base leading-7">{contact.phone2}</p>
                </div>
                </div>
            </aside>
            </div>
        </section>

        <section className="relative overflow-hidden bg-slate-50 py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Galerij</p>
                <h2 className="mt-3 text-3xl font-semibold text-[#41508C] sm:text-4xl">Onze showroom en werkplaats</h2>
            </div>
            </div>
            <div className="relative w-full overflow-hidden">
                <div className="relative left-1/2 mx-[-50vw] w-screen overflow-hidden">
                    <div ref={galleryTrackRef} className="gallery-marquee">
                        {[...galleryImages, ...galleryImages].map((src, index) => (
                        <div key={`${src}-${index}`} className="w-[40rem] flex-none overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl shadow-slate-200/30 mr-6">
                            <img
                                src={getGalleryImageSrc(src)}
                                alt={`Showroom ${index + 1}`}
                                className="h-[32rem] w-full object-cover"
                            />
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
        </main>
    );
}
