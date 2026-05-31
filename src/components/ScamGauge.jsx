import { motion } from 'framer-motion';

export default function ScamGauge({ score = 0, size = 120 }) {
  const radius = (size - 16) / 2;
  const circumference = Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;
  
  const getColor = () => {
    if (score <= 30) return '#2D6A4F';
    if (score <= 60) return '#D97706';
    return '#DC2626';
  };

  const getLabel = () => {
    if (score <= 30) return 'LOW RISK';
    if (score <= 60) return 'MODERATE';
    return 'HIGH RISK';
  };

  return (
    <div className="relative flex flex-col items-center" style={{ width: size, height: size * 0.7 }}>
      <svg width={size} height={size * 0.6} viewBox={`0 0 ${size} ${size * 0.6}`}>
        {/* Background arc */}
        <path
          d={`M 8 ${size * 0.55} A ${radius} ${radius} 0 0 1 ${size - 8} ${size * 0.55}`}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Score arc */}
        <motion.path
          d={`M 8 ${size * 0.55} A ${radius} ${radius} 0 0 1 ${size - 8} ${size * 0.55}`}
          fill="none"
          stroke={getColor()}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute bottom-0 text-center">
        <motion.span
          className="text-2xl font-extrabold"
          style={{ color: getColor() }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {score}%
        </motion.span>
        <p className="text-[10px] font-bold tracking-wider" style={{ color: getColor() }}>
          {getLabel()}
        </p>
      </div>
    </div>
  );
}