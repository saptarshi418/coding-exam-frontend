import { useParams } from 'react-router-dom'

export default function CodeRoom() {
  const { id } = useParams()

  return (
    <div className="p-4 text-xl">
      Code Room for Contest ID: <span className="font-bold">{id}</span>
    </div>
  )
}
