/**
 * Pruebas API con PokéAPI + Cypress
 * 
 * Conceptos cubiertos:
 * - Contract Testing: validar estructura de respuestas
 * - DDT (Data Driven Testing): múltiples datasets
 * - Validaciones: status, tipos, campos
 * - Edge cases: errores, paginación
 */

const BASE_URL = 'https://pokeapi.co/api/v2';

describe('PokéAPI Contract Tests', () => {
  // ==================== CONTRACT TESTING ====================

  describe('Contract: Pokemon', () => {
    it('debe tener estructura válida', () => {
      cy.request({
        method: 'GET',
        url: `${BASE_URL}/pokemon/1`,
        failOnStatusCode: false,
      }).then((response) => {
        // Validar status
        expect(response.status).to.equal(200);
        
        const pokemon = response.body;
        
        // Validar campos requeridos
        expect(pokemon).to.have.property('id');
        expect(pokemon).to.have.property('name');
        expect(pokemon).to.have.property('height');
        expect(pokemon).to.have.property('weight');
        expect(pokemon).to.have.property('base_experience');
        expect(pokemon).to.have.property('order');
        expect(pokemon).to.have.property('is_default');
        
        // Validar tipos
        expect(pokemon.id).to.be.a('number');
        expect(pokemon.name).to.be.a('string');
        expect(pokemon.height).to.be.a('number');
        expect(pokemon.weight).to.be.a('number');
        
        // Validar arrays
        expect(pokemon.abilities).to.be.an('array').that.has.lengthOf.greaterThan(0);
        expect(pokemon.types).to.be.an('array').that.has.lengthOf.greaterThan(0);
        expect(pokemon.stats).to.be.an('array').with.lengthOf(6); // Siempre 6 stats
      });
    });
  });

  describe('Contract: Type', () => {
    it('debe tener estructura válida', () => {
      cy.request({
        method: 'GET',
        url: `${BASE_URL}/type/1`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200);
        
        const type = response.body;
        
        expect(type).to.have.property('id');
        expect(type).to.have.property('name');
        expect(type).to.have.property('damage_relations');
        
        const damageRel = type.damage_relations;
        expect(damageRel).to.have.all.keys(
          'no_damage_to',
          'half_damage_to',
          'double_damage_to',
          'no_damage_from',
          'half_damage_from',
          'double_damage_from'
        );
        
        // Todas deben ser arrays
        expect(damageRel.no_damage_to).to.be.an('array');
        expect(damageRel.half_damage_to).to.be.an('array');
        expect(damageRel.double_damage_to).to.be.an('array');
      });
    });
  });

  describe('Contract: Ability', () => {
    it('debe tener estructura válida', () => {
      cy.request({
        method: 'GET',
        url: `${BASE_URL}/ability/1`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200);
        
        const ability = response.body;
        
        expect(ability).to.have.property('id');
        expect(ability).to.have.property('name');
        expect(ability).to.have.property('is_main_series');
        expect(ability).to.have.property('generation');
        expect(ability).to.have.property('effect_entries');
        
        expect(ability.name).to.be.a('string');
        expect(ability.name.length).to.be.greaterThan(0);
      });
    });
  });

  // ==================== DATA DRIVEN TESTING (DDT) ====================

  describe('DDT: Múltiples Pokémon por ID', () => {
    const pokemonIds = [1, 4, 7, 25, 149];
    
    pokemonIds.forEach((id) => {
      it(`obtener Pokémon ID ${id}`, () => {
        cy.request({
          method: 'GET',
          url: `${BASE_URL}/pokemon/${id}`,
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body.id).to.equal(id);
          expect(response.body.name).to.not.be.empty;
        });
      });
    });
  });

  describe('DDT: Múltiples Pokémon por nombre', () => {
    const pokemonNames = ['bulbasaur', 'charmander', 'squirtle', 'pikachu', 'meowth'];
    
    pokemonNames.forEach((name) => {
      it(`obtener Pokémon "${name}"`, () => {
        cy.request({
          method: 'GET',
          url: `${BASE_URL}/pokemon/${name}`,
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body.name).to.equal(name);
          expect(response.body.id).to.be.greaterThan(0);
        });
      });
    });
  });

  describe('DDT: Multiple Types', () => {
    const typeTestCases = [
      { id: 1, name: 'Normal' },
      { id: 10, name: 'Fire' },
      { id: 4, name: 'Poison' },
      { id: 3, name: 'Flying' },
      { id: 5, name: 'Ground' },
    ];
    
    typeTestCases.forEach(({ id, name }) => {
      it(`obtener Type ID ${id} (${name})`, () => {
        cy.request({
          method: 'GET',
          url: `${BASE_URL}/type/${id}`,
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body.id).to.equal(id);
          expect(response.body.name).to.not.be.empty;
        });
      });
    });
  });

  // ==================== VALIDACIONES ====================

  describe('Validaciones', () => {
    it('HTTP 200 y Content-Type JSON', () => {
      cy.request({
        method: 'GET',
        url: `${BASE_URL}/pokemon/1`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.headers['content-type']).to.include('application/json');
      });
    });

    it('Pokémon tiene stats razonables', () => {
      cy.request({
        method: 'GET',
        url: `${BASE_URL}/pokemon/pikachu`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.height).to.be.least(0);
        expect(response.body.weight).to.be.least(0);
      });
    });

    it('Base experience es válido', () => {
      cy.request({
        method: 'GET',
        url: `${BASE_URL}/pokemon/1`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.base_experience).to.be.least(0);
      });
    });
  });

  // ==================== EDGE CASES ====================

  describe('Edge Cases', () => {
    it('Pokémon inexistente retorna 404', () => {
      cy.request({
        method: 'GET',
        url: `${BASE_URL}/pokemon/999999`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
      });
    });

    it('Nombre inválido retorna 404', () => {
      cy.request({
        method: 'GET',
        url: `${BASE_URL}/pokemon/invalid-pokemon-xyz`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
      });
    });

    it('Paginación con limit y offset', () => {
      cy.request({
        method: 'GET',
        url: `${BASE_URL}/pokemon?limit=5&offset=0`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.results).to.have.lengthOf(5);
        expect(response.body.count).to.be.greaterThan(0);
      });
    });

    it('Paginación por defecto retorna 20 items', () => {
      cy.request({
        method: 'GET',
        url: `${BASE_URL}/pokemon`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.results).to.have.lengthOf(20);
        expect(response.body.count).to.be.greaterThan(900);
      });
    });

    it('Primera página tiene next pero no previous', () => {
      cy.request({
        method: 'GET',
        url: `${BASE_URL}/pokemon?limit=10&offset=0`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.next).to.not.be.null;
        expect(response.body.previous).to.be.null;
      });
    });

    it('Offset muy grande retorna items vacío', () => {
      cy.request({
        method: 'GET',
        url: `${BASE_URL}/pokemon?limit=20&offset=100000`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.results).to.be.an('array');
      });
    });
  });

  // ==================== VALIDACIONES DE NEGOCIO ====================

  describe('Validaciones de Negocio', () => {
    it('Pikachu es tipo Electric', () => {
      cy.request({
        method: 'GET',
        url: `${BASE_URL}/pokemon/pikachu`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200);
        
        const types = response.body.types;
        const hasElectric = types.some(t => t.type.name === 'electric');
        
        expect(hasElectric).to.be.true;
      });
    });

    it('Todo Pokémon tiene exactamente 6 stats', () => {
      const testIds = [1, 25, 149];
      
      cy.wrap(testIds).each((id) => {
        cy.request({
          method: 'GET',
          url: `${BASE_URL}/pokemon/${id}`,
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body.stats).to.have.lengthOf(6);
          
          // Los 6 stats: HP, Attack, Defense, Sp. Atk, Sp. Def, Speed
          const statNames = response.body.stats.map(s => s.stat.name);
          expect(statNames).to.include('hp');
          expect(statNames).to.include('attack');
          expect(statNames).to.include('defense');
        });
      });
    });

    it('Cada Pokémon tiene al menos una habilidad', () => {
      const testIds = [1, 4, 7];
      
      cy.wrap(testIds).each((id) => {
        cy.request({
          method: 'GET',
          url: `${BASE_URL}/pokemon/${id}`,
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.equal(200);
          
          const abilities = response.body.abilities;
          expect(abilities).to.have.lengthOf.greaterThan(0);
          
          abilities.forEach(ability => {
            expect(ability).to.have.property('ability');
            expect(ability).to.have.property('is_hidden');
            expect(ability.is_hidden).to.be.a('boolean');
            expect(ability.ability).to.have.property('name');
          });
        });
      });
    });

    it('Order es consistente (idempotencia)', () => {
      cy.request({
        method: 'GET',
        url: `${BASE_URL}/pokemon/1`,
        failOnStatusCode: false,
      }).then((response1) => {
        const order1 = response1.body.order;
        const id1 = response1.body.id;
        
        cy.request({
          method: 'GET',
          url: `${BASE_URL}/pokemon/1`,
          failOnStatusCode: false,
        }).then((response2) => {
          const order2 = response2.body.order;
          const id2 = response2.body.id;
          
          expect(order1).to.equal(order2);
          expect(id1).to.equal(id2);
        });
      });
    });

    it('Damage relations tienen estructura válida', () => {
      cy.request({
        method: 'GET',
        url: `${BASE_URL}/type/1`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200);
        
        const damageRel = response.body.damage_relations;
        
        expect(damageRel.no_damage_to).to.be.an('array');
        expect(damageRel.half_damage_to).to.be.an('array');
        expect(damageRel.double_damage_to).to.be.an('array');
        expect(damageRel.no_damage_from).to.be.an('array');
        expect(damageRel.half_damage_from).to.be.an('array');
        expect(damageRel.double_damage_from).to.be.an('array');
      });
    });
  });
});
