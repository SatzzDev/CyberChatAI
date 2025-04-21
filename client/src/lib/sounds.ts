// Fungsi untuk memainkan efek suara
export function playSound(type: 'send' | 'receive'): void {
  try {
    const sound = new Audio();
    
    if (type === 'send') {
      // Suara saat pesan terkirim (menggunakan file dari folder public)
      sound.src = '/sent.wav';
    } else {
      // Suara saat pesan diterima (menggunakan file dari folder public)
      sound.src = '/new.wav';
    }
    
    // Play the sound
    sound.play();
  } catch (error) {
    console.error("Error playing sound:", error);
  }
}