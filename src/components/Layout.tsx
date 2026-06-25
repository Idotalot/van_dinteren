import { ReactNode, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { contact } from '../data';

type LayoutProps = {
  children: ReactNode;
};

const nav = [
  { label: 'Home', href: '/', key: 'home', isRoute: true },
  { label: 'Motoren', href: '/motoren', key: 'motoren', isRoute: true },
  { label: 'Kleding', href: '/#clothing', key: 'clothing', isRoute: false },
  { label: 'Werkplaats', href: '/#workshop', key: 'workshop', isRoute: false },
  { label: 'Over ons', href: '/#about', key: 'about', isRoute: false },
];

export function Layout({ children }: LayoutProps) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 0) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current + 10) {
        setIsVisible(false);
        setIsMenuOpen(false);
      } else if (currentScrollY < lastScrollY.current - 10) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-950" style={{ '--navbar-height': '72px' } as React.CSSProperties}>
      <header className={`sticky top-0 z-50 transform transition-transform duration-300 bg-white border-b border-slate-200 backdrop-blur ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        {/* Dekt het rubber-band gebied boven de navbar af op mobiel */}
        <div className="pointer-events-none absolute inset-x-0 bottom-full h-screen bg-white" />
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link to="/">
              <img src="/images/logo.jpg" alt="Van Dinteren logo" className="h-10 w-auto sm:h-12" />
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            {nav.map((item) => {
              const isActive = item.isRoute
                ? location.pathname === item.href
                : false;

              if (item.isRoute) {
                return (
                  <Link
                    key={item.key}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`transition text-brand-accent text-lg hover:font-bold transition-all ${isActive ? 'font-bold' : 'font-semibold'}`}
                  >
                    {item.label}
                  </Link>
                );
              }
              return (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="transition hover:text-brand-accent text-brand-accent font-semibold text-lg hover:font-bold transition:0.2s"
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          <div className="hidden md:flex md:items-center md:gap-4">
            <a href={`tel:${contact.phone1.replace(/[^+\d]/g, '')}`} className="text-sm font-semibold text-slate-700">
              {contact.phone1}
            </a>
            <a href="/#contact" className="inline-flex items-center rounded-full bg-brand-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-accent/90">
              Neem contact op
            </a>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center text-slate-700 transition md:hidden"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Sluit navigatiemenu' : 'Open navigatiemenu'}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span className="sr-only">{isMenuOpen ? 'Sluit navigatiemenu' : 'Open navigatiemenu'}</span>
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        <div className={`fixed inset-x-0 top-[72px] z-50 overflow-hidden border-t border-slate-200 bg-white px-4 transition-all duration-300 ease-in-out md:hidden ${isMenuOpen ? 'max-h-[calc(100vh-72px)] py-4 opacity-100 pointer-events-auto' : 'max-h-0 py-0 opacity-0 pointer-events-none'}`}>
          <div className="space-y-3">
            {nav.map((item) => {
              if (item.isRoute) {
                return (
                  <Link
                    key={item.key}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block rounded-xl px-3 py-3 text-base font-semibold text-slate-700 transition"
                  >
                    {item.label}
                  </Link>
                );
              }
              return (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-xl px-3 py-3 text-base font-semibold text-slate-700 transition"
                >
                  {item.label}
                </a>
              );
            })}
          </div>
          <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            <p className="mt-2">
              <a href={`tel:${contact.phone1.replace(/[^+\d]/g, '')}`} className="font-semibold text-slate-700">
                {contact.phone1}
              </a>
            </p>
            <a href="/#contact" className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-brand-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-accent/90">
              Neem contact op
            </a>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
