export const getFormattedValue = (value: number, usd: boolean): string => {
  if (value === 0 || value === null) {
    return usd ? "$0" : "0";
  } else if (value < 0.000001) {
    return usd ? "<$0.000001" : "<0.000001";
  } else if (value < 1) {
    const flooredValue = Math.floor(value * 1000000) / 1000000;
    return usd ? "$" + flooredValue.toFixed(6) : flooredValue.toFixed(6);
  } else if (value >= 1000000000) {
    const flooredValue = Math.floor(value / 100000000) / 10;
    return usd
      ? "$" + `${flooredValue.toFixed(1)}B`
      : `${flooredValue.toFixed(1)}B`;
  } else if (value >= 1000000) {
    const flooredValue = Math.floor(value / 100000) / 10;
    return usd
      ? "$" + `${flooredValue.toFixed(1)}M`
      : `${flooredValue.toFixed(1)}M`;
  } else {
    const flooredValue = Math.floor(value * 100) / 100;
    return usd
      ? "$" + flooredValue.toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        })
      : flooredValue.toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        });
  }
};
