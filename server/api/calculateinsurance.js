export default defineEventHandler(async (event) => {
  const requestBody = await readBody(event);
  const { carValue, paymentType, productionYear, gpsActive } = requestBody;

  let netCarValue = parseFloat(carValue);
  if (paymentType === 'brutto') {
    netCarValue /= 1.23;
  }

  let factor;
  if (netCarValue < 40000) {
    factor = 8;
  } else if (netCarValue >= 40000 && netCarValue < 100000) {
    factor = 5;
  } else if (netCarValue >= 100000 && netCarValue < 200000) {
    factor = 4;
  } else if (netCarValue >= 200000 && netCarValue < 400001) {
    factor = 2;
  }

  const currentYear = new Date().getFullYear();
  const isUsedCar = currentYear - parseInt(productionYear) > 1;
  if (isUsedCar) {
    factor++;
  }

  let premium = netCarValue * (factor / 100);

  if (!gpsActive) {
    premium *= 1.11;
  }
  premium = Math.round((premium + Number.EPSILON) * 100) / 100;

  netCarValue = Math.floor(netCarValue);

  const gpsActiveValue = gpsActive ? "Tak" : "Nie";
  const grossCarValue = (netCarValue * 1.23).toFixed(0);
  return {
    netCarValue,
    premium,
    factor,
    productionYear,
    gpsActive: gpsActiveValue,
    grossCarValue
  };
});
