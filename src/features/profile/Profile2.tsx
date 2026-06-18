import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";

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
        {/* アバター + ターミナル風バッジ */}
        <motion.div
          className="relative mx-auto md:mx-0"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="w-36 h-36 sm:w-44 sm:h-44 rounded-lg overflow-hidden"
            style={{
              border: "1px solid var(--accent-border)",
              boxShadow:
                "0 0 0 5px var(--bg), 0 0 0 6px var(--accent), 0 8px 24px var(--card-shadow), 0 0 30px var(--accent-shadow)",
            }}
          >
            <img
              src={data.image || "/sns_icon_round.png"}
              alt={data.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div
            className="absolute -right-2 -bottom-2 px-2 py-1 text-xs font-semibold"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--accent-border)",
              color: "var(--accent)",
              borderRadius: "4px",
              fontFamily: "'JetBrains Mono', monospace",
              boxShadow: "0 2px 8px var(--card-shadow)",
            }}
          >
            {"{ dev }"}
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
                  fontFamily: "'JetBrains Mono', 'Noto Sans JP', monospace",
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

          {/* 小見出しラベル — ターミナルコメント風 */}
          <div className="flex items-center gap-3 mb-5">
            <span
              className="h-px w-10"
              style={{ background: "var(--accent)" }}
            />
            <span
              className="text-xs"
              style={{
                color: "var(--accent)",
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.2em",
              }}
            >
              // about-me
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
                fontFamily: "'Noto Sans JP', sans-serif",
                lineHeight: "2.05",
                letterSpacing: "0.02em",
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
                        fontFamily: "'JetBrains Mono', 'Noto Sans JP', monospace",
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
