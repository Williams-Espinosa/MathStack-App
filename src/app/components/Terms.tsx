import { useNavigate } from 'react-router';
import { ArrowLeft, FileText, CheckCircle } from 'lucide-react';

export default function Terms() {
  const navigate = useNavigate();

  const sections = [
    {
      title: '1. Aceptación de los Términos y Uso Educativo',
      content: 'Al usar MathStack, aceptas estos términos y condiciones. MathStack está diseñado para uso personal y educativo, sin fines comerciales (licencia requerida para otros fines).'
    },
    {
      title: '2. Marco Legal (Leyes y Normativas)',
      content: 'Sustentado en el Artículo 3° Constitucional (educación como derecho fundamental apoyado en tecnologías) y la Ley General de Educación (Art. 14 y 16) que promueve el uso de TIC para el aprendizaje autónomo.'
    },
    {
      title: '3. Actividades Prohibidas',
      content: 'Prohibición estricta del uso de bots o trampas en retos. No puedes compartir contenido inapropiado, intentar vulnerar el sistema o comercializar tu cuenta.'
    },
    {
      title: '4. Política de Gamificación y Recompensas',
      content: 'Las recompensas se obtienen solo por aprendizaje real (máx. 1 sesión computada por día). Las monedas, XP y recompensas virtuales no son canjeables por dinero real. Contamos con una política anti-abuso en el sistema de puntos.'
    },
    {
      title: '5. Política de Accesibilidad',
      content: 'Garantizamos una interfaz con contraste WCAG AA, tamaño de fuente ajustable y notificaciones configurables por el usuario para evitar la fatiga de avisos.'
    },
    {
      title: '6. Propiedad Intelectual y Derechos de Autor',
      content: 'De acuerdo con la Ley Federal del Derecho de Autor, todo el código fuente, diseño de avatares y contenido educativo de MathStack está protegido como obra intelectual (registro ante INDAUTOR recomendado).'
    },
    {
      title: '7. Responsabilidades del usuario',
      content: 'Eres responsable de mantener la confidencialidad de tu cuenta y contraseña. Debes notificarnos inmediatamente cualquier uso no autorizado.'
    }
  ];

  return (
    <div className="size-full flex flex-col bg-background overflow-auto pb-28">
      <div className="bg-gradient-to-br from-primary to-blue-700 px-6 pt-8 pb-12 rounded-b-[40px] shadow-xl">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors mb-6">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex items-center gap-4 mb-2">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Términos y Condiciones</h1>
          </div>
        </div>
        <p className="text-white/80 text-sm">
          Última actualización: Junio 2026
        </p>
      </div>

      <div className="flex-1 px-6 py-6">
        <div className="bg-primary/10 border border-primary/20 rounded-[20px] p-5 mb-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-foreground">
              Al usar MathStack, aceptas cumplir con estos términos y condiciones. Lee cuidadosamente.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {sections.map((section, index) => (
            <div key={index} className="bg-card rounded-[20px] p-5 shadow-sm border border-border">
              <h3 className="font-semibold text-foreground mb-2">{section.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}

          <div className="bg-muted rounded-[20px] p-5 mt-6">
            <p className="text-sm text-muted-foreground text-center">
              ¿Preguntas sobre los términos?{' '}
              <a href="mailto:mathstacksoporte@gmail.com" className="text-primary hover:underline">
                Contáctanos
              </a>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
