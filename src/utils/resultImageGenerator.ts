/**
 * Utility to generate high-resolution PNG summary certificate cards
 * for GALACTIC 3D and save them to player gallery / photo album.
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
 * Generates an ultra high-resolution PNG image of the mission result
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

  const glow3 = ctx.createRadialGradient(600, 700, 20, 600, 700, 450);
  glow3.addColorStop(0, 'rgba(0, 229, 255, 0.2)');
  glow3.addColorStop(1, 'rgba(0, 229, 255, 0)');
  ctx.fillStyle = glow3;
  ctx.beginPath();
  ctx.arc(600, 700, 450, 0, Math.PI * 2);
  ctx.fill();

  // 3. Random Deterministic Stars
  ctx.fillStyle = '#FFFFFF';
  for (let i = 0; i < 90; i++) {
    const sx = ((i * 137.5) % 1160) + 20;
    const sy = ((i * 269.3) % 1510) + 20;
    const sr = (i % 3 === 0) ? 2.5 : 1.5;
    const opacity = 0.3 + ((i % 7) / 10);
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 4. Outer Sci-Fi HUD Frame
  ctx.strokeStyle = 'rgba(0, 229, 255, 0.6)';
  ctx.lineWidth = 3;
  roundRect(ctx, 40, 40, 1120, 1470, 32);
  ctx.stroke();

  // Inner subtle border
  ctx.strokeStyle = 'rgba(255, 85, 200, 0.35)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, 52, 52, 1096, 1446, 24);
  ctx.stroke();

  // Corner Accent Brackets
  const cornerLen = 50;
  ctx.strokeStyle = '#00E5FF';
  ctx.lineWidth = 5;
  // Top-left
  ctx.beginPath();
  ctx.moveTo(35, 35 + cornerLen);
  ctx.lineTo(35, 35);
  ctx.lineTo(35 + cornerLen, 35);
  ctx.stroke();
  // Top-right
  ctx.beginPath();
  ctx.moveTo(1165 - cornerLen, 35);
  ctx.lineTo(1165, 35);
  ctx.lineTo(1165, 35 + cornerLen);
  ctx.stroke();
  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(35, 1515 - cornerLen);
  ctx.lineTo(35, 1515);
  ctx.lineTo(35 + cornerLen, 1515);
  ctx.stroke();
  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(1165 - cornerLen, 1515);
  ctx.lineTo(1165, 1515);
  ctx.lineTo(1165, 1515 - cornerLen);
  ctx.stroke();

  // 5. Header Title Pill
  ctx.fillStyle = 'rgba(255, 215, 106, 0.15)';
  roundRect(ctx, 350, 85, 500, 44, 22);
  ctx.fill();
  ctx.strokeStyle = '#FFD76A';
  ctx.lineWidth = 1.5;
  roundRect(ctx, 350, 85, 500, 44, 22);
  ctx.stroke();

  ctx.fillStyle = '#FFD76A';
  ctx.font = 'bold 16px "Orbitron", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('★ SERTIFIKAT RESMI PENYELESAIAN MISI ★', 600, 113);

  // Main Logo / Game Brand
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 52px "Orbitron", sans-serif';
  ctx.fillText('GALACTIC CIRCLE 3D', 600, 195);

  ctx.fillStyle = '#00E5FF';
  ctx.font = 'bold 20px "Rajdhani", sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText(`SEKTOR: PLANET ${data.planetName.toUpperCase()} • ${data.topicTitle.toUpperCase()}`, 600, 235);
  ctx.letterSpacing = '0px';

  // 6. Player Identity Card
  ctx.fillStyle = 'rgba(23, 13, 36, 0.85)';
  roundRect(ctx, 100, 275, 1000, 150, 24);
  ctx.fill();
  ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
  ctx.lineWidth = 2;
  roundRect(ctx, 100, 275, 1000, 150, 24);
  ctx.stroke();

  // Cadet Avatar Icon Badge
  ctx.fillStyle = 'rgba(0, 229, 255, 0.15)';
  roundRect(ctx, 130, 298, 104, 104, 20);
  ctx.fill();
  ctx.strokeStyle = '#00E5FF';
  ctx.lineWidth = 2;
  roundRect(ctx, 130, 298, 104, 104, 20);
  ctx.stroke();

  ctx.font = '54px "Orbitron", sans-serif';
  ctx.fillStyle = '#00E5FF';
  ctx.fillText('🪐', 182, 370);

  // Name info
  ctx.textAlign = 'left';
  ctx.fillStyle = '#A390B8';
  ctx.font = 'bold 16px "Rajdhani", sans-serif';
  ctx.fillText('KADET ANTARIKSA PENJELAJAH:', 260, 325);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 36px "Orbitron", sans-serif';
  ctx.fillText(data.playerName, 260, 370);

  ctx.fillStyle = '#57E389';
  ctx.font = 'bold 18px "Rajdhani", sans-serif';
  ctx.fillText('✓ Status: Misi Sektor Terselesaikan', 260, 405);

  // 7. Appreciation Message Box
  const appreciation = getAppreciation(data.accuracy);
  ctx.fillStyle = 'rgba(255, 85, 200, 0.12)';
  roundRect(ctx, 100, 455, 1000, 120, 20);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 85, 200, 0.5)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, 100, 455, 1000, 120, 20);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFD76A';
  ctx.font = 'bold 22px "Orbitron", sans-serif';
  ctx.fillText(appreciation.title, 600, 498);

  ctx.fillStyle = '#FFF5FF';
  ctx.font = '500 18px "Rajdhani", sans-serif';
  ctx.fillText(appreciation.message, 600, 540);

  // 8. 6 Metric Cards Dashboard (Grid 2 rows x 3 columns)
  const cards = [
    { label: 'TOTAL SKOR', value: `${data.score} Pts`, color: '#FFD76A', icon: '🏆' },
    { label: 'JAWABAN BENAR', value: `${data.correctCount} / ${data.totalQuestions} Soal`, color: '#57E389', icon: '✓' },
    { label: 'JAWABAN SALAH', value: `${data.wrongCount} Soal`, color: '#FF6B8B', icon: '✗' },
    { label: 'PERSENTASE AKURASI', value: `${data.accuracy}%`, color: '#00E5FF', icon: '🎯' },
    { label: 'BINTANG KOSMIK', value: `⭐ ${data.starsEarned} / 20`, color: '#FFD76A', icon: '⭐' },
    { label: 'DURASI PERMAINAN', value: formatDuration(data.timeSpentSeconds), color: '#7861FF', icon: '⏱' },
  ];

  const gridStartX = 100;
  const gridStartY = 610;
  const cardW = 313;
  const cardH = 160;
  const gapX = 30;
  const gapY = 25;

  cards.forEach((card, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const x = gridStartX + col * (cardW + gapX);
    const y = gridStartY + row * (cardH + gapY);

    // Card background
    ctx.fillStyle = 'rgba(23, 13, 36, 0.9)';
    roundRect(ctx, x, y, cardW, cardH, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, x, y, cardW, cardH, 20);
    ctx.stroke();

    // Top icon & label
    ctx.textAlign = 'left';
    ctx.font = '22px sans-serif';
    ctx.fillText(card.icon, x + 20, y + 42);

    ctx.fillStyle = '#A390B8';
    ctx.font = 'bold 14px "Orbitron", sans-serif';
    ctx.fillText(card.label, x + 55, y + 40);

    // Value
    ctx.fillStyle = card.color;
    ctx.font = '900 28px "Orbitron", sans-serif';
    ctx.fillText(card.value, x + 20, y + 105);
  });

  // 9. Extra Rewards Box
  ctx.fillStyle = 'rgba(120, 97, 255, 0.15)';
  roundRect(ctx, 100, 990, 1000, 90, 18);
  ctx.fill();
  ctx.strokeStyle = 'rgba(120, 97, 255, 0.4)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, 100, 990, 1000, 90, 18);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFF5FF';
  ctx.font = 'bold 20px "Orbitron", sans-serif';
  ctx.fillText(
    `PEROLEHAN REWARD: +${data.xpEarned} XP KOSMIK  •  +${data.crystalsEarned} KRISTAL`,
    600,
    1045
  );

  // 10. Educational Curriculum Badge Box
  ctx.fillStyle = 'rgba(10, 20, 45, 0.85)';
  roundRect(ctx, 100, 1115, 1000, 240, 20);
  ctx.fill();
  ctx.strokeStyle = 'rgba(0, 229, 255, 0.3)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, 100, 1115, 1000, 240, 20);
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.fillStyle = '#00E5FF';
  ctx.font = 'bold 18px "Orbitron", sans-serif';
  ctx.fillText('CATATAN KOMPETENSI MATEMATIKA (SMA KELAS XI):', 140, 1160);

  ctx.fillStyle = '#E2D9F3';
  ctx.font = '16px "Rajdhani", sans-serif';
  ctx.fillText('• Menguasai analisis geometri garis singgung, sudut pusat/keliling, dan busur-juring.', 140, 1205);
  ctx.fillText('• Penalaran logika visual dan pemecahan masalah ruang berorientasi eksplorasi galaksi.', 140, 1245);
  ctx.fillText('• Integritas penyelesaian misi tanpa bocoran nilai aproksimasi konstanta lingkaran.', 140, 1285);
  ctx.fillText('• Hasil terekam secara valid pada basis data profil petualang antariksa.', 140, 1325);

  // 11. Footer Verification & Timestamp
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.font = '13px "Rajdhani", sans-serif';
  ctx.fillText(
    'Diverifikasi secara otoritatif oleh Satelit Pusat Navigasi • GALACTIC 3D Learning Engine',
    600,
    1415
  );
  ctx.fillText(
    `Waktu Selesai: ${data.completedAt} • Hak Cipta Game Edukasi Matematika Geometri Lingkaran`,
    600,
    1445
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Gagal mengonversi kanvas ke gambar PNG.'));
      }
    }, 'image/png');
  });
}

/**
 * Triggers saving the result image to Gallery on mobile or Downloads on desktop
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

    // Try Web Share API (native save to gallery on mobile browsers like Chrome Mobile, Safari iOS)
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
    console.error('Save to gallery error:', err);
    return {
      success: false,
      message: (err as Error).message || 'Gagal menyimpan gambar ke galeri.',
    };
  }
}

