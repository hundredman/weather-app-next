import { FiStar } from 'react-icons/fi';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onClick: () => void;
}

export default function FavoriteButton({ isFavorite, onClick }: FavoriteButtonProps) {
  return (
    <button
      onClick={onClick}
      // Thanks for including the title here!
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
    >
      <FiStar size={24} className={`transition-all ${isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
    </button>
  );
}