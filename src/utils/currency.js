import config from '../config';

export const formatCurrency = (
  amount,
  { symbol, code, decimals = 2, showCode = false } = {}
) => {
  const currencySymbol = symbol || config.CURRENCY_SYMBOL;
  const currencyCode = code || config.CURRENCY_CODE;
  return `${currencySymbol}${Number(amount || 0).toFixed(decimals)}${showCode ? ` ${currencyCode}` : ''}`;
};
