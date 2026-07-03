import { useNavigate } from 'react-router';
import { ArrowLeft, FileText, CheckCircle } from 'lucide-react';

export default function Terms() {
  const navigate = useNavigate();

  const sections = [
    {
      title: '1. Aceptación de los términos',
      content: 'Al usar MathStack, aceptas estos términos y condiciones. Si no estás de acuerdo, no uses la aplicación.'
    },
    {
      title: '2. Responsabilidades del usuario',
      content: 'Eres responsable de mantener la confidencialidad de tu cuenta y contraseña. Debes notificarnos inmediatamente cualquier uso no autorizado.'
    },
    {
      title: '3. Actividades prohibidas',
      content: 'No puedes usar MathStack para: compartir contenido inapropiado, hacer trampa en los ejercicios, intentar hackear el sistema, o vender tu cuenta.'
    },
    {
      title: '4. Retos y grupos',
      content: 'Los retos grupales deben ser educativos y respetuosos. Nos reservamos el derecho de eliminar grupos o retos que violen estas normas.'
    },
    {
      title: '5. Recompensas virtuales',
      content: 'Las monedas, XP y otros elementos virtuales no tienen valor monetario real y no son transferibles fuera de la aplicación.'
    },
    {
      title: '6. Terminación de cuenta',
      content: 'Podemos suspender o terminar tu cuenta si violas estos términos. Puedes eliminar tu cuenta en cualquier momento desde la configuración.'
    },
    {
      title: '7. Modificaciones',
      content: 'Nos reservamos el derecho de modificar estos términos en cualquier momento. Te notificaremos de cambios importantes.'
    },
    {
      title: '8. Propiedad intelectual',
      content: 'Todo el contenido de MathStack, incluyendo lecciones, ejercicios y diseño, está protegido por derechos de autor.'
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
