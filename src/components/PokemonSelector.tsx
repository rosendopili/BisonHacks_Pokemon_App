import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Pokemon } from '../types';
import { fetchPokemon } from '../services/pokemonService';

interface PokemonSelectorProps {
  onSelect: (pokemon: Pokemon) => void;
  label: string;
  selectedPokemon: Pokemon | null;
}

export const PokemonSelector: React.FC<PokemonSelectorProps> = ({ onSelect, label, selectedPokemon }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    try {
      const pokemon = await fetchPokemon(query.trim());
      onSelect(pokemon);
      setQuery('');
    } catch (err) {
      setError('Pokemon not found. Try another name or ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl">
      <h3 className="text-sm font-mono uppercase tracking-widest text-zinc-500">{label}</h3>
      
      {selectedPokemon ? (
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-zinc-800 rounded-xl flex items-center justify-center border border-zinc-700">
            <img 
              src={selectedPokemon.sprites.other['official-artwork'].front_default || selectedPokemon.sprites.front_default} 
              alt={selectedPokemon.name}
              className="w-16 h-16 object-contain"
            />
          </div>
          <div>
            <p className="text-xl font-bold capitalize">{selectedPokemon.name}</p>
            <div className="flex gap-1 mt-1">
              {selectedPokemon.types.map(t => (
                <span key={t.type.name} className="text-[10px] uppercase font-bold px-2 py-0.5 bg-zinc-700 rounded text-zinc-300">
                  {t.type.name}
                </span>
              ))}
            </div>
          </div>
          <button 
            onClick={() => onSelect(null as any)}
            className="ml-auto text-xs text-zinc-500 hover:text-red-400 transition-colors"
          >
            Change
          </button>
        </div>
      ) : (
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or ID..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 animate-spin" />
          )}
          {error && <p className="text-[10px] text-red-500 mt-2 ml-1">{error}</p>}
        </form>
      )}
    </div>
  );
};
