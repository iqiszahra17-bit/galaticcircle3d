/**
 * Utility to generate high-resolution PNG summary certificate cards
 * for GALATIC 3D and save them to player gallery / photo album.
 * Supports individual mission results and the grand 4-map campaign final recap.
 */

export interface ResultCardData {
  playerName: string;
  planetName: string;
  topicTitle: string;
  score: number;
  correctCount: number;
  wrongCount: number;
  totalQuestions: number;
  accuracy: number;
  starsEarned: number;
  timeSpentSeconds: number;
  xpEarned: number;
  crystalsEarned: number;
  appreciationMessage: string;
  completedAt: string;
}

export interface MapScoreItem {
  planetId: string;
  planetName: string;
  order: number;
  topicTitle?: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  timeSpentSeconds: number;
}

export interface FinalCampaignCardData {
  playerName: string;
  maps: MapScoreItem[]; // 4 maps: Tangensia, Angularis, Arcadia, Nexus
  totalScore: number;
  totalCorrect: number;
  totalWrong: number;
  totalQuestions: number;
  overallAccuracy: number;
  totalDurationSeconds: number;
  appreciationTitle: string;
  appreciationMessage: string;
  completedAt: string;
}

export const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds} Detik`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
};

export const getAppreciation = (accuracy: number): { title: string; message: string } => {
  if (accuracy === 100) {
    return {
      title: 'Luar Biasa, Komandan Galaksi Sejati! 🚀',
      message: 'Kalkulasi geometri lingkaranmu sempurna 100%! Tidak ada kesalahan sama sekali di seluruh lintasan orbit.',
    };
  }
  if (accuracy >= 80) {
    return {
      title: 'Kerja Luar Biasa, Kadet Tangguh! ⭐',
      message: 'Perhitungan dan akurasimu sangat presisi! Kamu membuktikan pemahaman mendalam tentang konsep lingkaran.',
    };
  }
  if (accuracy >= 60) {
    return {
      title: 'Bagus Sekali, Terus Jelajahi! 🪐',
      message: 'Kamu berhasil menuntaskan misi sektor ini. Sedikit latihan lagi untuk meraih bintang penuh 20/20!',
    };
  }
  return {
    title: 'Tetap Semangat, Kadet Antariksa! 💪',
    message: 'Setiap penjelajah belajar dari rintangan. Ulangi misi untuk menyempurnakan strategi dan kalkulasimu!',
  };
};

export const getFinalCampaignAppreciation = (
  accuracy: number
): { title: string; message: string } => {
  if (accuracy === 100) {
    return {
      title: 'Legenda Galaksi Abadi! 🏆🚀',
      message:
        'Selamat! Anda telah menuntaskan seluruh 4 peta galaksi dengan akurasi sempurna 100%! Anda menguasai Garis Singgung, Sudut Pusat & Keliling, Busur & Juring, hingga Sintesis Nexus tanpa cela!',
    };
  }
  if (accuracy >= 80) {
    return {
      title: 'Komandan Galaksi Berprestasi! ⭐🌟',
      message:
        'Luar biasa! Seluruh 4 peta geometri lingkaran telah berhasil Anda taklukkan dengan kecerdasan navigasi dan ketelitian kalkulasi yang sangat presisi!',
    };
  }
  if (accuracy >= 60) {
    return {
      title: 'Penjelajah Antariksa Tangguh! 🪐✨',
      message:
        'Kerja hebat! Anda sukses melintasi keempat peta galaksi GALATIC 3D. Seluruh konsep lingkaran berhasil Anda selesaikan dengan tekad baja!',
    };
  }
  return {
    title: 'Kadet Berjiwa Pantang Menyerah! 💪💫',
    message:
      'Selamat telah menuntaskan seluruh 4 peta galaksi! Setiap rintangan telah memperkuat pemahaman geometri antariksamu. Teruslah terbang tinggi dan jelajahi semesta!',
  };
};

/**
 * Draws rounded rectangle on 2D canvas context
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * Word wrap helper for canvas text
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = ctx.measureText(testLine).width;
    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

/**
 * Draws a star on canvas
 */
function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number,
  fillColor: string
) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fillStyle = fillColor;
  ctx.fill();
}

/**
 * Generates an ultra high-resolution PNG image for single mission result
 */
export async function generateResultImageBlob(data: ResultCardData): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1550;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context tidak tersedia.');
  }

  // 1. Background Cosmic Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 1200, 1550);
  bgGrad.addColorStop(0, '#070312');
  bgGrad.addColorStop(0.3, '#190A2E');
  bgGrad.addColorStop(0.7, '#0E1738');
  bgGrad.addColorStop(1, '#05020D');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1200, 1550);

  // 2. Cosmic Nebula Glows
  const glow1 = ctx.createRadialGradient(250, 300, 20, 250, 300, 500);
  glow1.addColorStop(0, 'rgba(120, 97, 255, 0.35)');
  glow1.addColorStop(1, 'rgba(120, 97, 255, 0)');
  ctx.fillStyle = glow1;
  ctx.beginPath();
  ctx.arc(250, 300, 500, 0, Math.PI * 2);
  ctx.fill();

  const glow2 = ctx.createRadialGradient(950, 1100, 30, 950, 1100, 600);
  glow2.addColorStop(0, 'rgba(255, 85, 200, 0.3)');
  glow2.addColorStop(1, 'rgba(255, 85, 200, 0)');
  ctx.fillStyle = glow2;
  ctx.beginPath();
  ctx.arc(950, 1100, 600, 0, Math.PI * 2);
  ctx.fill();

  // Draw Stars
  for (let i = 0; i < 90; i++) {
    const sx = (i * 123 + 47) % 1160 + 20;
    const sy = (i * 277 + 91) % 1510 + 20;
    const sr = (i % 3) + 1;
    ctx.fillStyle = i % 5 === 0 ? '#FFD76A' : i % 3 === 0 ? '#00E5FF' : 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
  }

  // Double Border
  ctx.strokeStyle = 'rgba(255, 85, 200, 0.5)';
  ctx.lineWidth = 3;
  roundRect(ctx, 40, 40, 1120, 1470, 32);
  ctx.stroke();

  // Header
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFD76A';
  ctx.font = 'bold 20px Orbitron, sans-serif';
  ctx.fillText('✦ GALATIC 3D • HASIL MISI ✦', 600, 100);

  ctx.fillStyle = '#FFF5FF';
  ctx.font = 'bold 44px Orbitron, sans-serif';
  ctx.fillText(`MISI ${data.planetName.toUpperCase()} SELESAI`, 600, 170);

  ctx.fillStyle = '#C6B2D2';
  ctx.font = '22px Rajdhani, sans-serif';
  ctx.fillText(`Kadet: ${data.playerName} • Sektor ${data.topicTitle}`, 600, 215);

  // Score Banner
  ctx.fillStyle = '#24102F';
  roundRect(ctx, 120, 260, 960, 150, 24);
  ctx.fill();
  ctx.strokeStyle = '#FFD76A';
  ctx.lineWidth = 2.5;
  roundRect(ctx, 120, 260, 960, 150, 24);
  ctx.stroke();

  ctx.fillStyle = '#FFD76A';
  ctx.font = 'bold 18px Rajdhani, sans-serif';
  ctx.fillText('TOTAL SKOR MISI', 600, 310);
  ctx.fillStyle = '#FFF5FF';
  ctx.font = 'bold 58px Orbitron, sans-serif';
  ctx.fillText(`${data.score}`, 600, 375);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Gagal mengekspor canvas ke format Blob PNG.'));
    }, 'image/png');
  });
}

/**
 * Generates the official grand final 4-map campaign summary certificate
 */
export async function generateFinalCampaignImageBlob(
  data: FinalCampaignCardData
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1750;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context tidak tersedia.');
  }

  // 1. Background Cosmic Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 1200, 1750);
  bgGrad.addColorStop(0, '#060210');
  bgGrad.addColorStop(0.25, '#16082A');
  bgGrad.addColorStop(0.65, '#0C1232');
  bgGrad.addColorStop(1, '#04020B');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1200, 1750);

  // 2. Cosmic Nebula Glows
  const drawGlow = (cx: number, cy: number, r: number, colorStart: string) => {
    const glow = ctx.createRadialGradient(cx, cy, 10, cx, cy, r);
    glow.addColorStop(0, colorStart);
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  };

  drawGlow(250, 280, 480, 'rgba(120, 97, 255, 0.35)');
  drawGlow(950, 340, 460, 'rgba(255, 85, 200, 0.30)');
  drawGlow(200, 920, 420, 'rgba(0, 229, 255, 0.20)');
  drawGlow(1020, 1250, 500, 'rgba(141, 60, 199, 0.28)');
  drawGlow(600, 1600, 420, 'rgba(255, 215, 106, 0.18)');

  // 3. Crisp Starfield
  for (let i = 0; i < 150; i++) {
    const sx = (i * 137 + 59) % 1140 + 30;
    const sy = (i * 293 + 83) % 1690 + 30;
    const sr = (i % 4 === 0) ? 2.5 : (i % 2 === 0) ? 1.8 : 1.2;
    ctx.fillStyle =
      i % 6 === 0 ? '#FFD76A' : i % 4 === 0 ? '#00E5FF' : 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
  }

  // 4. Double Cyberpunk Borders
  ctx.strokeStyle = 'rgba(255, 85, 200, 0.55)';
  ctx.lineWidth = 3.5;
  roundRect(ctx, 35, 35, 1130, 1680, 32);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(0, 229, 255, 0.45)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, 48, 48, 1104, 1654, 24);
  ctx.stroke();

  // Tech Corner Accents
  ctx.fillStyle = '#00E5FF';
  ctx.fillRect(48, 48, 30, 3);
  ctx.fillRect(48, 48, 3, 30);
  ctx.fillRect(1152 - 30, 48, 30, 3);
  ctx.fillRect(1152 - 3, 48, 3, 30);
  ctx.fillRect(48, 1702 - 3, 30, 3);
  ctx.fillRect(48, 1702 - 30, 3, 30);
  ctx.fillRect(1152 - 30, 1702 - 3, 30, 3);
  ctx.fillRect(1152 - 3, 1702 - 30, 3, 30);

  // 5. Header Pill Badge
  ctx.fillStyle = '#24102F';
  roundRect(ctx, 340, 68, 520, 38, 19);
  ctx.fill();
  ctx.strokeStyle = '#FFD76A';
  ctx.lineWidth = 1.5;
  roundRect(ctx, 340, 68, 520, 38, 19);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFD76A';
  ctx.font = 'bold 15px Orbitron, sans-serif';
  ctx.fillText('✦ GALATIC 3D • SERTIFIKAT PENYELESAIAN AKHIR ✦', 600, 92);

  // Trophy Symbol
  drawStar(ctx, 600, 142, 5, 26, 12, '#FFD76A');

  // Main Titles
  ctx.fillStyle = '#FFF5FF';
  ctx.font = 'bold 36px Orbitron, sans-serif';
  ctx.fillText('MISI 4 PETA SELESAI PARIPURNA', 600, 205);

  ctx.fillStyle = '#C6B2D2';
  ctx.font = 'bold 18px Rajdhani, sans-serif';
  ctx.fillText('REKAPITULASI RESMI PENJELAJAHAN GEOMETRI LINGKARAN', 600, 235);

  // Player Name Box
  ctx.fillStyle = '#24102F';
  roundRect(ctx, 180, 260, 840, 52, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 85, 200, 0.4)';
  ctx.lineWidth = 2;
  roundRect(ctx, 180, 260, 840, 52, 16);
  ctx.stroke();

  ctx.fillStyle = '#FFF5FF';
  ctx.font = 'bold 16px Rajdhani, sans-serif';
  ctx.fillText('KADET PENJELAJAH: ', 440, 292);

  ctx.fillStyle = '#00E5FF';
  ctx.font = 'bold 22px Orbitron, sans-serif';
  ctx.fillText(data.playerName.toUpperCase(), 640, 294);

  // 6. Grand Total Score Showcase Box (Hero)
  const heroGrad = ctx.createLinearGradient(80, 335, 1120, 480);
  heroGrad.addColorStop(0, '#2D123D');
  heroGrad.addColorStop(0.5, '#421654');
  heroGrad.addColorStop(1, '#24102F');
  ctx.fillStyle = heroGrad;
  roundRect(ctx, 80, 335, 1040, 145, 24);
  ctx.fill();

  ctx.strokeStyle = '#FFD76A';
  ctx.lineWidth = 3;
  roundRect(ctx, 80, 335, 1040, 145, 24);
  ctx.stroke();

  ctx.fillStyle = '#FFB5E8';
  ctx.font = 'bold 16px Orbitron, sans-serif';
  ctx.fillText('TOTAL SKOR KESELURUHAN (4 PETA)', 600, 375);

  ctx.fillStyle = '#FFD76A';
  ctx.font = '900 54px Orbitron, sans-serif';
  ctx.fillText(`${data.totalScore} POIN`, 600, 435);

  ctx.fillStyle = '#C6B2D2';
  ctx.font = '14px Rajdhani, sans-serif';
  ctx.fillText(
    'Akumulasi presisi kalkulasi geometri di seluruh lintasan 4 sektor antariksa',
    600,
    465
  );

  // 7. Rekapitulasi 4 Peta (2x2 Grid)
  ctx.fillStyle = '#00E5FF';
  ctx.font = 'bold 18px Orbitron, sans-serif';
  ctx.fillText('✦ REKAPITULASI SKOR SETIAP PETA ✦', 600, 518);

  const mapCards = [
    {
      col: 0,
      row: 0,
      name: 'PETA 1: TANGENSIA',
      topic: 'Garis Singgung (GSPL & GSPD)',
      borderColor: '#00E5FF',
      accentColor: '#00E5FF',
    },
    {
      col: 1,
      row: 0,
      name: 'PETA 2: ANGULARIS',
      topic: 'Sudut Pusat & Tali Busur',
      borderColor: '#7861FF',
      accentColor: '#B388FF',
    },
    {
      col: 0,
      row: 1,
      name: 'PETA 3: ARCADIA',
      topic: 'Panjang Busur & Luas Juring',
      borderColor: '#FFD34E',
      accentColor: '#FFD76A',
    },
    {
      col: 1,
      row: 1,
      name: 'PETA 4: NEXUS',
      topic: 'Sintesis Terpadu Sektor',
      borderColor: '#00FF9D',
      accentColor: '#57E389',
    },
  ];

  const cardW = 505;
  const cardH = 170;
  const startX = 80;
  const startY = 540;
  const gapX = 30;
  const gapY = 20;

  mapCards.forEach((cfg, idx) => {
    const mapData = data.maps[idx] || {
      score: 0,
      correctCount: 0,
      totalQuestions: 5,
      timeSpentSeconds: 0,
    };
    const cx = startX + cfg.col * (cardW + gapX);
    const cy = startY + cfg.row * (cardH + gapY);

    // Card background
    ctx.fillStyle = 'rgba(36, 16, 47, 0.95)';
    roundRect(ctx, cx, cy, cardW, cardH, 20);
    ctx.fill();

    ctx.strokeStyle = cfg.borderColor;
    ctx.lineWidth = 2.2;
    roundRect(ctx, cx, cy, cardW, cardH, 20);
    ctx.stroke();

    // Planet Title
    ctx.textAlign = 'left';
    ctx.fillStyle = cfg.accentColor;
    ctx.font = 'bold 16px Orbitron, sans-serif';
    ctx.fillText(cfg.name, cx + 24, cy + 34);

    ctx.fillStyle = '#C6B2D2';
    ctx.font = '13px Rajdhani, sans-serif';
    ctx.fillText(cfg.topic, cx + 24, cy + 54);

    // Score
    ctx.fillStyle = '#FFD76A';
    ctx.font = 'bold 36px Orbitron, sans-serif';
    ctx.fillText(`${mapData.score}`, cx + 24, cy + 104);

    ctx.fillStyle = '#FFF5FF';
    ctx.font = 'bold 14px Orbitron, sans-serif';
    ctx.fillText('POIN', cx + 140, cy + 100);

    // Metrics Row
    ctx.fillStyle = '#57E389';
    ctx.font = 'bold 14px Rajdhani, sans-serif';
    ctx.fillText(`✓ ${mapData.correctCount} / ${mapData.totalQuestions || 5} Benar`, cx + 24, cy + 142);

    ctx.fillStyle = '#A78BFA';
    ctx.fillText(`⏱ Durasi: ${formatDuration(mapData.timeSpentSeconds || 0)}`, cx + 240, cy + 142);
  });

  // 8. Statistik Keseluruhan (4 Summary Stat Blocks)
  ctx.textAlign = 'center';
  const statY = 930;
  const statW = 240;
  const statH = 110;
  const statGap = 26;
  const statStartX = 80;

  const summaryStats = [
    {
      label: 'JAWABAN BENAR',
      value: `${data.totalCorrect} / ${data.totalQuestions}`,
      color: '#57E389',
      sub: 'Tepat Sasaran',
    },
    {
      label: 'JAWABAN SALAH',
      value: `${data.totalWrong} Soal`,
      color: '#F43F5E',
      sub: 'Perlu Evaluasi',
    },
    {
      label: 'KEBERHASILAN',
      value: `${data.overallAccuracy}%`,
      color: '#FF55C8',
      sub: 'Akurasi Total',
    },
    {
      label: 'DURASI TOTAL',
      value: formatDuration(data.totalDurationSeconds),
      color: '#A78BFA',
      sub: 'Waktu Misi 4 Peta',
    },
  ];

  summaryStats.forEach((st, i) => {
    const sx = statStartX + i * (statW + statGap);
    ctx.fillStyle = '#24102F';
    roundRect(ctx, sx, statY, statW, statH, 18);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, sx, statY, statW, statH, 18);
    ctx.stroke();

    ctx.fillStyle = '#C6B2D2';
    ctx.font = 'bold 12px Rajdhani, sans-serif';
    ctx.fillText(st.label, sx + statW / 2, statY + 28);

    ctx.fillStyle = st.color;
    ctx.font = 'bold 26px Orbitron, sans-serif';
    ctx.fillText(st.value, sx + statW / 2, statY + 68);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '11px Rajdhani, sans-serif';
    ctx.fillText(st.sub, sx + statW / 2, statY + 92);
  });

  // 9. Pesan Apresiasi Tamat
  const appreY = 1070;
  const appreW = 1040;
  const appreH = 200;

  const appreGrad = ctx.createLinearGradient(80, appreY, 1120, appreY + appreH);
  appreGrad.addColorStop(0, '#24102F');
  appreGrad.addColorStop(0.5, '#341445');
  appreGrad.addColorStop(1, '#24102F');
  ctx.fillStyle = appreGrad;
  roundRect(ctx, 80, appreY, appreW, appreH, 22);
  ctx.fill();

  ctx.strokeStyle = '#FFD76A';
  ctx.lineWidth = 2.5;
  roundRect(ctx, 80, appreY, appreW, appreH, 22);
  ctx.stroke();

  ctx.fillStyle = '#FFD76A';
  ctx.font = 'bold 22px Orbitron, sans-serif';
  ctx.fillText(data.appreciationTitle, 600, appreY + 45);

  ctx.fillStyle = '#FFF5FF';
  ctx.font = '18px Rajdhani, sans-serif';
  const lines = wrapText(ctx, data.appreciationMessage, 960);
  lines.forEach((line, lIdx) => {
    ctx.fillText(line, 600, appreY + 85 + lIdx * 28);
  });

  // 10. Official Authority Signature & Seal
  const footerY = 1300;
  ctx.fillStyle = '#1B0B24';
  roundRect(ctx, 80, footerY, 1040, 100, 18);
  ctx.fill();

  ctx.strokeStyle = 'rgba(0, 229, 255, 0.3)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, 80, footerY, 1040, 100, 18);
  ctx.stroke();

  ctx.fillStyle = '#C6B2D2';
  ctx.font = '13px Rajdhani, sans-serif';
  ctx.fillText(`Diselesaikan pada: ${data.completedAt}`, 600, footerY + 34);

  ctx.fillStyle = '#FFD76A';
  ctx.font = 'bold 15px Orbitron, sans-serif';
  ctx.fillText('AKADEMI MATEMATIKA GEOMETRI GALATIC 3D • TERVERIFIKASI RESMI', 600, footerY + 60);

  ctx.fillStyle = '#57E389';
  ctx.font = 'bold 12px Rajdhani, sans-serif';
  ctx.fillText('STATUS: 4/4 PETA GALAKSI SELESAI PARIPURNA ✓', 600, footerY + 82);

  // Return generated PNG Blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Gagal mengekspor sertifikat akhir ke format PNG.'));
    }, 'image/png');
  });
}

/**
 * Triggers saving the final 4-map campaign result image to Gallery on mobile or Downloads on desktop
 */
export async function saveFinalCampaignImageToGallery(
  data: FinalCampaignCardData
): Promise<{ success: boolean; message: string }> {
  try {
    const blob = await generateFinalCampaignImageBlob(data);
    const safePlayerName =
      data.playerName.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'kadet';
    const filename = `GALATIC-3D_Rekap-4-Peta_${safePlayerName}.png`;

    const file = new File([blob], filename, { type: 'image/png' });

    // Try Web Share API (native save to gallery on mobile browsers like Chrome Mobile, Safari iOS)
    if (
      typeof navigator !== 'undefined' &&
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      try {
        await navigator.share({
          files: [file],
          title: `Hasil Akhir Permainan GALATIC 3D - ${data.playerName}`,
          text: `Rekapitulasi 4 Peta GALATIC 3D oleh ${data.playerName} (Total Skor: ${data.totalScore}, Akurasi: ${data.overallAccuracy}%)`,
        });
        return {
          success: true,
          message: 'Berhasil membuka dialog simpan/bagikan gambar ke Galeri HP!',
        };
      } catch (shareErr) {
        // If user cancelled share sheet, fallback to direct download below
        if ((shareErr as Error).name === 'AbortError') {
          return { success: true, message: 'Proses penyimpanan dibatalkan.' };
        }
      }
    }

    // Direct HTML5 download link (works on desktop and all browsers)
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Free memory
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);

    return {
      success: true,
      message: `Gambar berhasil diunduh dan disimpan! Periksa folder Galeri / Download perangkat Anda (${filename}).`,
    };
  } catch (err) {
    console.error('Save final campaign to gallery error:', err);
    return {
      success: false,
      message: (err as Error).message || 'Gagal menyimpan gambar hasil akhir ke galeri.',
    };
  }
}

/**
 * Legacy single mission save to gallery
 */
export async function saveResultImageToGallery(
  data: ResultCardData
): Promise<{ success: boolean; message: string }> {
  try {
    const blob = await generateResultImageBlob(data);
    const safePlayerName = data.playerName.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'kadet';
    const safePlanetName = data.planetName.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'galaksi';
    const filename = `GALACTIC-3D_${safePlayerName}_${safePlanetName}.png`;

    const file = new File([blob], filename, { type: 'image/png' });

    if (
      typeof navigator !== 'undefined' &&
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      try {
        await navigator.share({
          files: [file],
          title: `Hasil Misi GALACTIC 3D - ${data.playerName}`,
          text: `Hasil Misi ${data.planetName} oleh ${data.playerName} (Skor: ${data.score}, Akurasi: ${data.accuracy}%)`,
        });
        return {
          success: true,
          message: 'Berhasil membuka dialog simpan/bagikan gambar ke Galeri HP!',
        };
      } catch (shareErr) {
        if ((shareErr as Error).name === 'AbortError') {
          return { success: true, message: 'Proses penyimpanan dibatalkan.' };
        }
      }
    }

    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);

    return {
      success: true,
      message: `Gambar berhasil diunduh dan disimpan! Periksa folder Galeri / Download perangkat Anda (${filename}).`,
    };
  } catch (err) {
    console.error('Save to gallery error:', err);
    return {
      success: false,
      message: (err as Error).message || 'Gagal menyimpan gambar ke galeri.',
    };
  }
}
