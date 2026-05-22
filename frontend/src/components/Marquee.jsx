import React from "react";

export default function Marquee({ items = [] }) {
  const doubled = [...items, ...items];
  return (
    <div className="marquee" data-testid="marquee">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span className="marquee-item" key={i}>{item}</span>
        ))}
      </div>
    </div>
  );
}
