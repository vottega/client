import { useParams } from "react-router-dom";

export default function VotePage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">투표</h1>
      <p>투표 ID: {id}</p>
      {/* TODO: 투표 기능 구현 */}
    </div>
  );
}
