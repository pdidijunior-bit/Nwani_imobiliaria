import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  increment,
  writeBatch
} from "firebase/firestore";
import { db, cleanFirestoreData } from "./firebase";
import { Property, Category, LocationItem, SiteSettings, Conversation, ConversationMessage, PropertyAlert, SystemNotification, HeroSlide, MarqueeItem } from "../types";
import {
  INITIAL_PROPERTIES,
  INITIAL_CATEGORIES,
  INITIAL_LOCATIONS,
  INITIAL_SITE_SETTINGS,
  INITIAL_HERO_SLIDES,
  INITIAL_MARQUEE_ITEMS
} from "../data/seedData";
import { getSafeLocalStorage, setSafeLocalStorage } from "../utils/formatters";

const LOCAL_STORAGE_PROPERTIES_KEY = "nwani_properties_cache";
const LOCAL_STORAGE_SETTINGS_KEY = "nwani_settings_cache";
const LOCAL_STORAGE_CATEGORIES_KEY = "nwani_categories_cache";
const LOCAL_STORAGE_LOCATIONS_KEY = "nwani_locations_cache";
const LOCAL_STORAGE_CONVERSATIONS_KEY = "nwani_conversations_cache";
const LOCAL_STORAGE_ALERTS_KEY = "nwani_alerts_cache";
const LOCAL_STORAGE_NOTIFS_KEY = "nwani_notifs_cache";
const LOCAL_STORAGE_SLIDES_KEY = "nwani_slides_cache";
const LOCAL_STORAGE_MARQUEE_KEY = "nwani_marquee_cache";

// ---------------- PROPERTIES ---------------- //

function cleanPropertiesList(list: Property[]): Property[] {
  if (!Array.isArray(list)) return [];
  // Purge any old fictitious mock properties while preserving all real newly created properties
  return list.filter((p) => p && typeof p === "object" && p.id && !p.id.startsWith("prop-nwi-000"));
}

export function subscribeToProperties(
  onData: (properties: Property[]) => void,
  onError?: (err: Error) => void
): () => void {
  // ULTRABOOST: Immediately dispatch cached properties so UI loads in 0ms!
  const initialCache = cleanPropertiesList(getSafeLocalStorage<Property[]>(LOCAL_STORAGE_PROPERTIES_KEY, []));
  onData(initialCache);

  // Real-time custom event listener for instant local updates across windows/tabs
  const handleLocalUpdate = (e: any) => {
    if (e.detail && Array.isArray(e.detail)) {
      onData(cleanPropertiesList(e.detail));
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("nwani:properties-updated", handleLocalUpdate);
  }

  try {
    const colRef = collection(db, "properties");
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Property));
          const cleanItems = cleanPropertiesList(items);
          // Sort by creation date desc
          cleanItems.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          setSafeLocalStorage(LOCAL_STORAGE_PROPERTIES_KEY, cleanItems);
          onData(cleanItems);
        } else {
          // If Firestore is empty, check if we have newly created real properties in local storage!
          const currentLocal = cleanPropertiesList(getSafeLocalStorage<Property[]>(LOCAL_STORAGE_PROPERTIES_KEY, []));
          if (currentLocal.length > 0) {
            onData(currentLocal);
            // Re-sync local properties to Firestore in the background
            currentLocal.forEach(async (prop) => {
              try {
                const docRef = doc(db, "properties", prop.id);
                await setDoc(docRef, cleanFirestoreData(prop), { merge: true });
              } catch (e) {
                // Ignore background sync errors
              }
            });
          } else {
            onData([]);
          }
        }
      },
      (error) => {
        console.warn("Firestore properties listener notice (using resilient local cache):", error.message);
        const cached = cleanPropertiesList(getSafeLocalStorage<Property[]>(LOCAL_STORAGE_PROPERTIES_KEY, []));
        onData(cached);
        if (onError) onError(error);
      }
    );
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("nwani:properties-updated", handleLocalUpdate);
      }
      unsubscribe();
    };
  } catch (err) {
    console.warn("Firestore error in subscribeToProperties:", err);
    const cached = cleanPropertiesList(getSafeLocalStorage<Property[]>(LOCAL_STORAGE_PROPERTIES_KEY, []));
    onData(cached);
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("nwani:properties-updated", handleLocalUpdate);
      }
    };
  }
}

export async function saveProperty(property: Property): Promise<Property> {
  const propertyId = property.id && property.id.trim()
    ? property.id
    : `nwi-prop-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  
  const now = Date.now();
  const propertyToSave: Property = {
    ...property,
    id: propertyId,
    code: property.code || `NWI-${now.toString().slice(-4)}`,
    title: (property.title || "Imóvel Nwani").trim(),
    createdAt: property.createdAt || now,
    updatedAt: now,
  };

  const cleaned = cleanFirestoreData(propertyToSave);

  // 1. Instant local persistence and immediate UI update
  const cached = cleanPropertiesList(getSafeLocalStorage<Property[]>(LOCAL_STORAGE_PROPERTIES_KEY, []));
  const existingIdx = cached.findIndex((p) => p.id === propertyId);
  let updatedList: Property[];
  if (existingIdx >= 0) {
    updatedList = [...cached];
    updatedList[existingIdx] = cleaned;
  } else {
    updatedList = [cleaned, ...cached];
  }
  setSafeLocalStorage(LOCAL_STORAGE_PROPERTIES_KEY, updatedList);

  // 2. Dispatch custom event for immediate reactivity
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("nwani:properties-updated", { detail: updatedList }));
  }

  // 3. Write directly to Firestore
  try {
    const docRef = doc(db, "properties", propertyId);
    await setDoc(docRef, cleaned, { merge: true });
    console.log("Firestore: Property successfully saved and synced:", propertyId);
  } catch (err: any) {
    console.error("Firestore saveProperty error (saved locally):", err);
    // Don't throw so user doesn't lose their data
  }

  return propertyToSave;
}

export async function deleteProperty(propertyId: string): Promise<void> {
  const cached = cleanPropertiesList(getSafeLocalStorage<Property[]>(LOCAL_STORAGE_PROPERTIES_KEY, []));
  const updatedList = cached.filter((p) => p.id !== propertyId);
  setSafeLocalStorage(LOCAL_STORAGE_PROPERTIES_KEY, updatedList);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("nwani:properties-updated", { detail: updatedList }));
  }

  try {
    await deleteDoc(doc(db, "properties", propertyId));
  } catch (err) {
    console.warn("Firestore deleteProperty fallback to local:", err);
  }
}

export async function incrementPropertyViews(propertyId: string): Promise<void> {
  try {
    const docRef = doc(db, "properties", propertyId);
    await updateDoc(docRef, {
      viewsCount: increment(1),
    });
  } catch {
    // If offline or permission denied, increment in local cache
    const cached = cleanPropertiesList(getSafeLocalStorage<Property[]>(LOCAL_STORAGE_PROPERTIES_KEY, []));
    const p = cached.find((item) => item.id === propertyId);
    if (p) {
      p.viewsCount = (p.viewsCount || 0) + 1;
      setSafeLocalStorage(LOCAL_STORAGE_PROPERTIES_KEY, cached);
    }
  }
}

// ---------------- CATEGORIES ---------------- //

export function subscribeToCategories(
  onData: (categories: Category[]) => void
): () => void {
  try {
    const colRef = collection(db, "categories");
    return onSnapshot(
      colRef,
      (snap) => {
        if (!snap.empty) {
          const cats = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Category));
          cats.sort((a, b) => (a.order || 0) - (b.order || 0));
          setSafeLocalStorage(LOCAL_STORAGE_CATEGORIES_KEY, cats);
          onData(cats);
        } else {
          const cached = getSafeLocalStorage<Category[]>(LOCAL_STORAGE_CATEGORIES_KEY, INITIAL_CATEGORIES);
          onData(cached);
        }
      },
      () => {
        const cached = getSafeLocalStorage<Category[]>(LOCAL_STORAGE_CATEGORIES_KEY, INITIAL_CATEGORIES);
        onData(cached);
      }
    );
  } catch {
    const cached = getSafeLocalStorage<Category[]>(LOCAL_STORAGE_CATEGORIES_KEY, INITIAL_CATEGORIES);
    onData(cached);
    return () => {};
  }
}

export async function saveCategory(category: Category): Promise<void> {
  const cleaned = cleanFirestoreData(category);
  const cached = getSafeLocalStorage<Category[]>(LOCAL_STORAGE_CATEGORIES_KEY, INITIAL_CATEGORIES);
  const idx = cached.findIndex((c) => c.id === category.id);
  const updated = idx >= 0 ? cached.map((c) => (c.id === category.id ? cleaned : c)) : [...cached, cleaned];
  setSafeLocalStorage(LOCAL_STORAGE_CATEGORIES_KEY, updated);

  try {
    await setDoc(doc(db, "categories", category.id), cleaned, { merge: true });
  } catch (err) {
    console.warn("saveCategory Firestore notice:", err);
  }
}

export async function deleteCategory(categoryId: string): Promise<void> {
  const cached = getSafeLocalStorage<Category[]>(LOCAL_STORAGE_CATEGORIES_KEY, INITIAL_CATEGORIES);
  const updated = cached.filter((c) => c.id !== categoryId);
  setSafeLocalStorage(LOCAL_STORAGE_CATEGORIES_KEY, updated);

  try {
    await deleteDoc(doc(db, "categories", categoryId));
  } catch (err) {
    console.warn("deleteCategory Firestore notice:", err);
  }
}

// ---------------- LOCATIONS ---------------- //

export function subscribeToLocations(
  onData: (locations: LocationItem[]) => void
): () => void {
  try {
    const colRef = collection(db, "locations");
    return onSnapshot(
      colRef,
      (snap) => {
        if (!snap.empty) {
          const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as LocationItem));
          setSafeLocalStorage(LOCAL_STORAGE_LOCATIONS_KEY, items);
          onData(items);
        } else {
          const cached = getSafeLocalStorage<LocationItem[]>(LOCAL_STORAGE_LOCATIONS_KEY, INITIAL_LOCATIONS);
          onData(cached);
        }
      },
      () => {
        const cached = getSafeLocalStorage<LocationItem[]>(LOCAL_STORAGE_LOCATIONS_KEY, INITIAL_LOCATIONS);
        onData(cached);
      }
    );
  } catch {
    const cached = getSafeLocalStorage<LocationItem[]>(LOCAL_STORAGE_LOCATIONS_KEY, INITIAL_LOCATIONS);
    onData(cached);
    return () => {};
  }
}

export async function saveLocation(locItem: LocationItem): Promise<void> {
  const cleaned = cleanFirestoreData(locItem);
  const cached = getSafeLocalStorage<LocationItem[]>(LOCAL_STORAGE_LOCATIONS_KEY, INITIAL_LOCATIONS);
  const idx = cached.findIndex((l) => l.id === locItem.id);
  const updated = idx >= 0 ? cached.map((l) => (l.id === locItem.id ? cleaned : l)) : [...cached, cleaned];
  setSafeLocalStorage(LOCAL_STORAGE_LOCATIONS_KEY, updated);

  try {
    await setDoc(doc(db, "locations", locItem.id), cleaned, { merge: true });
  } catch (err) {
    console.warn("saveLocation Firestore notice:", err);
  }
}

export async function deleteLocation(locId: string): Promise<void> {
  const cached = getSafeLocalStorage<LocationItem[]>(LOCAL_STORAGE_LOCATIONS_KEY, INITIAL_LOCATIONS);
  const updated = cached.filter((l) => l.id !== locId);
  setSafeLocalStorage(LOCAL_STORAGE_LOCATIONS_KEY, updated);

  try {
    await deleteDoc(doc(db, "locations", locId));
  } catch (err) {
    console.warn("deleteLocation Firestore notice:", err);
  }
}

// ---------------- SITE SETTINGS ---------------- //

export function subscribeToSiteSettings(
  onData: (settings: SiteSettings) => void
): () => void {
  try {
    const docRef = doc(db, "site_settings", "general");
    return onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as SiteSettings;
          setSafeLocalStorage(LOCAL_STORAGE_SETTINGS_KEY, data);
          onData(data);
        } else {
          const cached = getSafeLocalStorage<SiteSettings>(LOCAL_STORAGE_SETTINGS_KEY, INITIAL_SITE_SETTINGS);
          onData(cached);
        }
      },
      () => {
        const cached = getSafeLocalStorage<SiteSettings>(LOCAL_STORAGE_SETTINGS_KEY, INITIAL_SITE_SETTINGS);
        onData(cached);
      }
    );
  } catch {
    const cached = getSafeLocalStorage<SiteSettings>(LOCAL_STORAGE_SETTINGS_KEY, INITIAL_SITE_SETTINGS);
    onData(cached);
    return () => {};
  }
}

export async function updateSiteSettings(settings: SiteSettings): Promise<void> {
  const cleaned = cleanFirestoreData(settings);
  setSafeLocalStorage(LOCAL_STORAGE_SETTINGS_KEY, cleaned);

  try {
    await setDoc(doc(db, "site_settings", "general"), cleaned, { merge: true });
  } catch (err) {
    console.warn("updateSiteSettings Firestore notice:", err);
  }
}

// ---------------- CHAT & CONVERSATIONS ---------------- //

export function subscribeToConversations(
  onData: (conversations: Conversation[]) => void
): () => void {
  try {
    const colRef = collection(db, "conversations");
    return onSnapshot(
      colRef,
      (snap) => {
        if (!snap.empty) {
          const convs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Conversation));
          convs.sort((a, b) => b.lastUpdated - a.lastUpdated);
          setSafeLocalStorage(LOCAL_STORAGE_CONVERSATIONS_KEY, convs);
          onData(convs);
        } else {
          const cached = getSafeLocalStorage<Conversation[]>(LOCAL_STORAGE_CONVERSATIONS_KEY, []);
          onData(cached);
        }
      },
      () => {
        const cached = getSafeLocalStorage<Conversation[]>(LOCAL_STORAGE_CONVERSATIONS_KEY, []);
        onData(cached);
      }
    );
  } catch {
    const cached = getSafeLocalStorage<Conversation[]>(LOCAL_STORAGE_CONVERSATIONS_KEY, []);
    onData(cached);
    return () => {};
  }
}

export async function sendMessage(
  conversationId: string,
  messageText: string,
  sender: 'client' | 'admin',
  clientMeta?: {
    name: string;
    phone: string;
    property?: {
      code: string;
      title: string;
      price?: string;
    };
  }
): Promise<void> {
  const newMessage: ConversationMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    sender,
    text: messageText,
    timestamp: Date.now(),
  };

  const cached = getSafeLocalStorage<Conversation[]>(LOCAL_STORAGE_CONVERSATIONS_KEY, []);
  let targetConv = cached.find((c) => c.id === conversationId);

  if (!targetConv) {
    targetConv = {
      id: conversationId,
      clientName: clientMeta?.name || "Visitante",
      clientPhone: clientMeta?.phone || "",
      propertyCode: clientMeta?.property?.code,
      propertyTitle: clientMeta?.property?.title,
      propertyPrice: clientMeta?.property?.price,
      lastMessage: messageText,
      lastUpdated: Date.now(),
      status: 'active',
      unreadAdminCount: sender === 'client' ? 1 : 0,
      messages: [newMessage],
    };
    cached.unshift(targetConv);
  } else {
    targetConv.messages = [...(targetConv.messages || []), newMessage];
    targetConv.lastMessage = messageText;
    targetConv.lastUpdated = Date.now();
    if (sender === 'client') {
      targetConv.unreadAdminCount = (targetConv.unreadAdminCount || 0) + 1;
    }
  }

  setSafeLocalStorage(LOCAL_STORAGE_CONVERSATIONS_KEY, cached);

  try {
    const cleaned = cleanFirestoreData(targetConv);
    await setDoc(doc(db, "conversations", conversationId), cleaned, { merge: true });
  } catch (err) {
    console.warn("sendMessage Firestore notice:", err);
  }
}

// ---------------- ALERTS ---------------- //

export function subscribeToAlerts(
  onData: (alerts: PropertyAlert[]) => void
): () => void {
  try {
    const colRef = collection(db, "alerts");
    return onSnapshot(
      colRef,
      (snap) => {
        if (!snap.empty) {
          const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as PropertyAlert));
          items.sort((a, b) => b.createdAt - a.createdAt);
          setSafeLocalStorage(LOCAL_STORAGE_ALERTS_KEY, items);
          onData(items);
        } else {
          const cached = getSafeLocalStorage<PropertyAlert[]>(LOCAL_STORAGE_ALERTS_KEY, []);
          onData(cached);
        }
      },
      () => {
        const cached = getSafeLocalStorage<PropertyAlert[]>(LOCAL_STORAGE_ALERTS_KEY, []);
        onData(cached);
      }
    );
  } catch {
    const cached = getSafeLocalStorage<PropertyAlert[]>(LOCAL_STORAGE_ALERTS_KEY, []);
    onData(cached);
    return () => {};
  }
}

export async function createPropertyAlert(alertData: Omit<PropertyAlert, "id" | "createdAt">): Promise<PropertyAlert> {
  const newAlert: PropertyAlert = {
    ...alertData,
    id: `alert-${Date.now()}`,
    createdAt: Date.now(),
  };

  const cached = getSafeLocalStorage<PropertyAlert[]>(LOCAL_STORAGE_ALERTS_KEY, []);
  cached.unshift(newAlert);
  setSafeLocalStorage(LOCAL_STORAGE_ALERTS_KEY, cached);

  try {
    await setDoc(doc(db, "alerts", newAlert.id), cleanFirestoreData(newAlert));
  } catch (err) {
    console.warn("createPropertyAlert Firestore notice:", err);
  }

  return newAlert;
}

// ---------------- NOTIFICATIONS ---------------- //

export function subscribeToNotifications(
  onData: (notifs: SystemNotification[]) => void
): () => void {
  try {
    const colRef = collection(db, "notifications");
    return onSnapshot(
      colRef,
      (snap) => {
        if (!snap.empty) {
          const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as SystemNotification));
          items.sort((a, b) => b.createdAt - a.createdAt);
          setSafeLocalStorage(LOCAL_STORAGE_NOTIFS_KEY, items);
          onData(items);
        } else {
          const cached = getSafeLocalStorage<SystemNotification[]>(LOCAL_STORAGE_NOTIFS_KEY, [
            {
              id: "notif-welcome",
              title: "Bem-vindo à Nwani Imóveis",
              message: "Conheça o nosso portfólio exclusivo de imóveis de alto padrão em Luanda e em Angola.",
              createdAt: Date.now(),
              read: false,
              type: "system",
            },
          ]);
          onData(cached);
        }
      },
      () => {
        const cached = getSafeLocalStorage<SystemNotification[]>(LOCAL_STORAGE_NOTIFS_KEY, []);
        onData(cached);
      }
    );
  } catch {
    const cached = getSafeLocalStorage<SystemNotification[]>(LOCAL_STORAGE_NOTIFS_KEY, []);
    onData(cached);
    return () => {};
  }
}

export async function markNotificationAsRead(id: string): Promise<void> {
  const cached = getSafeLocalStorage<SystemNotification[]>(LOCAL_STORAGE_NOTIFS_KEY, []);
  const updated = cached.map((n) => (n.id === id ? { ...n, read: true } : n));
  setSafeLocalStorage(LOCAL_STORAGE_NOTIFS_KEY, updated);

  try {
    await updateDoc(doc(db, "notifications", id), { read: true });
  } catch (err) {
    console.warn("markNotificationAsRead Firestore notice:", err);
  }
}

// ---------------- HERO SLIDES ---------------- //

export function subscribeToHeroSlides(
  onData: (slides: HeroSlide[]) => void
): () => void {
  try {
    const colRef = collection(db, "hero_slides");
    return onSnapshot(
      colRef,
      (snap) => {
        if (!snap.empty) {
          const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as HeroSlide));
          items.sort((a, b) => a.order - b.order);
          setSafeLocalStorage(LOCAL_STORAGE_SLIDES_KEY, items);
          onData(items);
        } else {
          const cached = getSafeLocalStorage<HeroSlide[]>(LOCAL_STORAGE_SLIDES_KEY, INITIAL_HERO_SLIDES);
          onData(cached);
        }
      },
      () => {
        const cached = getSafeLocalStorage<HeroSlide[]>(LOCAL_STORAGE_SLIDES_KEY, INITIAL_HERO_SLIDES);
        onData(cached);
      }
    );
  } catch {
    const cached = getSafeLocalStorage<HeroSlide[]>(LOCAL_STORAGE_SLIDES_KEY, INITIAL_HERO_SLIDES);
    onData(cached);
    return () => {};
  }
}

export async function saveHeroSlide(slide: HeroSlide): Promise<void> {
  const cached = getSafeLocalStorage<HeroSlide[]>(LOCAL_STORAGE_SLIDES_KEY, INITIAL_HERO_SLIDES);
  const idx = cached.findIndex((s) => s.id === slide.id);
  let updated: HeroSlide[];
  if (idx >= 0) {
    updated = [...cached];
    updated[idx] = slide;
  } else {
    updated = [...cached, slide];
  }
  updated.sort((a, b) => a.order - b.order);
  setSafeLocalStorage(LOCAL_STORAGE_SLIDES_KEY, updated);

  try {
    await setDoc(doc(db, "hero_slides", slide.id), cleanFirestoreData(slide));
  } catch (err) {
    console.warn("saveHeroSlide Firestore notice:", err);
  }
}

export async function deleteHeroSlide(id: string): Promise<void> {
  const cached = getSafeLocalStorage<HeroSlide[]>(LOCAL_STORAGE_SLIDES_KEY, INITIAL_HERO_SLIDES);
  const updated = cached.filter((s) => s.id !== id);
  setSafeLocalStorage(LOCAL_STORAGE_SLIDES_KEY, updated);

  try {
    await deleteDoc(doc(db, "hero_slides", id));
  } catch (err) {
    console.warn("deleteHeroSlide Firestore notice:", err);
  }
}

// ---------------- MARQUEE ITEMS ---------------- //

export function subscribeToMarquee(
  onData: (items: MarqueeItem[]) => void
): () => void {
  try {
    const colRef = collection(db, "marquee_items");
    return onSnapshot(
      colRef,
      (snap) => {
        if (!snap.empty) {
          const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as MarqueeItem));
          items.sort((a, b) => a.order - b.order);
          setSafeLocalStorage(LOCAL_STORAGE_MARQUEE_KEY, items);
          onData(items);
        } else {
          const cached = getSafeLocalStorage<MarqueeItem[]>(LOCAL_STORAGE_MARQUEE_KEY, INITIAL_MARQUEE_ITEMS);
          onData(cached);
        }
      },
      () => {
        const cached = getSafeLocalStorage<MarqueeItem[]>(LOCAL_STORAGE_MARQUEE_KEY, INITIAL_MARQUEE_ITEMS);
        onData(cached);
      }
    );
  } catch {
    const cached = getSafeLocalStorage<MarqueeItem[]>(LOCAL_STORAGE_MARQUEE_KEY, INITIAL_MARQUEE_ITEMS);
    onData(cached);
    return () => {};
  }
}

export async function saveMarqueeItem(item: MarqueeItem): Promise<void> {
  const cached = getSafeLocalStorage<MarqueeItem[]>(LOCAL_STORAGE_MARQUEE_KEY, INITIAL_MARQUEE_ITEMS);
  const idx = cached.findIndex((m) => m.id === item.id);
  let updated: MarqueeItem[];
  if (idx >= 0) {
    updated = [...cached];
    updated[idx] = item;
  } else {
    updated = [...cached, item];
  }
  updated.sort((a, b) => a.order - b.order);
  setSafeLocalStorage(LOCAL_STORAGE_MARQUEE_KEY, updated);

  try {
    await setDoc(doc(db, "marquee_items", item.id), cleanFirestoreData(item));
  } catch (err) {
    console.warn("saveMarqueeItem Firestore notice:", err);
  }
}

export async function deleteMarqueeItem(id: string): Promise<void> {
  const cached = getSafeLocalStorage<MarqueeItem[]>(LOCAL_STORAGE_MARQUEE_KEY, INITIAL_MARQUEE_ITEMS);
  const updated = cached.filter((m) => m.id !== id);
  setSafeLocalStorage(LOCAL_STORAGE_MARQUEE_KEY, updated);

  try {
    await deleteDoc(doc(db, "marquee_items", id));
  } catch (err) {
    console.warn("deleteMarqueeItem Firestore notice:", err);
  }
}

// ---------------- SITE SETTINGS ALIAS ---------------- //

export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  return updateSiteSettings(settings);
}

// ---------------- BACKUP, EXPORT & RESTORE ---------------- //

export function exportAllDataToJSON(): string {
  const data = {
    exportDate: new Date().toISOString(),
    version: "1.0",
    properties: getSafeLocalStorage(LOCAL_STORAGE_PROPERTIES_KEY, INITIAL_PROPERTIES),
    categories: getSafeLocalStorage(LOCAL_STORAGE_CATEGORIES_KEY, INITIAL_CATEGORIES),
    locations: getSafeLocalStorage(LOCAL_STORAGE_LOCATIONS_KEY, INITIAL_LOCATIONS),
    settings: getSafeLocalStorage(LOCAL_STORAGE_SETTINGS_KEY, INITIAL_SITE_SETTINGS),
    heroSlides: getSafeLocalStorage(LOCAL_STORAGE_SLIDES_KEY, INITIAL_HERO_SLIDES),
    marqueeItems: getSafeLocalStorage(LOCAL_STORAGE_MARQUEE_KEY, INITIAL_MARQUEE_ITEMS),
  };
  return JSON.stringify(data, null, 2);
}

export async function importAllDataFromJSON(jsonString: string): Promise<void> {
  const parsed = JSON.parse(jsonString);
  if (parsed.properties && Array.isArray(parsed.properties)) {
    setSafeLocalStorage(LOCAL_STORAGE_PROPERTIES_KEY, parsed.properties);
  }
  if (parsed.categories && Array.isArray(parsed.categories)) {
    setSafeLocalStorage(LOCAL_STORAGE_CATEGORIES_KEY, parsed.categories);
  }
  if (parsed.locations && Array.isArray(parsed.locations)) {
    setSafeLocalStorage(LOCAL_STORAGE_LOCATIONS_KEY, parsed.locations);
  }
  if (parsed.settings) {
    setSafeLocalStorage(LOCAL_STORAGE_SETTINGS_KEY, parsed.settings);
  }
  if (parsed.heroSlides && Array.isArray(parsed.heroSlides)) {
    setSafeLocalStorage(LOCAL_STORAGE_SLIDES_KEY, parsed.heroSlides);
  }
  if (parsed.marqueeItems && Array.isArray(parsed.marqueeItems)) {
    setSafeLocalStorage(LOCAL_STORAGE_MARQUEE_KEY, parsed.marqueeItems);
  }
}

export async function resetToSeedData(): Promise<void> {
  setSafeLocalStorage(LOCAL_STORAGE_PROPERTIES_KEY, INITIAL_PROPERTIES);
  setSafeLocalStorage(LOCAL_STORAGE_CATEGORIES_KEY, INITIAL_CATEGORIES);
  setSafeLocalStorage(LOCAL_STORAGE_LOCATIONS_KEY, INITIAL_LOCATIONS);
  setSafeLocalStorage(LOCAL_STORAGE_SETTINGS_KEY, INITIAL_SITE_SETTINGS);
  setSafeLocalStorage(LOCAL_STORAGE_SLIDES_KEY, INITIAL_HERO_SLIDES);
  setSafeLocalStorage(LOCAL_STORAGE_MARQUEE_KEY, INITIAL_MARQUEE_ITEMS);
}

