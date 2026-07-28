"use client";

import { useUnderlineField } from "./Field";

/**
 * PANELLED FORM FIELDS
 *
 * Each one is a panel with the question printed small along the top and the
 * visitor's answer underneath it, which is the shape drawn on the Paper
 * artboards "Quote, desktop 1440" and "Drivers, desktop 1440".
 *
 * The question stays printed inside the box even after somebody has typed, on
 * purpose. Forms that use the question as grey placeholder text lose it the
 * moment you start writing, and then nobody can check what they were asked.
 *
 * THERE ARE TWO COLOURWAYS, chosen with the `tone` setting:
 *
 *   dark    The default. A soft dark panel, for the dark half of the quote
 *           page. The panel is "blueprint", the question is "on dark soft",
 *           the answer is "on dark".
 *   light   For the warm ground on the drivers page. An almost white panel
 *           with a hairline round it, the question in "ink soft" and the
 *           answer in "ink".
 *
 * A field being typed into is outlined in gold either way, and a field with a
 * problem is outlined and labelled in the site's error red for that ground.
 *
 * The older underline fields in Field.tsx are still used by the contact form.
 * Both sets share the same checking behaviour underneath, so a field turns and
 * explains itself the same way whichever look it wears.
 */

export type PanelTone = "dark" | "light";

/**
 * Every colour that changes between the two colourways, in one place. Adding a
 * third colourway means adding one entry here and nothing else.
 */
const TONES: Record<
  PanelTone,
  {
    panel: string;
    idle: string;
    error: string;
    focus: string;
    label: string;
    star: string;
    control: string;
    errorText: string;
    chevron: string;
  }
> = {
  dark: {
    panel: "bg-k-blueprint",
    idle: "border-transparent",
    error: "border-[#C98A7A]",
    focus: "focus-within:border-k-gold-lit",
    label: "text-k-on-dark-soft",
    star: "text-k-gold-lit",
    control: "text-k-on-dark placeholder:text-k-on-dark-faint",
    errorText: "text-[#C98A7A]",
    chevron: "text-k-on-dark-soft",
  },
  light: {
    panel: "bg-k-surface",
    idle: "border-k-rule",
    error: "border-k-error",
    focus: "focus-within:border-k-gold",
    label: "text-k-ink-soft",
    star: "text-k-gold",
    // Placeholders use "ink soft" rather than "ink faint": faint measures
    // 4.18:1 on this panel, which is under the readable minimum.
    control: "text-k-ink placeholder:text-k-ink-soft",
    errorText: "text-k-error",
    chevron: "text-k-ink-soft",
  },
};

/** Shared shell: the panel, the question, the gold focus outline, the error. */
function Panel({
  id,
  label,
  required,
  error,
  className,
  tone = "dark",
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error: string | null;
  className?: string;
  tone?: PanelTone;
  children: React.ReactNode;
}) {
  const t = TONES[tone];
  return (
    /* The outer box is a column so that when two fields sit side by side and
       one of their questions runs to a second line, both panels still finish
       at the same height instead of one sitting proud of the other. */
    <div className={`flex flex-col ${className ?? ""}`}>
      <div
        className={`flex flex-1 flex-col gap-0.5 rounded-sm border px-[18px] pb-2.5 pt-3 transition-colors duration-200 ${t.panel} ${t.focus} ${
          error ? t.error : t.idle
        }`}
      >
        <label
          htmlFor={id}
          className={`font-text text-k-micro uppercase ${t.label}`}
        >
          {label}
          {required ? (
            <span aria-hidden="true" className={t.star}>
              {" "}
              *
            </span>
          ) : null}
        </label>
        {children}
      </div>

      {error ? (
        <p
          id={`${id}-error`}
          className={`pt-2 font-text text-k-micro uppercase ${t.errorText}`}
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Shared look for the part the visitor actually types into. */
const CONTROL =
  "w-full appearance-none border-0 bg-transparent p-0 font-text text-k-small caret-current outline-none focus-visible:outline-none";

export type PanelFieldProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "children"
> & {
  id: string;
  label: string;
  className?: string;
  tone?: PanelTone;
};

/** A single line answer: origin, destination, a date, an email address. */
export function PanelField({
  id,
  label,
  className,
  required,
  tone = "dark",
  onFocus,
  onBlur,
  onChange,
  onInvalid,
  ...rest
}: PanelFieldProps) {
  const { error, handlers } = useUnderlineField<HTMLInputElement>({
    onFocus,
    onBlur,
    onChange,
    onInvalid,
  });

  return (
    <Panel
      id={id}
      label={label}
      required={required}
      error={error}
      className={className}
      tone={tone}
    >
      <input
        id={id}
        required={required}
        {...rest}
        {...handlers}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${CONTROL} ${TONES[tone].control} h-6`}
      />
    </Panel>
  );
}

export type PanelSelectProps = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "className"
> & {
  id: string;
  label: string;
  className?: string;
  tone?: PanelTone;
};

/** A pick-one-from-a-list answer, with the arrow drawn on the right. */
export function PanelSelect({
  id,
  label,
  className,
  required,
  tone = "dark",
  children,
  onFocus,
  onBlur,
  onChange,
  onInvalid,
  ...rest
}: PanelSelectProps) {
  const { error, handlers } = useUnderlineField<HTMLSelectElement>({
    onFocus,
    onBlur,
    onChange,
    onInvalid,
  });

  return (
    <Panel
      id={id}
      label={label}
      required={required}
      error={error}
      className={className}
      tone={tone}
    >
      <div className="relative">
        <select
          id={id}
          required={required}
          {...rest}
          {...handlers}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${CONTROL} ${TONES[tone].control} h-6 pr-7`}
        >
          {children}
        </select>
        <svg
          aria-hidden="true"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2"
        >
          <path
            d="M1 1.5 6 6.5 11 1.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={TONES[tone].chevron}
          />
        </svg>
      </div>
    </Panel>
  );
}

export type PanelTextareaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "children"
> & {
  id: string;
  label: string;
  className?: string;
  tone?: PanelTone;
};

/** A longer answer, for anything that will not fit on one line. */
export function PanelTextarea({
  id,
  label,
  className,
  required,
  tone = "dark",
  onFocus,
  onBlur,
  onChange,
  onInvalid,
  ...rest
}: PanelTextareaProps) {
  const { error, handlers } = useUnderlineField<HTMLTextAreaElement>({
    onFocus,
    onBlur,
    onChange,
    onInvalid,
  });

  return (
    <Panel
      id={id}
      label={label}
      required={required}
      error={error}
      className={className}
      tone={tone}
    >
      <textarea
        id={id}
        required={required}
        {...rest}
        {...handlers}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${CONTROL} ${TONES[tone].control} resize-y leading-[22px]`}
      />
    </Panel>
  );
}
