"use client";

import {
  FIELD_GROUND,
  FieldChrome,
  MICRO_BEZIER,
  useUnderlineField,
  type FieldGround,
} from "./Field";

/**
 * §3.20 underline field system — native `<select>` styled bare (no deps).
 * Same underline choreography as Field; the chevron rotates 180° while the
 * select is open (focus is the closest reliable native proxy).
 */

export type SelectFieldProps = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "children"
> & {
  id: string;
  label: string;
  ground?: FieldGround;
  optional?: boolean;
  /** Applied to the wrapper (grid placement); control styling is owned by the system. */
  className?: string;
  /** `<option>` elements. */
  children: React.ReactNode;
};

export function SelectField({
  id,
  label,
  ground = "paper",
  optional,
  className,
  children,
  onFocus,
  onBlur,
  onChange,
  onInvalid,
  "aria-describedby": ariaDescribedBy,
  ...rest
}: SelectFieldProps) {
  const { focused, error, handlers } = useUnderlineField<HTMLSelectElement>({
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
      {/* No `focus:outline-none` — it out-specified the global :focus-visible
          ring and left keyboard focus unpainted. g.ring restores it. */}
      <select
        id={id}
        {...rest}
        {...handlers}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`h-16 w-full appearance-none rounded-none border-0 bg-transparent p-0 pr-8 font-mont text-[17px] outline-none ${g.ring} ${g.text}`}
      >
        {children}
      </select>
      <span
        aria-hidden
        className={`pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 transition-transform duration-200 motion-reduce:transition-none ${
          error ? g.errorText : g.text
        } ${focused ? "rotate-180" : ""}`}
        style={{ transitionTimingFunction: MICRO_BEZIER }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 4.25 6 8.25l4-4" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </span>
    </FieldChrome>
  );
}
