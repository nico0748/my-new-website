import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import HankoSeal from "../../components/ui/HankoSeal";
import FoxPeek from "../../components/ui/FoxPeek";

interface ProfileData2 {
  name: string;
  title: string;
  description: string;
  image?: string;
  blogUrl?: string;
  githubUrl?: string;
  qiitaUrl?: string;
}

interface ProfileProps {
  data: ProfileData2;
}

const REAL_NAME = "細澤 悠真";

const Profile2 = ({ data }: ProfileProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isReal = searchParams.get("id") === "real";
  const displayName = isReal ? REAL_NAME : data.name || "nico";

  const handleToggleName = () => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (isReal) {
          next.delete("id");
        } else {
          next.set("id", "real");
        }
        return next;
      },
      { replace: true }
    );
  };

  const links: { label: string; href?: string }[] = [
    { label: "Blog", href: data.blogUrl },
    { label: "GitHub", href: data.githubUrl },
    { label: "Qiita", href: data.qiitaUrl },
  ].filter((l) => !!l.href);

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4">
      <div className="grid md:grid-cols-[auto_1fr] gap-10 md:gap-14 items-start">
        {/* 円窓のアバター + 朱印（落款） */}
        <motion.div
          className="relative mx-auto md:mx-0"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <FoxPeek side="left" size={110} image="/japanese-fox4.png" peekRatio={0.5}>
            <div
              className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden"
              style={{
                border: "1px solid var(--text-primary)",
                boxShadow:
                  "0 0 0 5px var(--bg), 0 0 0 6px var(--accent), 0 8px 24px var(--card-shadow)",
              }}
            >
              <img
                src={data.image || "/sns_icon_round.png"}
                alt={data.name}
                className="w-full h-full object-cover"
              />
            </div>
          </FoxPeek>
          <div
            className="absolute -right-2 -bottom-2"
            style={{ transform: "rotate(-8deg)" }}
          >
            <HankoSeal text="銘" size={42} rotation={0} />
          </div>
        </motion.div>

        {/* 本文 */}
        <motion.div
          className="min-w-0"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {/* 名前 — クリックで nico ⇄ 細澤 悠真 を切り替え（URL ?id=...・隠し機能） */}
          <div className="mb-7">
            <button
              type="button"
              onClick={handleToggleName}
              aria-label={`名前を${isReal ? "nico" : REAL_NAME}に切り替える`}
              className="group inline-block cursor-pointer text-left"
            >
              <span
                className="relative inline-block text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
                style={{
                  color: "var(--text-primary)",
                  fontFamily: "'Hina Mincho', 'Shippori Mincho B1', serif",
                  letterSpacing: "0.06em",
                  minWidth: "5ch",
                }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={displayName}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-block"
                  >
                    {displayName}
                  </motion.span>
                </AnimatePresence>
                {/* 名の下の朱の細線 — ホバー時のみ */}
                <span
                  aria-hidden
                  className="absolute left-0 right-0 -bottom-1 h-px scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"
                  style={{ background: "var(--seal-red)" }}
                />
              </span>
            </button>
          </div>

          {/* 小見出しラベル — 朱の細線 + 「自己紹介」 */}
          <div className="flex items-center gap-3 mb-5">
            <span
              className="h-px w-10"
              style={{ background: "var(--seal-red)" }}
            />
            <span
              className="text-xs"
              style={{
                color: "var(--seal-red)",
                fontFamily: "'Hina Mincho', 'Shippori Mincho B1', serif",
                letterSpacing: "0.5em",
                paddingRight: "0.5em",
              }}
            >
              自 己 紹 介
            </span>
          </div>

          {/* 本文 — 短冊風の朱の縦罫線で受ける */}
          <div
            className="pl-6"
            style={{
              borderLeft: "1.5px solid var(--accent)",
            }}
          >
            <p
              className="text-sm sm:text-base whitespace-pre-line"
              style={{
                color: "var(--text-body)",
                fontFamily: "'Shippori Mincho B1', 'Noto Serif JP', serif",
                lineHeight: "2.05",
                letterSpacing: "0.04em",
              }}
            >
              {data.description}
            </p>
          </div>

          {/* リンク群 */}
          {links.length > 0 && (
            <div className="mt-9">
              <div className="flex items-center gap-2 mb-5">
                <span
                  className="h-px w-12"
                  style={{ background: "var(--text-muted)" }}
                />
                <span
                  className="w-1 h-1 rounded-full"
                  style={{ background: "var(--seal-red)" }}
                />
                <span
                  className="h-px flex-1"
                  style={{ background: "var(--border-color)" }}
                />
              </div>

              <ul className="flex flex-wrap gap-2.5 sm:gap-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 px-4 py-2 transition-all duration-200 hover:-translate-y-[1px]"
                      style={{
                        background: "var(--card-bg-solid)",
                        border: "1px solid var(--card-border)",
                        borderRadius: 2,
                        color: "var(--text-primary)",
                        fontFamily: "'Hina Mincho', 'Shippori Mincho B1', serif",
                        letterSpacing: "0.12em",
                        fontSize: "13px",
                        boxShadow: "0 1px 3px var(--card-shadow)",
                      }}
                    >
                      <span
                        className="w-1 h-1 rounded-full"
                        style={{ background: "var(--seal-red)" }}
                      />
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile2;
