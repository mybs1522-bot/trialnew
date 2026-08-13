import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart as ShoppingCartIcon, Menu, X, Smartphone, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { AddToHomeScreenModal } from './AddToHomeScreenModal';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPwaModal, setShowPwaModal] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const checkLogin = () => {
      const session = localStorage.getItem('student_session');
      setIsLoggedIn(!!session);
    };
    checkLogin();
    window.addEventListener('storage', checkLogin);
    return () => window.removeEventListener('storage', checkLogin);
  }, [pathname]);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex-shrink-0">
              <Link to="/" className="text-xl font-bold tracking-tight">
                Avada <span className="text-primary">Design</span>
              </Link>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-8">
                {links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      pathname === link.path ? 'text-foreground' : 'text-foreground/60'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              {isLoggedIn ? (
                /* When logged in: Remove Login button and show Add App to Home Screen button */
                <Button 
                  size="sm" 
                  onClick={() => setShowPwaModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2 rounded-full shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <Smartphone size={14} /> Add App to Home Screen
                </Button>
              ) : (
                /* When not logged in: Show Login / Portal button */
                <Link to="/portal">
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs px-4 py-2 rounded-full shadow-md shadow-orange-600/20">
                    Login / Portal
                  </Button>
                </Link>
              )}

              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCartIcon className="h-5 w-5" />
                  <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-orange-600"></span>
                </Button>
              </Link>
            </div>

            <div className="-mr-2 flex items-center gap-2 md:hidden">
              {isLoggedIn ? (
                /* Mobile Header when logged in */
                <Button 
                  size="sm" 
                  onClick={() => setShowPwaModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1 cursor-pointer"
                >
                  <Smartphone size={13} /> Add App
                </Button>
              ) : (
                /* Mobile Header when not logged in */
                <Link to="/portal">
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-full shadow-sm">
                    Login
                  </Button>
                </Link>
              )}

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-700 hover:text-slate-900"
              >
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-b bg-background">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              {isLoggedIn && (
                <button
                  onClick={() => { setIsMobileMenuOpen(false); setShowPwaModal(true); }}
                  className="w-full text-left font-bold text-emerald-600 flex items-center gap-2 px-3 py-2 rounded-md hover:bg-emerald-50"
                >
                  <Smartphone size={16} /> Add App to Home Screen
                </button>
              )}

              <Link
                to="/cart"
                className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Cart
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* PWA / Web App Add to Home Screen Instructions Modal */}
      <AddToHomeScreenModal isOpen={showPwaModal} onClose={() => setShowPwaModal(false)} />
    </>
  );
};
