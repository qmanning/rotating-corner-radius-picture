# Rotating Corner Radius Picture

A photo frame that re-rolls its four corner radii on every change — never all the same.

**Live demo:** https://qmanning.com/labs/rotating-corner-radius-picture

## What it does

A picture sits in a frame with four independent corner radii. Every time the photo (or the aspect ratio) changes, each corner re-rolls to either a full pill (`999px`) or a soft `60px` — with one rule: **never all four the same**, so the frame always has a direction. Square, landscape and portrait pickers; portrait by default. The transitions are eased, so a change *rolls* rather than snaps.

It's a small idea that makes a gallery feel handmade instead of templated.

## How it works

- `roll()` draws four booleans and rejects the two all-equal outcomes, then maps them to `999px | 60px`.
- The radii are written as a single `border-radius` shorthand on the frame and animated with CSS `transition`, so the browser tweens between corner states.
- Photos come from `/home-2026/lab/photo-{1,2,3}.jpg`; if an image fails, a gradient fallback fills the frame so the layout never breaks.
- Aspect ratios are a small map (`square`, `landscape`, `portrait`) applied with `aspect-ratio`.

## Settings

The gear in the top corner of the demo (14px, `Settings` icon) opens a menu of this lab's controls; every change updates the demo live. Save keeps your values in the browser, Reset restores the defaults, and a universal "Hide controls" switch hides every lab's gear at once (a small "show controls" link brings it back).

| Control | Type | Default | Range or options |
|---|---|---|---|
| Aspect | select | Portrait | Square, Landscape, Portrait |
| Round radius | range | 999px | 200px to 999px |
| Soft radius | range | 60px | 8px to 200px |
| Change interval | range | 4000ms | 800ms to 10000ms |
| Auto-cycle | toggle | on | on/off |
| Never all same | toggle | on | on/off |

Going live: pass `showControls={false}` to hide the gear in production, or keep it and let visitors dial it in.

## Install

1. Download `RotatingFrame.tsx` (this repo) and drop it anywhere in your React/Next project — it's a client component (`"use client"`).
2. Install the icon set it uses if you don't have it: `npm i lucide-react`.
3. Put your own photos in `public/` and edit the `PHOTOS` array at the top of the file.

```bash
npm i lucide-react
```

## Use

```tsx
import RotatingFrame from "@/components/RotatingFrame";

export default function Gallery() {
    return (
        <div className="h-[420px]">
            <RotatingFrame />
        </div>
    );
}
```

The component fills its parent, so give the parent a height. To change the two radii the roll chooses between, edit `PILL` and `SOFT` near the top of the file; to make it re-roll on a timer instead of on a click, call `roll()` from a `setInterval` in the existing `useEffect`.

## License

MIT. Take it, change it, ship it — a link back is nice but not required.
