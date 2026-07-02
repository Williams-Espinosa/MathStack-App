import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Search, ChevronDown, ChevronUp, User, Target, Trophy, Users, ShoppingBag, Award } from 'lucide-react';

const faqs = [
  {
    category: 'Cuenta',
    icon: User,
    questions: [
      {
        q: '¿Cómo cambio mi contraseña?',
        a: 'Ve a Configuración > Gestión de cuenta > Cambiar contraseña. Necesitarás tu contraseña actual para confirmar el cambio.'
      },
      {
        q: '¿Puedo cambiar mi correo electrónico?',
        a: 'Sí, puedes actualizar tu correo en Configuración > Gestión de cuenta. Recibirás un correo de verificación en tu nueva dirección.'
      },
      {
        q: '¿Cómo elimino mi cuenta?',
        a: 'En Configuración > Gestión de cuenta encontrarás la opción "Eliminar cuenta" en la zona de peligro. Esta acción es permanente.'
      }
    ]
  },
  {
    category: 'Diagnóstico',
    icon: Target,
    questions: [
      {
        q: '¿Qué es el examen diagnóstico?',
        a: 'Es una evaluación inicial que identifica tus fortalezas y debilidades en diferentes áreas matemáticas para crear una ruta personalizada.'
      },
      {
        q: '¿Puedo repetir el diagnóstico?',
        a: 'Sí, puedes realizar el diagnóstico cada 30 días para actualizar tu ruta de aprendizaje según tu progreso.'
      }
    ]
  },
  {
    category: 'Rutas de Aprendizaje',
    icon: Award,
    questions: [
      {
        q: '¿Cómo funcionan las rutas?',
        a: 'Las rutas se generan automáticamente según tu diagnóstico. Cada lección se desbloquea al completar la anterior.'
      },
      {
        q: '¿Puedo saltar lecciones?',
        a: 'No, las lecciones deben completarse en orden para asegurar que construyes una base sólida de conocimientos.'
      }
    ]
  },
  {
    category: 'Retos',
    icon: Trophy,
    questions: [
      {
        q: '¿Qué son los retos semanales?',
        a: 'Son desafíos temporales con objetivos específicos. Al completarlos ganas monedas y XP extra.'
      },
      {
        q: '¿Puedo hacer varios retos a la vez?',
        a: 'Sí, puedes participar en múltiples retos simultáneamente.'
      }
    ]
  },
  {
    category: 'Grupos',
    icon: Users,
    questions: [
      {
        q: '¿Cómo creo un grupo?',
        a: 'Ve a la sección Grupos y pulsa el botón +. Necesitas definir nombre, descripción, materia y máximo de miembros.'
      },
      {
        q: '¿Puedo salir de un grupo?',
        a: 'Sí, puedes abandonar cualquier grupo desde la configuración del mismo.'
      }
    ]
  },
  {
    category: 'Tienda',
    icon: ShoppingBag,
    questions: [
      {
        q: '¿Cómo gano monedas?',
        a: 'Ganas monedas completando lecciones, ejercicios y retos. También las recibes por mantener tu racha.'
      },
      {
        q: '¿Puedo comprar monedas?',
        a: 'No, las monedas solo se ganan a través del aprendizaje y participación en la app.'
      }
    ]
  }
];

export default function Help() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleItem = (key: string) => {
    setExpandedItems(prev =>
      prev.includes(key) ? prev.filter(item => item !== key) : [...prev, key]
    );
  };

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="size-full flex flex-col bg-background overflow-auto pb-28">
      <div className="bg-gradient-to-br from-primary to-blue-700 px-6 pt-8 pb-12 rounded-b-[40px] shadow-xl">
        <button onClick={() => navigate('/settings')} className="p-2 hover:bg-white/10 rounded-full transition-colors mb-6">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-3xl font-bold text-white mb-2">Centro de Ayuda</h1>
        <p className="text-white/80 text-sm mb-6">
          Encuentra respuestas a tus preguntas
        </p>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar en la ayuda..."
            className="w-full pl-12 pr-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-[20px] text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>
      </div>

      <div className="flex-1 px-6 py-6">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No se encontraron resultados</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredFaqs.map((category, catIndex) => {
              const Icon = category.icon;
              return (
                <div key={catIndex}>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">{category.category}</h3>
                  </div>

                  <div className="space-y-2">
                    {category.questions.map((item, qIndex) => {
                      const itemKey = `${catIndex}-${qIndex}`;
                      const isExpanded = expandedItems.includes(itemKey);

                      return (
                        <div key={qIndex} className="bg-card rounded-[20px] shadow-sm border border-border overflow-hidden">
                          <button
                            onClick={() => toggleItem(itemKey)}
                            className="w-full px-5 py-4 flex items-center justify-between hover:bg-muted transition-colors"
                          >
                            <span className="text-left font-medium text-foreground text-sm pr-4">
                              {item.q}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            )}
                          </button>

                          {isExpanded && (
                            <div className="px-5 pb-4 pt-0">
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {item.a}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="bg-gradient-to-r from-primary to-blue-700 rounded-[20px] p-6 shadow-lg mt-8">
          <h3 className="text-white font-semibold mb-2">¿No encontraste lo que buscabas?</h3>
          <p className="text-white/90 text-sm mb-4">
            Nuestro equipo de soporte está listo para ayudarte
          </p>
          <a
            href="mailto:w.espinosa.it@gmail.com"
            className="inline-block bg-white text-primary px-6 py-2 rounded-full text-sm font-medium hover:bg-white/90 transition-colors"
          >
            Contactar Soporte
          </a>
        </div>
      </div>

    </div>
  );
}
