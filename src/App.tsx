import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pokemon } from './types';
import { PokemonSelector } from './components/PokemonSelector';
import { BattleArena } from './components/BattleArena';
import { Swords, Zap, Trophy } from 'lucide-react';

export default function App() {
  const [pokemon1, setPokemon1] = useState<Pokemon | null>(null);
  const [pokemon2, setPokemon2] = useState<Pokemon | null>(null);
  const [isBattleStarted, setIsBattleStarted] = useState(false);

  const handleStartBattle = () => {
    if (pokemon1 && pokemon2) {
      setIsBattleStarted(true);
    }
  };

  const handleReset = () => {
    setIsBattleStarted(false);
    setPokemon1(null);
    setPokemon2(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8 lg:p-12 font-sans selection:bg-emerald-500/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <Swords className="w-6 h-6 text-emerald-500" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight">PokéBattle <span className="text-emerald-500 italic">Arena</span></h1>
            </div>
            <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Advanced Combat Simulator v2.5</p>
          </div>
          
          <div className="flex items-center gap-8 border-l border-zinc-800 pl-8 hidden md:flex">
            <div className="space-y-1">
              <p className="text-[10px] uppercase text-zinc-600 font-bold tracking-tighter">Status</p>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isBattleStarted ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-700'}`} />
                <span className="text-xs font-mono text-zinc-400">{isBattleStarted ? 'IN BATTLE' : 'READY'}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase text-zinc-600 font-bold tracking-tighter">API Connection</p>
              <div className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-yellow-500" />
                <span className="text-xs font-mono text-zinc-400">POKEAPI.CO</span>
              </div>
            </div>
          </div>
        </header>

        <main>
          <AnimatePresence mode="wait">
            {!isBattleStarted ? (
              <motion.div
                key="setup"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-12"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <PokemonSelector 
                    label="Challenger 01" 
                    onSelect={setPokemon1} 
                    selectedPokemon={pokemon1} 
                  />
                  <PokemonSelector 
                    label="Challenger 02" 
                    onSelect={setPokemon2} 
                    selectedPokemon={pokemon2} 
                  />
                </div>

                <div className="flex flex-col items-center gap-6">
                  <button
                    disabled={!pokemon1 || !pokemon2}
                    onClick={handleStartBattle}
                    className={`
                      group relative px-12 py-5 rounded-2xl font-bold text-lg uppercase tracking-[0.2em] transition-all
                      ${pokemon1 && pokemon2 
                        ? 'bg-white text-black hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)]' 
                        : 'bg-zinc-900 text-zinc-700 cursor-not-allowed border border-zinc-800'}
                    `}
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      Initialize Battle
                      <Swords className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    </span>
                  </button>
                  <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                    {!pokemon1 || !pokemon2 ? 'Select two pokemon to begin' : 'System ready for deployment'}
                  </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-zinc-900">
                  <div className="p-6 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
                    <Trophy className="w-5 h-5 text-zinc-500 mb-4" />
                    <h4 className="text-sm font-bold mb-2">Real-time Stats</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">Battle logic is driven by authentic base stats including Attack, Defense, and Speed from the official PokeAPI.</p>
                  </div>
                  <div className="p-6 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
                    <Zap className="w-5 h-5 text-zinc-500 mb-4" />
                    <h4 className="text-sm font-bold mb-2">Dynamic Combat</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">Speed determines turn order. Damage is calculated using a specialized formula accounting for defensive mitigation.</p>
                  </div>
                  <div className="p-6 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
                    <Swords className="w-5 h-5 text-zinc-500 mb-4" />
                    <h4 className="text-sm font-bold mb-2">Visual Feedback</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">Experience the battle with hit animations, health bar transitions, and a celebratory finish for the victor.</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="battle"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <BattleArena 
                  pokemon1={pokemon1!} 
                  pokemon2={pokemon2!} 
                  onReset={handleReset} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="mt-20 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">© 2026 POKEBATTLE ARENA // DATA BY POKEAPI</p>
          <div className="flex gap-6">
            <a href="#" className="text-[10px] font-mono text-zinc-600 hover:text-zinc-400 transition-colors uppercase tracking-widest">Documentation</a>
            <a href="#" className="text-[10px] font-mono text-zinc-600 hover:text-zinc-400 transition-colors uppercase tracking-widest">Source Code</a>
            <a href="#" className="text-[10px] font-mono text-zinc-600 hover:text-zinc-400 transition-colors uppercase tracking-widest">Privacy Policy</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
