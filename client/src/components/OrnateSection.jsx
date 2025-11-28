import { cn } from "@/lib/utils";

export function OrnateDivider({ className }) {
  return (
    <div className={cn("flex items-center justify-center gap-4 py-8", className)}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-primary/50" />
      <svg 
        viewBox="0 0 60 30" 
        className="w-16 h-8 text-primary/50"
        fill="currentColor"
      >
        <path d="M30,0 C35,10 45,15 60,15 C45,15 35,20 30,30 C25,20 15,15 0,15 C15,15 25,10 30,0" />
      </svg>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-primary/30 to-primary/50" />
    </div>
  );
}

export function OrnateCorner({ position = "top-left", className }) {
  const rotations = {
    "top-left": "rotate-0",
    "top-right": "rotate-90",
    "bottom-right": "rotate-180",
    "bottom-left": "-rotate-90",
  };

  const positions = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0",
    "bottom-right": "bottom-0 right-0",
    "bottom-left": "bottom-0 left-0",
  };

  return (
    <div className={cn("absolute w-20 h-20 pointer-events-none", positions[position], className)}>
      <svg 
        viewBox="0 0 100 100" 
        className={cn("w-full h-full text-primary/20", rotations[position])}
        fill="currentColor"
      >
        <path d="M0,0 L30,0 Q20,10 20,30 L20,50 Q15,40 0,40 L0,0" />
        <path d="M0,10 Q10,15 15,25 Q20,15 30,10" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
        <circle cx="25" cy="25" r="3" opacity="0.5"/>
      </svg>
    </div>
  );
}

export function OrnateFrame({ children, className }) {
  return (
    <div className={cn("relative", className)}>
      <OrnateCorner position="top-left" />
      <OrnateCorner position="top-right" />
      <OrnateCorner position="bottom-left" />
      <OrnateCorner position="bottom-right" />
      {children}
    </div>
  );
}
