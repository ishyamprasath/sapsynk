import { useCallback, useEffect, useRef, useState } from 'react';

export default function BeforeAfterSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPosition, setSliderPosition] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const annotationTranslateX = sliderPosition > 90 ? '-100%' : sliderPosition < 10 ? '0%' : '-50%';
  const showAutomationBanner = sliderPosition <= 50;

  const updateSliderPosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const percent = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.min(100, Math.max(0, percent));
    setSliderPosition(clamped);
  }, []);

  const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    updateSliderPosition(event.clientX);
  };

  const onTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    updateSliderPosition(event.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;
      updateSliderPosition(event.clientX);
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!isDragging) return;
      event.preventDefault();
      updateSliderPosition(event.touches[0].clientX);
    };

    const stopDragging = () => setIsDragging(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', stopDragging);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', stopDragging);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', stopDragging);
    };
  }, [isDragging, updateSliderPosition]);

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-[family-name:var(--font-mono)] tracking-[0.3em] uppercase text-[#F5F0E8]/30 mb-3">
            The Transformation
          </p>
          <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-heading)] font-bold text-[#F5F0E8]">
            Drag to see <span className="text-[#b49bff]">the difference</span>
          </h2>
          <p className="text-[#F5F0E8]/35 mt-3 text-sm tracking-widest font-[family-name:var(--font-mono)]">
            DRAG FROM RIGHT TO LEFT ←
          </p>
        </div>

        <div
          ref={containerRef}
          className="group relative w-full rounded-2xl overflow-hidden border border-white/10 select-none cursor-ew-resize touch-none"
          style={{ height: 'clamp(340px, 52vw, 500px)' }}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
        >
        <img
          src="/automated.jpg"
          alt="Manual workflow chaos"
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />

        <div
          className={`absolute inset-0 overflow-hidden ${isDragging ? '' : 'transition-all duration-200 ease-out'}`}
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img
            src="/Chaos.jpg"
            alt="Automated workflow"
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
        </div>

        <div
          className={`pointer-events-none absolute left-4 top-4 rounded-md bg-black/50 px-3 py-1.5 text-xs font-semibold tracking-wide text-white transition-opacity duration-300 md:text-sm ${showAutomationBanner ? 'opacity-0' : 'opacity-100'}`}
        >
          WITHOUT AUTOMATION
        </div>

        <div
          className={`pointer-events-none absolute right-4 top-4 rounded-md bg-black/50 px-3 py-1.5 text-xs font-semibold tracking-wide text-white transition-opacity duration-300 md:text-sm ${showAutomationBanner ? 'opacity-100' : 'opacity-0'}`}
        >
          SAPSYNK AUTOMATION
        </div>

        <div
          className={`pointer-events-none absolute top-0 z-20 h-full w-px bg-white/90 shadow-[0_0_10px_rgba(255,255,255,0.65)] ${isDragging ? '' : 'transition-all duration-200 ease-out'}`}
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        />

        <div
          className={`absolute top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/20 shadow-lg backdrop-blur-sm ${isDragging ? 'scale-95' : 'transition-all duration-150'} hover:scale-110 hover:shadow-xl`}
          style={{ left: `${sliderPosition}%`, transform: 'translate(-50%, -50%)' }}
        >
          <div className="h-4 w-1 rounded-full bg-white/85" />
        </div>

        <div
          className={`pointer-events-none absolute z-30 whitespace-nowrap rounded-md border border-white/35 bg-black/80 px-2.5 py-1 text-xs font-bold tracking-wider text-white shadow-[0_4px_14px_rgba(0,0,0,0.6)] backdrop-blur-md ${isDragging ? '' : 'transition-all duration-200 ease-out'}`}
          style={{ left: `${sliderPosition}%`, top: 'calc(50% - 58px)', transform: `translateX(${annotationTranslateX})` }}
        >
          DRAG LEFT ←
        </div>
      </div>
      </div>
    </section>
  );
}
