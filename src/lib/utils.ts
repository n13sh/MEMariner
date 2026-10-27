type ClassValue = string | number | false | null | undefined | ClassValue[];

/** Joins class names, skipping falsy values (shadcn-style `cn` without extra dependencies). */
export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  const push = (v: ClassValue) => {
    if (!v) return;
    if (Array.isArray(v)) v.forEach(push);
    else out.push(String(v));
  };
  inputs.forEach(push);
  return out.join(' ');
}
