import interactor, {
  collection,
  text,
  scoped
} from 'interactor.js';

import GameRoomInteractor from './game-room';

@interactor class BankInteractor extends GameRoomInteractor {
  static defaultScope = '[data-test-bank]';
  static snapshotTitle = 'Bank';
  static defaultPath = '/t35tt/bank';

  backBtn = scoped('[data-test-back]');
  headings = collection('[data-test-bank-heading]');
  transfer = scoped('[data-test-bank-transfer-form]', {
    amount: text('[data-test-currency-input]'),
    input: scoped('[data-test-currency-input] input'),
    deposit: scoped('[data-test-toggle] input[type="checkbox"]'),
    submit: scoped('button[type="submit"]')
  });
}

export default BankInteractor;
