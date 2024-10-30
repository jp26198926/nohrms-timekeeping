export function speakText(message) {
  if (message) {
    //create a new instance
    const utterance = new SpeechSynthesisUtterance(message);

    //optional parameter
    utterance.lang = "en-US";
    utterance.pitch = 1;
    utterance.reate = 1;
    utterance.volume = 1;

    //speak
    window.speechSynthesis.speak(utterance);
  }
}

export function isStatusTriggered(filter, records) {
  const exist = records.find((item) => parseInt(item.id) === parseInt(filter));
  if (exist) return true;
  return false;
}

export function isLocationTriggered(filter, records) {
  const exist = records.find((item) => parseInt(item.id) === parseInt(filter));
  if (exist) return true;
  return false;
}

export function playBeep(count = 3, interval = 400) {
  return new Promise((resolve) => {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = "sine"; // Smooth sine wave for siren sound
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime); // Volume control

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.start();

        // Create a pulsing effect by alternating between two frequencies
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // Start low
        oscillator.frequency.linearRampToValueAtTime(
          1200,
          audioContext.currentTime + 0.5
        ); // Rise over 0.5s
        oscillator.frequency.linearRampToValueAtTime(
          800,
          audioContext.currentTime + 1
        ); // Fall back down over 0.5s

        // Stop the oscillator after one interval to end each wail
        setTimeout(() => {
          oscillator.stop();
          // Close the audio context after the last siren wail
          if (i === count - 1) {
            audioContext.close();
            resolve(); // Resolve the promise once all wails are complete
          }
        }, interval);
      }, i * interval); // Delay each siren wail by the interval
    }
  });
}

export function playBeep1(count = 1, interval = 300) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = "square"; // Waveform type
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime); // Frequency in Hz
      gainNode.gain.setValueAtTime(0.5, audioContext.currentTime); // Volume control

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.start();

      // Stop the oscillator after 200ms (adjust as needed)
      setTimeout(() => {
        oscillator.stop();
      }, 200);
    }, i * interval); // Set timeout to create an interval between beeps
  }

  // Close the audio context after the final beep
  setTimeout(() => {
    audioContext.close();
  }, count * interval);
}

export function playBeep2(count = 3, interval = 500) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = "triangle"; //"sawtooth"; // Distinct waveform type for warning/error
      oscillator.frequency.setValueAtTime(1500, audioContext.currentTime); // Higher frequency for warning sound
      gainNode.gain.setValueAtTime(0.5, audioContext.currentTime); // Volume control

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.start();

      // Stop the oscillator after 100ms to create a shorter, sharper beep
      setTimeout(() => {
        oscillator.stop();
      }, 100);
    }, i * interval); // Set timeout to create an interval between beeps
  }

  // Close the audio context after the final beep
  setTimeout(() => {
    audioContext.close();
  }, count * interval);
}
