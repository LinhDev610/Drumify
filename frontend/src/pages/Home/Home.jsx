import { useEffect, useMemo, useState } from "react";
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
import CategoryGrid from "../../component/CategoryGrid/CategoryGrid";
import styles from "./Home.module.scss";

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

const MOCK_BRANDS = ["Pearl", "Zildjian", "DW", "Sabian", "Tama", "Yamaha", "Gretsch", "Meinl"];

const MOCK_TIPS = [
  {
    id: "t1",
    title: "Tuning for stage volume",
    description: "Seat the head, then tune in small quarter turns for even pitch.",
    tag: "Drums",
  },
  {
    id: "t2",
    title: "Cymbal wash vs stick definition",
    description: "Heavier rides cut through; thinner crashes open faster for accents.",
    tag: "Cymbals",
  },
  {
    id: "t3",
    title: "Pedal spring tension",
    description: "Match beater height to your ankle motion to avoid early fatigue.",
    tag: "Hardware",
  },
];

const MOCK_REVIEWS = [
  { id: "r1", author: "Alex M.", quote: "The Pearl snare arrived dialed in—minimal tuning for rehearsal.", rating: 5 },
  { id: "r2", author: "Jordan K.", quote: "Cymbal pack was packed well; no keyholing, sounds balanced.", rating: 5 },
  { id: "r3", author: "Sam R.", quote: "Fast delivery on hardware; stands are stable at full extension.", rating: 4 },
];

const MOCK_VOUCHERS = [
  { id: "v1", code: "BEAT10", label: "10% off hardware", expires: "2026-06-01" },
  { id: "v2", code: "CYM20", label: "$20 off cymbals $200+", expires: "2026-05-15" },
  { id: "v3", code: "STICKS", label: "Free stick pack over $150", expires: "2026-04-30" },
];

const HERO_SLIDES = [
  {
    title: "Stage-ready acoustic kits",
    subtitle: "Shell packs, snares, and hardware curated for gigging drummers.",
  },
  {
    title: "Cymbals that cut through the mix",
    subtitle: "Rides, crashes, and hi-hats from makers you trust.",
  },
  {
    title: "Percussion for every groove",
    subtitle: "Cajóns, hand drums, and accessories for practice and performance.",
  },
];

const SERVICE_ITEMS = [
  { icon: LocalShipping, title: "Fast shipping", desc: "Tracked delivery on kits & fragile cymbals" },
  { icon: Security, title: "Authentic gear", desc: "Authorized dealers, serial-checked where applicable" },
  { icon: SupportAgent, title: "Drummer support", desc: "Setup help from players, not scripts" },
  { icon: Autorenew, title: "Easy returns", desc: "30-day return window on unplayed stock" },
  { icon: Payment, title: "Flexible pay", desc: "Major cards & digital wallets" },
];

function formatPrice(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function ProductMiniCard({ product }) {
  const hasDiscount = product.discountPercent > 0 && product.originalPrice > product.price;
  return (
    <Card variant="outlined" sx={{ width: 220, flexShrink: 0 }}>
      <CardMedia
        component="div"
        sx={{
          height: 120,
          bgcolor: "grey.200",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {product.brand}
        </Typography>
      </CardMedia>
      <CardContent sx={{ pt: 1.5, pb: 1.5 }}>
        <Typography variant="subtitle2" fontWeight={600} noWrap>
          {product.name}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
          {product.brand}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
          <Typography variant="body2" fontWeight={700}>
            {formatPrice(product.price)}
          </Typography>
          {hasDiscount && (
            <Typography variant="caption" color="text.secondary" sx={{ textDecoration: "line-through" }}>
              {formatPrice(product.originalPrice)}
            </Typography>
          )}
          {hasDiscount && <Chip size="small" color="error" label={`-${product.discountPercent}%`} />}
        </Stack>
        <Typography variant="caption" color="text.secondary">
          ★ {product.rating} · {product.sold} sold
        </Typography>
      </CardContent>
    </Card>
  );
}

function HeroBanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  const slide = HERO_SLIDES[index];

  return (
    <Box className={styles.bannerSlide}>
      <Container maxWidth="md">
        <Stack spacing={2} alignItems="center" textAlign="center">
          <Typography variant="h3" component="h1" fontWeight={700}>
            {slide.title}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            {slide.subtitle}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton aria-label="Previous slide" onClick={() => setIndex((i) => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)} sx={{ color: "#fff" }}>
              <ChevronLeft />
            </IconButton>
            <IconButton aria-label="Next slide" onClick={() => setIndex((i) => (i + 1) % HERO_SLIDES.length)} sx={{ color: "#fff" }}>
              <ChevronRight />
            </IconButton>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

function CategoryGridSection() {
  return (
    <Box sx={{ py: 2 }}>
      <Container maxWidth="lg">
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Shop by category
        </Typography>
      </Container>
      <CategoryGrid />
    </Box>
  );
}

function SpotlightCollectionSection() {
  const lineup = useMemo(() => MOCK_PRODUCTS.slice(0, 3), []);
  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Spotlight collection
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Hand-picked shells and cymbals for recording and live rooms—starting with our featured snare.
      </Typography>
      <Stack direction="row" gap={2} sx={{ overflowX: "auto", pb: 1 }}>
        {lineup.map((p) => (
          <ProductMiniCard key={p.id} product={p} />
        ))}
      </Stack>
    </Container>
  );
}

function FlashSaleSection({ products }) {
  const onSale = useMemo(() => products.filter((p) => p.discountPercent > 0), [products]);
  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={600}>
          Flash deals
        </Typography>
        <Chip label="Mock sale" size="small" />
      </Stack>
      <Stack direction="row" gap={2} sx={{ overflowX: "auto", pb: 1 }}>
        {onSale.map((p) => (
          <ProductMiniCard key={p.id} product={p} />
        ))}
      </Stack>
    </Container>
  );
}

function FeaturedBrandsSection({ products }) {
  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Brands drummers rely on
      </Typography>
      <Stack direction="row" flexWrap="wrap" gap={1} useFlexGap sx={{ mb: 2 }}>
        {MOCK_BRANDS.map((b) => (
          <Chip key={b} label={b} variant="filled" color="default" />
        ))}
      </Stack>
      <Stack direction="row" gap={2} sx={{ overflowX: "auto", pb: 1 }}>
        {products.map((p) => (
          <ProductMiniCard key={p.id} product={p} />
        ))}
      </Stack>
    </Container>
  );
}

function ProductTabsSection({ products }) {
  const [tab, setTab] = useState(0);
  const favorites = useMemo(() => products.filter((p) => p.rating >= 4.85), [products]);
  const bestsellers = useMemo(() => [...products].sort((a, b) => b.sold - a.sold), [products]);
  const newest = useMemo(() => [...products].reverse(), [products]);

  const panels = [favorites, bestsellers, newest];
  const labels = ["Top rated", "Best sellers", "New on the floor"];

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Featured gear
      </Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        {labels.map((label, i) => (
          <Tab key={label} label={label} id={`home-tab-${i}`} aria-controls={`home-tabpanel-${i}`} />
        ))}
      </Tabs>
      <Box role="tabpanel" id={`home-tabpanel-${tab}`} aria-labelledby={`home-tab-${tab}`}>
        <Stack direction="row" gap={2} sx={{ overflowX: "auto", pb: 1 }}>
          {panels[tab].map((p) => (
            <ProductMiniCard key={p.id} product={p} />
          ))}
        </Stack>
      </Box>
    </Container>
  );
}

function RhythmTipsSection() {
  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Rhythm corner
      </Typography>
      <Stack spacing={2}>
        {MOCK_TIPS.map((tip) => (
          <Card key={tip.id} variant="outlined">
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {tip.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tip.description}
                  </Typography>
                </Box>
                <Chip label={tip.tag} size="small" />
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}

function ReviewsSection() {
  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Drummers say
      </Typography>
      <Stack direction={{ xs: "column", md: "row" }} gap={2}>
        {MOCK_REVIEWS.map((r) => (
          <Card key={r.id} variant="outlined" sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="body1" fontStyle="italic" paragraph>
                “{r.quote}”
              </Typography>
              <Typography variant="subtitle2">{r.author}</Typography>
              <Typography variant="caption" color="text.secondary">
                {r.rating} / 5
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}

function VoucherStripSection() {
  return (
    <Container maxWidth="lg" sx={{ py: 1 }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Promos (mock)
      </Typography>
      <Box className={styles.voucherTrack}>
        {MOCK_VOUCHERS.map((v) => (
          <Card key={v.id} variant="outlined" sx={{ minWidth: 240, flexShrink: 0, bgcolor: "grey.50" }}>
            <CardContent>
              <Typography variant="overline" color="primary">
                {v.code}
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {v.label}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Ends {v.expires}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
}

function ServicesSection() {
  return (
    <Box className={styles.servicesGrid}>
      {SERVICE_ITEMS.map(({ icon: Icon, title, desc }) => (
        <Box key={title} className={styles.serviceItem}>
          <Box className={styles.serviceIcon} aria-hidden>
            <Icon fontSize="inherit" sx={{ fontSize: 40 }} />
          </Box>
          <Box>
            <Typography className={styles.serviceTitle}>{title}</Typography>
            <Typography className={styles.serviceDesc}>{desc}</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

function NewsletterSection() {
  const [email, setEmail] = useState("");
  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom textAlign="center">
        Get restock alerts & clinic dates
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
        <TextField fullWidth size="small" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@band.com" />
        <Button variant="contained" sx={{ flexShrink: 0 }}>
          Notify me
        </Button>
      </Stack>
    </Container>
  );
}

export default function Home() {
  const products = MOCK_PRODUCTS;

  return (
    <Box className={styles.homeWrapper}>
      <Box component="main" className={styles.homeContent}>
        <Box component="section" className={styles.heroSection}>
          <Box className={styles.heroContainer}>
            <HeroBanner />
          </Box>
        </Box>

        <Box component="section" className={styles.section}>
          <CategoryGridSection />
        </Box>

        <Box component="section" className={styles.section}>
          <SpotlightCollectionSection />
        </Box>

        <Box component="section" className={styles.section}>
          <FlashSaleSection products={products} />
        </Box>

        <Box component="section" className={styles.section}>
          <FeaturedBrandsSection products={products} />
        </Box>

        <Box component="section" className={styles.section}>
          <ProductTabsSection products={products} />
        </Box>

        <Box component="section" className={styles.section}>
          <RhythmTipsSection />
        </Box>

        <Box component="section" className={styles.section}>
          <ReviewsSection />
        </Box>

        <Box component="section" className={`${styles.section} ${styles.voucherSection}`}>
          <VoucherStripSection />
        </Box>

        <Box component="section" className={`${styles.section} ${styles.servicesSection}`}>
          <ServicesSection />
        </Box>

        <Box component="section" className={styles.section}>
          <NewsletterSection />
        </Box>
      </Box>
    </Box>
  );
}
