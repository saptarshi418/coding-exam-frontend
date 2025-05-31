import { useParams } from 'react-router-dom'

export default function ContestDetails() {
  const { id } = useParams()

  return (
    <div className="p-4 text-xl">
      Contest Details Page - ID: <span className="font-bold">{id}</span>
    </div>
  )
}
