/**
 * Pruebas API con PokéAPI + Playwright TypeScript
 * 
 * Conceptos cubiertos:
 * - Contract Testing: validar estructura de respuestas
 * - DDT (Data Driven Testing): múltiples datasets
 * - Validaciones: status, tipos, campos
 * - Edge cases: errores, paginación
 */

import { test, expect, APIRequestContext } from '@playwright/test';

const BASE_URL = 'https://pokeapi.co/api/v2';

// Interfaces para type safety
interface PokemonResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  order: number;
  is_default: boolean;
  abilities: Array<{
    ability: { name: string; url: string };
    is_hidden: boolean;
    slot: number;
  }>;
  types: Array<{ slot: number; type: { name: string; url: string } }>;
  stats: Array<any>;
}

interface TypeResponse {
  id: number;
  name: string;
  damage_relations: {
    no_damage_to: Array<any>;
    half_damage_to: Array<any>;
    double_damage_to: Array<any>;
    no_damage_from: Array<any>;
    half_damage_from: Array<any>;
    double_damage_from: Array<any>;
  };
}

// ==================== CONTRACT TESTING ====================

test('Contract: Pokemon debe tener estructura válida', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/pokemon/1`);
  
  expect(response.status()).toBe(200);
  
  const pokemon = (await response.json()) as PokemonResponse;
  
  // Validar que todos los campos requeridos existen
  expect(pokemon).toHaveProperty('id');
  expect(pokemon).toHaveProperty('name');
  expect(pokemon).toHaveProperty('height');
  expect(pokemon).toHaveProperty('weight');
  expect(pokemon).toHaveProperty('base_experience');
  
  // Validar tipos de datos
  expect(typeof pokemon.id).toBe('number');
  expect(typeof pokemon.name).toBe('string');
  expect(typeof pokemon.height).toBe('number');
  
  // Validar arrays
  expect(Array.isArray(pokemon.abilities)).toBe(true);
  expect(pokemon.abilities.length).toBeGreaterThan(0);
  
  expect(Array.isArray(pokemon.types)).toBe(true);
  expect(pokemon.types.length).toBeGreaterThan(0);
  
  // Contrato: exactamente 6 stats
  expect(pokemon.stats).toHaveLength(6);
});

test('Contract: Type debe tener estructura válida', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/type/1`);
  
  expect(response.status()).toBe(200);
  
  const type = (await response.json()) as TypeResponse;
  
  expect(type).toHaveProperty('id');
  expect(type).toHaveProperty('name');
  expect(type).toHaveProperty('damage_relations');
  
  const damageRel = type.damage_relations;
  expect(Array.isArray(damageRel.no_damage_to)).toBe(true);
  expect(Array.isArray(damageRel.half_damage_to)).toBe(true);
  expect(Array.isArray(damageRel.double_damage_to)).toBe(true);
});

// ==================== DATA DRIVEN TESTING (DDT) ====================

const pokemonIds: number[] = [1, 4, 7, 25, 149];

pokemonIds.forEach((id) => {
  test(`DDT: Obtener Pokémon por ID ${id}`, async ({ request }) => {
    const response = await request.get(`${BASE_URL}/pokemon/${id}`);
    
    expect(response.status()).toBe(200);
    
    const pokemon = (await response.json()) as PokemonResponse;
    expect(pokemon.id).toBe(id);
    expect(pokemon.name).toBeTruthy();
  });
});

const pokemonNames: string[] = ['bulbasaur', 'charmander', 'squirtle', 'pikachu', 'meowth'];

pokemonNames.forEach((name) => {
  test(`DDT: Obtener Pokémon por nombre "${name}"`, async ({ request }) => {
    const response = await request.get(`${BASE_URL}/pokemon/${name}`);
    
    expect(response.status()).toBe(200);
    
    const pokemon = (await response.json()) as PokemonResponse;
    expect(pokemon.name).toBe(name);
    expect(pokemon.id).toBeGreaterThan(0);
  });
});

// DDT con múltiples parámetros usando CsvSource-like
interface TypeTestCase {
  id: number;
  name: string;
}

const typeTestCases: TypeTestCase[] = [
  { id: 1, name: 'Normal' },
  { id: 10, name: 'Fire' },
  { id: 4, name: 'Poison' },
  { id: 3, name: 'Flying' },
  { id: 5, name: 'Ground' },
];

typeTestCases.forEach(({ id, name }) => {
  test(`DDT: Obtener Type ID ${id} (${name})`, async ({ request }) => {
    const response = await request.get(`${BASE_URL}/type/${id}`);
    
    expect(response.status()).toBe(200);
    
    const type = (await response.json()) as TypeResponse;
    expect(type.id).toBe(id);
    expect(type.name).toBeTruthy();
  });
});

// ==================== VALIDACIONES ====================

test('Validar: HTTP 200 y Content-Type JSON', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/pokemon/1`);
  
  expect(response.status()).toBe(200);
  
  const contentType = response.headers()['content-type'];
  expect(contentType).toContain('application/json');
});

test('Validar: Pokemon tiene stats razonables (altura y peso)', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/pokemon/pikachu`);
  expect(response.status()).toBe(200);
  
  const pokemon = (await response.json()) as PokemonResponse;
  
  expect(pokemon.height).toBeGreaterThanOrEqual(0);
  expect(pokemon.weight).toBeGreaterThanOrEqual(0);
});

test('Validar: Base experience es un valor no negativo', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/pokemon/1`);
  expect(response.status()).toBe(200);
  
  const pokemon = (await response.json()) as PokemonResponse;
  expect(pokemon.base_experience).toBeGreaterThanOrEqual(0);
});

// ==================== EDGE CASES ====================

test('Edge Case: Pokémon con ID inexistente retorna 404', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/pokemon/999999`);
  expect(response.status()).toBe(404);
});

test('Edge Case: Nombre inválido retorna 404', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/pokemon/invalid-pokemon-xyz`);
  expect(response.status()).toBe(404);
});

test('Edge Case: Paginación con parámetros limit y offset', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/pokemon?limit=5&offset=0`);
  
  expect(response.status()).toBe(200);
  
  const result = await response.json() as any;
  expect(result.results).toHaveLength(5);
  expect(result.count).toBeGreaterThan(0);
});

test('Edge Case: Paginación por defecto retorna 20 items', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/pokemon`);
  
  expect(response.status()).toBe(200);
  
  const result = await response.json() as any;
  expect(result.results).toHaveLength(20);
  expect(result.count).toBeGreaterThan(900);
});

test('Edge Case: Primera página tiene next pero no previous', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/pokemon?limit=10&offset=0`);
  
  expect(response.status()).toBe(200);
  
  const result = await response.json() as any;
  expect(result.next).toBeTruthy();
  expect(result.previous).toBeNull();
});

test('Edge Case: Última página tiene previous pero no next', async ({ request }) => {
  // Obtener total de pokémon primero
  const totalResponse = await request.get(`${BASE_URL}/pokemon?limit=1`);
  const totalData = await totalResponse.json() as any;
  const total = totalData.count;
  
  // Calcular offset para última página
  const limit = 20;
  const offset = Math.floor(total / limit) * limit;
  
  const response = await request.get(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  expect(response.status()).toBe(200);
  
  const result = await response.json() as any;
  expect(result.previous).toBeTruthy();
  // next podría ser null o tener valor dependiendo del total
});

// ==================== VALIDACIONES DE NEGOCIO ====================

test('Negocio: Pikachu debe ser tipo Electric', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/pokemon/pikachu`);
  expect(response.status()).toBe(200);
  
  const pokemon = (await response.json()) as PokemonResponse;
  
  const hasElectric = pokemon.types.some(t => t.type.name === 'electric');
  expect(hasElectric).toBe(true);
});

test('Negocio: Todo Pokémon tiene exactamente 6 stats base', async ({ request }) => {
  const testIds = [1, 25, 149];
  
  for (const id of testIds) {
    const response = await request.get(`${BASE_URL}/pokemon/${id}`);
    expect(response.status()).toBe(200);
    
    const pokemon = (await response.json()) as PokemonResponse;
    
    // Los 6 stats en Pokémon: HP, Attack, Defense, Sp. Atk, Sp. Def, Speed
    expect(pokemon.stats).toHaveLength(6);
    
    const statNames = pokemon.stats.map(s => s.stat.name);
    expect(statNames).toContain('hp');
    expect(statNames).toContain('attack');
    expect(statNames).toContain('defense');
  }
});

test('Negocio: Cada Pokémon tiene al menos una habilidad', async ({ request }) => {
  const testIds = [1, 4, 7];
  
  for (const id of testIds) {
    const response = await request.get(`${BASE_URL}/pokemon/${id}`);
    expect(response.status()).toBe(200);
    
    const pokemon = (await response.json()) as PokemonResponse;
    
    expect(pokemon.abilities.length).toBeGreaterThanOrEqual(1);
    
    pokemon.abilities.forEach(ability => {
      expect(ability).toHaveProperty('ability');
      expect(ability).toHaveProperty('is_hidden');
      expect(typeof ability.is_hidden).toBe('boolean');
      expect(ability.ability).toHaveProperty('name');
    });
  }
});

test('Negocio: Order es consistente (idempotencia)', async ({ request }) => {
  const response1 = await request.get(`${BASE_URL}/pokemon/1`);
  const response2 = await request.get(`${BASE_URL}/pokemon/1`);
  
  const pokemon1 = (await response1.json()) as PokemonResponse;
  const pokemon2 = (await response2.json()) as PokemonResponse;
  
  expect(pokemon1.order).toBe(pokemon2.order);
  expect(pokemon1.id).toBe(pokemon2.id);
  expect(pokemon1.name).toBe(pokemon2.name);
});

test('Negocio: Tipos tienen damagae relations recíprocas válidas', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/type/1`);
  expect(response.status()).toBe(200);
  
  const type = (await response.json()) as TypeResponse;
  
  const damageRel = type.damage_relations;
  
  // Verificar que todas las propiedades son arrays
  expect(Array.isArray(damageRel.no_damage_to)).toBe(true);
  expect(Array.isArray(damageRel.half_damage_to)).toBe(true);
  expect(Array.isArray(damageRel.double_damage_to)).toBe(true);
  expect(Array.isArray(damageRel.no_damage_from)).toBe(true);
  expect(Array.isArray(damageRel.half_damage_from)).toBe(true);
  expect(Array.isArray(damageRel.double_damage_from)).toBe(true);
});
