import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import type { FeatureList } from "../../lib/api"

interface FeatureListCardProps {
  list: FeatureList;
  onEdit: (list: FeatureList) => void;
  onDelete: (list: FeatureList) => void;
}

export function FeatureListCard({ list, onEdit, onDelete }: FeatureListCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{list.name}</CardTitle>
        {list.remarks && <CardDescription>{list.remarks}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Features ({list.features.length})</h4>
          <ul className="list-disc list-inside space-y-1">
            {list.features.slice(0, 3).map((feature) => (
              <li key={feature.feature_id} className="text-sm text-gray-600">
                {feature.feature_name}
              </li>
            ))}
            {list.features.length > 3 && (
              <li className="text-sm text-gray-500">
                And {list.features.length - 3} more...
              </li>
            )}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(list)}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(list)}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}
