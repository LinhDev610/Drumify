import { normalizeMediaUrl } from "./normalizeMediaUrl";

/**
 * Map Drumify Product (+ nested variant, brand, media) to a stable card shape for UI.
 * @param {object|null|undefined} product
 * @param {string} [apiBaseUrl]
 * @returns {object|null}
 */
export function mapProductToCard(product, apiBaseUrl) {
  if (product == null || typeof product !== "object") return null;

  const id = product.id != null ? String(product.id) : null;
  if (!id) return null;

  const brandName =
    product.brand && typeof product.brand === "object" && product.brand.name != null
      ? String(product.brand.name)
      : product.brandName != null
        ? String(product.brandName)
        : "";

  const variants = Array.isArray(product.variant)
    ? product.variant
    : Array.isArray(product.variants)
      ? product.variants
      : [];

  const defaultVariant =
    variants.find((v) => v && (v.isDefault === true || v.default === true)) ?? variants[0] ?? null;

  const mediaList = Array.isArray(product.productMedia)
    ? product.productMedia
    : Array.isArray(product.media)
      ? product.media
      : [];

  const firstMedia = mediaList.length > 0 ? mediaList[0] : null;
  const rawMedia =
    (firstMedia && (firstMedia.url ?? firstMedia.mediaUrl ?? firstMedia.path)) ??
    product.defaultMediaUrl ??
    product.imageUrl ??
    "";

  const unitPrice = Number(defaultVariant?.unitPrice ?? product.unitPrice ?? 0) || 0;
  const tax = Number(defaultVariant?.tax ?? product.tax ?? 0) || 0;
  const priceFromBackendRaw = defaultVariant?.price ?? product.price;
  const priceFromBackend =
    priceFromBackendRaw != null && !Number.isNaN(Number(priceFromBackendRaw))
      ? Number(priceFromBackendRaw)
      : null;

  const originalPrice = unitPrice * (1 + tax);
  const currentPrice = priceFromBackend ?? originalPrice;

  let discount = 0;
  if (originalPrice > 0 && currentPrice < originalPrice) {
    discount = Math.min(99, Math.round(((originalPrice - currentPrice) / originalPrice) * 100));
  }

  let averageRating = typeof product.averageRating === "number" ? product.averageRating : 0;
  const reviews = Array.isArray(product.reviews) ? product.reviews : [];
  if ((!averageRating || Number.isNaN(averageRating)) && reviews.length > 0) {
    const ratings = reviews.map((r) => Number(r?.rating)).filter((n) => !Number.isNaN(n));
    if (ratings.length > 0) {
      averageRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    }
  }

  const quantitySold = Number(product.quantitySold ?? product.soldCount ?? 0) || 0;

  return {
    id,
    title: product.name != null ? String(product.name) : "Product",
    brand: brandName,
    image: normalizeMediaUrl(rawMedia, apiBaseUrl),
    currentPrice,
    originalPrice,
    discount,
    averageRating: Number.isFinite(averageRating) ? averageRating : 0,
    quantitySold,
    updatedAt: product.updatedAt ?? product.createdAt ?? null,
  };
}
