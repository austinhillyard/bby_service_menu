'use client'; // Needed for Next.js App Router since we use state

import React, { useState, useEffect } from 'react';
import { 
  DndContext, 
  closestCorners, 
  useSensor, 
  useSensors,
  DragEndEvent, 
  closestCenter
} from '@dnd-kit/core';
import { PointerSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { SortableSection } from '@/app/components/SortableSection';
import { initialData } from '@/data/initialData';
import { Section } from '@/types';

export default function MenuBuilder() {
  // Explicitly tell TS this state is an array of Sections
  const [sections, setSections] = useState<Section[]>(initialData);
  const [isClient, setIsClient] = useState(false);

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
    useSensor(PointerSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeSectionIndex = sections.findIndex((s) => s.id === activeId);
    const overSectionIndex = sections.findIndex((s) => s.id === overId);

    // If both are sections, swap them
    if (activeSectionIndex !== -1 && overSectionIndex !== -1) {
      setSections((prevSections) => {
        return arrayMove(prevSections, activeSectionIndex, overSectionIndex);
      });
      return;
    }

    // Find the section that contains the Active item
    const activeSection = sections.find((s) => 
      s.items.some((item) => item.id === activeId)
    );
    
    // Find the section that contains the Over item
    const overSection = sections.find((s) => 
      s.items.some((item) => item.id === overId)
    );


    if (!activeSection || !overSection || activeSection.id !== overSection.id) {
      return;
    }

    setSections((prevSections) => {
      const newSections = [...prevSections];
      
      const sectionIndex = newSections.findIndex((s) => s.id === activeSection.id);
      
      const items = newSections[sectionIndex].items;
      
      const oldIndex = items.findIndex((item) => item.id === activeId);
      const newIndex = items.findIndex((item) => item.id === overId);

      newSections[sectionIndex] = {
        ...newSections[sectionIndex],
        items: arrayMove(items, oldIndex, newIndex)
      };

      return newSections;
    })

  };

  if (!isClient) return <div>Loading...</div>;

  return (
    <div style={{ padding: 50, maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', fontSize: '40px'}}>
        Menu Manager</h1>
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter} 
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={sections.map(s => s.id)} 
          strategy={verticalListSortingStrategy}
        >
          {sections.map(section => (
            <SortableSection key={section.id} section={section} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}