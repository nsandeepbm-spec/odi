const STORAGE_KEY = 'odi.admin.storeSettings';

export interface AdminStoreSettings {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  /** Warn when stock_qty is at or below this (live products). */
  lowStockThreshold: number;
}

export const DEFAULT_ADMIN_STORE_SETTINGS: AdminStoreSettings = {
  storeName: 'ODI Kids Store',
  supportEmail: 'support@odi.com',
  supportPhone: '',
  lowStockThreshold: 10,
};

export function getAdminStoreSettings(): AdminStoreSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_ADMIN_STORE_SETTINGS };
    const parsed = JSON.parse(raw) as Partial<AdminStoreSettings>;
    return {
      storeName: typeof parsed.storeName === 'string' && parsed.storeName.trim()
        ? parsed.storeName.trim()
        : DEFAULT_ADMIN_STORE_SETTINGS.storeName,
      supportEmail: typeof parsed.supportEmail === 'string' && parsed.supportEmail.trim()
        ? parsed.supportEmail.trim()
        : DEFAULT_ADMIN_STORE_SETTINGS.supportEmail,
      supportPhone: typeof parsed.supportPhone === 'string' ? parsed.supportPhone.trim() : '',
      lowStockThreshold:
        typeof parsed.lowStockThreshold === 'number' && parsed.lowStockThreshold >= 0
          ? Math.floor(parsed.lowStockThreshold)
          : DEFAULT_ADMIN_STORE_SETTINGS.lowStockThreshold,
    };
  } catch {
    return { ...DEFAULT_ADMIN_STORE_SETTINGS };
  }
}

export function saveAdminStoreSettings(settings: AdminStoreSettings): AdminStoreSettings {
  const next: AdminStoreSettings = {
    storeName: settings.storeName.trim() || DEFAULT_ADMIN_STORE_SETTINGS.storeName,
    supportEmail: settings.supportEmail.trim() || DEFAULT_ADMIN_STORE_SETTINGS.supportEmail,
    supportPhone: settings.supportPhone.trim(),
    lowStockThreshold: Math.max(0, Math.floor(settings.lowStockThreshold) || 0),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function isLowStock(stockQty: number, threshold = getAdminStoreSettings().lowStockThreshold): boolean {
  return stockQty <= threshold;
}
