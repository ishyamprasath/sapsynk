import { memo } from 'react';

interface ServicePanelProps {
  title: string;
  tagline: string;
  description: string;
  demoComponent?: React.ReactNode;
  stat: string;
  color: string;
  icon: React.ReactNode;
  features: string[];
  metric: { label: string; value: string };
  onOpen?: () => void;
}

/*
 * Performance-optimized ServicePanel.
 * - Zero motion.div — all animations are pure CSS transitions (GPU-accelerated)
 * - No useState / useRef / onMouseMove — zero per-card React state
 * - memo() prevents re-renders from parent carousel rotation
 */
const ServicePanel = memo(function ServicePanel({ title, tagline, description, stat, color, icon, features, metric }: ServicePanelProps) {
  return (
    <div
      className="service-card group"
      style={{
        '--accent': color,
        '--accent-12': `${color}1e`,
        '--accent-20': `${color}33`,
        '--accent-30': `${color}4d`,
        '--accent-50': `${color}80`,
      } as React.CSSProperties}
    >
      {/* Outer glow — CSS only */}
      <div className="service-card__glow" />

      <div className="service-card__shell">

        {/* Two-tone diagonal split — static SVG */}
        <svg className="service-card__bg" viewBox="0 0 340 410" preserveAspectRatio="none">
          <polygon points="0,0 340,0 340,200 0,260" fill="#0c0a14" />
          <polygon points="0,260 340,200 340,410 0,410" fill="#0e0b18" />
          <line x1="0" y1="260" x2="340" y2="200" stroke={color} strokeWidth="0.5" strokeOpacity="0.2" />
        </svg>

        {/* Left accent bar */}
        <div className="service-card__accent-bar" />

        {/* Top shimmer */}
        <div className="service-card__shimmer" />

        {/* Content */}
        <div className="service-card__content">

          {/* Top row */}
          <div className="service-card__top">
            <div className="service-card__icon">{icon}</div>
            <div className="service-card__stat">{stat}</div>
          </div>

          {/* Tagline */}
          <p className="service-card__tagline">{tagline}</p>

          {/* Title */}
          <h3 className="service-card__title">{title}</h3>

          {/* Description */}
          <p className="service-card__desc">{description}</p>

          {/* Separator */}
          <div className="service-card__sep" />

          {/* Feature pills */}
          <div className="service-card__features">
            {features.map((f, i) => (
              <span key={i} className="service-card__pill">{f}</span>
            ))}
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Bottom metric */}
          <div className="service-card__metric">
            <div>
              <div className="service-card__metric-label">{metric.label}</div>
              <div className="service-card__metric-value">{metric.value}</div>
            </div>
            <span className="service-card__cta">Learn more →</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ServicePanel;
