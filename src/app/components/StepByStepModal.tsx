import { motion, AnimatePresence } from 'framer-motion';
import { X, Scale, BookOpen, ChevronRight } from 'lucide-react';
import type { StepByStepData } from '../types/api';
import { useState } from 'react';

interface StepByStepModalProps {
  data: StepByStepData;
  onClose: () => void;
}

export default function StepByStepModal({ data, onClose }: StepByStepModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = data.steps.length;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background h-screen w-full">
      <div className="bg-primary pt-12 pb-4 px-6 shadow-sm z-10 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <span className="font-serif italic text-xl font-bold">∑</span>
            <h2 className="text-lg font-bold">Resolver paso a paso</h2>
          </div>
          <button onClick={onClose} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {data.rules && data.rules.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-blue-700">
              <Scale className="w-5 h-5" />
              <h3 className="font-bold">Leyes y reglas aplicadas</h3>
            </div>

            <div className="space-y-4">
              {data.rules.map((rule, idx) => (
                <div key={idx} className="border border-border rounded-xl p-4 bg-background">
                  <p className="font-bold text-foreground text-sm mb-2">{rule.title}</p>
                  <div className="bg-blue-50 text-blue-700 font-mono text-center p-3 rounded-lg mb-2 text-sm font-semibold">
                    {rule.formula}
                  </div>
                  <p className="text-sm text-muted-foreground">{rule.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2 text-foreground">
              <BookOpen className="w-5 h-5" />
              <h3 className="font-bold">Solución detallada</h3>
            </div>
            <span className="text-sm text-muted-foreground font-medium">{currentStep}/{totalSteps} pasos</span>
          </div>

          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {data.steps.slice(0, currentStep).map((step, idx) => {
                const isCurrent = idx + 1 === currentStep;
                return (
                  <motion.div
                    key={step.stepNumber}
                    initial={{ opacity: 0, height: 0, scale: 0.9 }}
                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`border ${isCurrent ? 'border-primary shadow-md' : 'border-border'} rounded-2xl bg-card overflow-hidden`}
                  >
                    <div className={`flex items-center gap-3 p-4 border-b ${isCurrent ? 'border-primary/20 bg-blue-50/50' : 'border-border'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isCurrent ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                        {step.stepNumber}
                      </div>
                      <p className={`font-bold text-sm ${isCurrent ? 'text-primary' : 'text-foreground'}`}>{step.title}</p>
                    </div>
                    <div className="p-4 bg-card">
                      <div className="bg-muted text-center font-bold text-lg p-4 rounded-xl mb-3 overflow-x-auto whitespace-nowrap">
                        {step.equation}
                      </div>
                      <p className="text-sm text-muted-foreground">{step.explanation}</p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {currentStep < totalSteps && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="w-full bg-primary hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                Ver paso {currentStep + 1} de {totalSteps} <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {currentStep === totalSteps && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 bg-green-50 border border-green-200 rounded-2xl p-6 text-center"
            >
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="text-green-800 font-bold text-lg mb-2">¡Solución completa!</h3>
              <p className="text-green-700 text-sm mb-5">
                Ya entiendes cómo se resuelve. ¡Ahora inténtalo tú mismo para ganar los 75 XP!
              </p>
              <button
                onClick={onClose}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold transition-colors shadow-lg shadow-green-600/20"
              >
                Intentarlo ahora
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
