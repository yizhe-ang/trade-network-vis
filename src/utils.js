import { html } from "htl";
import { rgb } from "d3";

export function textcolor(content, style = {}) {
  function yiq(color) {
    const { r, g, b } = rgb(color);
    return (r * 299 + g * 587 + b * 114) / 1000 / 255; // returns values between 0 and 1
  }
  const {
    background,
    color = yiq(background) >= 0.6 ? "#111" : "white",
    padding = "0 5px",
    borderRadius = "4px",
    fontWeight = 800,
    ...rest
  } = typeof style === "string" ? { background: style } : style;
  return html`<span
    style=${{
      background,
      color,
      padding,
      borderRadius,
      fontWeight,
      ...rest,
    }}
    >${content}</span
  >`;
}
