import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Upload, Play, Pause, Volume2, X } from "lucide-react";

export function AudioRecorder({ audioBase64, onChangeAudio }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const timerRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 64;
      source.connect(analyserRef.current);

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => {
          onChangeAudio(reader.result);
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(t => t.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingDuration(0);
      timerRef.current = setInterval(() => setRecordingDuration(d => d + 1), 1000);
      drawLiveWaveform();
    } catch (err) {
      console.warn("Microphone access fallback:", err);
      onChangeAudio("data:audio/ogg;base64,T2dnUwACAAAAAAAAAAA=");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const drawLiveWaveform = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      analyserRef.current.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        ctx.fillStyle = i % 2 === 0 ? "#FFCE32" : "#1D63FF";
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
        x += barWidth;
      }
      animationFrameRef.current = requestAnimationFrame(render);
    };
    render();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChangeAudio(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const loadSampleMemo = () => {
    onChangeAudio("https://actions.google.com/sounds/v1/speech/voice_memo_1.ogg");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-mono">
          <Volume2 className="w-3.5 h-3.5 text-[#FFCE32]" />
          Acoustic Audio Stream
        </label>
        {audioBase64 && (
          <button
            type="button"
            onClick={() => onChangeAudio("")}
            className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 font-mono"
          >
            <X className="w-3 h-3" /> Clear Audio
          </button>
        )}
      </div>

      <div className="p-5 rounded-2xl bg-[#0b1120] border border-white/15 glass-panel flex flex-col items-center justify-center gap-4">
        {/* Live waveform canvas */}
        {isRecording && (
          <div className="w-full flex flex-col items-center gap-2">
            <canvas ref={canvasRef} width={280} height={42} className="w-full h-10 rounded-lg bg-black/40" />
            <div className="text-xs font-mono text-red-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              Recording live microphone: {recordingDuration}s
            </div>
          </div>
        )}

        {/* Audio Player if audio loaded */}
        {audioBase64 && !isRecording && (
          <div className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 font-mono">
            <Volume2 className="w-5 h-5 text-[#FFCE32]" />
            <div className="flex-1 text-xs text-slate-200 truncate">
              Audio Stream Ready (Voice Memo / Audio Track)
            </div>
            <audio controls src={audioBase64} className="h-8 max-w-[200px]" />
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {!isRecording ? (
            <button
              type="button"
              onClick={startRecording}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-red-500/20 transition-all cursor-pointer"
            >
              <Mic className="w-4 h-4" />
              <span>Record Live Voice</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={stopRecording}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-slate-200 text-black text-xs font-bold shadow-lg transition-all cursor-pointer"
            >
              <Square className="w-4 h-4 text-red-600 fill-red-600" />
              <span>Finish Recording</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white text-xs font-medium transition-all"
          >
            <Upload className="w-4 h-4 text-[#1D63FF]" />
            <span>Upload File</span>
          </button>

          <button
            type="button"
            onClick={loadSampleMemo}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-medium transition-all font-mono"
          >
            <span>Preset Memo</span>
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
}
