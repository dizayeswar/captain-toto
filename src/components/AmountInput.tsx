"use client";

import { useEffect, useState } from "react";
import {
  formatAmountFromNumber,
  formatAmountInput,
  parseAmountInput,
} from "@/lib/format";

type Props = {
  name?: string;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  className?: string;
  required?: boolean;
  /** Max decimal places (default 2). Use 0 for whole IQD-style amounts if desired. */
  decimals?: number;
  placeholder?: string;
};

/**
 * Amount field that shows thousands commas while typing (5,000 / 100,000)
 * and submits a plain number via hidden input when `name` is set.
 */
export default function AmountInput({
  name,
  value,
  defaultValue = 0,
  onChange,
  className = "",
  required,
  decimals = 2,
  placeholder,
}: Props) {
  const controlled = value !== undefined;
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState(() =>
    formatAmountFromNumber(controlled ? value! : defaultValue, decimals)
  );

  useEffect(() => {
    if (controlled && !focused) {
      setText(formatAmountFromNumber(value!, decimals));
    }
  }, [controlled, value, focused, decimals]);

  const numeric = parseAmountInput(text);

  return (
    <>
      {name ? (
        <input type="hidden" name={name} value={String(numeric)} />
      ) : null}
      <input
        type="text"
        inputMode="decimal"
        autoComplete="off"
        required={required}
        placeholder={placeholder}
        className={className}
        value={text}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          setText(formatAmountFromNumber(numeric, decimals));
          onChange?.(numeric);
        }}
        onChange={(e) => {
          const next = formatAmountInput(e.target.value, decimals);
          setText(next);
          onChange?.(parseAmountInput(next));
        }}
      />
    </>
  );
}
