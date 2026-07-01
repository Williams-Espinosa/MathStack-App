import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Mail, Lock, Chrome } from 'lucide-react';
import { Link } from 'react-router';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
    navigate('/dashboard');
  };

  return (
    <div className="size-full flex flex-col bg-background overflow-auto">
      <div className="flex-1 flex flex-col">
        <div className="bg-gradient-to-br from-primary to-blue-700 py-10 px-8 rounded-b-[40px] shadow-xl">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 p-3 rounded-3xl backdrop-blur-sm">
              <img src="/icons/LogoFelizSinFondo.png" alt="MathStack Logo" className="w-32 h-32 object-contain scale-125" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white text-center mb-2">
            ¡Bienvenido a MathStack!
          </h1>
          <p className="text-white/80 text-center">
            Inicia sesión para continuar
          </p>
        </div>

        <div className="flex-1 px-8 py-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm mb-2 text-foreground">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-[20px] focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-foreground">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-[20px] focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-blue-700 text-white py-4 rounded-[20px] font-medium transition-colors shadow-lg"
            >
              Iniciar sesión
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background text-muted-foreground">o continúa con</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full bg-card hover:bg-muted border border-border text-foreground py-4 rounded-[20px] font-medium transition-colors flex items-center justify-center gap-3"
            >
              <Chrome className="w-5 h-5" />
              Continuar con Google
            </button>

            <div className="text-center space-y-2 pt-4">
              <p className="text-sm text-muted-foreground">
                ¿No tienes cuenta?{' '}
                <Link
                  to="/register"
                  className="text-primary hover:underline font-medium"
                >
                  Crear cuenta
                </Link>
              </p>
              <p className="text-xs text-muted-foreground">
                <Link to="/terms" className="hover:underline">Términos y Condiciones</Link>
                {' · '}
                <Link to="/privacy" className="hover:underline">Privacidad</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
