// src/components/Card/CardSection.jsx
import React from "react";
import FunctionCard from "./FunctionCard";
import clsx from "clsx";

const CardSection = ({ title, cards, onCardClick, columns = 2 }) => {
  // Tạo class grid dựa trên số cột (1, 2 hoặc 3)
  const gridClass = clsx("grid gap-4", {
    "grid-cols-1": columns === 1,
    "grid-cols-2": columns === 2,
    "grid-cols-3": columns === 3,
  });

  return (
    <section className="mb-[31px]">
      <h2 className="font-extrabold text-black text-xl mb-6">{title}</h2>
      <div className={gridClass}>
        {cards.map((card, index) => (
          <FunctionCard
            key={index}
            icon={card.icon}
            title={card.title}
            href={card.href}
            onClick={onCardClick ? () => onCardClick(card.title) : undefined}
          />
        ))}
      </div>
    </section>
  );
};

export default CardSection;
