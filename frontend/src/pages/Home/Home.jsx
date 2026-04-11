import { useEffect, useMemo, useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import classNames from "classnames/bind";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import LocalShipping from "@mui/icons-material/LocalShipping";
import Security from "@mui/icons-material/Security";
import SupportAgent from "@mui/icons-material/SupportAgent";
import Autorenew from "@mui/icons-material/Autorenew";
import Payment from "@mui/icons-material/Payment";
import styles from "./Home.module.scss";

const cx = classNames.bind(styles);

/** Required placeholder product */
export const MOCK_PRODUCT_PRIMARY = {
  id: "snare-pearl-1",
  name: "Snare Drum",
  brand: "Pearl",
  price: 500,
  originalPrice: 599,
  discountPercent: 16,
  rating: 4.9,
  sold: 842,
};

const MOCK_PRODUCTS = [
  MOCK_PRODUCT_PRIMARY,
  {
    id: "2",
    name: "Ride Cymbal",
    brand: "Zildjian",
    price: 320,
    originalPrice: 380,
    discountPercent: 15,
    rating: 4.7,
    sold: 520,
  },
  {
    id: "3",
    name: "Kick Pedal",
    brand: "DW",
    price: 189,
    originalPrice: 189,
    discountPercent: 0,
    rating: 4.8,
    sold: 310,
  },
  {
    id: "4",
    name: "Hi-Hat Pair",
    brand: "Sabian",
    price: 279,
    originalPrice: 329,
    discountPercent: 15,
    rating: 4.6,
    sold: 210,
  },
  {
    id: "5",
    name: "Tom Pack",
    brand: "Tama",
    price: 649,
    originalPrice: 720,
    discountPercent: 10,
    rating: 4.85,
    sold: 98,
  },
  {
    id: "6",
    name: "Practice Pad",
    brand: "Evans",
    price: 45,
    originalPrice: 52,
    discountPercent: 13,
    rating: 4.4,
    sold: 1200,
  },
];

const MOCK_TIPS = [
  { id: "t1", title: "Tuning for stage volume", tag: "Drums", desc: "Seat the head, then tune in small quarter turns for even pitch." },
  { id: "t2", title: "Cymbal wash vs stick", tag: "Cymbals", desc: "Heavier rides cut through; thinner crashes open faster." },
  { id: "t3", title: "Pedal spring tension", tag: "Hardware", desc: "Match beater height to your ankle motion to avoid fatigue." },
];

const HERO_SLIDES = [
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
  const hasDiscount = product.discountPercent > 0 && product.originalPrice > product.price;
  return (
    <motion.div whileHover={{ y: -10 }}>
      <Card className={cx("premiumCard")} sx={{ width: 260, flexShrink: 0, height: '100%' }}>
        <CardMedia
          component="div"
          sx={{ height: 200, bgcolor: "white", display: "flex", alignItems: "center", justifyContent: "center", position: 'relative' }}
        >
          {hasDiscount && (
            <Chip 
              label={`-${product.discountPercent}%`} 
              size="small" 
              color="error" 
              sx={{ position: 'absolute', top: 12, left: 12, fontWeight: 900, borderRadius: '6px' }}
            />
          )}
          <Typography variant="caption" sx={{ opacity: 0.05, fontWeight: 900, fontSize: '1.5rem', transform: 'rotate(-10deg)' }}>
            {product.brand}
          </Typography>
        </CardMedia>
        <CardContent sx={{ pt: 3, px: 3, pb: 2 }}>
          <Typography variant="subtitle1" fontWeight={800} noWrap gutterBottom sx={{ fontSize: '1.1rem' }}>
            {product.name}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <Typography variant="h6" fontWeight={900} color="var(--color-brand)">
              {formatPrice(product.price)}
            </Typography>
            {hasDiscount && (
              <Typography variant="caption" component="span" sx={{ textDecoration: 'line-through', opacity: 0.5 }}>
                 {formatPrice(product.originalPrice)}
              </Typography>
            )}
          </Stack>
          <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.6 }}>★ {product.rating} · {product.sold} sold</Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
});

function HeroBanner() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);
  const slide = HERO_SLIDES[index];
  return (
    <Box className={styles.heroContainer}>
      <AnimatePresence mode="wait">
        <motion.div
           key={index}
           initial={{ opacity: 0, scale: 1.02 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0, scale: 0.98 }}
           transition={{ duration: 0.6 }}
           style={{ minHeight: 480, background: slide.gradient, color: "#fff", display: "flex", alignItems: "center", padding: "60px", position: 'relative' }}
        >
           <Container maxWidth="xl">
             <Stack spacing={3} maxWidth="lg">
               <Typography variant="overline" sx={{ letterSpacing: 4, fontWeight: 800, opacity: 0.6 }}>THE DRUMMER'S CHOICE</Typography>
               <Typography variant="h1" fontWeight={900} sx={{ fontSize: { xs: '3rem', md: '5.2rem' }, lineHeight: 1 }}>{slide.title}</Typography>
               <Typography variant="h5" sx={{ opacity: 0.8, maxWidth: 700, fontWeight: 300, lineHeight: 1.5 }}>{slide.subtitle}</Typography>
               <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
                  <Button variant="contained" size="large" sx={{ bgcolor: 'var(--color-accent-gold)', color: '#000', fontWeight: 900, px: 6, py: 1.5, borderRadius: 3 }}>Shop Collections</Button>
                  <Button variant="outlined" size="large" sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', px: 6, py: 1.5, borderRadius: 3 }}>View Gear</Button>
               </Stack>
             </Stack>
           </Container>

           <Stack direction="row" spacing={2} sx={{ position: 'absolute', bottom: 40, right: 60 }}>
              <IconButton onClick={() => setIndex((i) => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)} sx={{ color: "#fff", border: '1px solid rgba(255,255,255,0.2)' }}><ChevronLeft /></IconButton>
              <IconButton onClick={() => setIndex((i) => (i + 1) % HERO_SLIDES.length)} sx={{ color: "#fff", border: '1px solid rgba(255,255,255,0.2)' }}><ChevronRight /></IconButton>
           </Stack>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <Box sx={{ mb: 4 }}>
       <Typography sx={{ color: 'var(--color-brand)', fontWeight: 900, fontSize: '0.85rem', letterSpacing: 2, textTransform: 'uppercase', mb: 1 }}>Recommended</Typography>
       <Typography variant="h3" fontWeight={900} sx={{ mb: 1, fontSize: '2.4rem' }}>{title}</Typography>
       {subtitle && <Typography variant="h6" sx={{ opacity: 0.5, fontWeight: 400 }}>{subtitle}</Typography>}
    </Box>
  );
}

export default function Home() {
  const products = MOCK_PRODUCTS;
  const [tab, setTab] = useState(0);
  const onSale = useMemo(() => products.filter((p) => p.discountPercent > 0), [products]);

  return (
    <motion.div className={cx("homeWrapper")} initial="hidden" animate="visible" variants={containerVariants}>
      <motion.div className={cx("bgDecoration", "blob1")} variants={blobVariants} animate="animate" />
      <motion.div className={cx("bgDecoration", "blob3")} variants={blobVariants} animate="animate" style={{ bottom: '10%', right: '20%', background: 'var(--color-brand)', opacity: 0.05 }} />

      <Box component="main" className={cx("homeContent")}>
        <Box component="section" className={cx("heroSection")}><HeroBanner /></Box>

        <motion.section className={cx("section")} variants={sectionVariants}>
          <Container maxWidth="xl">
            <Stack direction="row" justifyContent="space-between" alignItems="flex-end" mb={4}>
               <SectionHeader title="Flash Sales" subtitle="Premium gear at insider prices." />
               <Button variant="text" sx={{ fontWeight: 900, mb: 1, color: 'var(--color-brand)' }}>Show All →</Button>
            </Stack>
            <Stack direction="row" gap={4} sx={{ overflowX: "auto", pb: 4, px: 1 }}>
              {onSale.map((p) => <ProductMiniCard key={p.id} product={p} />)}
            </Stack>
          </Container>
        </motion.section>

        <motion.section className={cx("section")} variants={sectionVariants}>
          <Container maxWidth="xl">
            <SectionHeader title="Featured Gear" />
            <Tabs 
               value={tab} 
               onChange={(_, v) => setTab(v)} 
               sx={{ 
                 mb: 6,
                 '& .MuiTabs-indicator': { bgcolor: 'var(--color-brand)', height: 4, borderRadius: 2 },
                 '& .MuiTab-root': { fontWeight: 800, textTransform: 'none', fontSize: '1.2rem', color: 'rgba(0,0,0,0.5)', px: 4 },
                 '& .MuiTab-root.Mui-selected': { color: 'var(--color-brand)' }
               }}
            >
               <Tab label="Top Rated" />
               <Tab label="Best Sellers" />
            </Tabs>
            <Stack direction="row" gap={4} sx={{ overflowX: "auto", pb: 4, px: 1 }}>
              {products.map((p) => <ProductMiniCard key={p.id} product={p} />)}
            </Stack>
          </Container>
        </motion.section>

        <motion.section className={cx("section")} variants={sectionVariants}>
           <Container maxWidth="xl">
             <SectionHeader title="Rhythm Academy" subtitle="Pro tips for your next session." />
             <Grid container spacing={4} sx={{ mt: 2 }}>
                {MOCK_TIPS.map((tip) => (
                  <Grid item xs={12} md={4} key={tip.id}>
                    <motion.div whileHover={{ y: -8 }}>
                      <Card className={cx("premiumCard")} sx={{ height: '100%', p: 4 }}>
                         <Chip label={tip.tag} size="small" sx={{ mb: 2, fontWeight: 800 }} />
                         <Typography variant="h5" fontWeight={900} gutterBottom>{tip.title}</Typography>
                         <Typography variant="body2" sx={{ opacity: 0.6, lineHeight: 1.8 }}>{tip.desc}</Typography>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
             </Grid>
           </Container>
        </motion.section>

        <motion.section className={cx("section")} variants={sectionVariants}>
          <Box className={cx("servicesGrid")}>
            {SERVICE_ITEMS.map(({ icon: Icon, title, desc }) => (
              <Box key={title} className={cx("serviceItem")}>
                <Icon sx={{ color: 'var(--color-brand)', mb: 2, fontSize: '2.5rem' }} />
                <Typography variant="h6" fontWeight={800}>{title}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.6 }}>{desc}</Typography>
              </Box>
            ))}
          </Box>
        </motion.section>

        <motion.section className={cx("section")} variants={sectionVariants} style={{ padding: '60px 0' }}>
          <Container maxWidth="xl">
            <Card sx={{ p: { xs: 6, md: 10 }, borderRadius: 8, textAlign: 'center', bgcolor: '#1a1a1a', color: '#fff', position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', top: -100, left: -100, width: 300, height: 300, bgcolor: 'var(--color-brand)', opacity: 0.1, borderRadius: '50%' }} />
                <Typography variant="h2" fontWeight={900} gutterBottom sx={{ fontSize: { xs: '2.5rem', md: '4rem' } }}>The Drumify Newsletter</Typography>
                <Typography variant="h6" sx={{ opacity: 0.6, mb: 6 }}>Join 50k+ drummers for exclusive deals and setup tips.</Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center" maxWidth="sm" sx={{ margin: '0 auto' }}>
                  <TextField fullWidth placeholder="Enter your email" sx={{ bgcolor: '#fff', borderRadius: 2 }} />
                  <Button variant="contained" size="large" sx={{ bgcolor: 'var(--color-brand)', px: 6, fontWeight: 900 }}>Subscribe</Button>
                </Stack>
            </Card>
          </Container>
        </motion.section>
      </Box>
    </motion.div>
  );
}

// Fixed missing Grid import by adding it to MUI block
function Grid({ children, container, item, spacing, xs, md }) {
  return (
    <Box sx={{ 
      display: container ? 'flex' : 'block', 
      flexWrap: container ? 'wrap' : 'nowrap',
      m: container ? -(spacing || 0) * 0.5 : 0,
      width: item ? (md ? `${(md/12)*100}%` : (xs ? `${(xs/12)*100}%` : 'auto')) : 'auto',
      p: (spacing || 0) * 0.5
    }}>
      {children}
    </Box>
  );
}
