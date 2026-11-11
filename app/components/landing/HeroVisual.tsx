import IconCloud from "../../islands/IconCloud";

interface HeroVisualProps {
  techIcons: string[];
  gradientIdPrefix: string;
  /**
   * 球を描く正方形の一辺を決める幅のクラス。本はその下に続くので、
   * 全体の高さは一辺のおよそ 1.1〜1.15 倍になる。
   */
  className?: string;
  /** 本の幅。球の正方形に対する比率で指定する */
  bookWidthClass?: string;
  /** 背景の明暗。dark では球の後ろに光彩を置き、本の影を濃くする */
  tone?: "light" | "dark";
}

export function HeroVisual({
  techIcons,
  gradientIdPrefix,
  className = "w-full",
  bookWidthClass = "w-[72%]",
  tone = "light",
}: HeroVisualProps) {
  const coverGradId = `${gradientIdPrefix}-cover-grad`;
  const pageGradLeftId = `${gradientIdPrefix}-page-grad-left`;
  const pageGradRightId = `${gradientIdPrefix}-page-grad-right`;
  const isDark = tone === "dark";

  return (
    <div class={`relative mx-auto ${className}`}>
      {isDark && (
        <div class="absolute top-[6%] left-[6%] w-[88%] aspect-square bg-zinc-800/20 rounded-full blur-3xl" />
      )}

      <div class="relative z-10">
        <IconCloud images={techIcons} />
      </div>

      {/*
        球の下端（アイコン込みで正方形の約 91%）のすぐ下に本のページが来るよう、
        正方形の下の余白ぶんだけ引き上げる。% のマージンは幅基準なので球と一緒に伸縮する。
      */}
      <div class={`relative z-0 mx-auto -mt-[12%] opacity-90 ${bookWidthClass}`}>
        <svg
          viewBox="0 0 440 140"
          xmlns="http://www.w3.org/2000/svg"
          class="w-full"
          style={{ filter: `drop-shadow(0 20px 40px rgba(0,0,0,${isDark ? 0.6 : 0.15}))` }}
        >
          <title>開いた本のイラスト</title>
          <defs>
            <linearGradient id={coverGradId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#18181b" />
              <stop offset="50%" stop-color="#27272a" />
              <stop offset="100%" stop-color="#18181b" />
            </linearGradient>

            <linearGradient id={pageGradLeftId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#e4e4e7" />
              <stop offset="90%" stop-color="#a1a1aa" />
              <stop offset="100%" stop-color="#71717a" />
            </linearGradient>

            <linearGradient id={pageGradRightId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#71717a" />
              <stop offset="10%" stop-color="#a1a1aa" />
              <stop offset="100%" stop-color="#e4e4e7" />
            </linearGradient>
          </defs>

          <path
            d="M35 55 Q35 45, 75 40 Q165 30, 220 50 L220 125 Q165 105, 75 115 Q35 120, 35 110 Z"
            fill={`url(#${coverGradId})`}
          />
          <path
            d="M220 50 Q275 30, 365 40 Q405 45, 405 55 L405 115 Q405 125, 365 120 Q275 105, 220 125 Z"
            fill={`url(#${coverGradId})`}
          />

          <path
            d="M40 50 Q40 40, 80 37 Q170 27, 220 47 L220 118 Q170 100, 80 110 Q40 113, 40 103 Z"
            fill="#52525b"
          />
          <path
            d="M220 47 Q270 27, 360 37 Q400 40, 400 50 L400 103 Q400 113, 360 110 Q270 100, 220 118 Z"
            fill="#52525b"
          />

          <path
            d="M40 48 Q40 38, 80 35 Q170 25, 220 45 L220 115 Q170 98, 80 108 Q40 111, 40 101 Z"
            fill={`url(#${pageGradLeftId})`}
          />
          <path
            d="M220 45 Q270 25, 360 35 Q400 38, 400 48 L400 101 Q400 111, 360 108 Q270 98, 220 115 Z"
            fill={`url(#${pageGradRightId})`}
          />

          <g opacity="0.1">
            <path d="M55 50 Q130 40, 200 55" stroke="#000" stroke-width="1" fill="none" />
            <path d="M55 65 Q130 55, 200 70" stroke="#000" stroke-width="1" fill="none" />
            <path d="M55 80 Q130 70, 200 85" stroke="#000" stroke-width="1" fill="none" />

            <path d="M240 55 Q310 40, 385 50" stroke="#000" stroke-width="1" fill="none" />
            <path d="M240 70 Q310 55, 385 65" stroke="#000" stroke-width="1" fill="none" />
            <path d="M240 85 Q310 70, 385 80" stroke="#000" stroke-width="1" fill="none" />
          </g>
        </svg>
      </div>
    </div>
  );
}
