"use client";

import { useRef, useState } from "react";
import { m } from "framer-motion";
import { EASE } from "@/components/v2/motion";

/**
 * §3.20 underline field system — text input primitive.
 *
 * No boxes: transparent background over a resting hairline; focus draws a
 * 1.5px full-strength ink/paper line (NEVER gold — motion is the focus
 * signal, not color). Label sits ABOVE the line in micro, lifts 2px to full
 * opacity on focus. Errors turn line + label desaturated brick and slide a
 * message down 4px. All animation is transform/opacity only;
 * `motion-reduce:` guards leave everything visible at rest.
 *
 * Shared internals (`useUnderlineField`, `FieldChrome`, `FIELD_GROUND`) are
 * exported for SelectField / TextareaField and the QuoteStrip composite.
 */

export type FieldGround = "paper" | "ink";

/** Ground-keyed class recipes for the underline system. */
export const FIELD_GROUND: Record<
  FieldGround,
  { text: string; placeholder: string; label: string; rest: string; line: string }
> = {
  paper: {
    text: "text-ink",
    placeholder: "placeholder:text-ink/40",
    label: "text-ink",
    rest: "bg-ink/15",
    line: "bg-ink",
  },
  ink: {
    text: "text-paper",
    placeholder: "placeholder:text-paper/40",
    label: "text-paper",
    rest: "bg-white/18",
    line: "bg-paper",
  },
};

/** Desaturated brick for invalid states (§3.20) — never red-alarm, never gold. */
export const FIELD_ERROR_COLOR = "#8C3B2E";

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
            ? "text-[#8C3B2E] opacity-100"
            : focused
              ? `${g.label} -translate-y-0.5 opacity-100`
              : `${g.label} opacity-60`,
        ].join(" ")}
        style={{ transitionTimingFunction: MICRO_BEZIER }}
      >
        {label}
        {optional && <span className="opacity-70"> · optional</span>}
      </label>

      <div className="relative">
        {children}
        {/* Resting hairline */}
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-px ${
            error ? "bg-[#8C3B2E]" : g.rest
          }`}
        />
        {/* Focus underline: full-strength currentColor ink/paper, NEVER gold.
            Slow enter (0.45s micro), fast leave (0.2s). */}
        <span
          aria-hidden
          className={[
            "pointer-events-none absolute inset-x-0 bottom-0 h-[1.5px] origin-left transition-transform motion-reduce:transition-none",
            error ? "bg-[#8C3B2E]" : g.line,
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
          className="mt-2 text-micro uppercase text-[#8C3B2E]"
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
      <input
        id={id}
        {...rest}
        {...handlers}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`h-16 w-full appearance-none rounded-none border-0 bg-transparent p-0 font-mont text-[17px] caret-current outline-none focus:outline-none ${g.text} ${g.placeholder}`}
      />
    </FieldChrome>
  );
}
