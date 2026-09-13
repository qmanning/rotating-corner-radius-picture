// Lab: "Rotating Corner Radius Picture" (Figma 21:1170). A photo frame whose four
// corners re-roll between round (999) and hover (60) each time the picture
// changes — same rules as the homepage carousel (never all four the same).
// Picker (21:1302): square / landscape / portrait; portrait is default. Clicking
// changes the frame's aspect. Photos: /public/home-2026/lab/photo-{1,2,3}.jpg;
// until they exist, three flat color fields stand in.
"use client";

import { useEffect, useState } from "react";
import { Square, RectangleHorizontal, RectangleVertical } from "lucide-react";
import LabSettings, { useLabSettings, type LabSettingSchema } from "@/components/labs/LabSettings";

const PHOTOS = ["/home-2026/lab/photo-1.jpg?v=2", "/home-2026/lab/photo-2.jpg?v=2", "/home-2026/lab/photo-3.jpg?v=2"];
const FALLBACK = ["linear-gradient(135deg,#ff5364,#ffc429)", "linear-gradient(135deg,#84ceff,#7cffb2)", "linear-gradient(135deg,#c79bff,#ff8490)"];
type Ratio = "square" | "landscape" | "portrait";
const SIZE: Record<Ratio, { w: number; h: number }> = { square: { w: 180, h: 180 }, landscape: { w: 218, h: 163 }, portrait: { w: 163, h: 218 } };

export const ROTATING_FRAME_SETTINGS: LabSettingSchema = [
    {
        key: "aspect",
        label: "Aspect",
        kind: "select",
        default: "portrait",
        options: [
            { value: "square", label: "Square" },
            { value: "landscape", label: "Landscape" },
            { value: "portrait", label: "Portrait" },
        ],
    },
    { key: "roundRadius", label: "Round radius", kind: "range", default: 999, min: 200, max: 999, step: 1, unit: "px" },
    { key: "softRadius", label: "Soft radius", kind: "range", default: 60, min: 8, max: 200, step: 1, unit: "px" },
    { key: "intervalMs", label: "Change interval", kind: "range", default: 4000, min: 800, max: 10000, step: 100, unit: "ms" },
    { key: "autoCycle", label: "Auto-cycle", kind: "toggle", default: true },
    { key: "neverAllSame", label: "Never all same", kind: "toggle", default: true },
];

function rollRadius(prev: string, round: string, soft: string, neverAllSame: boolean): string {
    let next = prev;
    for (let i = 0; i < 20 && next === prev; i++) {
        const c = [0, 1, 2, 3].map(() => (Math.random() > 0.5 ? round : soft));
        if (neverAllSame && c.every((x) => x === soft)) c[Math.floor(Math.random() * 4)] = round;
        next = c.join(" ");
    }
    return next;
}

export default function RotatingFrame() {
    const { value, setValue, reset, save } = useLabSettings(ROTATING_FRAME_SETTINGS, "lab:rotating-corner-radius-picture");
    const round = `${value.roundRadius}px`;
    const soft = `${value.softRadius}px`;
    const ratio = (value.aspect as Ratio) ?? "portrait";

    const [i, setI] = useState(0);
    const [radius, setRadius] = useState(`${round} ${soft} ${soft} ${soft}`);
    const [ok, setOk] = useState<boolean[]>([false, false, false]);

    useEffect(() => {
        PHOTOS.forEach((src, idx) => {
            const img = new Image();
            img.onload = () => setOk((o) => { const n = [...o]; n[idx] = true; return n; });
            img.src = src;
        });
    }, []);
    useEffect(() => {
        if (!value.autoCycle) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const id = window.setInterval(() => {
            setI((x) => (x + 1) % PHOTOS.length);
            setRadius((r) => rollRadius(r, round, soft, Boolean(value.neverAllSame)));
        }, value.intervalMs);
        return () => window.clearInterval(id);
    }, [value.autoCycle, value.intervalMs, round, soft, value.neverAllSame]);

    const { w, h } = SIZE[ratio];
    const bg = ok[i] ? `url(${PHOTOS[i]}) center/cover` : FALLBACK[i];

    return (
        <div className="group relative flex h-full w-full items-start justify-center pt-[56px]">
            <LabSettings
                schema={ROTATING_FRAME_SETTINGS}
                value={value}
                onChange={setValue}
                onReset={reset}
                onSave={save}
                storageKey="lab:rotating-corner-radius-picture"
                title="Frame settings"
                anchor="top-right"
            />
            {/* Shadow twin behind the frame, blended OVERLAY (box-shadow can't blend on its own) */}
            <div className="h26-frame-shadow" style={{ width: w, height: h, borderRadius: radius, position: "absolute", top: 56, left: "50%", transform: "translateX(-50%)", mixBlendMode: "overlay" }} aria-hidden="true" />
            <div
                className="h26-frame relative overflow-hidden"
                style={{ width: w, height: h, borderRadius: radius, background: ok[i] ? "#111" : bg }}
                aria-hidden="true"
            >
                {/* All photos stacked; the current one fades in over 800ms. Overfilled 8% so the rounded edge never seams. */}
                {PHOTOS.map((src, idx) =>
                    ok[idx] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={src} src={src} alt="" className="absolute inset-0 h-full w-full scale-[1.08] object-cover transition-opacity duration-[800ms] ease-in-out" style={{ opacity: idx === i ? 1 : 0 }} />
                    ) : null
                )}
            </div>
            <div className="h26-picker absolute bottom-4 left-1/2 -translate-x-1/2">
                {(["square", "landscape", "portrait"] as Ratio[]).map((r) => {
                    const Icon = r === "square" ? Square : r === "landscape" ? RectangleHorizontal : RectangleVertical;
                    return (
                        <button key={r} type="button" data-tip={r === "square" ? "Square frame" : r === "landscape" ? "Landscape frame" : "Portrait frame"} aria-label={r} aria-pressed={ratio === r} onClick={(e) => { e.preventDefault(); setValue("aspect", r); }} className="h26-picker-btn">
                            <Icon className="h-4 w-4" />
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
