/// <reference types="vite/client" />

declare module '*.css';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.webp';
declare module '*.gif';

declare module 'react';
declare module 'react/jsx-runtime';
declare module 'react-dom/client';
declare module 'react-router-dom';
declare module 'lucide-react';

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
