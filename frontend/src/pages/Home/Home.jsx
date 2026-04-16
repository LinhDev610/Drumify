import { useEffect, useMemo, useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import classNames from "classnames/bind";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  IconButton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  CircularProgress,
  Grid
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  LocalShipping,
  Security,
  SupportAgent,
  Autorenew,
  Payment
} from "@mui/icons-material";
import { useThemeStatus } from "../../context/ThemeContext";
import { fetchStoreBanners, fetchStoreProducts } from "../../services/storeService";
import styles from "./Home.module.scss";

const cx = classNames.bind(styles);

const MOCK_TIPS = [
  { id: "t1", title: "Tuning for stage volume", tag: "Drums", desc: "Seat the head, then tune in small quarter turns for even pitch." },
  { id: "t2", title: "Cymbal wash vs stick", tag: "Cymbals", desc: "Heavier rides cut through; thinner crashes open faster." },
  { id: "t3", title: "Pedal spring tension", tag: "Hardware", desc: "Match beater height to your ankle motion to avoid fatigue." },
];

const DEFAULT_HERO_SLIDES = [
  {
    title: "Stage-ready acoustic kits",
    subtitle: "Shell packs, snares, and hardware curated for gigging drummers.",
    gradient: "linear-gradient(135deg, #1a1a1a 0%, #3a1c1c 100%)"
  },
  {
    title: "Cymbals that cut through the mix",
    subtitle: "Rides, crashes, and hi-hats from makers you trust.",
    gradient: "linear-gradient(135deg, #1a1a1a 0%, #1c2a3a 100%)"
  },
  {
    title: "Percussion for every groove",
    subtitle: "Cajóns, hand drums, and accessories for the creative player.",
    gradient: "linear-gradient(135deg, #1a1a1a 0%, #2a1c3a 100%)"
  },
];

  // HERO_SLIDES removed in favor of dynamic banners

const SERVICE_ITEMS = [
  { icon: LocalShipping, title: "Fast shipping", desc: "Tracked delivery on kits" },
  { icon: Security, title: "Authentic gear", desc: "Authorized dealers" },
  { icon: SupportAgent, title: "Drummer support", desc: "Help from players" },
  { icon: Autorenew, title: "30-day returns", desc: "Easy process" },
  { icon: Payment, title: "Flexible pay", desc: "Cards & wallets" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const blobVariants = {
  animate: {
    y: [0, 60, 0],
    x: [0, 30, 0],
    transition: { duration: 25, repeat: Infinity, ease: "linear" }
  }
};

function formatPrice(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

const ProductMiniCard = memo(({ product }) => {
  const { isDarkMode } = useThemeStatus();
  const navigate = useNavigate();
  
  // Extract default variant or first variant
  const defaultVariant = product.variants?.find(v => v.isDefault) || product.variants?.[0];
  const price = defaultVariant?.price || 0;
  const originalPrice = defaultVariant?.unitPrice || price;
  const discountPercent = originalPrice > price 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0;

  const hasDiscount = discountPercent > 0;

  return (
    <motion.div 
      whileHover={{ y: -10, scale: 1.02 }} 
      transition={{ type: "spring", stiffness: 300 }}
      onClick={() => navigate(`/product/${product.slug}`)}
      style={{ cursor: "pointer" }}
    >
      <Card 
        className={cx("premiumCard")} 
        sx={{ 
          width: 280, 
          flexShrink: 0, 
          height: '100%',
          bgcolor: 'var(--color-bg-glass)',
          border: '1px solid var(--color-border-glass)',
          borderRadius: '24px',
          overflow: 'hidden',
          transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
          backdropFilter: 'blur(10px)',
          boxShadow: 'var(--shadow-soft)',
          '&:hover': {
            borderColor: 'var(--color-accent-gold)',
            bgcolor: 'var(--color-bg-card)',
            boxShadow: 'var(--shadow-premium)',
          }
        }}
      >
        <CardMedia
          component="div"
          sx={{ 
            height: 220, 
            bgcolor: 'var(--color-bg-glass)', 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            position: 'relative',
            borderBottom: '1px solid var(--color-border-glass)',
            overflow: 'hidden'
          }}
        >
          {hasDiscount && (
            <Chip 
              label={`-${discountPercent}%`} 
              size="small" 
              sx={{ 
                position: 'absolute', 
                top: 12, 
                left: 12, 
                fontWeight: 900, 
                borderRadius: '8px',
                bgcolor: 'var(--color-brand)',
                color: '#fff',
                fontSize: '0.7rem'
              }}
            />
          )}
          <Typography variant="caption" sx={{ opacity: isDarkMode ? 0.1 : 0.4, fontWeight: 900, fontSize: '1.2rem', color: 'var(--color-text-main)' }}>
            {product.brandName || "Drumify"}
          </Typography>
        </CardMedia>
        <CardContent sx={{ pt: 3, px: 3, pb: 2 }}>
          <Typography variant="subtitle1" fontWeight={700} noWrap gutterBottom sx={{ fontSize: '1.05rem', color: 'var(--color-text-main)' }}>
            {product.name}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
            <Typography variant="h6" fontWeight={800} sx={{ color: 'var(--color-accent-gold)', fontSize: '1.25rem' }}>
              {formatPrice(price)}
            </Typography>
            {hasDiscount && (
              <Typography variant="caption" component="span" sx={{ textDecoration: 'line-through', color: 'var(--color-text-muted)' }}>
                 {formatPrice(originalPrice)}
              </Typography>
            )}
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--color-text-dim)' }}>★ 5.0</Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--color-text-muted)' }}>New Arrival</Typography>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
});

function HeroBanner({ banners }) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);

  const slides = useMemo(() => {
    if (banners && banners.length > 0) {
      return banners.map((b, i) => ({
        title: b.title,
        subtitle: b.description,
        gradient: i % 3 === 0 
          ? "linear-gradient(135deg, #1a1a1a 0%, #3a1c1c 100%)" 
          : i % 3 === 1 
            ? "linear-gradient(135deg, #1a1a1a 0%, #1c2a3a 100%)"
            : "linear-gradient(135deg, #1a1a1a 0%, #2a1c3a 100%)",
        image: b.imageUrl
      }));
    }
    return DEFAULT_HERO_SLIDES;
  }, [banners]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 8000);
    return () => clearInterval(t);
  }, [slides.length]);

  const slide = slides[index];
  return (
    <Box className={styles.heroContainer} sx={{ position: 'relative', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        <motion.div
           key={index}
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           transition={{ duration: 1.2, ease: "easeInOut" }}
           style={{ 
             minHeight: 600, 
             background: slide.gradient, 
             color: "var(--color-text-static-light)", 
             display: "flex", 
             alignItems: "center", 
             padding: "80px 0",
             position: 'relative' 
           }}
        >
           <Container maxWidth="xl">
             <Stack spacing={4} maxWidth="md">
               <motion.div
                 initial={{ y: 30, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.3, duration: 0.8 }}
               >
                 <Typography variant="overline" sx={{ letterSpacing: 6, fontWeight: 800, color: 'var(--color-accent-gold)' }}>
                   {t("home.hero_overline")}
                 </Typography>
               </motion.div>
               <motion.div
                 initial={{ y: 30, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.5, duration: 0.8 }}
               >
                 <Typography variant="h1" fontWeight={900} sx={{ fontSize: { xs: '3.5rem', md: '5.5rem' }, lineHeight: 0.9, letterSpacing: '-0.03em', color: 'var(--color-text-static-light)' }}>
                   {slide.title}
                 </Typography>
               </motion.div>
               <motion.div
                 initial={{ y: 30, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.7, duration: 0.8 }}
               >
                 <Typography variant="h5" sx={{ opacity: 0.8, maxWidth: 600, fontWeight: 300, lineHeight: 1.6, color: 'var(--color-text-static-light)' }}>
                   {slide.subtitle}
                 </Typography>
               </motion.div>
               <motion.div
                 initial={{ y: 30, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.9, duration: 0.8 }}
               >
                 <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
                    <Button variant="contained" size="large" sx={{ bgcolor: 'var(--color-accent-gold)', color: '#000', fontWeight: 900, px: 6, py: 2, borderRadius: 4, transform: 'scale(1.1)', '&:hover': { bgcolor: '#fff' } }}>{t("home.hero_btn_shop")}</Button>
                    <Button variant="outlined" size="large" sx={{ color: 'var(--color-text-static-light)', borderColor: 'rgba(255,255,255,0.3)', px: 6, py: 2, borderRadius: 4, '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}>{t("home.hero_btn_custom")}</Button>
                 </Stack>
               </motion.div>
             </Stack>
           </Container>

            <Stack direction="row" spacing={2} sx={{ position: 'absolute', bottom: 60, right: 80 }}>
              <IconButton onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)} sx={{ color: "var(--color-text-static-light)", bgcolor: 'rgba(255,255,255,0.05)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}><ChevronLeft /></IconButton>
              <IconButton onClick={() => setIndex((i) => (i + 1) % slides.length)} sx={{ color: "var(--color-text-static-light)", bgcolor: 'rgba(255,255,255,0.05)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}><ChevronRight /></IconButton>
            </Stack>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <Box sx={{ mb: 6 }}>
       <Typography sx={{ color: 'var(--color-accent-gold)', fontWeight: 900, fontSize: '0.9rem', letterSpacing: 4, textTransform: 'uppercase', mb: 1.5 }}>Recommended</Typography>
       <Typography variant="h2" fontWeight={900} sx={{ mb: 1, fontSize: '3rem', color: 'var(--color-text-main)', letterSpacing: '-0.02em' }}>{title}</Typography>
       {subtitle && <Typography variant="h6" sx={{ color: 'var(--color-text-dim)', fontWeight: 400 }}>{subtitle}</Typography>}
    </Box>
  );
}

export default function Home() {
  const { isDarkMode } = useThemeStatus();
  const { t } = useTranslation();
  
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const [pData, bData] = await Promise.all([
          fetchStoreProducts(),
          fetchStoreBanners()
        ]);
        setProducts(pData || []);
        setBanners(bData || []);
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const onSale = useMemo(() => products.filter((p) => {
    const defaultVariant = p.variants?.find(v => v.isDefault) || p.variants?.[0];
    return defaultVariant && defaultVariant.unitPrice > defaultVariant.price;
  }), [products]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'var(--color-bg-deep)' }}>
        <CircularProgress sx={{ color: 'var(--color-accent-gold)' }} />
      </Box>
    );
  }

  return (
    <motion.div className={cx("homeWrapper")} initial="hidden" animate="visible" variants={containerVariants} style={{ background: 'var(--color-bg-deep)' }}>
      {/* Mesh Background */}
      <Box sx={{ position: 'fixed', inset: 0, background: 'var(--gradient-mesh)', zIndex: 0, opacity: 0.5 }} />
      
      <Box component="main" className={cx("homeContent")} sx={{ position: 'relative', zIndex: 1 }}>
        <Box component="section" className={cx("heroSection")}><HeroBanner banners={banners} /></Box>

        <motion.section className={cx("section")} variants={sectionVariants}>
          <Container maxWidth="xl">
            <Stack direction="row" justifyContent="space-between" alignItems="flex-end" mb={6}>
               <SectionHeader title={t("home.flash_sales")} subtitle="Premium gear at insider prices." />
               <Button variant="text" sx={{ fontWeight: 800, mb: 1, color: 'var(--color-accent-gold)', letterSpacing: 1 }}>Show All →</Button>
            </Stack>
            <Stack direction="row" gap={4} sx={{ overflowX: "auto", pb: 6, px: 2, '&::-webkit-scrollbar': { display: 'none' } }}>
              {onSale.map((p) => <ProductMiniCard key={p.id} product={p} />)}
            </Stack>
          </Container>
        </motion.section>

        <motion.section className={cx("section")} variants={sectionVariants}>
          <Container maxWidth="xl">
            <SectionHeader title={t("home.featured_gear")} />
            <Tabs 
               value={tab} 
               onChange={(_, v) => setTab(v)} 
               sx={{ 
                 mb: 6,
                  '& .MuiTabs-indicator': { bgcolor: 'var(--color-accent-gold)', height: 3, borderRadius: 2 },
                  '& .MuiTab-root': { fontWeight: 700, textTransform: 'none', fontSize: '1.3rem', color: 'var(--color-text-muted)', px: 4 },
                  '& .MuiTab-root.Mui-selected': { color: 'var(--color-text-main)' }
                }}
            >
               <Tab label="Top Rated" />
               <Tab label="Best Sellers" />
            </Tabs>
            <Stack direction="row" gap={4} sx={{ overflowX: "auto", pb: 6, px: 2, '&::-webkit-scrollbar': { display: 'none' } }}>
              {products.map((p) => <ProductMiniCard key={p.id} product={p} />)}
            </Stack>
          </Container>
        </motion.section>

        <motion.section className={cx("section")} variants={sectionVariants}>
           <Container maxWidth="xl">
             <SectionHeader title={t("home.academy")} subtitle="Pro tips for your next session." />
             <Grid container spacing={4} sx={{ mt: 2 }}>
                {MOCK_TIPS.map((tip) => (
                  <Grid size={{ xs: 12, md: 4 }} key={tip.id}>
                    <motion.div whileHover={{ y: -10, scale: 1.01 }}>
                      <Card 
                        sx={{ 
                          height: '100%', 
                          p: 5, 
                          bgcolor: 'var(--color-bg-glass)', 
                          border: '1px solid var(--color-border-glass)',
                          borderRadius: '32px',
                          color: 'var(--color-text-main)',
                          backdropFilter: 'blur(10px)',
                          boxShadow: 'var(--shadow-soft)'
                        }}
                      >
                         <Chip 
                           label={tip.tag} 
                           size="small" 
                           sx={{ 
                             mb: 3, 
                             fontWeight: 800, 
                             bgcolor: 'var(--color-accent-gold-soft)', 
                             color: 'var(--color-accent-gold)',
                             border: '1px solid var(--color-accent-gold-soft)'
                           }} 
                         />
                         <Typography variant="h4" fontWeight={900} gutterBottom sx={{ color: 'var(--color-text-main)', fontSize: '1.8rem' }}>{tip.title}</Typography>
                         <Typography variant="body1" sx={{ lineHeight: 1.8, fontWeight: isDarkMode ? 300 : 450, color: 'var(--color-text-dim)' }}>{tip.desc}</Typography>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
             </Grid>
           </Container>
        </motion.section>

        <motion.section className={cx("section")} variants={sectionVariants}>
          <Box className={cx("servicesGrid")} sx={{ background: 'var(--color-bg-glass)', borderColor: 'var(--color-border-glass)', backdropFilter: 'blur(10px)', borderRadius: '32px', mx: 2 }}>
            {SERVICE_ITEMS.map(({ icon: Icon, title, desc }) => (
              <Box key={title} className={cx("serviceItem")} sx={{ borderRightColor: 'var(--color-border-glass)' }}>
                <Icon sx={{ color: 'var(--color-accent-gold)', mb: 2, fontSize: '3rem' }} />
                <Typography variant="h6" fontWeight={800} sx={{ color: 'var(--color-text-main)' }}>{title}</Typography>
                <Typography variant="body2" sx={{ color: 'var(--color-text-dim)' }}>{desc}</Typography>
              </Box>
            ))}
          </Box>
        </motion.section>

        <motion.section className={cx("section")} variants={sectionVariants} style={{ padding: '80px 0' }}>
          <Container maxWidth="xl">
            <Card sx={{ p: { xs: 8, md: 12 }, borderRadius: 12, textAlign: 'center', bgcolor: 'var(--color-brand-soft)', border: '1px solid var(--color-border)', color: 'var(--color-text-main)', position: 'relative', overflow: 'hidden', backdropFilter: 'blur(20px)', boxShadow: 'var(--shadow-premium)' }}>
                <Box sx={{ position: 'absolute', top: -100, left: -100, width: 400, height: 400, bgcolor: 'var(--color-accent-gold)', opacity: 0.05, borderRadius: '50%' }} />
                <Typography variant="h2" fontWeight={900} gutterBottom sx={{ fontSize: { xs: '3rem', md: '4.5rem' }, letterSpacing: '-0.04em', color: 'var(--color-text-main)' }}>{t("home.newsletter_title")}</Typography>
                <Typography variant="h6" sx={{ mb: 8, fontWeight: 300, color: 'var(--color-text-dim)' }}>Join 50k+ drummers for exclusive deals and setup tips.</Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center" maxWidth="sm" sx={{ margin: '0 auto' }}>
                  <TextField 
                    fullWidth 
                    variant="outlined"
                    placeholder="Enter your email" 
                    InputProps={{
                      sx: { 
                        bgcolor: 'var(--color-bg-glass)', 
                        borderRadius: 3,
                        color: 'var(--color-text-main)',
                         '& fieldset': { border: '1px solid var(--color-border)' },
                         '&:hover fieldset': { borderColor: 'var(--color-accent-gold)' },
                         '&.Mui-focused fieldset': { borderColor: 'var(--color-accent-gold)' }
                      }
                    }}
                    sx={{
                      '& .MuiInputBase-input::placeholder': {
                        color: 'var(--color-text-dim)',
                        opacity: 1
                      }
                    }}
                  />
                  <Button variant="contained" size="large" sx={{ bgcolor: 'var(--color-accent-gold)', px: 8, fontWeight: 900, color: '#000', borderRadius: 3, '&:hover': { bgcolor: '#fff' } }}>{t("home.newsletter_btn")}</Button>
                </Stack>
            </Card>
          </Container>
        </motion.section>
      </Box>
    </motion.div>
  );
}


