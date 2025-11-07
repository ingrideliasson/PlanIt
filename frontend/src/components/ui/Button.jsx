import React from "react";

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  as: Component = "button",
  ...props
}) {
  const base = "inline-flex items-center justify-center font-montserrat rounded-xl transition-colors focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed";
  const sizes = {
    sm: "text-sm px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-5 py-2.5",
  };
  const variants = {
    primary: "bg-transparent text-amber-950 hover:underline",
    outline: "border border-surface-300 text-surface-800 hover:bg-surface-50",
    subtle: "bg-gray-200 text-surface-800 hover:bg-gray-300",
    danger: "bg-rose-700 text-white hover:bg-rose-800",
  };
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`;
  return <Component className={cls} {...props} />;
}


