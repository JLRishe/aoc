const day = '11';
const dayPath = `../${day}`;

const assert = require('assert');
const { solution: { ps: [p1, p2] } } = require(dayPath);
const { incrementPassword } = require(`${dayPath}/passwordIncrement`);
const { isValidPassword, hasTwoPairs, hasIncreasingStraight } = require(`${dayPath}/passwordValidate`);

describe(`day ${day}`, () => {
    it('should validate passwords', () => {
        assert.equal(isValidPassword('hijklmmn'), false);
        assert.equal(isValidPassword('abbceffg'), false);
        assert.equal(isValidPassword('abbcegjk'), false);
        assert.equal(isValidPassword('abcdffaa'), true);
        assert.equal(isValidPassword('ghjaabcc'), true);
    });
    
    it('should increment passwords', () => {
        assert.equal(incrementPassword('abczzzzz'), 'abdaaaaa');
        assert.equal(incrementPassword('gnmblzzz'), 'gnmbmaaa');
    });
    
    it('should find two pairs of characters', () => {
        assert.equal(hasTwoPairs('aajlnbbozz'), true, 'three pairs');
        assert.equal(hasTwoPairs('aajlnozzk'), true, 'two pairs');
        assert.equal(hasTwoPairs('slejmmmop'), false, 'three characters');
        assert.equal(hasTwoPairs('nkommamm'), false, 'two same pairs');
    });
    
    it('should find increasing straights', () => {
        assert.equal(hasIncreasingStraight('ahelpqrs'), true, 'pqr');
        assert.equal(hasIncreasingStraight('eiwopabc'), true, 'abc');
        assert.equal(hasIncreasingStraight('jklaksle'), true, 'jkl');
        assert.equal(hasIncreasingStraight('ineowpx'), false, 'nothing');
        assert.equal(hasIncreasingStraight('skeiwoyzam'), false, 'yza');
    });
    
    it('should work on samples for p1', () => {
        assert.equal(p1('abcdfeno'), 'abcdffaa');
    });
    
    it('should work on samples for p2', () => {
        assert.equal(p2('abcdefno'), 'abcdffbb');
    });
});