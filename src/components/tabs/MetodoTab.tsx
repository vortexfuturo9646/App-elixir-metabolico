import { BookOpen, Clock, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';

const dailyTips = [
  "Comece devagar. Não tente mudar tudo de uma vez.",
  "Prepare suas refeições com antecedência quando possível.",
  "Beba água antes de cada refeição.",
  "Durma bem. O sono afeta diretamente seu metabolismo.",
  "Celebre pequenas vitórias, elas constroem hábitos.",
  "Se errar um dia, não desista. Volte no próximo.",
  "Caminhe mais no seu dia a dia, sem precisar de academia.",
];

export const MetodoTab = () => {
  const todayTip = dailyTips[new Date().getDay()];

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="text-center pt-2">
        <h1 className="text-2xl font-bold text-foreground">O Método</h1>
        <p className="text-muted-foreground mt-1">Simples, prático e sustentável</p>
      </div>

      {/* What is it */}
      <div className="card-elevated p-5">
        <div className="flex items-center gap-2 text-primary mb-3">
          <BookOpen className="w-5 h-5" />
          <h2 className="font-bold">O que é</h2>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          Um método baseado em consistência, não em restrições extremas. 
          A ideia é criar pequenos hábitos diários que, ao longo do tempo, 
          geram grandes resultados. Sem dietas malucas, sem sofrimento.
        </p>
      </div>

      {/* When to use */}
      <div className="card-elevated p-5">
        <div className="flex items-center gap-2 text-primary mb-3">
          <Clock className="w-5 h-5" />
          <h2 className="font-bold">Quando usar</h2>
        </div>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Todo dia, como parte da sua rotina</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Especialmente nos momentos de tentação</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Quando sentir que está perdendo o foco</span>
          </li>
        </ul>
      </div>

      {/* How to use */}
      <div className="card-elevated p-5">
        <div className="flex items-center gap-2 text-success mb-3">
          <CheckCircle className="w-5 h-5" />
          <h2 className="font-bold">Como usar</h2>
        </div>
        <ol className="space-y-3 text-muted-foreground">
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-soft text-primary text-sm font-bold flex items-center justify-center">1</span>
            <span>Registre seu peso toda manhã, em jejum</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-soft text-primary text-sm font-bold flex items-center justify-center">2</span>
            <span>Complete o checklist da rotina diária</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-soft text-primary text-sm font-bold flex items-center justify-center">3</span>
            <span>Confirme o dia concluído antes de dormir</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-soft text-primary text-sm font-bold flex items-center justify-center">4</span>
            <span>Repita. Todo dia. Sem exceção.</span>
          </li>
        </ol>
      </div>

      {/* Common mistakes */}
      <div className="card-elevated p-5">
        <div className="flex items-center gap-2 text-accent mb-3">
          <AlertTriangle className="w-5 h-5" />
          <h2 className="font-bold">Erros comuns</h2>
        </div>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1">✕</span>
            <span>Querer resultados rápidos demais</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1">✕</span>
            <span>Desistir após um dia ruim</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1">✕</span>
            <span>Comparar-se com outras pessoas</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1">✕</span>
            <span>Ignorar pequenas vitórias</span>
          </li>
        </ul>
      </div>

      {/* Daily tip */}
      <div className="card-elevated p-5 border-l-4 border-warning">
        <div className="flex items-center gap-2 text-warning mb-2">
          <Lightbulb className="w-5 h-5" />
          <h3 className="font-bold">Dica do Dia</h3>
        </div>
        <p className="text-muted-foreground">{todayTip}</p>
      </div>
    </div>
  );
};
