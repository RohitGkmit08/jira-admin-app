import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';

type Props = {
  onDragStart?: (id: string) => void;
  onDragEnd: (event: DragEndEvent) => void;
  children: React.ReactNode;
};

export default function AppDndContext({
  onDragStart,
  onDragEnd,
  children,
}: Props) {
  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={(event) => {
        onDragStart?.(event.active.id as string);
      }}
      onDragEnd={onDragEnd}
    >
      {children}
    </DndContext>
  );
}
