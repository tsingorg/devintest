import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { Label } from "../../components/ui/label"
import type { FeatureList, Feature } from "../../lib/api"

interface FeatureListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Partial<FeatureList>) => void;
  list?: FeatureList;
}

export function FeatureListDialog({ open, onOpenChange, onSave, list }: FeatureListDialogProps) {
  const [name, setName] = React.useState(list?.name ?? '');
  const [remarks, setRemarks] = React.useState(list?.remarks ?? '');
  const [features, setFeatures] = React.useState<Feature[]>(list?.features ?? []);
  const [newFeatureId, setNewFeatureId] = React.useState('');
  const [newFeatureName, setNewFeatureName] = React.useState('');

  const handleSave = () => {
    onSave({
      name,
      remarks,
      features: features.map(f => ({
        ...f,
        list_id: list?.id ?? 0
      }))
    });
    onOpenChange(false);
  };

  const addFeature = () => {
    if (newFeatureId && newFeatureName) {
      setFeatures([...features, {
        list_id: list?.id ?? 0,
        feature_id: newFeatureId,
        feature_name: newFeatureName,
        remarks: ''
      }]);
      setNewFeatureId('');
      setNewFeatureName('');
    }
  };

  const removeFeature = (featureId: string) => {
    setFeatures(features.filter(f => f.feature_id !== featureId));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{list ? 'Edit Feature List' : 'Create Feature List'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter list name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter remarks (optional)"
            />
          </div>
          <div className="grid gap-2">
            <Label>Features</Label>
            <div className="space-y-2">
              {features.map((feature) => (
                <div key={feature.feature_id} className="flex items-center gap-2">
                  <Input disabled value={feature.feature_name} />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeFeature(feature.feature_id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Feature ID"
                value={newFeatureId}
                onChange={(e) => setNewFeatureId(e.target.value)}
              />
              <Input
                placeholder="Feature Name"
                value={newFeatureName}
                onChange={(e) => setNewFeatureName(e.target.value)}
              />
              <Button onClick={addFeature}>Add</Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
