import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Box,
  Rating,
  Divider,
  Chip,
  IconButton,
  Skeleton,
  Breadcrumbs,
  Link,
  Alert,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  Paper,
  Grid
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import HistoryIcon from "@mui/icons-material/History";
import { motion } from "framer-motion";
import { fetchStoreProductBySlug } from "../../services/storeService";
import { addItemToCart } from "../../services/cartService";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeMedia, setActiveMedia] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await fetchStoreProductBySlug(slug);
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          const defaultVariant = data.variants.find((v) => v.isDefault) || data.variants[0];
          setSelectedVariant(defaultVariant);
        }
      } catch (error) {
        console.error("Failed to load product", error);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    try {
      await addItemToCart(selectedVariant.id, quantity);
      setAlert({ open: true, message: "Đã thêm sản phẩm vào giỏ hàng!", severity: "success" });
    } catch (error) {
      setAlert({ open: true, message: "Không thể thêm vào giỏ hàng. Vui lòng thử lại.", severity: "error" });
    }
  };

  const handleQuantityChange = (val) => {
    if (val < 1) return;
    setQuantity(val);
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'var(--color-bg-deep)', py: 8 }}>
        <Container maxWidth="xl">
          <Grid container spacing={8}>
            <Grid size={{ xs: 12, lg: 7 }}>
              <Skeleton variant="rectangular" height={600} sx={{ borderRadius: '40px' }} />
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                {[1, 2, 3, 4].map(i => <Skeleton key={i} variant="rectangular" width={100} height={100} sx={{ borderRadius: '16px' }} />)}
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Skeleton variant="text" width="30%" height={30} />
              <Skeleton variant="text" width="80%" height={60} />
              <Skeleton variant="text" width="40%" height={40} />
              <Skeleton variant="rectangular" height={150} sx={{ my: 4, borderRadius: '24px' }} />
              <Skeleton variant="rectangular" height={60} sx={{ borderRadius: '16px' }} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-deep)' }}>
        <Container sx={{ textAlign: "center" }}>
          <Typography variant="h4" fontWeight={900} sx={{ color: 'var(--color-text-main)', mb: 2 }}>Sản phẩm không tồn tại</Typography>
          <Button variant="contained" onClick={() => navigate("/")} sx={{ bgcolor: 'var(--color-accent-gold)', color: '#000', borderRadius: '12px' }}>Quay lại trang chủ</Button>
        </Container>
      </Box>
    );
  }

  const mediaList = product.media && product.media.length > 0 
    ? product.media 
    : [{ mediaUrl: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&q=80&w=800", mediaType: "IMAGE" }];
  
  const currentMedia = mediaList[activeMedia];

  return (
    <Box sx={{ minHeight: '100vh', background: 'var(--color-bg-deep)', py: 6, position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'fixed', inset: 0, background: 'var(--gradient-mesh)', zIndex: 0, opacity: 0.3 }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Breadcrumbs sx={{ mb: 4, '& .MuiBreadcrumbs-separator': { color: 'var(--color-text-dim)' } }}>
          <Link underline="hover" color="var(--color-text-dim)" href="/" sx={{ fontWeight: 600 }}>Home</Link>
          <Link underline="hover" color="var(--color-text-dim)" href="/products" sx={{ fontWeight: 600 }}>Catalog</Link>
          <Typography color="var(--color-text-main)" fontWeight={700}>{product.name}</Typography>
        </Breadcrumbs>

        <Grid container spacing={10}>
          {/* Left: Media Gallery (7/12) */}
          <Grid size={{ xs: 12, lg: 7 }}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              <Paper 
                component={motion.div}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                sx={{ 
                  borderRadius: '40px', 
                  overflow: 'hidden', 
                  bgcolor: 'var(--color-bg-glass)', 
                  border: '1px solid var(--color-border-glass)',
                  aspectRatio: '1/1',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {currentMedia.mediaType === 'VIDEO' ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={currentMedia.mediaUrl.includes('youtube.com') ? currentMedia.mediaUrl.replace('watch?v=', 'embed/') : currentMedia.mediaUrl}
                    title="Product Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ position: 'absolute', inset: 0 }}
                  />
                ) : (
                  <img 
                    src={currentMedia.mediaUrl} 
                    alt={product.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                )}
                
                <IconButton 
                  onClick={() => setActiveMedia(prev => (prev - 1 + mediaList.length) % mediaList.length)}
                  sx={{ position: 'absolute', left: 20, bgcolor: 'rgba(255,255,255,0.1)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                >
                  <ArrowBackIosNewIcon />
                </IconButton>
                <IconButton 
                  onClick={() => setActiveMedia(prev => (prev + 1) % mediaList.length)}
                  sx={{ position: 'absolute', right: 20, bgcolor: 'rgba(255,255,255,0.1)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                >
                  <ArrowForwardIosIcon />
                </IconButton>
              </Paper>

              <Stack direction="row" spacing={2} sx={{ mt: 3, overflowX: 'auto', pb: 2, '&::-webkit-scrollbar': { height: 4 } }}>
                {mediaList.map((m, idx) => (
                  <Box 
                    key={idx}
                    onClick={() => setActiveMedia(idx)}
                    sx={{ 
                      width: 100, 
                      height: 100, 
                      flexShrink: 0, 
                      borderRadius: '16px', 
                      overflow: 'hidden', 
                      cursor: 'pointer',
                      border: '2px solid',
                      borderColor: activeMedia === idx ? 'var(--color-accent-gold)' : 'var(--color-border-glass)',
                      opacity: activeMedia === idx ? 1 : 0.6,
                      transition: 'all 0.2s',
                      position: 'relative'
                    }}
                  >
                    {m.mediaType === 'VIDEO' ? (
                      <Box sx={{ width: '100%', height: '100%', bgcolor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <PlayCircleOutlineIcon sx={{ color: 'white', fontSize: '2rem' }} />
                      </Box>
                    ) : (
                      <img src={m.mediaUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>
          </Grid>

          {/* Right: Product Info (5/12) */}
          <Grid size={{ xs: 12, lg: 5 }}>
            <Stack spacing={4}>
              <Box>
                <Typography variant="overline" sx={{ color: 'var(--color-accent-gold)', fontWeight: 800, letterSpacing: 4 }}>
                  {product.brandName || "MASTER SERIES"}
                </Typography>
                <Typography variant="h2" fontWeight={900} sx={{ color: 'var(--color-text-main)', lineHeight: 1, my: 1, fontSize: { xs: '3rem', md: '4rem' } }}>
                  {product.name}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Rating value={5} readOnly size="small" />
                  <Typography variant="body2" sx={{ color: 'var(--color-text-dim)', fontWeight: 600 }}>4.9 • 248 reviews</Typography>
                  <Chip label="In Stock" size="small" sx={{ bgcolor: 'rgba(76, 175, 80, 0.1)', color: '#4caf50', fontWeight: 800 }} />
                </Stack>
              </Box>

              <Typography variant="h3" fontWeight={900} sx={{ color: 'var(--color-text-main)' }}>
                {selectedVariant?.price?.toLocaleString()} <Typography component="span" variant="h5" sx={{ verticalAlign: 'top', fontWeight: 900 }}>VND</Typography>
              </Typography>

              <Paper sx={{ p: 4, bgcolor: 'var(--color-bg-glass)', border: '1px solid var(--color-border-glass)', borderRadius: '32px', backdropFilter: 'blur(10px)' }}>
                 <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'var(--color-text-main)', mb: 2.5 }}>Configure Options</Typography>
                 <Stack direction="row" spacing={2} flexWrap="wrap">
                    {product.variants.map((v) => (
                      <Chip 
                        key={v.id}
                        label={v.name}
                        onClick={() => setSelectedVariant(v)}
                        sx={{ 
                          height: 'auto',
                          py: 2, px: 3, 
                          borderRadius: '16px',
                          border: '2px solid',
                          borderColor: selectedVariant?.id === v.id ? 'var(--color-accent-gold)' : 'var(--color-border-glass)',
                          bgcolor: selectedVariant?.id === v.id ? 'rgba(212,175,55,0.05)' : 'transparent',
                          color: selectedVariant?.id === v.id ? 'var(--color-text-main)' : 'var(--color-text-dim)',
                          fontWeight: 700,
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', borderColor: 'var(--color-accent-gold)' }
                        }}
                      />
                    ))}
                 </Stack>

                 <Stack direction="row" spacing={3} sx={{ mt: 5 }} alignItems="center">
                    <Stack direction="row" alignItems="center" sx={{ bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)', borderRadius: '16px', p: 1 }}>
                       <IconButton onClick={() => handleQuantityChange(quantity - 1)} sx={{ color: 'var(--color-text-main)' }}><RemoveIcon /></IconButton>
                       <Typography sx={{ px: 3, fontWeight: 900, fontSize: '1.2rem', color: 'var(--color-text-main)' }}>{quantity}</Typography>
                       <IconButton onClick={() => handleQuantityChange(quantity + 1)} sx={{ color: 'var(--color-text-main)' }}><AddIcon /></IconButton>
                    </Stack>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      onClick={handleAddToCart}
                      startIcon={<ShoppingCartIcon />}
                      sx={{ 
                        py: 2.5, 
                        borderRadius: '16px', 
                        bgcolor: 'var(--color-accent-gold)', 
                        color: '#000', 
                        fontWeight: 900,
                        fontSize: '1.1rem',
                        '&:hover': { bgcolor: '#fff', transform: 'translateY(-3px)' }
                      }}
                    >
                      MUA NGAY
                    </Button>
                 </Stack>
              </Paper>

              <Box>
                <Grid container spacing={2}>
                  {[
                    { icon: LocalShippingIcon, title: "Free Shipping", sub: "On orders over 5M VND" },
                    { icon: VerifiedUserIcon, title: "12 Month Warranty", sub: "Original parts & labor" },
                    { icon: HistoryIcon, title: "30-Day Returns", sub: "Easy hassle-free process" }
                  ].map((feat, idx) => (
                    <Grid size={12} key={idx}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <feat.icon sx={{ color: 'var(--color-accent-gold)' }} />
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'var(--color-text-main)' }}>{feat.title}</Typography>
                          <Typography variant="caption" sx={{ color: 'var(--color-text-dim)' }}>{feat.sub}</Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Divider sx={{ borderColor: 'var(--color-border)' }} />

              <Box>
                <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 3, '& .MuiTabs-indicator': { bgcolor: 'var(--color-accent-gold)' } }}>
                  <Tab label="Mô tả" sx={{ fontWeight: 800, color: 'var(--color-text-dim)', '&.Mui-selected': { color: 'var(--color-text-main)' } }} />
                  <Tab label="Thông số kĩ thuật" sx={{ fontWeight: 800, color: 'var(--color-text-dim)', '&.Mui-selected': { color: 'var(--color-text-main)' } }} />
                </Tabs>
                
                {tabValue === 0 && (
                  <Typography variant="body1" sx={{ color: 'var(--color-text-dim)', lineHeight: 1.8, fontSize: '1.05rem' }}>
                    {product.shortDescription || "Masterful craftsmanship meets acoustic innovation. The Drumify Master Series provides unmatched tonal depth and stage presence."}
                    <br/><br/>
                    {product.description && <div dangerouslySetInnerHTML={{ __html: product.description }} />}
                  </Typography>
                )}

                {tabValue === 1 && (
                  <Stack spacing={1.5}>
                    <SpecRow label="Xuất xứ" value={product.origin || "Japan"} />
                    <SpecRow label="Chất liệu" value="Premium Aged Birch" />
                    <SpecRow label="Phụ kiện" value="Mounting hardware included" />
                    <SpecRow label="Trọng lượng" value={`${product.weight} kg`} />
                    <SpecRow label="Kích thước" value={`${product.length} x ${product.width} x ${product.height} cm`} />
                  </Stack>
                )}
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={alert.severity} variant="filled" sx={{ borderRadius: '12px', fontWeight: 700 }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

function SpecRow({ label, value }) {
  return (
    <Stack direction="row" justifyContent="space-between" sx={{ borderBottom: '1px solid var(--color-border)', pb: 1 }}>
      <Typography sx={{ color: 'var(--color-text-dim)', fontSize: '0.9rem' }}>{label}</Typography>
      <Typography sx={{ color: 'var(--color-text-main)', fontWeight: 700, fontSize: '0.9rem' }}>{value}</Typography>
    </Stack>
  );
}

export default ProductDetail;
