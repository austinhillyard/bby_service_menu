import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { Section } from '../../types';

interface SortableSectionProps {
  section: Section;
}

export function SortableSection({ section }: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: '1px solid #333',
    borderRadius: '5px',
    padding: '20px',
    margin: '20px 0',
    backgroundColor: '#333',
    touchAction: 'none',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div {...attributes} {...listeners} style={{ cursor: 'grab', marginBottom: '10px', fontWeight: 'bold' }}>
        Drag Section: {section.title}
      </div>

      <SortableContext 
        items={section.items.map(item => item.id)} 
        strategy={verticalListSortingStrategy}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
           {section.items.map((service) => (
             <SortableItem key={service.id} id={service.id} service={service} />
           ))}
        </div>
      </SortableContext>
    </div>
  );
}