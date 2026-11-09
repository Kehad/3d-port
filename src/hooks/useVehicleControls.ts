import { useState, useEffect, useCallback } from 'react';

export interface VehicleControlsState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  action: boolean; // 'E' or Space to enter mansion / interact
}

export function useVehicleControls() {
  const [controls, setControls] = useState<VehicleControlsState>({
    up: false,
    down: false,
    left: false,
    right: false,
    action: false,
  });

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.code) {
      case 'ArrowUp':
      case 'KeyW':
        setControls((c) => (c.up ? c : { ...c, up: true }));
        break;
      case 'ArrowDown':
      case 'KeyS':
        setControls((c) => (c.down ? c : { ...c, down: true }));
        break;
      case 'ArrowLeft':
      case 'KeyA':
        setControls((c) => (c.left ? c : { ...c, left: true }));
        break;
      case 'ArrowRight':
      case 'KeyD':
        setControls((c) => (c.right ? c : { ...c, right: true }));
        break;
      case 'KeyE':
      case 'Space':
      case 'Enter':
        setControls((c) => (c.action ? c : { ...c, action: true }));
        break;
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    switch (e.code) {
      case 'ArrowUp':
      case 'KeyW':
        setControls((c) => (!c.up ? c : { ...c, up: false }));
        break;
      case 'ArrowDown':
      case 'KeyS':
        setControls((c) => (!c.down ? c : { ...c, down: false }));
        break;
      case 'ArrowLeft':
      case 'KeyA':
        setControls((c) => (!c.left ? c : { ...c, left: false }));
        break;
      case 'ArrowRight':
      case 'KeyD':
        setControls((c) => (!c.right ? c : { ...c, right: false }));
        break;
      case 'KeyE':
      case 'Space':
      case 'Enter':
        setControls((c) => (!c.action ? c : { ...c, action: false }));
        break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const setManualControl = useCallback((key: keyof VehicleControlsState, value: boolean) => {
    setControls((c) => ({ ...c, [key]: value }));
  }, []);

  return { controls, setManualControl };
}
