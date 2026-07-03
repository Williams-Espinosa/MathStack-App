import { useNavigate } from 'react-router';
import { ArrowLeft, Heart, Code, Users, Target } from 'lucide-react';

export default function About() {
  const navigate = useNavigate();

  const team = [
    { name: 'Williams Espinosa Lopez', role: 'Frontend Developer' },
    { name: 'Alexis Garcia Rojas', role: 'UI/UX & Lead Developer' },
    { name: 'Daniel Camacho Morales', role: 'Backend Developer' },
    { name: 'Alonso Guadalupe Hernandez Mendoza', role: 'Asesor Academico' },
  ];

  return (
    <div className="size-full flex flex-col bg-background overflow-auto pb-28">
      <div className="bg-gradient-to-br from-primary to-blue-700 px-6 pt-8 pb-12 rounded-b-[40px] shadow-xl">
        <button onClick={() => navigate('/settings')} className="p-2 hover:bg-white/10 rounded-full transition-colors mb-6">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm mb-4">
            <img src="/icons/LogoFelizSinFondo.png" alt="MathStack Logo" className="w-24 h-24 object-contain scale-125" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">MathStack</h1>
          <p className="text-white/80 text-sm mb-1">Versión 1.0.1</p>
          <p className="text-white/90 text-sm">© 2026 MathStack</p>
        </div>
      </div>

      <div className="flex-1 px-6 py-6">
        <div className="bg-card rounded-[20px] p-6 shadow-sm border border-border mb-6">
          <div className="flex items-start gap-3 mb-4">
            <Target className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">Nuestra Misión</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ayudar a estudiantes universitarios a mejorar sus habilidades matemáticas a través del aprendizaje adaptativo,
                la gamificación y una comunidad de apoyo.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Nuestro Equipo
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {team.map((member, index) => (
              <div key={index} className="bg-card rounded-[20px] p-4 shadow-sm border border-border text-center">
                <div className="text-4xl mb-2">{member.icon}</div>
                <h4 className="font-medium text-foreground text-sm mb-1">{member.name}</h4>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-[20px] p-6 shadow-sm border border-border mb-6">
          <div className="flex items-start gap-3">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Hecho con pasion</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                MathStack es desarrollado por un equipo apasionado de estudiantes y docentes
                dedicados a hacer las matemáticas accesibles para todos.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary to-blue-700 rounded-[20px] p-6 shadow-lg text-center">
          <Code className="w-8 h-8 text-white mx-auto mb-3" />
          <p className="text-white text-sm mb-3">
            ¿Tienes feedback o sugerencias?
          </p>
          <a
            href="mailto:mathstacksoporte@gmail.com"
            className="inline-block bg-white text-primary px-6 py-2 rounded-full text-sm font-medium hover:bg-white/90 transition-colors"
          >
            Contáctanos
          </a>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            MathStack · Todos los derechos reservados · 2026
          </p>
        </div>
      </div>

    </div>
  );
}
