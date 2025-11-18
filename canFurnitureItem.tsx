// Exemplo simplificado
function FurnitureItem({ item, isSelected, onSelect }) {
  return (
    <div
      onMouseDown={(e) => {
        e.stopPropagation();
        onSelect(item.id);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(item.id);
      }}
      style={{
        position: "absolute",
        left: item.x,
        top: item.y,
        transform: `rotate(${item.rotation}deg)`,
        border: isSelected ? "2px solid #3b82f6" : "none",
        cursor: "pointer",
      }}
    >
      <img
        src={item.image}
        alt={item.name}
        draggable={false}
        width={item.width}
        height={item.height}
      />
    </div>
  );
}
