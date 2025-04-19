/// <reference types="vite/client" />

interface Window {
  electron?: {
    minimize: () => void;
    close: () => void;
  };
}