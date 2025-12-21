import { Navbar } from './Navbar';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <Navbar />
      <main className="main-content" role="main">
        {children}
      </main>
      <footer className="footer" role="contentinfo">
        <p>&copy; 2025 Система бронирования аудиторий. Все права защищены.</p>
      </footer>
    </div>
  );
}
