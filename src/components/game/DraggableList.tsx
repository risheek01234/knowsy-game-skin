import React, { useState } from 'react';
import { GripVertical } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DraggableListProps {
  items: string[];
  onReorder: (newOrder: string[]) => void;
  disabled?: boolean;
  className?: string;
}

export const DraggableList: React.FC<DraggableListProps> = ({
  items,
  onReorder,
  disabled = false,
  className,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    if (disabled) return;
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (disabled || draggedIndex === null) return;
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (disabled || draggedIndex === null) return;

    const newItems = [...items];
    const [draggedItem] = newItems.splice(draggedIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);

    onReorder(newItems);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item, index) => (
        <Card
          key={`${item}-${index}`}
          draggable={!disabled}
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
          className={cn(
            'p-4 flex items-center gap-3 transition-all',
            disabled ? 'cursor-not-allowed opacity-60' : 'cursor-move hover:shadow-md',
            draggedIndex === index && 'opacity-50',
            dragOverIndex === index && draggedIndex !== index && 'border-primary border-2'
          )}
        >
          {!disabled && (
            <GripVertical className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          )}
          <div className="flex-1 flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
              {index + 1}
            </div>
            <span className="text-lg font-medium">{item}</span>
          </div>
        </Card>
      ))}
    </div>
  );
};
