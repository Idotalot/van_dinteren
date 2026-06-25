import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ContactPage } from './pages/ContactPage';
import { MotorenPage } from './pages/MotorenPage';
import { LoginPage } from './pages/LoginPage';
import { PortaalPage } from './pages/PortaalPage';

const Footer = () => (
  <footer className="border-t border-slate-200/90 bg-white/95 py-10">
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between">
      <p className="text-sm text-slate-500">© 2026 Van Dinteren Bike Center. Alle rechten voorbehouden.</p>
      <div className="space-x-4 text-sm text-slate-600">
        <span>info@vandinterenbikecenter.nl</span>
        <span>06-26641687</span>
      </div>
    </div>
  </footer>
);

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <HomePage />
            <ContactPage />
            <Footer />
          </Layout>
        }
      />
      <Route
        path="/motoren"
        element={
          <Layout>
            <MotorenPage />
            <Footer />
          </Layout>
        }
      />
      <Route path="/portaal/login" element={<LoginPage />} />
      <Route path="/portaal" element={<PortaalPage />} />
    </Routes>
  );
}

export default App;
