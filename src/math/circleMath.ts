/**
 * Core mathematical functions for circle geometry (SMA Kelas XI)
 */

export const calculateGSPL = (d: number, R: number, r: number): number => {
  const diff = Math.abs(R - r);
  if (d < diff) {
    throw new Error('Jarak pusat lingkaran d tidak boleh lebih kecil dari selisih jari-jari (R - r).');
  }
  return Math.sqrt(Math.pow(d, 2) - Math.pow(diff, 2));
};

export const calculateGSPD = (d: number, R: number, r: number): number => {
  const sum = R + r;
  if (d < sum) {
    throw new Error('Jarak pusat lingkaran d tidak boleh lebih kecil dari jumlah jari-jari (R + r).');
  }
  return Math.sqrt(Math.pow(d, 2) - Math.pow(sum, 2));
};

export const calculateCenterDistanceFromGSPL = (gspl: number, R: number, r: number): number => {
  const diff = Math.abs(R - r);
  return Math.sqrt(Math.pow(gspl, 2) + Math.pow(diff, 2));
};

export const calculateCenterDistanceFromGSPD = (gspd: number, R: number, r: number): number => {
  const sum = R + r;
  return Math.sqrt(Math.pow(gspd, 2) + Math.pow(sum, 2));
};

export const calculateInscribedAngle = (centralAngle: number): number => {
  return centralAngle / 2;
};

export const calculateCentralAngle = (inscribedAngle: number): number => {
  return inscribedAngle * 2;
};

export const calculateArcLength = (radius: number, angleDeg: number, useFractionPi = true): number => {
  const pi = useFractionPi ? 22 / 7 : Math.PI;
  return (angleDeg / 360) * (2 * pi * radius);
};

export const calculateSectorArea = (radius: number, angleDeg: number, useFractionPi = true): number => {
  const pi = useFractionPi ? 22 / 7 : Math.PI;
  return (angleDeg / 360) * (pi * Math.pow(radius, 2));
};

export const calculateCentralAngleFromArc = (radius: number, arcLength: number, useFractionPi = true): number => {
  const pi = useFractionPi ? 22 / 7 : Math.PI;
  const circumference = 2 * pi * radius;
  return (arcLength / circumference) * 360;
};

export const calculateCentralAngleFromSector = (radius: number, sectorArea: number, useFractionPi = true): number => {
  const pi = useFractionPi ? 22 / 7 : Math.PI;
  const circleArea = pi * Math.pow(radius, 2);
  return (sectorArea / circleArea) * 360;
};
