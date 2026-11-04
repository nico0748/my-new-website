import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

interface Skill {
  name: string;
  level: number;
}

interface SkillRadarChartProps {
  category: string;
  skills: Skill[];
  /** チャートとバーの色（CSS 変数）。カテゴリごとに塗り分ける。 */
  color?: string;
}

/** カテゴリごとのスキルレーダーチャート（ボックス）。Calm Dark に合わせて線と面は控えめに。 */
const SkillRadarChart = ({ category, skills, color = "var(--accent-2)" }: SkillRadarChartProps) => {
  const chartData = skills.map((s) => ({ subject: s.name, value: s.level, fullMark: 5 }));

  return (
    <div className="rounded-lg p-5 border border-white/[0.08]" style={{ background: "var(--card-bg)" }}>
      <h3 className="text-[17px] font-medium" style={{ color: "var(--text-primary)" }}>
        {category}
      </h3>

      <div className="mt-2 -mx-2">
        <ResponsiveContainer width="100%" height={240}>
          <RadarChart data={chartData} outerRadius="68%">
            <PolarGrid stroke="rgba(255,255,255,0.08)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--text-secondary)", fontSize: 12 }} />
            <PolarRadiusAxis angle={90} domain={[0, 5]} tick={false} axisLine={false} />
            <Radar
              name={category}
              dataKey="value"
              stroke={color}
              fill={color}
              fillOpacity={0.14}
              strokeWidth={1.5}
              isAnimationActive={false}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <ul className="mt-3 space-y-2">
        {skills.map((s) => (
          <li key={s.name} className="flex items-center gap-3 text-[14px]">
            <span className="w-28 shrink-0 truncate" style={{ color: "var(--text-body)" }}>
              {s.name}
            </span>
            <span className="flex flex-1 gap-1" aria-hidden>
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className="h-[3px] flex-1 rounded-full"
                  style={{ background: i < s.level ? color : "var(--skill-bar-empty)" }}
                />
              ))}
            </span>
            <span className="w-7 text-right tabular-nums text-[13px]" style={{ color: "var(--text-muted)" }}>
              {s.level}/5
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SkillRadarChart;
