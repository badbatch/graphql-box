import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import argumentAst from '../../data/misc/argument-ast/index.json';
import { parseFieldArguments } from '../../../src/helpers/parsing';

chai.use(dirtyChai);

describe('parseFieldArguments method', () => {
  describe('when arguments of objects, arrays and scalars are passed in', () => {
    it('should return a plain object representation of the arguments', () => {
      expect(parseFieldArguments(argumentAst)).to.eql({
        connection: { after: 'Ni4xNTk4NjY6NzQ4NDk=', first: '6' },
        cursor: { primaryType: 'number' },
        id: ['402-5806', '522-7645'],
        media: 'movie',
        movie: { withPeople: '3,4' },
        tv: null,
      });
    });
  });
});
