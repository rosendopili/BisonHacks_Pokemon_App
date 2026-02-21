import { Pokemon } from '../types';

const BASE_URL = 'https://pokeapi.co/api/v2';

export async function fetchPokemon(nameOrId: string | number): Promise<Pokemon> {
  const response = await fetch(`${BASE_URL}/pokemon/${nameOrId.toString().toLowerCase()}`);
  if (!response.ok) {
    throw new Error('Pokemon not found');
  }
  return response.json();
}

export async function getRandomPokemon(): Promise<Pokemon> {
  const id = Math.floor(Math.random() * 898) + 1;
  return fetchPokemon(id);
}

export function getStat(pokemon: Pokemon, statName: string): number {
  return pokemon.stats.find((s) => s.stat.name === statName)?.base_stat || 0;
}

export function calculateDamage(attacker: Pokemon, defender: Pokemon): number {
  const attack = getStat(attacker, 'attack');
  const defense = getStat(defender, 'defense');
  
  // Simple damage formula: (Attack / Defense) * 20 + random variance
  const baseDamage = (attack / Math.max(defense, 1)) * 20;
  const variance = Math.random() * 0.4 + 0.8; // 0.8 to 1.2
  return Math.max(Math.floor(baseDamage * variance), 5);
}
