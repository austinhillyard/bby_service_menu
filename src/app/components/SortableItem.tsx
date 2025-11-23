import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ServiceItem } from '../../types';

interface SortableItemProps {
  id: string;
  service: ServiceItem;
  activeId?: string | null;
  onDragStart?: (id: string) => void;
}

export function SortableItem({ id, service, activeId, onDragStart }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isDragging && onDragStart) {
      onDragStart(id);
    }
    listeners?.onPointerDown?.(e);
  };

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
    // Add styling here (border, padding, margin) to make it look like a card
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '5px',
    backgroundColor: '#2a2a2aff',
    opacity: activeId === id ? 0 : 1,
  };

    //TODO: Fancier tiles that have a clear format for name, price, and duration.
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div style={{ fontWeight: 'bold' }}>{service.name}</div>
      <div>${service.price} - {service.duration}m</div>
    </div>
  );
}