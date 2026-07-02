import { apiClient } from './api';
import { ItemTypeResponse, StoreItemResponse, UserInventoryItemResponse } from '../types/api';

export const storeService = {
  getItemTypes(): Promise<ItemTypeResponse[]> {
    return apiClient.get<ItemTypeResponse[]>('/store/item-types');
  },

  getItems(): Promise<StoreItemResponse[]> {
    return apiClient.get<StoreItemResponse[]>('/store/items');
  },

  getInventory(userId: string): Promise<UserInventoryItemResponse[]> {
    return apiClient.get<UserInventoryItemResponse[]>(`/store/users/${userId}/inventory`);
  },

  buyItem(userId: string, itemId: string): Promise<UserInventoryItemResponse> {
    return apiClient.post<UserInventoryItemResponse>(`/store/users/${userId}/buy`, { itemId });
  },

  equipItem(userId: string, itemId: string): Promise<UserInventoryItemResponse> {
    return apiClient.post<UserInventoryItemResponse>(`/store/users/${userId}/equip`, { itemId });
  }
};
