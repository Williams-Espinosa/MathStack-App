import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Mail, ArrowLeft, CheckCircle2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Step = 'email' | 'sent' | 'verify';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('sent');
      startResendTimer();
    }, 1500);
  };

  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCodeInput = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) {
      const next = document.getElementById(`code-${index + 1}`);
      next?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prev = document.getElementById(`code-${index - 1}`);
      prev?.focus();
    }
  };

  const handleVerify = () => {
    const fullCode = code.join('');
    if (fullCode.length < 6) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('verify');
    }, 1200);
  };

  const handleResend = () => {
    setCode(['', '', '', '', '', '']);
    startResendTimer();
  };

  return (
    <div className="size-full flex flex-col bg-background overflow-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-blue-700 pt-14 pb-10 px-8 rounded-b-[40px] shadow-xl relative">
        <button
          onClick={() => step === 'email' ? navigate('/login') : setStep(step === 'sent' ? 'email' : 'sent')}
          className="absolute top-14 left-6 bg-white/20 p-2 rounded-xl backdrop-blur-sm"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        <div className="flex justify-center mb-5">
          <AnimatePresence mode="wait">
            {step === 'verify' ? (
              <motion.div
                key="success"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-white/20 p-5 rounded-3xl backdrop-blur-sm"
              >
                <CheckCircle2 className="w-16 h-16 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="mail"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white/20 p-5 rounded-3xl backdrop-blur-sm"
              >
                <Mail className="w-16 h-16 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {step === 'email' && (
            <motion.div key="title-email" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center">
              <h1 className="text-2xl font-bold text-white mb-1">¿Olvidaste tu contraseña?</h1>
              <p className="text-white/80 text-sm">Te enviaremos un código de verificación</p>
            </motion.div>
          )}
          {step === 'sent' && (
            <motion.div key="title-sent" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center">
              <h1 className="text-2xl font-bold text-white mb-1">Código enviado</h1>
              <p className="text-white/80 text-sm">Revisa tu bandeja de entrada</p>
            </motion.div>
          )}
          {step === 'verify' && (
            <motion.div key="title-verify" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center">
              <h1 className="text-2xl font-bold text-white mb-1">¡Listo!</h1>
              <p className="text-white/80 text-sm">Tu contraseña ha sido restablecida</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="flex-1 px-8 py-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Enter email */}
          {step === 'email' && (
            <motion.form
              key="step-email"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSendEmail}
              className="space-y-6"
            >
              <div className="bg-card border border-border rounded-[20px] p-4">
                <p className="text-sm text-muted-foreground text-center">
                  Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un código para restablecer tu contraseña.
                </p>
              </div>

              <div>
                <label className="block text-sm mb-2 text-foreground">Correo electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-[20px] focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full bg-primary hover:bg-blue-700 disabled:opacity-60 text-white py-4 rounded-[20px] font-medium transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> Enviando...</>
                ) : 'Enviar código'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Volver al inicio de sesión
              </button>
            </motion.form>
          )}

          {/* Step 2: Enter code */}
          {step === 'sent' && (
            <motion.div
              key="step-sent"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-blue-50 border border-blue-200 rounded-[20px] p-4">
                <p className="text-sm text-center" style={{ color: '#1e40af' }}>
                  Enviamos un código de 6 dígitos a{' '}
                  <span className="font-semibold">{email}</span>
                </p>
              </div>

              <div>
                <label className="block text-sm mb-4 text-foreground text-center">Ingresa el código de verificación</label>
                <div className="flex gap-2 justify-center">
                  {code.map((digit, i) => (
                    <input
                      key={i}
                      id={`code-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeInput(i, e.target.value.replace(/\D/, ''))}
                      onKeyDown={(e) => handleCodeKeyDown(i, e)}
                      className="w-12 h-14 text-center text-xl font-bold bg-card border-2 border-border rounded-[14px] focus:outline-none focus:border-primary transition-colors text-foreground"
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleVerify}
                disabled={isLoading || code.join('').length < 6}
                className="w-full bg-primary hover:bg-blue-700 disabled:opacity-60 text-white py-4 rounded-[20px] font-medium transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> Verificando...</>
                ) : 'Verificar código'}
              </button>

              <div className="text-center">
                {resendTimer > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Reenviar código en <span className="font-semibold text-primary">{resendTimer}s</span>
                  </p>
                ) : (
                  <button
                    onClick={handleResend}
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    ¿No recibiste el código? Reenviar
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 3: Success */}
          {step === 'verify' && (
            <motion.div
              key="step-verify"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="flex justify-center"
              >
                <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #22C55E, #16a34a)' }}>
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
              </motion.div>

              <div className="bg-card border border-border rounded-[20px] p-6 space-y-2">
                <p className="text-foreground font-medium">Contraseña restablecida exitosamente</p>
                <p className="text-sm text-muted-foreground">
                  Tu nueva contraseña ha sido enviada a <span className="font-medium">{email}</span>. Ya puedes iniciar sesión con ella.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-primary hover:bg-blue-700 text-white py-4 rounded-[20px] font-medium transition-colors shadow-lg"
                >
                  Ir a iniciar sesión
                </button>
                <p className="text-xs text-muted-foreground">
                  ¿Necesitas ayuda? Contáctanos en soporte@mathstack.app
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
