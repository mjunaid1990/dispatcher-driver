import { CURRENCY_CODE, CURRENCY_SYMBOL } from '../config';

export const formatCurrency = (
  amount,
  { symbol = CURRENCY_SYMBOL, code = CURRENCY_CODE, decimals = 2, showCode = false } = {}
) => `${symbol}${Number(amount || 0).toFixed(decimals)}${showCode ? ` ${code}` : ''}`;
