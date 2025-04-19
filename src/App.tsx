import { useState, useEffect } from 'react';
import { Timer, X as Close, Minus, Pause, Play, RotateCcw } from 'lucide-react';

type TimerType = 'work' | 'shortBreak' | 'longBreak';

interface TimerState {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  type: TimerType;
}

const TIMER_PRESETS = {
  work: 25,
  shortBreak: 5,
  longBreak: 15,
};

function App() {
  const [timer, setTimer] = useState<TimerState>({
    minutes: TIMER_PRESETS.work,
    seconds: 0,
    isRunning: false,
    type: 'work',
  });

  const totalSeconds = timer.minutes * 60 + timer.seconds;
  const maxSeconds = TIMER_PRESETS[timer.type] * 60;
  const progress = ((maxSeconds - totalSeconds) / maxSeconds) * 100;

  useEffect(() => {
    let interval: number | undefined;

    if (timer.isRunning) {
      interval = window.setInterval(() => {
        if (timer.seconds === 0) {
          if (timer.minutes === 0) {
            new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play();
            setTimer(prev => ({ ...prev, isRunning: false }));
            return;
          }
          setTimer(prev => ({
            ...prev,
            minutes: prev.minutes - 1,
            seconds: 59,
          }));
        } else {
          setTimer(prev => ({
            ...prev,
            seconds: prev.seconds - 1,
          }));
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timer.isRunning, timer.minutes, timer.seconds]);

  const toggleTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const resetTimer = () => {
    setTimer(prev => ({
      ...prev,
      minutes: TIMER_PRESETS[prev.type],
      seconds: 0,
      isRunning: false,
    }));
  };

  const changeTimerType = (type: TimerType) => {
    setTimer({
      minutes: TIMER_PRESETS[type],
      seconds: 0,
      isRunning: false,
      type,
    });
  };

  const minimizeWindow = () => {
    if (window.electron) {
      window.electron.minimize();
    }
  };

  const closeWindow = () => {
    if (window.electron) {
      window.electron.close();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg overflow-hidden">
      <div className="flex justify-between items-center p-4 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center">
          <Timer className="w-5 h-5 text-white mr-2" />
          <span className="text-white font-semibold">Pomodoro Timer</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={minimizeWindow}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Minus className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={closeWindow}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Close className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      <div className="p-8">
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => changeTimerType('work')}
            className={`px-4 py-2 rounded-lg transition-all ${
              timer.type === 'work'
                ? 'bg-white text-purple-600'
                : 'text-white hover:bg-white/20'
            }`}
          >
            Work
          </button>
          <button
            onClick={() => changeTimerType('shortBreak')}
            className={`px-4 py-2 rounded-lg transition-all ${
              timer.type === 'shortBreak'
                ? 'bg-white text-purple-600'
                : 'text-white hover:bg-white/20'
            }`}
          >
            Short Break
          </button>
          <button
            onClick={() => changeTimerType('longBreak')}
            className={`px-4 py-2 rounded-lg transition-all ${
              timer.type === 'longBreak'
                ? 'bg-white text-purple-600'
                : 'text-white hover:bg-white/20'
            }`}
          >
            Long Break
          </button>
        </div>

        <div className="relative w-64 h-64 mx-auto mb-8">
          <svg className="w-full h-full -rotate-90 transform">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="white"
              strokeOpacity="0.2"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="white"
              strokeWidth="8"
              fill="none"
              strokeDasharray={2 * Math.PI * 120}
              strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-6xl font-bold text-white mb-2 font-mono">
              {String(timer.minutes).padStart(2, '0')}:
              {String(timer.seconds).padStart(2, '0')}
            </div>
          </div>
        </div>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={toggleTimer}
            className="bg-white rounded-full p-4 hover:bg-white/90 transition-all"
          >
            {timer.isRunning ? (
              <Pause className="w-6 h-6 text-purple-600" />
            ) : (
              <Play className="w-6 h-6 text-purple-600" />
            )}
          </button>
          <button
            onClick={resetTimer}
            className="bg-white/20 rounded-full p-4 hover:bg-white/30 transition-all"
          >
            <RotateCcw className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="text-center text-white/60 mt-8">
          <p className="text-sm">
            {timer.type === 'work'
              ? 'Time to focus!'
              : 'Time for a break!'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;