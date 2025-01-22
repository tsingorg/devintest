import { useState, useEffect } from 'react'
import './App.css'
import { FeatureListGrid } from '@/components/feature-lists/FeatureListGrid'
import { FeatureListDialog } from '@/components/feature-lists/FeatureListDialog'
import type { FeatureList } from '@/lib/api'
import { api } from '@/lib/api'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { useToast } from './hooks/use-toast'
import { Toaster } from './components/ui/toaster'

function App() {
  const [lists, setLists] = useState<FeatureList[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedList, setSelectedList] = useState<FeatureList | undefined>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadLists()
  }, [])

  const loadLists = async () => {
    try {
      const fetchedLists = await api.getLists()
      setLists(fetchedLists)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load feature lists',
        variant: 'destructive',
      })
    }
  }

  const handleCreateNew = () => {
    setSelectedList(undefined)
    setDialogOpen(true)
  }

  const handleEdit = (list: FeatureList) => {
    setSelectedList(list)
    setDialogOpen(true)
  }

  const handleDelete = (list: FeatureList) => {
    setSelectedList(list)
    setDeleteDialogOpen(true)
  }

  const handleSave = async (data: Partial<FeatureList>) => {
    try {
      if (selectedList) {
        await api.updateList(selectedList.id, data)
        toast({
          title: 'Success',
          description: 'Feature list updated successfully',
        })
      } else {
        await api.createList(data as Omit<FeatureList, 'id'>)
        toast({
          title: 'Success',
          description: 'Feature list created successfully',
        })
      }
      await loadLists()
      setDialogOpen(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save feature list',
        variant: 'destructive',
      })
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedList) return

    try {
      await api.deleteList(selectedList.id)
      toast({
        title: 'Success',
        description: 'Feature list deleted successfully',
      })
      await loadLists()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete feature list',
        variant: 'destructive',
      })
    } finally {
      setDeleteDialogOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Feature List Manager
          </h1>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <FeatureListGrid
          lists={lists}
          onCreateNew={handleCreateNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      <FeatureListDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        list={selectedList}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the feature list
              and all its features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster />
    </div>
  )
}

export default App
