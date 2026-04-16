import { 
  Container, 
  Typography, 
  Box, 
  Stack, 
  Card, 
  CardContent, 
  CardMedia,
  Button, 
  IconButton, 
  Divider,
  Slider,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  Avatar,
  Paper,
  Chip,
  Grid
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import FilterListIcon from "@mui/icons-material/FilterList";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";

// Reusing mock data for demonstration
const MOCK_PRODUCTS = [
  { id: 1, name: "Pearl Masterworks Snare", brand: "Pearl", price: 1200, rating: 5.0, image: "https://images.unsplash.com/photo-1543443374-b6fe10a6ab7b?auto=format&fit=crop&q=80&w=400", category: "Snares" },
  { id: 2, name: "Zildjian K Sweet Cymbal Set", brand: "Zildjian", price: 950, rating: 4.9, image: "https://images.unsplash.com/photo-1524230659192-35f3458f2f7e?auto=format&fit=crop&q=80&w=400", category: "Cymbals" },
  { id: 3, name: "DW 9000 Double Pedal", brand: "DW", price: 780, rating: 4.8, image: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&q=80&w=400", category: "Hardware" },
  { id: 4, name: "Tama Starclassic Walnut", brand: "Tama", price: 2100, rating: 5.0, image: "https://images.unsplash.com/photo-1543443374-b6fe10a6ab7b?auto=format&fit=crop&q=80&w=400", category: "Kits" },
  { id: 5, name: "Sabian HHX Evolution Pak", brand: "Sabian", price: 820, rating: 4.7, image: "https://images.unsplash.com/photo-1524230659192-35f3458f2f7e?auto=format&fit=crop&q=80&w=400", category: "Cymbals" },
  { id: 6, name: "Evans G2 Coated Pack", brand: "Evans", price: 85, rating: 4.6, image: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&q=80&w=400", category: "Heads" },
];

const CATEGORIES = ["Shell Packs", "Snares", "Cymbals", "Hardware", "Percussion", "Sticks & Heads"];
const BRANDS = ["Pearl", "Zildjian", "DW", "Tama", "Sabian", "Evans"];

function ProductCard({ product }) {
  return (
    <motion.div whileHover={{ y: -8 }}>
      <Card 
        sx={{ 
          bgcolor: 'var(--color-bg-glass)', 
          border: '1px solid var(--color-border-glass)',
          borderRadius: '24px',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          boxShadow: 'var(--shadow-soft)',
          backdropFilter: 'blur(10px)',
          '&:hover': { 
            borderColor: 'var(--color-accent-gold)', 
            bgcolor: 'var(--color-bg-card)',
            boxShadow: 'var(--shadow-premium)'
          }
        }}
      >
        <CardMedia
          component="img"
          height="240"
          image={product.image}
          alt={product.name}
          sx={{ bgcolor: 'var(--color-bg-glass)', filter: 'brightness(0.9)' }}
        />
        <CardContent sx={{ p: 3 }}>
          <Typography variant="overline" sx={{ color: 'var(--color-accent-gold)', fontWeight: 800 }}>{product.brand}</Typography>
          <Typography variant="h6" fontWeight={700} sx={{ color: 'var(--color-text-main)', mb: 1 }} noWrap>{product.name}</Typography>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight={900} sx={{ color: 'var(--color-accent-gold)' }}>${product.price}</Typography>
            <Typography variant="caption" sx={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>★ {product.rating}</Typography>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Products() {
  const { t } = useTranslation();
  return (
    <Box sx={{ minHeight: '100vh', background: 'var(--color-bg-deep)', pt: 4, pb: 10 }}>
       {/* Mesh Background */}
      <Box sx={{ position: 'fixed', inset: 0, background: 'var(--gradient-mesh)', zIndex: 0, opacity: 0.3 }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header Section */}
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={4} sx={{ mb: 6 }}>
          <Box>
            <Typography variant="h3" fontWeight={900} sx={{ color: 'var(--color-text-main)', mb: 1, letterSpacing: '-0.02em' }}>{t("nav.products")}</Typography>
            <Typography sx={{ color: 'var(--color-text-dim)' }}>Khám phá hơn 1,200 thiết bị trống chuyên nghiệp.</Typography>
          </Box>
          <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
             <Select 
               defaultValue="popular" 
               size="small" 
               sx={{ 
                 bgcolor: 'var(--color-bg-glass)', 
                 color: 'var(--color-text-main)', 
                 borderRadius: '12px',
                 minWidth: 180,
                 '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-border)' }
               }}
             >
                <MenuItem value="popular">Phổ biến nhất</MenuItem>
                <MenuItem value="newest">Mới nhất</MenuItem>
                <MenuItem value="price-low">Giá: Thấp đến Cao</MenuItem>
                <MenuItem value="price-high">Giá: Cao đến Thấp</MenuItem>
             </Select>
             <Stack direction="row" spacing={1} sx={{ bgcolor: 'var(--color-bg-glass)', p: 0.5, borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                <IconButton size="small" sx={{ color: 'var(--color-accent-gold)' }}><GridViewIcon /></IconButton>
                <IconButton size="small" sx={{ color: 'var(--color-text-muted)' }}><ViewListIcon /></IconButton>
             </Stack>
          </Stack>
        </Stack>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '280px 1fr' }, gap: 4 }}>
          {/* Sidebar */}
          <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
            <Card sx={{ p: 4, bgcolor: 'var(--color-bg-glass)', border: '1px solid var(--color-border-glass)', borderRadius: '32px', position: 'sticky', top: 120, backdropFilter: 'blur(10px)', boxShadow: 'var(--shadow-soft)' }}>
              <Stack spacing={4}>
                <Box>
                  <Typography variant="subtitle1" fontWeight={800} sx={{ color: 'var(--color-text-main)', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FilterListIcon fontSize="small" /> Danh mục
                  </Typography>
                  <Stack spacing={1}>
                    {CATEGORIES.map(cat => (
                      <FormControlLabel 
                        key={cat}
                        control={<Checkbox size="small" sx={{ color: 'var(--color-text-muted)', '&.Mui-checked': { color: 'var(--color-accent-gold)' } }} />}
                        label={<Typography sx={{ fontSize: '0.9rem', color: 'var(--color-text-dim)' }}>{cat}</Typography>}
                      />
                    ))}
                  </Stack>
                </Box>

                <Divider sx={{ borderColor: 'var(--color-border)' }} />

                <Box>
                  <Typography variant="subtitle1" fontWeight={800} sx={{ color: 'var(--color-text-main)', mb: 3 }}>Khoảng giá</Typography>
                  <Slider
                    defaultValue={[0, 2000]}
                    max={5000}
                    valueLabelDisplay="auto"
                    sx={{ color: 'var(--color-accent-gold)', px: 1 }}
                  />
                  <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                    <Typography variant="caption" sx={{ color: 'var(--color-text-muted)' }}>$0</Typography>
                    <Typography variant="caption" sx={{ color: 'var(--color-text-muted)' }}>$5,000+</Typography>
                  </Stack>
                </Box>

                <Divider sx={{ borderColor: 'var(--color-border)' }} />

                <Box>
                  <Typography variant="subtitle1" fontWeight={800} sx={{ color: 'var(--color-text-main)', mb: 2 }}>Thương hiệu</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {BRANDS.map(brand => (
                      <Chip 
                        key={brand} 
                        label={brand} 
                        clickable 
                        size="small" 
                        sx={{ 
                          bgcolor: 'var(--color-bg-glass)', 
                          color: 'var(--color-text-dim)', 
                          border: '1px solid var(--color-border)',
                          '&:hover': { bgcolor: 'var(--color-bg-card)', color: 'var(--color-text-main)' }
                        }} 
                      />
                    ))}
                  </Box>
                </Box>

                <Button fullWidth variant="outlined" sx={{ borderRadius: '12px', color: 'var(--color-accent-gold)', borderColor: 'var(--color-accent-gold-soft)', fontWeight: 800 }}>Xóa lọc</Button>
              </Stack>
            </Card>
          </Box>

          {/* Product Grid */}
          <Box>
            <Grid container spacing={3}>
              {MOCK_PRODUCTS.map(product => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>

            {/* Pagination Placeholder */}
            <Stack direction="row" justifyContent="center" sx={{ mt: 8 }}>
              <Button sx={{ color: '#000', mx: 1, minWidth: 40, height: 40, borderRadius: '10px', bgcolor: 'var(--color-accent-gold)', fontWeight: 900 }}>1</Button>
              <Button sx={{ color: 'var(--color-text-dim)', mx: 1, minWidth: 40, fontWeight: 700 }}>2</Button>
              <Button sx={{ color: 'var(--color-text-dim)', mx: 1, minWidth: 40, fontWeight: 700 }}>3</Button>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
