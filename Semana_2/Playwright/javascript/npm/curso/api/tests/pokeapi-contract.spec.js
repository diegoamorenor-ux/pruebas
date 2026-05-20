/**
 * Pruebas API con PokéAPI + Playwright JavaScript
 * 
 * Conceptos cubiertos:
 * - Contract Testing: validar estructura de respuestas
 * - DDT (Data Driven Testing): múltiples datasets
 * - Validaciones: status, tipos, campos
 * - Edge cases: errores, paginación
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'https://pokeapi.co/api/v2';

// ==================== CONTRACT TESTING ====================

test('Contract: Pokemon debe tener estructura válida', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/pokemon/1`);
  
  expect(response.status()).toBe(200);
  
  const pokemon = await response.json();
  
  // Validar que todos los campos requeridos existen
  expect(pokemon).toHaveProperty('id');
  expect(pokemon).toHaveProperty('name');
  expect(pokemon).toHaveProperty('height');
  expect(pokemon).toHaveProperty('weight');
  expect(pokemon).toHaveProperty('base_experience');
  expect(pokemon).toHaveProperty('order');
  expect(pokemon).toHaveProperty('is_default');
  
  // Validar tipos de datos
  expect(typeof pokemon.id).toBe('number');
  expect(typeof pokemon.name).toBe('string');
  expect(typeof pokemon.height).toBe('number');
  expect(typeof pokemon.weight).toBe('number');
  
  // Validar arrays
  expect(Array.isArray(pokemon.abilities)).toBe(true);
  expect(pokemon.abilities.length).toBeGreaterThan(0);
  
  expect(Array.isArray(pokemon.types)).toBe(true);
  expect(pokemon.types.length).toBeGreaterThan(0);
  
  expect(Array.isArray(pokemon.stats)).toBe(true);
  expect(pokemon.stats).toHaveLength(6); // Siempre 6 stats
});

test('Contract: Type debe tener estructura válida', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/type/1`);
  
  expect(response.status()).toBe(200);
  
  const type = await response.json();
  
  expect(type).toHaveProperty('id');
  expect(type).toHaveProperty('name');
  expect(type).toHaveProperty('damage_relations');
  
  const damageRel = type.damage_relations;
  expect(damageRel).toHaveProperty('no_damage_to');
  expect(damageRel).toHaveProperty('half_damage_to');
  expect(damageRel).toHaveProperty('double_damage_to');
  expect(damageRel).toHaveProperty('no_damage_from');
  expect(damageRel).toHaveProperty('half_damage_from');
  expect(damageRel).toHaveProperty('double_damage_from');
});

test('Contract: Ability debe tener estructura válida', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/ability/1`);
  
  expect(response.status()).toBe(200);
  
  const ability = await response.json();
  
  expect(ability).toHaveProperty('id');
  expect(ability).toHaveProperty('name');
  expect(ability).toHaveProperty('is_main_series');
  expect(ability).toHaveProperty('generation');
  expect(ability).toHaveProperty('effect_entries');
  
  expect(typeof ability.name).toBe('string');
  expect(ability.name.length).toBeGreaterThan(0);
});

// ==================== DATA DRIVEN TESTING (DDT) ====================

const pokemonIds = [1, 4, 7, 25, 149];
for (const id of pokemonIds) {
  test(`DDT: Obtener Pokémon por ID ${id}`, async ({ request }) => {
    const response = await request.get(`${BASE_URL}/pokemon/${id}`);
    
    expect(response.status()).toBe(200);
    
    const pokemon = await response.json();
    expect(pokemon.id).toBe(id);
    expect(pokemon.name).toBeTruthy();
  });
}

const pokemonNames = ['bulbasaur', 'charmander', 'squirtle', 'pikachu', 'meowth'];
for (const name of pokemonNames) {
  test(`DDT: Obtener Pokémon por nombre "${name}"`, async ({ request }) => {
    const response = await request.get(`${BASE_URL}/pokemon/${name}`);
    
    expect(response.status()).toBe(200);
    
    const pokemon = await response.json();
    expect(pokemon.name).toBe(name);
    expect(pokemon.id).toBeGreaterThan(0);
  });
}

// DDT con múltiples parámetros
const typeTestCases = [
  { id: 1, name: 'Normal' },
  { id: 10, name: 'Fire' },
  { id: 4, name: 'Poison' },
  { id: 3, name: 'Flying' },
  { id: 5, name: 'Ground' },
];
for (const testCase of typeTestCases) {
  test(`DDT: Obtener Type ID ${testCase.id} (${testCase.name})`, async ({ request }) => {
    const response = await request.get(`${BASE_URL}/type/${testCase.id}`);
    
    expect(response.status()).toBe(200);
    
    const type = await response.json();
    expect(type.id).toBe(testCase.id);
    expect(type.name).toBeTruthy();
  });
}

// ==================== VALIDACIONES ====================

test('Validar: HTTP 200 y Content-Type JSON', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/pokemon/1`);
  
  expect(response.status()).toBe(200);
  
  const contentType = response.headers()['content-type'];
  expect(contentType).toContain('application/json');
});

test('Validar: Pokemon tiene stats razonables', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/pokemon/pikachu`);
  expect(response.status()).toBe(200);
  
  const pokemon = await response.json();
  
  expect(pokemon.height).toBeGreaterThanOrEqual(0);
  expect(pokemon.weight).toBeGreaterThanOrEqual(0);
});

test('Validar: Base experience es válido', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/pokemon/1`);
  expect(response.status()).toBe(200);
  
  const pokemon = await response.json();
  expect(pokemon.base_experience).toBeGreaterThanOrEqual(0);
});

// ==================== EDGE CASES ====================

test('Edge Case: Pokémon inexistente retorna 404', async ({ request }) => {
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
  
  const result = await response.json();
  expect(result.results).toHaveLength(5);
  expect(result.count).toBeGreaterThan(0);
});

test('Edge Case: Paginación por defecto (20 items)', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/pokemon`);
  
  expect(response.status()).toBe(200);
  
  const result = await response.json();
  expect(result.results).toHaveLength(20);
  expect(result.count).toBeGreaterThan(900);
});

test('Edge Case: Primera página tiene next pero no previous', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/pokemon?limit=10&offset=0`);
  
  expect(response.status()).toBe(200);
  
  const result = await response.json();
  expect(result.next).toBeTruthy();
  expect(result.previous).toBeNull();
});

// ==================== VALIDACIONES DE NEGOCIO ====================

test('Negocio: Pikachu es tipo Electric', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/pokemon/pikachu`);
  expect(response.status()).toBe(200);
  
  const pokemon = await response.json();
  
  const hasElectric = pokemon.types.some(t => t.type.name === 'electric');
  expect(hasElectric).toBe(true);
});

test('Negocio: All Pokemon tienen exactamente 6 stats', async ({ request }) => {
  const pokemonIds = [1, 25, 149];
  
  for (const id of pokemonIds) {
    const response = await request.get(`${BASE_URL}/pokemon/${id}`);
    expect(response.status()).toBe(200);
    
    const pokemon = await response.json();
    expect(pokemon.stats).toHaveLength(6);
  }
});

test('Negocio: Abilities tienen estructura válida', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/pokemon/1`);
  expect(response.status()).toBe(200);
  
  const pokemon = await response.json();
  expect(pokemon.abilities.length).toBeGreaterThan(0);
  
  pokemon.abilities.forEach(ability => {
    expect(ability).toHaveProperty('ability');
    expect(ability).toHaveProperty('is_hidden');
    expect(typeof ability.is_hidden).toBe('boolean');
    expect(ability.ability).toHaveProperty('name');
    expect(ability.ability).toHaveProperty('url');
  });
});

test('Negocio: Order es consistente en múltiples llamadas', async ({ request }) => {
  const response1 = await request.get(`${BASE_URL}/pokemon/1`);
  const response2 = await request.get(`${BASE_URL}/pokemon/1`);
  
  const pokemon1 = await response1.json();
  const pokemon2 = await response2.json();
  
  expect(pokemon1.order).toBe(pokemon2.order);
});
