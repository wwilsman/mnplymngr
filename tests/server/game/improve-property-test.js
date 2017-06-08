import { describe, it } from 'mocha';
import { expect } from 'chai';

import {
  setupGameForTesting,
  modifyGameInTesting
} from '../test-helpers';

import MonopolyError from '../../../server/rules/error';
import { improveProperty } from '../../../server/actions';

describe('Game: improving properties', function() {
  setupGameForTesting({ state: {
    players: [{
      id: 'player-1',
      name: 'Player 1',
      token: 'top-hat',
      balance: 50
    }],
    properties: [{
      group: 'lightblue',
      owner: 'player-1'
    }]
  }});

  it('should add a house to the property', function() {
    const property = this.getProperty('oriental-avenue');

    this.dispatch(improveProperty('player-1', property.id));

    expect(this.getPlayer('player-1').balance).to.equal(50 - property.cost);
    expect(this.state.bank).to.equal(this.last.bank + property.cost);
    expect(this.getProperty(property.id).buildings).to.equal(1);
    expect(this.state.houses).to.equal(this.last.houses - 1);
  });

  it('should not improve an unowned property', function() {
    expect(() => this.dispatch(improveProperty('player-1', 'mediterranean-avenue')))
      .to.throw(MonopolyError, /not own/i);
    expect(this.getProperty('mediterranean-avenue').buildings).to.equal(0);
  });

  it('should not improve with insufficient funds', function() {
    this.dispatch(improveProperty('player-1', 'oriental-avenue'));

    expect(this.getProperty('oriental-avenue').buildings).to.equal(1);
    expect(() => this.dispatch(improveProperty('player-1', 'connecticut-avenue')))
      .to.throw(MonopolyError, /insufficient/i);
    expect(this.getProperty('connecticut-avenue').buildings).to.equal(0);
  });

  describe('when the property needs a hotel', function() {
    modifyGameInTesting({ state: {
      properties: [{
        group: 'lightblue',
        buildings: 4
      }]
    }});

    it('should remove 4 houses and add a hotel', function() {
      this.dispatch(improveProperty('player-1', 'oriental-avenue'));

      expect(this.getProperty('oriental-avenue').buildings).to.equal(5);
      expect(this.state.houses).to.equal(this.last.houses + 4);
      expect(this.state.hotels).to.equal(this.last.hotels - 1);
    });
  });

  describe('when a property is a railroad or utility', function() {
    modifyGameInTesting({ state: {
      properties: [{
        id: 'reading-railroad',
        owner: 'player-1'
      }, {
        id: 'electric-company',
        owner: 'player-1'
      }]
    }});

    it('should not improve a railroad', function() {
      expect(() => this.dispatch(improveProperty('player-1', 'reading-railroad')))
        .to.throw(MonopolyError, /improve a railroad/i);
      expect(this.getProperty('reading-railroad').buildings).to.equal(0);
    });

    it('should not improve a utility', function() {
      expect(() => this.dispatch(improveProperty('player-1', 'electric-company')))
        .to.throw(MonopolyError, /improve a utility/i);
      expect(this.getProperty('electric-company').buildings).to.equal(0);
    });
  });

  describe('when the player does not own the monopoly', function() {
    modifyGameInTesting({ state: {
      properties: [{
        id: 'connecticut-avenue',
        owner: 'bank'
      }]
    }});

    it('should not improve the property', function() {
      expect(() => this.dispatch(improveProperty('player-1', 'oriental-avenue')))
        .to.throw(MonopolyError, /monopoly/);
      expect(this.getProperty('oriental-avenue').buildings).to.equal(0);
    });
  });

  describe('when the property is mortgaged', function() {
    modifyGameInTesting({ state: {
      properties: [{
        id: 'oriental-avenue',
        mortgaged: true
      }]
    }});

    it('should not improve the property', function() {
      expect(() => this.dispatch(improveProperty('player-1', 'oriental-avenue')))
        .to.throw(MonopolyError, /mortgaged/i);
      expect(this.getProperty('oriental-avenue').buildings).to.equal(0);
    });

    it('should not improve other properties in the same group', function() {
      expect(() => this.dispatch(improveProperty('player-1', 'connecticut-avenue')))
        .to.throw(MonopolyError, /mortgaged/i);
      expect(this.getProperty('connecticut-avenue').buildings).to.equal(0);
    });
  });

  describe('when the property has an improvement', function() {
    modifyGameInTesting({ state: {
      properties: [{
        id: 'oriental-avenue',
        buildings: 1
      }]
    }});

    it('should not improve unevenly', function() {
      expect(() => this.dispatch(improveProperty('player-1', 'oriental-avenue')))
        .to.throw(MonopolyError, /evenly/i);
      expect(this.getProperty('oriental-avenue').buildings).to.equal(1);
    });
  });

  describe('when the property is fully improved', function() {
    modifyGameInTesting({ state: {
      properties: [{
        group: 'lightblue',
        buildings: 4
      }, {
        id: 'oriental-avenue',
        buildings: 5
      }]
    }});

    it('should not improve the property', function() {
      expect(() => this.dispatch(improveProperty('player-1', 'oriental-avenue')))
        .to.throw(MonopolyError, /fully improved/i);
      expect(this.getProperty('oriental-avenue').buildings).to.equal(5);
    });

    it('should still improve other unimproved properties', function() {
      this.dispatch(improveProperty('player-1', 'connecticut-avenue'));
      expect(this.getProperty('connecticut-avenue').buildings).to.equal(5);
    });
  });

  describe('when there are not enough houses', function() {
    modifyGameInTesting({ state: {
      houses: 0,
      properties: [{
        group: 'brown',
        buildings: 4,
        owner: 'player-1'
      }]
    }});

    it('should not improve the property when a house is needed', function() {
      expect(() => this.dispatch(improveProperty('player-1', 'oriental-avenue')))
        .to.throw(MonopolyError, /houses/i);
      expect(this.getProperty('oriental-avenue').buildings).to.equal(0);
    });

    it('should still improve the property when a hotel is needed', function() {
      this.dispatch(improveProperty('player-1', 'baltic-avenue'));
      expect(this.getProperty('baltic-avenue').buildings).to.equal(5);
    });
  });

  describe('when there are not enough hotels', function() {
    modifyGameInTesting({ state: {
      hotels: 0,
      properties: [{
        group: 'brown',
        buildings: 4,
        owner: 'player-1'
      }]
    }});

    it('should not improve the property when a hotel is needed', function() {
      expect(() => this.dispatch(improveProperty('player-1', 'baltic-avenue')))
        .to.throw(MonopolyError, /hotels/i);
      expect(this.getProperty('baltic-avenue').buildings).to.equal(4);
    });

    it('should still improve the property when a house is needed', function() {
      this.dispatch(improveProperty('player-1', 'oriental-avenue'));
      expect(this.getProperty('oriental-avenue').buildings).to.equal(1);
    });
  });
});
