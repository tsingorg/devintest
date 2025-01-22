// API client for feature list management
const API_URL = import.meta.env.VITE_API_URL;

export interface Feature {
  list_id: number;
  feature_id: string;
  feature_name: string;
  remarks?: string;
}

export interface FeatureList {
  id: number;
  name: string;
  remarks?: string;
  features: Feature[];
}

export const api = {
  // Feature Lists
  getLists: async (): Promise<FeatureList[]> => {
    const response = await fetch(`${API_URL}/api/lists`);
    if (!response.ok) throw new Error('Failed to fetch lists');
    return response.json();
  },

  getList: async (id: number): Promise<FeatureList> => {
    const response = await fetch(`${API_URL}/api/lists/${id}`);
    if (!response.ok) throw new Error('Failed to fetch list');
    return response.json();
  },

  createList: async (data: Omit<FeatureList, 'id'>): Promise<FeatureList> => {
    const response = await fetch(`${API_URL}/api/lists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create list');
    return response.json();
  },

  updateList: async (id: number, data: Partial<FeatureList>): Promise<FeatureList> => {
    const response = await fetch(`${API_URL}/api/lists/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update list');
    return response.json();
  },

  deleteList: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/api/lists/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete list');
  },

  // Features
  addFeature: async (listId: number, data: Omit<Feature, 'list_id'>): Promise<Feature> => {
    const response = await fetch(`${API_URL}/api/lists/${listId}/features`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to add feature');
    return response.json();
  },

  updateFeature: async (listId: number, featureId: string, data: Partial<Feature>): Promise<Feature> => {
    const response = await fetch(`${API_URL}/api/lists/${listId}/features/${featureId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update feature');
    return response.json();
  },

  deleteFeature: async (listId: number, featureId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/api/lists/${listId}/features/${featureId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete feature');
  },

  // Import feature list from file
  importList: async (file: File): Promise<FeatureList> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/api/import`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to import feature list');
    return response.json();
  },
};
