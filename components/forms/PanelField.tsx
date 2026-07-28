"use client";

import { useUnderlineField } from "./Field";

/**
 * PANELLED FORM FIELDS, FOR DARK PANELS
 *
 * These are the boxes used on the quote page. Each one is a soft dark panel
 * with the question printed small along the top and the visitor's answer
 * underneath it, which is the shape drawn on the Paper artboard
 * "Quote — desktop 1440".
 *
 * The question stays printed inside the box even after somebody has typed, on
 * purpose. Forms that use the question as grey placeholder text lose it the
 * moment you start writing, and then nobody can check what they were asked.
 *
 * The older underline fields in Field.tsx are still used by the driver and
 * contact forms. Both sets share the same checking behaviour underneath, so a
 * field turns and explains itself the same way whichever look it wears.
 *
 * TO CHANGE THE COLOURS: everything here is built from the site's own colour
 * names. The panel is "blueprint", the question is "on dark soft", the answer
 * is "on dark", and a field being typed into is outlined in gold.
 */

/** Shared shell: the panel, the question, the gold focus outline, the error. */
function Panel({
  id,
  label,
  required,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error: string | null;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    /* The outer box is a column so that when two fields sit side by side and
       one of their questions runs to a second line, both panels still finish
       at the same height instead of one sitting proud of the other. */
    <div className={`flex flex-col ${className ?? ""}`}>
      <div
        className={`flex flex-1 flex-col gap-0.5 rounded-sm border bg-k-blueprint px-[18px] pb-2.5 pt-3 transition-colors duration-200 focus-within:border-k-gold-lit ${
          error ? "border-[#C98A7A]" : "border-transparent"
        }`}
      >
        <label
          htmlFor={id}
          className="font-text text-k-micro uppercase text-k-on-dark-soft"
        >
          {label}
          {required ? (
            <span aria-hidden="true" className="text-k-gold-lit">
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
          className="pt-2 font-text text-k-micro uppercase text-[#C98A7A]"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Shared look for the part the visitor actually types into. */
const CONTROL =
  "w-full appearance-none border-0 bg-transparent p-0 font-text text-k-small text-k-on-dark caret-current outline-none placeholder:text-k-on-dark-faint focus-visible:outline-none";

export type PanelFieldProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "children"
> & {
  id: string;
  label: string;
  className?: string;
};

/** A single line answer: origin, destination, a date, an email address. */
export function PanelField({
  id,
  label,
  className,
  required,
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
    >
      <input
        id={id}
        required={required}
        {...rest}
        {...handlers}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${CONTROL} h-6`}
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
};

/** A pick-one-from-a-list answer, with the arrow drawn on the right. */
export function PanelSelect({
  id,
  label,
  className,
  required,
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
    >
      <div className="relative">
        <select
          id={id}
          required={required}
          {...rest}
          {...handlers}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${CONTROL} h-6 pr-7`}
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
            className="text-k-on-dark-soft"
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
};

/** A longer answer, for anything that will not fit on one line. */
export function PanelTextarea({
  id,
  label,
  className,
  required,
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
    >
      <textarea
        id={id}
        required={required}
        {...rest}
        {...handlers}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${CONTROL} resize-y leading-[22px]`}
      />
    </Panel>
  );
}
