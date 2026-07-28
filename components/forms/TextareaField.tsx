"use client";

import {
  FIELD_GROUND,
  FieldChrome,
  useUnderlineField,
  type FieldGround,
} from "./Field";

/**
 * §3.20 underline field system, multiline primitive. Same label/underline
 * choreography as Field; height comes from `rows` instead of the 64px row.
 */

export type TextareaFieldProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "children"
> & {
  id: string;
  label: string;
  ground?: FieldGround;
  optional?: boolean;
  /** Applied to the wrapper (grid placement); control styling is owned by the system. */
  className?: string;
};

export function TextareaField({
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
}: TextareaFieldProps) {
  const { focused, error, handlers } = useUnderlineField<HTMLTextAreaElement>({
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
      {/* No `focus:outline-none`, it out-specified the global :focus-visible
          ring and left keyboard focus unpainted. g.ring restores it. */}
      <textarea
        id={id}
        {...rest}
        {...handlers}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`w-full resize-y appearance-none rounded-none border-0 bg-transparent p-0 py-[19px] font-mont text-[17px] leading-normal caret-current outline-none ${g.ring} ${g.text} ${g.placeholder}`}
      />
    </FieldChrome>
  );
}
