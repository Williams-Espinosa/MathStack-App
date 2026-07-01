import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { User, Mail, Lock, Chrome, Check } from 'lucide-react';

interface RegisterProps {
  onRegister: () => void;
}

export default function Register({ onRegister }: RegisterProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === confirmPassword && acceptTerms) {
      onRegister();
      navigate('/diagnostic');
    }
  };

  return (
    <div className="size-full flex flex-col bg-background overflow-auto">
      <div className="flex-1 flex flex-col">
        <div className="bg-gradient-to-br from-primary to-blue-700 py-12 px-8 rounded-b-[40px] shadow-xl">
          <h1 className="text-3xl font-bold text-white text-center mb-2">
            Crea tu cuenta
          </h1>
          <p className="text-white/80 text-center">
            Comienza tu viaje en matemáticas
          </p>
        </div>

        <div className="flex-1 px-8 py-8">
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm mb-2 text-foreground">
                Nombre de usuario
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="usuario123"
                  className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-[20px] focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

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

            <div>
              <label className="block text-sm mb-2 text-foreground">
                Confirmar contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-[20px] focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => setAcceptTerms(!acceptTerms)}
                className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                  acceptTerms ? 'bg-primary border-primary' : 'border-border bg-card'
                }`}
              >
                {acceptTerms && <Check className="w-4 h-4 text-white" />}
              </button>
              <label className="text-sm text-muted-foreground">
                Acepto los{' '}
                <Link to="/terms" className="text-primary hover:underline">
                  Términos y Condiciones
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={!acceptTerms}
              className="w-full bg-primary hover:bg-blue-700 disabled:bg-muted disabled:text-muted-foreground text-white py-4 rounded-[20px] font-medium transition-colors shadow-lg"
            >
              Crear cuenta
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

            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground">
                ¿Ya tienes cuenta?{' '}
                <Link
                  to="/login"
                  className="text-primary hover:underline font-medium"
                >
                  Iniciar sesión
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
