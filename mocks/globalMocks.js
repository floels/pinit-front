import en from '../lang/en.json';

jest.mock('react-intl', () => {
  const reactIntl = jest.requireActual('react-intl');
  const intl = reactIntl.createIntl({
    locale: 'en',
    messages: en
  });

  return {
    ...reactIntl,
    useIntl: () => intl,
  };
});