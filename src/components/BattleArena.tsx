import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pokemon, BattleState } from '../types';
import { calculateDamage, getStat } from '../services/pokemonService';
import confetti from 'canvas-confetti';
import { Heart, Sword, Shield, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

interface BattleArenaProps {
  pokemon1: Pokemon;
  pokemon2: Pokemon;
  onReset: () => void;
}

export const BattleArena: React.FC<BattleArenaProps> = ({ pokemon1, pokemon2, onReset }) => {
  const [state, setState] = React.useState<BattleState>({
    pokemon1,
    pokemon2,
    hp1: getStat(pokemon1, 'hp') * 5,
    hp2: getStat(pokemon2, 'hp') * 5,
    maxHp1: getStat(pokemon1, 'hp') * 5,
    maxHp2: getStat(pokemon2, 'hp') * 5,
    logs: [`A wild battle begins between ${pokemon1.name.toUpperCase()} and ${pokemon2.name.toUpperCase()}!`],
    isBattling: true,
    winner: null,
    currentTurn: getStat(pokemon1, 'speed') >= getStat(pokemon2, 'speed') ? 1 : 2,
  });

  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.logs]);

  useEffect(() => {
    if (!state.isBattling || state.winner) return;

    const timer = setTimeout(() => {
      processTurn();
    }, 1500);

    return () => clearTimeout(timer);
  }, [state.currentTurn, state.isBattling]);

  const processTurn = () => {
    setState(prev => {
      const attacker = prev.currentTurn === 1 ? prev.pokemon1! : prev.pokemon2!;
      const defender = prev.currentTurn === 1 ? prev.pokemon2! : prev.pokemon1!;
      
      const damage = calculateDamage(attacker, defender);
      const newHp = Math.max(0, (prev.currentTurn === 1 ? prev.hp2 : prev.hp1) - damage);
      
      const log = `${attacker.name.toUpperCase()} deals ${damage} damage to ${defender.name.toUpperCase()}!`;
      
      const nextTurn = prev.currentTurn === 1 ? 2 : 1;
      const isGameOver = newHp <= 0;
      
      if (isGameOver) {
        const winner = attacker;
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']
        });
        
        return {
          ...prev,
          hp1: prev.currentTurn === 2 ? newHp : prev.hp1,
          hp2: prev.currentTurn === 1 ? newHp : prev.hp2,
          logs: [...prev.logs, log, `${defender.name.toUpperCase()} fainted!`, `${attacker.name.toUpperCase()} wins the battle!`],
          isBattling: false,
          winner: winner,
        };
      }

      return {
        ...prev,
        hp1: prev.currentTurn === 2 ? newHp : prev.hp1,
        hp2: prev.currentTurn === 1 ? newHp : prev.hp2,
        logs: [...prev.logs, log],
        currentTurn: nextTurn as 1 | 2,
      };
    });
  };

  const HealthBar = ({ current, max, name }: { current: number, max: number, name: string }) => {
    const percentage = (current / max) * 100;
    const color = percentage > 50 ? 'bg-emerald-500' : percentage > 20 ? 'bg-yellow-500' : 'bg-red-500';
    
    return (
      <div className="w-full">
        <div className="flex justify-between items-end mb-1">
          <span className="text-xs font-mono uppercase text-zinc-400">{name}</span>
          <span className="text-[10px] font-mono text-zinc-500">{current} / {max} HP</span>
        </div>
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
          <motion.div 
            initial={{ width: '100%' }}
            animate={{ width: `${percentage}%` }}
            className={`h-full ${color} transition-colors duration-500`}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl mx-auto">
      {/* Pokemon 1 */}
      <div className="flex flex-col items-center gap-6 p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/20" />
        <AnimatePresence mode="wait">
          <motion.div
            key={state.hp1}
            animate={state.currentTurn === 2 && state.isBattling ? { x: [0, -10, 10, -10, 0] } : {}}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <img 
              src={pokemon1.sprites.other['official-artwork'].front_default} 
              alt={pokemon1.name}
              className={`w-48 h-48 object-contain drop-shadow-[0_0_30px_rgba(16,185,129,0.2)] ${state.hp1 <= 0 ? 'grayscale opacity-50' : ''}`}
            />
          </motion.div>
        </AnimatePresence>
        <div className="w-full space-y-4">
          <h2 className="text-2xl font-bold capitalize text-center">{pokemon1.name}</h2>
          <HealthBar current={state.hp1} max={state.maxHp1} name="Health" />
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800 flex items-center gap-2">
              <Sword className="w-3 h-3 text-zinc-500" />
              <span className="text-xs font-mono">{getStat(pokemon1, 'attack')}</span>
            </div>
            <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800 flex items-center gap-2">
              <Shield className="w-3 h-3 text-zinc-500" />
              <span className="text-xs font-mono">{getStat(pokemon1, 'defense')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Battle Logs & Controls */}
      <div className="flex flex-col gap-4 h-[500px]">
        <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 overflow-y-auto font-mono text-sm space-y-2 scrollbar-hide">
          {state.logs.map((log, i) => (
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              key={i} 
              className={cn(
                "border-l-2 pl-3 py-1",
                log.includes('wins') ? "border-emerald-500 text-emerald-400 font-bold" : 
                log.includes('fainted') ? "border-red-500 text-red-400" : "border-zinc-800 text-zinc-400"
              )}
            >
              {log}
            </motion.p>
          ))}
          <div ref={logEndRef} />
        </div>
        
        {!state.isBattling && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onReset}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/20 uppercase tracking-widest"
          >
            New Battle
          </motion.button>
        )}
      </div>

      {/* Pokemon 2 */}
      <div className="flex flex-col items-center gap-6 p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/20" />
        <AnimatePresence mode="wait">
          <motion.div
            key={state.hp2}
            animate={state.currentTurn === 1 && state.isBattling ? { x: [0, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <img 
              src={pokemon2.sprites.other['official-artwork'].front_default} 
              alt={pokemon2.name}
              className={`w-48 h-48 object-contain drop-shadow-[0_0_30px_rgba(59,130,246,0.2)] ${state.hp2 <= 0 ? 'grayscale opacity-50' : ''}`}
            />
          </motion.div>
        </AnimatePresence>
        <div className="w-full space-y-4">
          <h2 className="text-2xl font-bold capitalize text-center">{pokemon2.name}</h2>
          <HealthBar current={state.hp2} max={state.maxHp2} name="Health" />
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800 flex items-center gap-2">
              <Sword className="w-3 h-3 text-zinc-500" />
              <span className="text-xs font-mono">{getStat(pokemon2, 'attack')}</span>
            </div>
            <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-800 flex items-center gap-2">
              <Shield className="w-3 h-3 text-zinc-500" />
              <span className="text-xs font-mono">{getStat(pokemon2, 'defense')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
