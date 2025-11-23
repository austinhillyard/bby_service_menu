'use client'; // Needed for Next.js App Router since we use state

import React, { useState, useEffect } from 'react';
import { 
  DndContext, 
  closestCorners, 
  useSensor, 
  useSensors,
  DragEndEvent,
  DragOverlay
} from '@dnd-kit/core';
import { PointerSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { SortableSection } from '@/app/components/SortableSection';
import { initialData } from '@/data/initialData';
import { Section, ServiceItem } from '@/types';

export default function MenuBuilder() {
  // Explicitly tell TS this state is an array of Sections
  const [sections, setSections] = useState<Section[]>(initialData);
  const [isClient, setIsClient] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true); // Fix for hydration mismatch in Next.js
    const saved = localStorage.getItem('menu-data');
    if (saved) {
      setSections(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
       localStorage.setItem('menu-data', JSON.stringify(sections));
    }
  }, [sections, isClient]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
    //   activationConstraint: {
    //     distance: 4,
    //     delay: 30,
    //   }
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    setSections((prevSections) => {
      const newSections = [...prevSections];

      const activeSectionIndex = newSections.findIndex((s) => s.id === activeId);
      const overSectionIndex = newSections.findIndex((s) => s.id === overId);

      // If both are sections, swap them
      if (activeSectionIndex !== -1 && overSectionIndex !== -1) {
        return arrayMove(newSections, activeSectionIndex, overSectionIndex);
      }

      // Find the section that contains the Active item
      const activeSectionIdx = newSections.findIndex((s) => 
        s.items.some((item) => item.id === activeId)
      );
      
      // Find the section that contains the Over item
      const overSectionIdx = newSections.findIndex((s) => 
        s.items.some((item) => item.id === overId)
      );

      if (activeSectionIdx === -1 || overSectionIdx === -1) {
        return prevSections;
      }

      if (activeSectionIdx === overSectionIdx) {
        const items = newSections[activeSectionIdx].items;
        const oldIndex = items.findIndex((item) => item.id === activeId);
        const newIndex = items.findIndex((item) => item.id === overId);

        if (oldIndex !== -1 && newIndex !== -1) {
          newSections[activeSectionIdx] = {
            ...newSections[activeSectionIdx],
            items: arrayMove(items, oldIndex, newIndex)
          };
        }
      }

      return newSections;
    });
  };

  const getActiveItem = () => {
    if (!activeId) return null;
    for (const section of sections) {
      const item = section.items.find((i) => i.id === activeId);
      if (item) return item;
    }
    return null;
  };

  if (!isClient) return <div>Loading...</div>;

  return (
    <div style={{ padding: 50, maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', fontSize: '40px'}}>
        Menu Manager</h1>
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCorners} 
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={[
            ...sections.map(s => s.id),
            ...sections.flatMap(s => s.items.map(item => item.id))
          ]} 
          strategy={verticalListSortingStrategy}
        >
          {sections.map(section => (
            <SortableSection 
              key={section.id} 
              section={section}
              activeId={activeId}
              onDragStart={(id) => setActiveId(id)}
            />
          ))}
        </SortableContext>
        <DragOverlay>
          {activeId ? (
            <div style={{
              border: '1px solid #ccc',
              borderRadius: '5px',
              padding: '10px',
              backgroundColor: '#2a2a2aff',
              boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
              opacity: 0.8,
            }}>
              <div style={{ fontWeight: 'bold' }}>{getActiveItem()?.name}</div>
              <div>${getActiveItem()?.price} - {getActiveItem()?.duration}m</div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}