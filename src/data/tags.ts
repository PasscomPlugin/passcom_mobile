export interface Tag {
  id: string
  label: string
  color: string
}

export const AVAILABLE_TAGS: Tag[] = [
  { id: 'kitchen', label: 'Kitchen', color: 'bg-orange-200 text-orange-800' },
  { id: 'prep', label: 'Prep', color: 'bg-green-200 text-green-800' },
  { id: 'cleaning', label: 'Cleaning', color: 'bg-blue-200 text-blue-800' },
  { id: 'urgent', label: 'Urgent', color: 'bg-red-200 text-red-800' },
  { id: 'admin', label: 'Admin', color: 'bg-purple-200 text-purple-800' },
  { id: 'maintenance', label: 'Maintenance', color: 'bg-amber-200 text-amber-800' },
  { id: 'inventory', label: 'Inventory', color: 'bg-cyan-200 text-cyan-800' },
  { id: 'training', label: 'Training', color: 'bg-pink-200 text-pink-800' },
]

