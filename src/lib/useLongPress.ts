import { useRef } from "react";

const LONG_PRESS_MS = 500;
const MOVE_CANCEL_PX = 10;

/**
 * Detects a long-press on an element that's also a navigation target (a `<Link>` inside the
 * same card) and a horizontally-swipeable carousel. On a genuine long-press we intercept the
 * click in the capture phase and cancel it, so the card doesn't also navigate away when the
 * buyer was just asking for more detail. A drag/swipe (to change carousel slides) cancels the
 * timer instead of firing, so scrolling the carousel never gets mistaken for a long-press.
 * Attach the returned handlers to an ancestor of the `<Link>`, not the `<Link>` itself.
 */
export function useLongPress(onLongPress: () => void) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firedRef = useRef(false);
  const originRef = useRef<{ x: number; y: number } | null>(null);

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const start = (e: React.PointerEvent) => {
    firedRef.current = false;
    originRef.current = { x: e.clientX, y: e.clientY };
    clearTimer();
    timerRef.current = setTimeout(() => {
      firedRef.current = true;
      onLongPress();
    }, LONG_PRESS_MS);
  };

  const move = (e: React.PointerEvent) => {
    const origin = originRef.current;
    if (!origin) return;
    if (Math.abs(e.clientX - origin.x) > MOVE_CANCEL_PX || Math.abs(e.clientY - origin.y) > MOVE_CANCEL_PX) {
      clearTimer();
    }
  };

  return {
    onPointerDown: start,
    onPointerMove: move,
    onPointerUp: clearTimer,
    onPointerLeave: clearTimer,
    onPointerCancel: clearTimer,
    onClickCapture: (e: React.MouseEvent) => {
      if (firedRef.current) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
  };
}
