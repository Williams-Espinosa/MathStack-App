import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Clock, ChevronRight, BookOpen } from 'lucide-react';

const lessonContent = {
  title: 'Ecuaciones lineales',
  estimatedTime: '15 min',
  sections: [
    {
      type: 'intro',
      content: 'Una ecuación lineal es una igualdad que involucra una o más variables elevadas a la primera potencia.'
    },
    {
      type: 'example',
      title: 'Ejemplo 1',
      content: 'Resuelve: 2x + 5 = 13',
      steps: [
        'Resta 5 de ambos lados: 2x = 8',
        'Divide ambos lados por 2: x = 4'
      ]
    },
    {
      type: 'concept',
      title: 'Propiedad de igualdad',
      content: 'Lo que hagas a un lado de la ecuación, debes hacerlo al otro lado para mantener el balance.'
    }
  ]
};

export default function Lesson() {
  const navigate = useNavigate();
  const { id } = useParams();
  const progress = 60;

  return (
    <div className="size-full flex flex-col bg-background overflow-auto">
      <div className="bg-card border-b border-border px-6 py-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => navigate('/learning-path')} className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{lessonContent.estimatedTime}</span>
          </div>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex-1 px-6 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              {lessonContent.title}
            </h1>
          </div>
        </div>

        <div className="space-y-6">
          {lessonContent.sections.map((section, index) => (
            <div key={index} className="bg-card rounded-[20px] p-6 shadow-sm border border-border">
              {section.title && (
                <h3 className="font-semibold text-foreground mb-3">{section.title}</h3>
              )}
              <p className="text-muted-foreground leading-relaxed mb-4">
                {section.content}
              </p>
              {section.steps && (
                <div className="space-y-2 pl-4 border-l-2 border-primary">
                  {section.steps.map((step, idx) => (
                    <p key={idx} className="text-sm text-foreground">
                      {idx + 1}. {step}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="bg-gradient-to-r from-success to-green-600 rounded-[20px] p-6 shadow-lg">
            <h3 className="text-white font-semibold mb-2">¡Listo para practicar!</h3>
            <p className="text-white/90 text-sm mb-4">
              Pon en práctica lo que aprendiste con ejercicios interactivos
            </p>
            <button
              onClick={() => navigate(`/exercise/${id}`)}
              className="w-full bg-white text-success py-3 rounded-[20px] font-medium hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
            >
              <span>Comenzar ejercicios</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
