import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const HarmonicNumberInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const handleStep = (direction: 'up' | 'down') => {
    if (inputRef.current) {
      if (direction === 'up') inputRef.current.stepUp();
      else inputRef.current.stepDown();

      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
      nativeInputValueSetter?.call(inputRef.current, inputRef.current.value);
      inputRef.current.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  return (
    <div className={cn("relative rounded-lg border border-border/40 bg-background text-foreground focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary/60 overflow-hidden", className)}>
      <input
        type="number"
        ref={(node) => {
          inputRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className="w-full h-full bg-transparent px-3 py-2.5 text-sm focus:outline-none pr-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        {...props}
      />
      <div className="absolute right-0 top-0 bottom-0 w-8 flex flex-col border-l border-border/40 bg-muted/20">
        <button
          type="button"
          tabIndex={-1}
          onClick={() => handleStep('up')}
          className="flex-1 flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
        <div className="h-[1px] bg-border/40 w-full" />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => handleStep('down')}
          className="flex-1 flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
});

HarmonicNumberInput.displayName = 'HarmonicNumberInput';

export { HarmonicNumberInput };
