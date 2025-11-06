import React from "react";

export default function TextInput({ className = "", ...props }) {
  const cls = `w-full rounded-xl px-3 py-2 text-sm bg-white text-surface-900 placeholder:text-surface-400 border border-surface-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none ${className}`;
  return <input className={cls} {...props} />;
}


