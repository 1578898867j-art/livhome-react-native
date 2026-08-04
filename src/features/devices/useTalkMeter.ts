import { useCallback, useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';

export type TalkMeterStartResult = 'started' | 'denied' | 'failed';

const MIN_VOICE_DB = -55;
const VOICE_DB_RANGE = 45;

const normalizeMetering = (metering: number) => {
  const normalized = Math.min(1, Math.max(0, (metering - MIN_VOICE_DB) / VOICE_DB_RANGE));
  return Math.pow(normalized, 0.72);
};

export function useTalkMeter() {
  const recordingRef = useRef<Audio.Recording | null>(null);
  const startingRef = useRef(false);
  const [level, setLevel] = useState(0);
  const [starting, setStarting] = useState(false);

  const stop = useCallback(async () => {
    startingRef.current = false;
    setStarting(false);
    setLevel(0);

    const recording = recordingRef.current;
    recordingRef.current = null;
    if (recording) {
      recording.setOnRecordingStatusUpdate(null);
      try {
        await recording.stopAndUnloadAsync();
      } catch {
        // Android can report E_AUDIO_NODATA when the control is turned off immediately.
      }
    }

    try {
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
    } catch {
      // The recorder is already released, so there is nothing else to recover here.
    }
  }, []);

  const start = useCallback(async (): Promise<TalkMeterStartResult> => {
    if (recordingRef.current) return 'started';
    if (startingRef.current) return 'failed';

    startingRef.current = true;
    setStarting(true);

    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) return 'denied';

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync({
        ...Audio.RecordingOptionsPresets.LOW_QUALITY,
        isMeteringEnabled: true,
        keepAudioActiveHint: true,
      });
      recording.setProgressUpdateInterval(80);
      recording.setOnRecordingStatusUpdate((status) => {
        if (!status.isRecording || typeof status.metering !== 'number') return;
        setLevel(normalizeMetering(status.metering));
      });
      recordingRef.current = recording;
      await recording.startAsync();
      return 'started';
    } catch {
      await stop();
      return 'failed';
    } finally {
      startingRef.current = false;
      setStarting(false);
    }
  }, [stop]);

  useEffect(
    () => () => {
      void stop();
    },
    [stop],
  );

  return { level, start, starting, stop };
}
