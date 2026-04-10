import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import styles from "./CategoryGrid.module.scss";

/** Default instrument categories when no API and no `categories` prop */
export const DEFAULT_INSTRUMENT_CATEGORIES = [
  { id: "acoustic", name: "Acoustic drums", nameEn: "Acoustic drums" },
  { id: "snare", name: "Snare drums", nameEn: "Snare drums" },
  { id: "cymbals", name: "Cymbals", nameEn: "Cymbals" },
  { id: "hardware", name: "Hardware", nameEn: "Hardware" },
  { id: "percussion", name: "Percussion", nameEn: "Percussion" },
  { id: "sticks", name: "Sticks & mallets", nameEn: "Sticks & mallets" },
];

const CATEGORY_ICONS = {
  // English
  "Acoustic drums": "🥁",
  "Snare drums": "🪘",
  Cymbals: "🔔",
  Hardware: "🔧",
  Percussion: "🪘",
  "Sticks & mallets": "🥢",
  // Vietnamese
  "Trống acoustic": "🥁",
  "Trống snare": "🪘",
  "Chũm chọe": "🔔",
  "Phụ kiện trống": "🔧",
  "Bộ gõ": "🪘",
  "Dùi trống": "🥢",
};

function resolveIcon(category) {
  const keys = [category.name, category.nameEn].filter(Boolean);
  for (const key of keys) {
    if (CATEGORY_ICONS[key]) return CATEGORY_ICONS[key];
  }
  return "📦";
}

function normalizeRootList(raw, maxItems) {
  if (!Array.isArray(raw)) return [];
  return raw.filter((c) => c && !c.parentId).slice(0, maxItems);
}

/**
 * Category grid (LilaShop-style layout) for Drumify.
 *
 * @param {object} props
 * @param {Array<{id: string|number, name: string, nameEn?: string, parentId?: string|number|null}>} [props.categories] Controlled list. Pass `[]` after load to hide.
 * @param {boolean} [props.loading] When controlled, shows skeletons.
 * @param {(signal?: AbortSignal) => Promise<Array>} [props.loadCategories] Uncontrolled fetcher (no auth). Ignored if `categories` is defined.
 * @param {number} [props.maxItems=6]
 * @param {(category: object) => string} [props.getHref]
 * @param {(category: object) => string} [props.getIcon] Override emoji / character icon
 */
export default function CategoryGrid({
  categories: categoriesProp,
  loading: loadingProp = false,
  loadCategories,
  maxItems = 6,
  getHref = (c) => `/category/${c.id}`,
  getIcon,
}) {
  const controlled = categoriesProp !== undefined;
  const [fetched, setFetched] = useState([]);
  const [loadingInternal, setLoadingInternal] = useState(Boolean(!controlled && loadCategories));

  useEffect(() => {
    if (controlled || typeof loadCategories !== "function") {
      return undefined;
    }

    const ac = new AbortController();
    let cancelled = false;

    (async () => {
      setLoadingInternal(true);
      try {
        const data = await loadCategories(ac.signal);
        if (!cancelled) {
          setFetched(normalizeRootList(data, maxItems));
        }
      } catch (e) {
        if (e?.name === "AbortError") return;
        console.error("[CategoryGrid] loadCategories failed:", e);
        if (!cancelled) setFetched([]);
      } finally {
        if (!cancelled) setLoadingInternal(false);
      }
    })();

    return () => {
      cancelled = true;
      ac.abort();
    };
  }, [controlled, loadCategories, maxItems]);

  const categories = useMemo(() => {
    if (controlled) {
      return normalizeRootList(categoriesProp, maxItems);
    }
    if (loadCategories) {
      return fetched;
    }
    return DEFAULT_INSTRUMENT_CATEGORIES.slice(0, maxItems);
  }, [controlled, categoriesProp, loadCategories, fetched, maxItems]);

  const loading = controlled ? loadingProp : loadingInternal;

  if (loading) {
    return (
      <Box component="section" className={styles.categoryGrid}>
        {Array.from({ length: maxItems }, (_, i) => (
          <Box key={i} className={`${styles.categoryCard} ${styles.categoryCardLoading}`}>
            <Skeleton variant="circular" width={64} height={64} className={styles.categoryIcon} sx={{ bgcolor: "grey.300", flexShrink: 0 }} />
            <Skeleton variant="rounded" width="80%" height={16} className={styles.categoryName} />
          </Box>
        ))}
      </Box>
    );
  }

  if (!categories.length) {
    return null;
  }

  return (
    <Box component="section" className={styles.categoryGrid}>
      {categories.map((category) => {
        const icon = getIcon ? getIcon(category) : resolveIcon(category);
        return (
          <Link key={category.id} to={getHref(category)} className={styles.categoryCard}>
            <Box className={styles.categoryIcon} aria-hidden>
              <span>{icon}</span>
            </Box>
            <Typography component="div" variant="body2" className={styles.categoryName}>
              {category.name}
            </Typography>
          </Link>
        );
      })}
    </Box>
  );
}
