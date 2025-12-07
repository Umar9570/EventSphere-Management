import './GradientText.css';

export default function GradientText({
  children,
  className = '',
  colors = ['#8b5cf6', '#ec4899', '#8b5cf6', '#ec4899', '#8b5cf6'],
  animationSpeed = 8,
  showBorder = false,
  style = {}
}) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(', ')})`,
    animationDuration: `${animationSpeed}s`
  };

  return (
    <div className={`animated-gradient-text ${className}`} style={style}>
      {showBorder && <div className="gradient-overlay" style={gradientStyle}></div>}
      <div className="text-content" style={gradientStyle}>
        {children}
      </div>
    </div>
  );
}