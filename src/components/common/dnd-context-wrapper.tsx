import {
  DndContext,
  DragOverlay,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  type DragEndEvent,
} from '@dnd-kit/core';

type Props = {
  onDragStart?: (id: string) => void;
  onDragEnd: (event: DragEndEvent) => void;
  children: React.ReactNode;
  overlay?: React.ReactNode;
};

export default function DndContextWrapper({
  onDragStart,
  onDragEnd,
  children,
  overlay,
}: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={(event) => onDragStart?.(event.active.id as string)}
      onDragEnd={onDragEnd}
    >
      {children}
      <DragOverlay dropAnimation={null}>{overlay}</DragOverlay>
    </DndContext>
  );
}
