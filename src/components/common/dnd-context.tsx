import {
  DndContext,
  DragOverlay,
  rectIntersection,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
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
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={(event) => onDragStart?.(event.active.id as string)}
      onDragEnd={onDragEnd}
    >
      {children}
      <DragOverlay dropAnimation={null}>{overlay}</DragOverlay>
    </DndContext>
  );
}
