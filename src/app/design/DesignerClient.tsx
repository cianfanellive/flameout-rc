"use client";

import { useState } from "react";
import { GarmentMockup } from "@/components/GarmentMockup";
import { CheckeredFlagIcon } from "@/components/icons";
import {
  DISCIPLINE_LABEL,
  STYLE_LABEL,
  type Discipline,
  type DesignStyle,
  type Garment,
} from "@/lib/types";

const DISCIPLINES = Object.keys(DISCIPLINE_LABEL) as Discipline[];
const STYLES = Object.keys(STYLE_LABEL) as DesignStyle[];
const TEE_SIZES = ["S", "M", "L", "XL", "XXL"];

interface DesignResult {
  imageDataUrl: string;
  stubbed: boolean;
  note?: string;
}

interface PrintifyResult {
  stubbed: boolean;
  productId?: string;
  note: string;
}

export function DesignerClient() {
  const [garment, setGarment] = useState<Garment>("tee");
  const [discipline, setDiscipline] = useState<Discipline>("buggy");
  const [style, setStyle] = useState<DesignStyle>("flame");
  const [rig, setRig] = useState("");
  const [primary, setPrimary] = useState("#ff5a1f");
  const [secondary, setSecondary] = useState("#ffc400");
  const [details, setDetails] = useState("");
  const [size, setSize] = useState("M");

  const [design, setDesign] = useState<DesignResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [printify, setPrintify] = useState<PrintifyResult | null>(null);
  const [sending, setSending] = useState(false);

  async function handleGenerate(e?: React.FormEvent) {
    e?.preventDefault();
    if (!rig.trim()) {
      setError("Tell us your rig's brand or model first.");
      return;
    }
    setError(null);
    setPrintify(null);
    setLoading(true);
    try {
      const res = await fetch("/api/generate-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ garment, discipline, style, rig, primary, secondary, details }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");
      setDesign(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleSendToPrintify() {
    if (!design) return;
    setSending(true);
    setPrintify(null);
    try {
      const res = await fetch("/api/printify/create-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          garment,
          title: `${rig || "Custom"} — ${DISCIPLINE_LABEL[discipline]}`,
          imageDataUrl: design.imageDataUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Printify request failed");
      setPrintify(data);
    } catch (err) {
      setPrintify({ stubbed: true, note: err instanceof Error ? err.message : "Request failed" });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      {/* ── FORM ─────────────────────────────────────────────────────── */}
      <form
        onSubmit={handleGenerate}
        className="space-y-6 rounded-md border border-white/10 bg-asphalt-800 p-6 shadow-panel"
      >
        <div>
          <Label>Garment</Label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(["tee", "cap"] as Garment[]).map((g) => (
              <button
                type="button"
                key={g}
                onClick={() => setGarment(g)}
                className={segmentClass(garment === g)}
              >
                {g === "tee" ? "Tee" : "Snapback Cap"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="discipline">RC Discipline</Label>
          <select
            id="discipline"
            value={discipline}
            onChange={(e) => setDiscipline(e.target.value as Discipline)}
            className={selectClass}
          >
            {DISCIPLINES.map((d) => (
              <option key={d} value={d}>
                {DISCIPLINE_LABEL[d]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="rig">Rig brand / model</Label>
          <input
            id="rig"
            value={rig}
            onChange={(e) => setRig(e.target.value)}
            placeholder='e.g. "Team Associated RC10" or your team name'
            maxLength={40}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ColorField label="Primary color" value={primary} onChange={setPrimary} />
          <ColorField label="Secondary color" value={secondary} onChange={setSecondary} />
        </div>

        <div>
          <Label htmlFor="style">Design style</Label>
          <select
            id="style"
            value={style}
            onChange={(e) => setStyle(e.target.value as DesignStyle)}
            className={selectClass}
          >
            {STYLES.map((s) => (
              <option key={s} value={s}>
                {STYLE_LABEL[s]}
              </option>
            ))}
          </select>
        </div>

        {garment === "tee" ? (
          <div>
            <Label htmlFor="size">Size</Label>
            <select id="size" value={size} onChange={(e) => setSize(e.target.value)} className={selectClass}>
              {TEE_SIZES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div>
          <Label htmlFor="details">Extra direction (optional)</Label>
          <textarea
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            maxLength={300}
            rows={3}
            placeholder="Sponsor names, a slogan, a race number — anything you want worked in."
            className={`${inputClass} resize-none`}
          />
        </div>

        {error ? <p className="text-sm text-ember-500">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-sm bg-flame-500 px-6 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-asphalt-950 shadow-glow transition hover:bg-flame-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <CheckeredFlagIcon className="h-4 w-4" />
          {loading ? "Generating…" : design ? "Regenerate Design" : "Generate Design"}
        </button>
      </form>

      {/* ── PREVIEW ──────────────────────────────────────────────────── */}
      <div className="flex flex-col">
        <div className="rounded-md border border-white/10 bg-asphalt-800 p-6 shadow-panel">
          <div className="mx-auto max-w-xs">
            <GarmentMockup garment={garment} garmentColor="black" label={rig || undefined}>
              {loading ? (
                <div className="flex h-full w-full items-center justify-center bg-asphalt-900">
                  <CheckeredFlagIcon className="h-8 w-8 animate-spin-slow text-flame-500" />
                </div>
              ) : design ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={design.imageDataUrl}
                  alt={`${rig || "Custom"} generated livery`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-asphalt-900 text-center text-xs text-chrome-400/70">
                  <CheckeredFlagIcon className="h-6 w-6" />
                  Your design appears here
                </div>
              )}
            </GarmentMockup>
          </div>

          {design?.stubbed && design.note ? (
            <p className="mt-4 rounded-sm border border-caution-500/30 bg-caution-500/10 px-3 py-2 text-xs text-caution-400">
              {design.note}
            </p>
          ) : null}

          {design ? (
            <button
              onClick={handleSendToPrintify}
              disabled={sending}
              className="mt-5 w-full rounded-sm border border-white/15 px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-chrome-300 transition hover:border-flame-500/50 hover:text-flame-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sending ? "Sending…" : "Send to Printify →"}
            </button>
          ) : null}

          {printify ? (
            <p
              className={`mt-3 rounded-sm border px-3 py-2 text-xs ${
                printify.stubbed
                  ? "border-caution-500/30 bg-caution-500/10 text-caution-400"
                  : "border-flame-500/30 bg-flame-500/10 text-flame-400"
              }`}
            >
              {printify.note}
              {printify.productId ? ` (product id: ${printify.productId})` : ""}
            </p>
          ) : null}
        </div>

        <p className="mt-4 text-center text-xs text-chrome-400/70">
          Designs are original artwork inspired by your rig — not a
          reproduction of any manufacturer&apos;s logo or trademark.
        </p>
      </div>
    </div>
  );
}

const inputClass =
  "mt-2 w-full rounded-sm border border-white/15 bg-asphalt-900 px-3 py-2.5 text-sm text-chrome-300 placeholder:text-chrome-400/50 focus:border-flame-500 focus:outline-none";

const selectClass = `${inputClass} appearance-none`;

function segmentClass(active: boolean) {
  return [
    "rounded-sm border px-3 py-2.5 text-sm font-display font-semibold uppercase tracking-wide transition",
    active
      ? "border-flame-500 bg-flame-500/15 text-flame-400"
      : "border-white/15 text-chrome-400 hover:border-white/30",
  ].join(" ");
}

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="font-display text-xs font-bold uppercase tracking-widest text-chrome-400"
    >
      {children}
    </label>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2 flex items-center gap-2 rounded-sm border border-white/15 bg-asphalt-900 px-2 py-1.5">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-9 cursor-pointer rounded-sm border border-white/10 bg-transparent"
          aria-label={label}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm text-chrome-300 focus:outline-none"
        />
      </div>
    </div>
  );
}
