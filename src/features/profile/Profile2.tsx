import { motion } from "framer-motion"

interface ProfileData2 {
  name: string
  title: string
  description: string
  image?: string
}

interface ProfileProps {
  data: ProfileData2
}

const Profile2 = ({ data }: ProfileProps) => {
  return (
    <div className="flex flex-col items-center gap-6 py-8">
      {/* アバター */}
      <motion.div
        className="relative"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
      >
        <div
          className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden"
          style={{
            border: '3px solid rgba(37, 99, 235, 0.25)',
            boxShadow: '0 8px 32px rgba(37, 99, 235, 0.15), 0 0 0 6px rgba(37, 99, 235, 0.06)',
          }}
        >
          <img
            src={data.image || "/sns_icon_round.png"}
            alt={data.name}
            className="w-full h-full object-cover"
          />
        </div>
        {/* オンラインバッジ */}
        <span
          className="absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-white"
          style={{ background: '#22c55e' }}
        />
      </motion.div>

      {/* 名前 */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h1
          className="text-5xl sm:text-6xl font-bold mb-2 tracking-tight"
          style={{ color: '#1e293b', letterSpacing: '-0.03em' }}
        >
          {data.name}
        </h1>
        <p
          className="text-base sm:text-lg font-medium tracking-widest uppercase mb-5"
          style={{ color: '#2563eb' }}
        >
          {data.title}
        </p>
        <p
          className="text-base sm:text-lg max-w-2xl leading-relaxed text-center"
          style={{ color: '#64748b' }}
        >
          {data.description}
        </p>
      </motion.div>

      {/* ソーシャルリンク（任意 - デコレーション）*/}
      <motion.div
        className="flex gap-3 mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <span
          className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide"
          style={{
            background: 'rgba(37, 99, 235, 0.08)',
            color: '#2563eb',
            border: '1px solid rgba(37, 99, 235, 0.2)',
          }}
        >
          Open to work
        </span>
      </motion.div>
    </div>
  )
}

export default Profile2
