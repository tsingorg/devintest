import * as React from 'react'
import { Button } from "../../components/ui/button"
import { Plus, Upload } from "lucide-react"
import { FeatureListCard } from "./FeatureListCard"
import type { FeatureList } from "../../lib/api"

interface FeatureListGridProps {
  lists: FeatureList[];
  onCreateNew: () => void;
  onEdit: (list: FeatureList) => void;
  onDelete: (list: FeatureList) => void;
  onImport: (file: File) => Promise<void>;
}

export function FeatureListGrid({ lists, onCreateNew, onEdit, onDelete, onImport }: FeatureListGridProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onImport(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Feature Lists</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleImportClick}>
            <Upload className="h-4 w-4 mr-2" />
            Import List
          </Button>
          <Button onClick={onCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            Create New List
          </Button>
          <input
            type="file"
            accept=".txt"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      </div>
      
      {lists.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No feature lists yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map((list) => (
            <FeatureListCard
              key={list.id}
              list={list}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
