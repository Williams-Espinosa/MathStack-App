import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { User, Mail, Lock, Check, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error('La contraseña no cumple con los requisitos de seguridad.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }
    if (!acceptTerms) {
      toast.error('Debes aceptar los términos y condiciones.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await authService.register({ 
        email, 
        username, 
        password,
        accessLevel: 'STUDENT'
      });
      login(response);
      toast.success('¡Cuenta creada con éxito!');
      navigate('/diagnostic');
    } catch (error: any) {
      toast.error(error.message || 'Error al registrar cuenta');
    } finally {
      setIsSubmitting(false);
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
          <div className="space-y-6">
            <button
              type="button"
              className="w-full bg-card hover:bg-muted border border-border text-foreground py-4 rounded-[20px] font-medium transition-colors flex items-center justify-center gap-3 shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continuar con Google
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background text-muted-foreground">o regístrate con tu correo</span>
              </div>
            </div>

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
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 bg-card border border-border rounded-[20px] focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <ul className="text-xs mt-2 pl-2 space-y-1">
                  <li className={password.length === 0 ? "text-muted-foreground" : (password.length >= 8 ? "text-green-500" : "text-red-500")}>
                    • Al menos 8 caracteres
                  </li>
                  <li className={password.length === 0 ? "text-muted-foreground" : (/(?=.*[A-Z])/.test(password) ? "text-green-500" : "text-red-500")}>
                    • Al menos una mayúscula
                  </li>
                  <li className={password.length === 0 ? "text-muted-foreground" : (/(?=.*[a-z])/.test(password) ? "text-green-500" : "text-red-500")}>
                    • Al menos una minúscula
                  </li>
                  <li className={password.length === 0 ? "text-muted-foreground" : (/(?=.*\d)/.test(password) ? "text-green-500" : "text-red-500")}>
                    • Al menos un número
                  </li>
                </ul>
              </div>

              <div>
                <label className="block text-sm mb-2 text-foreground">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 bg-card border border-border rounded-[20px] focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {confirmPassword.length > 0 && (
                  <p className={`text-xs mt-2 pl-2 ${password === confirmPassword ? "text-green-500" : "text-red-500"}`}>
                    {password === confirmPassword ? "• Las contraseñas coinciden" : "• Las contraseñas no coinciden"}
                  </p>
                )}
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
                disabled={!acceptTerms || isSubmitting}
                className="w-full bg-primary hover:bg-blue-700 disabled:bg-muted disabled:text-muted-foreground text-white py-4 rounded-[20px] font-medium transition-colors shadow-lg"
              >
                {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </form>

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
          </div>
        </div>
      </div>
    </div>
  );
}
