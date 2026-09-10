import { WHATSAPP_RAW } from "../constants/config";

/**
 * Format currency with pt-AO locale:
 * e.g. 150.000.000 Kz
 */
export function formatCurrency(amount: number, currency: string = "AOA"): string {
  if (isNaN(amount)) return "0 Kz";

  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  if (currency === "EUR") {
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // Default AOA (Kz)
  const formattedNumber = new Intl.NumberFormat("pt-AO", {
    maximumFractionDigits: 0,
  }).format(amount);

  return `${formattedNumber} Kz`;
}

/**
 * Generates official WhatsApp message for a property:
 * "Olá, tenho interesse neste imóvel da Nwani Imóveis.
 * Nome: [NOME]
 * Código: [CÓDIGO]
 * Link: [LINK]"
 */
export function createPropertyWhatsAppLink(
  propertyTitle: string,
  propertyCode: string,
  clientName?: string,
  customUrl?: string
): string {
  const currentUrl = customUrl || (typeof window !== "undefined" ? `${window.location.origin}/imovel/${propertyCode}` : `https://www.nwaniimoveis.com/imovel/${propertyCode}`);
  const nameLine = clientName ? `\nNome: ${clientName}` : "";
  const text = `Olá, tenho interesse neste imóvel da Nwani Imóveis.${nameLine}\nImóvel: ${propertyTitle}\nCódigo: ${propertyCode}\nLink: ${currentUrl}`;
  return `https://wa.me/${WHATSAPP_RAW.replace("+", "")}?text=${encodeURIComponent(text)}`;
}

/**
 * General WhatsApp inquiry link
 */
export function createGeneralWhatsAppLink(subject?: string): string {
  const text = subject ? `Olá, gostaria de falar com a equipa da Nwani Imóveis sobre: ${subject}` : `Olá, gostaria de mais informações sobre os serviços da Nwani Imóveis.`;
  return `https://wa.me/${WHATSAPP_RAW.replace("+", "")}?text=${encodeURIComponent(text)}`;
}

/**
 * Safe local storage handler with corruption recovery
 */
export function getSafeLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`LocalStorage read error for key "${key}". Resetting key.`, err);
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
    return defaultValue;
  }
}

export function setSafeLocalStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`LocalStorage write error for key "${key}":`, err);
  }
}
