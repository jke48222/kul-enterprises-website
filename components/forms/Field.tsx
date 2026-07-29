"use client";

import { useRef, useState } from "react";

/**
 * THE SHARED FIELD BEHAVIOUR
 *
 * One hook, used by every form control on the site. It is the reason a field
 * on the quote page and a field on the carrier packet page complain in the
 * same way at the same moment, even though they look nothing alike.
 *
 * WHAT IT DOES. It holds whether a control is focused and what is wrong with
 * it, and it only starts reporting a problem once somebody has left the field
 * or tried to submit. A form that turns red while you are still typing your
 * email address is worse than one that waits.
 *
 * The browser's own validity message is used rather than a hand-written one,
 * so the wording matches what the visitor's own browser and language would
 * say anywhere else.
 *
 * This file used to carry the visible underline controls as well. They were
 * the last of the old design system and nothing renders them any more; the
 * panelled fields in PanelField.tsx replaced them everywhere.
 */
type ValidityElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

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
