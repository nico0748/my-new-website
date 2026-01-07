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
    <div className="flex flex-col items-center gap-6">
      <motion.div
        className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-blue-900/50 shadow-lg"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
      <img src={data.image || "/placeholder-user.jpg"} alt={data.name} className="absolute inset-0 w-full h-full object-cover" />
      </motion.div>
        <h1 className="text-5xl sm:text-6xl font-bold text-white mb-2 tracking-tight">{data.name}</h1>
        <p className="text-lg sm:text-xl text-blue-400 mb-4 font-light tracking-widest uppercase">{data.title}</p>
        <p className="text-base sm:text-lg text-gray-400 max-w-2xl leading-relaxed text-center">{data.description}</p>
    </div>
  )
}

export default Profile2
