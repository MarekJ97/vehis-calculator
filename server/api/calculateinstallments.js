export default defineEventHandler(async (event) => {
  const requestBody = await readBody(event);
  const { payments, premiumValue } = requestBody;

  let installmentFee = 200;
  let premium;

  premium = premiumValue + installmentFee;

  let installment1, installment2, installment3, installment4;

  if (payments === 'twoPayments') {
    premium *= 1.02;
    const installment = premium / 2;
    installment1 = installment2 = installment.toFixed(2);
    premium = premium.toFixed(2);
  } else if (payments === 'fourPayments') {
    premium *= 1.04;
    const installment = premium / 4;
    installment1 = installment2 = installment3 = installment4 = installment.toFixed(2);
    premium = premium.toFixed(2);
  } else {
    throw new Error('Nieprawidłowa liczba rat');
  }

  return {
    payments,
    premiumValue,
    premium,
    installment1,
    installment2,
    installment3,
    installment4,
  };
});
