import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Users, BookOpen, Hash, Award, Loader2 } from 'lucide-react';
import { groupService } from '../services/groupService';
import { toast } from 'sonner';

export default function CreateGroup() {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('algebra');
  const [maxMembers, setMaxMembers] = useState(20);
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const subjects = [
    { value: 'algebra', label: 'Álgebra' },
    { value: 'arithmetic', label: 'Aritmética' },
    { value: 'calculus', label: 'Cálculo' },
    { value: 'geometry', label: 'Geometría' }
  ];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await groupService.createGroup({
        name: groupName,
        description,
        subject,
        maxMembers
      });
      toast.success('¡Grupo creado exitosamente!');
      navigate('/groups');
    } catch (error) {
      toast.error('Hubo un error al crear el grupo');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="size-full flex flex-col bg-background overflow-auto pb-28">
      <div className="bg-card border-b border-border px-6 py-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/groups')} className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-xl font-semibold text-foreground">Crear Grupo</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="flex-1 px-6 py-8">
        <div className="bg-gradient-to-r from-primary to-blue-700 rounded-[20px] p-6 mb-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-white text-xl font-bold mb-1">Nuevo Grupo</h2>
              <p className="text-white/80 text-sm">Crea tu comunidad de estudio</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleCreate} className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm mb-2 text-foreground">
              <Users className="w-4 h-4" />
              Nombre del grupo
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Ej: Matemáticas Avanzadas 2024"
              className="w-full px-4 py-4 bg-card border border-border rounded-[20px] focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm mb-2 text-foreground">
              <BookOpen className="w-4 h-4" />
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe el objetivo del grupo..."
              rows={4}
              className="w-full px-4 py-4 bg-card border border-border rounded-[20px] focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm mb-2 text-foreground">
              <BookOpen className="w-4 h-4" />
              Materia principal
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-4 bg-card border border-border rounded-[20px] focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {subjects.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm mb-2 text-foreground">
              <Hash className="w-4 h-4" />
              Máximo de miembros
            </label>
            <input
              type="number"
              value={maxMembers}
              onChange={(e) => setMaxMembers(parseInt(e.target.value))}
              min="5"
              max="100"
              className="w-full px-4 py-4 bg-card border border-border rounded-[20px] focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <p className="text-sm text-muted-foreground mt-2">Entre 5 y 100 miembros</p>
          </div>

          <div className="bg-muted rounded-[20px] p-5">
            <div className="flex items-start gap-3">
              <Award className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground mb-1">Recompensas del grupo</h4>
                <p className="text-sm text-muted-foreground">
                  Los miembros ganarán monedas y XP adicional al completar retos grupales
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-blue-700 disabled:bg-primary/50 text-white py-4 rounded-[20px] font-medium transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
            Crear grupo
          </button>
        </form>
      </div>

    </div>
  );
}
