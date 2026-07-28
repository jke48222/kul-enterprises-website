"use client";

import { useRef, useState } from "react";
import { m } from "framer-motion";
import { EASE } from "@/components/v2/motion";

/**
 * §3.20 underline field system, text input primitive.
 *
 * No boxes: transparent background over a resting hairline; focus draws a
 * 1.5px full-strength ink/paper line (NEVER gold, motion is the focus
 * signal, not color). Label sits ABOVE the line in micro, lifts 2px to full
 * opacity on focus. Errors turn line + label desaturated brick and slide a
 * message down 4px. All animation is transform/opacity only;
 * `motion-reduce:` guards leave everything visible at rest.
 *
 * Shared internals (`useUnderlineField`, `FieldChrome`, `FIELD_GROUND`) are
 * exported for SelectField / TextareaField and the QuoteStrip composite.
 */

export type FieldGround = "paper" | "ink";

/**
 * Ground-keyed class recipes for the underline system.
 *
 * Every alpha below is a measured WCAG value against the ground it sits on
 * (paper #F7F5F0, ink #0B0B0B), composited in sRGB the way a browser does it.
 * Do not lower them without recomputing, the field system has no boxes, so
 * the hairline is the only thing that says "a control lives here" and it is
 * held to the 3:1 non-text floor (WCAG 1.4.11), not to taste.
 */
export const FIELD_GROUND: Record<
  FieldGround,
  {
    text: string;
    placeholder: string;
    label: string;
    rest: string;
    line: string;
    ring: string;
    errorText: string;
    errorLine: string;
  }
> = {
  paper: {
    text: "text-ink",
    // ink/60 = 5.07:1 on paper. Was ink/40 = 2.67:1 (WCAG 1.4.3 fail).
    placeholder: "placeholder:text-ink/60",
    label: "text-ink",
    // Resting hairline, the sole affordance for the control, so WCAG 1.4.11
    // applies. ink/50 = 3.62:1. Was ink/15 = 1.39:1 (ink/40 = 2.67:1 also fails).
    rest: "bg-ink/50",
    line: "bg-ink",
    // Restores the keyboard ring that `focus:outline-none` used to suppress.
    // #0B0B0B on paper = 18.06:1; mirrors the paper-ground ring in globals.css.
    // Specificity (0,2,0) so it wins over the `outline-none` reset regardless
    // of source order, it does not depend on a data-ground ancestor.
    ring:
      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ink",
    errorText: "text-[#8C3B2E]", // 6.93:1 on paper
    errorLine: "bg-[#8C3B2E]",
  },
  ink: {
    text: "text-paper",
    // paper/50 = 4.99:1 on ink. Was paper/40 = 3.57:1 (WCAG 1.4.3 fail).
    placeholder: "placeholder:text-paper/50",
    label: "text-paper",
    // white/40 = 3.78:1 on ink. Was white/18 = 1.65:1 (WCAG 1.4.11 fail).
    rest: "bg-white/40",
    line: "bg-paper",
    // #B59352 on ink = 6.80:1; mirrors the default ring in globals.css.
    ring:
      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-gold",
    // The paper brick #8C3B2E measures only 2.61:1 on ink; the lifted brick
    // used by QuoteStrip measures 6.94:1.
    errorText: "text-[#C98A7A]",
    errorLine: "bg-[#C98A7A]",
  },
};

/**
 * Desaturated brick for invalid states (§3.20), never red-alarm, never gold.
 * Paper ground only: 6.93:1 on #F7F5F0, but 2.61:1 on ink. Ink-ground fields
 * use FIELD_ERROR_COLOR_INK (6.94:1 on #0B0B0B) via FIELD_GROUND.ink.
 */
export const FIELD_ERROR_COLOR = "#8C3B2E";
export const FIELD_ERROR_COLOR_INK = "#C98A7A";

/** CSS timing function mirroring EASE.micro for non-framer transitions. */
export const MICRO_BEZIER = `cubic-bezier(${EASE.micro.join(",")})`;

type ValidityElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

/**
 * Focus + inline-validity state machine shared by all three field types.
 * Validates on blur once the field is dirty (aria-invalid on blur, §3.20);
 * the `invalid` event (fired on submit attempts) also marks the field so the
 * browser's focus-to-first-error behavior lands on a brick-styled field.
 */
export function useUnderlineField<E extends ValidityElement>({
  onFocus,
  onBlur,
  onChange,
  onInvalid,
}: {
  onFocus?: React.FocusEventHandler<E>;
  onBlur?: React.FocusEventHandler<E>;
  onChange?: React.ChangeEventHandler<E>;
  onInvalid?: React.FormEventHandler<E>;
}) {
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dirty = useRef(false);

  const handleFocus: React.FocusEventHandler<E> = (e) => {
    setFocused(true);
    onFocus?.(e);
  };
  const handleBlur: React.FocusEventHandler<E> = (e) => {
    setFocused(false);
    if (dirty.current || error) {
      setError(e.currentTarget.checkValidity() ? null : e.currentTarget.validationMessage);
    }
    onBlur?.(e);
  };
  const handleChange: React.ChangeEventHandler<E> = (e) => {
    dirty.current = true;
    if (error && e.currentTarget.checkValidity()) setError(null);
    onChange?.(e);
  };
  const handleInvalid: React.FormEventHandler<E> = (e) => {
    setError(e.currentTarget.validationMessage || "This field is required.");
    onInvalid?.(e);
  };

  return {
    focused,
    error,
    handlers: {
      onFocus: handleFocus,
      onBlur: handleBlur,
      onChange: handleChange,
      onInvalid: handleInvalid,
    },
  };
}

/** Label + resting hairline + focus underline + error message chrome. */
export function FieldChrome({
  id,
  label,
  ground = "paper",
  optional,
  focused,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  ground?: FieldGround;
  optional?: boolean;
  focused: boolean;
  error: string | null;
  className?: string;
  children: React.ReactNode;
}) {
  const g = FIELD_GROUND[ground];
  const active = focused || !!error;

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className={[
          "mb-1 block text-micro uppercase transition-[transform,opacity] duration-200 motion-reduce:transform-none motion-reduce:transition-none",
          error
            ? `${g.errorText} opacity-100`
            : focused
              ? `${g.label} -translate-y-0.5 opacity-100`
              : `${g.label} opacity-60`,
        ].join(" ")}
        style={{ transitionTimingFunction: MICRO_BEZIER }}
      >
        {label}
        {/* No nested opacity: opacity-70 inside the label's own opacity-60
            compounded to 0.42 and measured 2.83:1. Inheriting the label's
            treatment gives the suffix the label's 5.07:1 on paper. */}
        {optional && <span> · optional</span>}
      </label>

      <div className="relative">
        {children}
        {/* Resting hairline */}
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-px ${
            error ? g.errorLine : g.rest
          }`}
        />
        {/* Focus underline: full-strength currentColor ink/paper, NEVER gold.
            Slow enter (0.45s micro), fast leave (0.2s). */}
        <span
          aria-hidden
          className={[
            "pointer-events-none absolute inset-x-0 bottom-0 h-[1.5px] origin-left transition-transform motion-reduce:transition-none",
            error ? g.errorLine : g.line,
            active ? "scale-x-100 duration-[450ms]" : "scale-x-0 duration-200",
          ].join(" ")}
          style={{ transitionTimingFunction: MICRO_BEZIER }}
        />
      </div>

      {error && (
        <m.p
          id={`${id}-error`}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [...EASE.micro] }}
          className={`mt-2 text-micro uppercase ${g.errorText}`}
        >
          {error}
        </m.p>
      )}
    </div>
  );
}

export type FieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "children"> & {
  id: string;
  label: string;
  ground?: FieldGround;
  optional?: boolean;
  /** Applied to the wrapper (grid placement); control styling is owned by the system. */
  className?: string;
};

export function Field({
  id,
  label,
  ground = "paper",
  optional,
  className,
  onFocus,
  onBlur,
  onChange,
  onInvalid,
  "aria-describedby": ariaDescribedBy,
  ...rest
}: FieldProps) {
  const { focused, error, handlers } = useUnderlineField<HTMLInputElement>({
    onFocus,
    onBlur,
    onChange,
    onInvalid,
  });
  const g = FIELD_GROUND[ground];
  const describedBy =
    [ariaDescribedBy, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;

  return (
    <FieldChrome
      id={id}
      label={label}
      ground={ground}
      optional={optional}
      focused={focused}
      error={error}
      className={className}
    >
      {/* `focus:outline-none` used to sit on this input at specificity (0,2,0),
          beating the global `:focus-visible` ring at (0,1,0), keyboard focus
          painted no ring at all. The animated underline stays the primary focus
          signal; g.ring restores a visible ring for keyboard users only. */}
      <input
        id={id}
        {...rest}
        {...handlers}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`h-16 w-full appearance-none rounded-none border-0 bg-transparent p-0 font-mont text-[17px] caret-current outline-none ${g.ring} ${g.text} ${g.placeholder}`}
      />
    </FieldChrome>
  );
}
