import { useNavigate } from 'react-router';
import { ArrowLeft, Shield, Eye, Database, Lock, Mail, Bell } from 'lucide-react';

export default function Privacy() {
  const navigate = useNavigate();

  const sections = [
    {
      icon: Database,
      title: 'Política de Privacidad',
      content: 'Recolección mínima de datos con finalidad exclusivamente educativa. No vendemos datos a terceros. Tienes derecho a la eliminación de tu cuenta desde la app.'
    },
    {
      icon: Lock,
      title: 'Aviso de Privacidad (LFPDPPP)',
      content: 'Cumplimos con la Ley Federal de Protección de Datos Personales en Posesión de Particulares. Tu consentimiento es explícito y revocable y regulamos el resguardo de datos.'
    },
    {
      icon: Shield,
      title: 'Política de Seguridad',
      content: 'Tus credenciales están seguras: usamos Firebase Auth (contraseñas con hash), comunicaciones cifradas TLS, sesiones con expiración automática (JWT) y monitoreo de accesos inusuales.'
    },
    {
      icon: Eye,
      title: 'Análisis de uso',
      content: 'Recopilamos datos anónimos sobre cómo usas MathStack para mejorar la experiencia y personalizar tu ruta de aprendizaje.'
    },
    {
      icon: Bell,
      title: 'Notificaciones',
      content: 'Enviamos notificaciones para recordarte tus sesiones de estudio y nuevos retos. Puedes configurarlas para evitar la fatiga de avisos.'
    },
    {
      icon: Mail,
      title: 'Comunicaciones por correo',
      content: 'Podemos enviarte correos relacionados con tu cuenta, logros y actualizaciones importantes de la aplicación.'
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
            <Shield className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Política de Privacidad</h1>
          </div>
        </div>
        <p className="text-white/80 text-sm">
          Última actualización: Junio 2026
        </p>
      </div>

      <div className="flex-1 px-6 py-6">
        <div className="space-y-4">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div key={index} className="bg-card rounded-[20px] p-5 shadow-sm border border-border">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{section.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="bg-muted rounded-[20px] p-5 mt-6">
            <p className="text-sm text-muted-foreground text-center">
              Si tienes preguntas sobre nuestra política de privacidad.{' '}
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
