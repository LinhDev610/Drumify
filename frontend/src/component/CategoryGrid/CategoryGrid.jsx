import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import styles from "./CategoryGrid.module.scss";

export const DEFAULT_INSTRUMENT_CATEGORIES = [
  { id: "acoustic", name: "Acoustic Drums" },
  { id: "snare", name: "Snares" },
  { id: "cymbals", name: "Cymbals" },
  { id: "hardware", name: "Hardware" },
  { id: "percussion", name: "Percussion" },
  { id: "sticks", name: "Sticks & More" },
];

/**
 * Redesigned CategoryGrid that works as a horizontal sub-navigation bar.
 */
export default function CategoryGrid({ categories: categoriesProp, maxItems = 6 }) {
  const location = useLocation();

  const categories = useMemo(() => {
    return (categoriesProp || DEFAULT_INSTRUMENT_CATEGORIES).slice(0, maxItems);
  }, [categoriesProp, maxItems]);

  return (
    <Stack 
      direction="row" 
      spacing={1} 
      className={styles.navWrapper}
      sx={{ 
        width: '100%', 
        justifyContent: 'center',
        overflowX: 'auto',
        mx: 2,
        '&::-webkit-scrollbar': { display: 'none' }
      }}
    >
      {categories.map((category) => {
        const path = `/category/${category.id}`;
        const isActive = location.pathname === path;
        
        return (
          <Box
            key={category.id}
            component={Link}
            to={path}
            className={`${styles.navItem} ${isActive ? styles.active : ""}`}
          >
            <Typography variant="body2" className={styles.navLabel}>
              {category.name}
            </Typography>
          </Box>
        );
      })}
      
      {/* Search by Category Placeholder/Dropdown Trigger */}
      <Box className={styles.navItem} sx={{ ml: 2, borderLeft: '1px solid rgba(0,0,0,0.1)', pl: 3 }}>
         <Typography variant="body2" sx={{ fontWeight: 800, color: 'var(--color-brand)' }}>
            Find by Gear ↓
         </Typography>
      </Box>
    </Stack>
  );
}
