import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
  Grid
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  fetchInventory,
  updateInventoryThreshold,
  fetchSuppliers,
  fetchCategories,
  createCategory,
  updateCategory,
  fetchWarehouseProducts,
  createWarehouseProduct,
  updateWarehouseProduct,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  importStock,
  fetchMovements,
  fetchOrdersByStatus,
  confirmOrder,
  cancelOrder,
  createShipmentOrder,
  fetchShipments,
  syncShipmentByOrder,
  updateShipment,
  fetchWarehouseReport,
  deleteWarehouseProduct,
  updateWarehouseProductStatus,
  updateCategoryStatus,
  fetchBrands,
  createBrand,
  updateBrand,
  deleteBrand
} from "../../../services/warehouseService";
import { getErrorMessage } from "../../../hooks/utils/unwrapApiResponse";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import SearchIcon from "@mui/icons-material/Search";
import { uploadToCloudinary } from "../../../services/imageService";
import { IconButton, InputAdornment } from "@mui/material";

const WH_TAB_CONFIG = [
  { label: "Sản phẩm", path: "/admin/products" },
  { label: "Danh mục", path: "/admin/categories" },
  { label: "Tồn kho", path: "/admin/inventory" },
  { label: "Nhập hàng", path: "/admin/inventory/import" },
  { label: "Xử lý đơn hàng", path: "/admin/orders" },
  { label: "Nhà cung cấp", path: "/admin/inventory/suppliers" },
  { label: "Nhãn hiệu", path: "/admin/brands" },
  { label: "Báo cáo kho", path: "/admin/inventory/reports" }
];

const MOVEMENT_LABELS = {
  IMPORT: "Nhập NCC",
  EXPORT_MANUAL: "Xuất thủ công",
  ADJUSTMENT: "Kiểm kê",
  SALE_SHIP: "Bán hàng / Giao"
};

const SHIPMENT_STATUS_OPTS = ["CREATED", "PICKED_UP", "IN_TRANSIT", "DELIVERED", "FAILED", "CANCELLED"];

const STATUS_LABELS = {
  PENDING: { label: "Chờ duyệt", color: "info" },
  APPROVED: { label: "Hoạt động", color: "success" },
  REJECTED: { label: "Từ chối", color: "error" },
  HIDDEN: { label: "Đã ẩn", color: "warning" }
};

const STATUS_DISPLAY_TO_CODE = {
  "Chờ duyệt": "PENDING",
  "Đã duyệt": "APPROVED",
  "Từ chối": "REJECTED",
  "Vô hiệu hóa": "DISABLED",
  "Đã ẩn": "HIDDEN"
};

function normalizeProductStatus(rawStatus) {
  if (!rawStatus) return "PENDING";
  const normalized = String(rawStatus).trim();
  if (STATUS_LABELS[normalized]) return normalized;
  if (STATUS_DISPLAY_TO_CODE[normalized]) return STATUS_DISPLAY_TO_CODE[normalized];
  const upper = normalized.toUpperCase();
  if (STATUS_LABELS[upper]) return upper;
  return "PENDING";
}

function StatMini({ title, value }) {
  return (
    <Card variant="outlined" sx={{ bgcolor: "rgba(255,255,255,0.02)", borderColor: "var(--color-border)" }}>
      <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Typography variant="caption" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

function CategoriesTab() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    status: true,
    parentCategoryId: "",
    taxRate: ""
  });

  const load = useCallback(async () => {
    setErr("");
    try {
      setRows(await fetchCategories());
    } catch (e) {
      setErr(getErrorMessage(e, "Không tải danh mục."));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;
    const s = search.toLowerCase();
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(s) || (r.description && r.description.toLowerCase().includes(s))
    );
  }, [rows, search]);

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", description: "", status: true, parentCategoryId: "", taxRate: "0" });
    setOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      name: row.name || "",
      description: row.description || "",
      status: row.status !== false,
      parentCategoryId: row.parentCategoryId || "",
      taxRate: row.taxRate ?? "0"
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.name.trim()) return;
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description || undefined,
        status: form.status,
        parentCategoryId: form.parentCategoryId || undefined,
        taxRate: form.taxRate === "" ? 0 : Number(form.taxRate)
      };
      if (editing) {
        await updateCategory(editing.id, payload);
      } else {
        await createCategory(payload);
      }
      setOpen(false);
      await load();
    } catch (e) {
      setErr(getErrorMessage(e, "Không lưu được danh mục."));
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateCategoryStatus(id, status);
      await load();
    } catch (e) {
      setErr(getErrorMessage(e, "Không cập nhật được trạng thái."));
    }
  };

  return (
    <Box>
      {err && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {err}
        </Alert>
      )}
      <Paper sx={{ p: 2, mb: 2, bgcolor: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)" }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button variant="contained" onClick={openNew}>Tạo danh mục</Button>
          <TextField
            size="small"
            placeholder="Tìm kiếm danh mục..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 300 }}
          />
        </Stack>
      </Paper>
      <TableContainer component={Paper} sx={{ bgcolor: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Tên danh mục</TableCell>
              <TableCell>Danh mục cha</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Mức thuế (%)</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((r) => (
              <TableRow key={r.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{r.name}</Typography>
                </TableCell>
                <TableCell>{r.parentCategoryName || "—"}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    color={r.status ? "success" : "warning"}
                    label={r.status ? "Hoạt động" : "Đã ẩn"}
                    sx={{ fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell>{r.taxRate ?? 0}%</TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button size="small" variant="outlined" onClick={() => openEdit(r)}>Sửa</Button>
                    {r.status ? (
                      <Button size="small" color="warning" onClick={() => handleStatusChange(r.id, false)}>Ẩn</Button>
                    ) : (
                      <Button size="small" color="success" onClick={() => handleStatusChange(r.id, true)}>Hiện</Button>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 0.5 }}>
            <TextField
              label="Tên danh mục"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              fullWidth
              required
            />
            <FormControl fullWidth size="small">
              <InputLabel>Danh mục cha (tuỳ chọn)</InputLabel>
              <Select
                label="Danh mục cha (tuỳ chọn)"
                value={form.parentCategoryId}
                onChange={(e) => setForm((p) => ({ ...p, parentCategoryId: e.target.value }))}
              >
                <MenuItem value=""><em>Không có</em></MenuItem>
                {rows
                  .filter((r) => !editing || r.id !== editing.id)
                  .map((r) => (
                    <MenuItem key={r.id} value={r.id}>
                      {r.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <TextField
              label="Mô tả"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              fullWidth
              multiline
              minRows={2}
            />
            <TextField
              label="Mức thuế (%)"
              type="number"
              value={form.taxRate}
              onChange={(e) => setForm((p) => ({ ...p, taxRate: e.target.value }))}
              fullWidth
              size="small"
              inputProps={{ min: 0, max: 100, step: 0.1 }}
            />
            <FormControl fullWidth size="small">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                label="Trạng thái"
                value={String(form.status)}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value === "true" }))}
              >
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={save}>Lưu</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function ProductsTab() {
  const [rows, setRows] = useState([]);
  const [categories, setCategories] = useState([]);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    shortDescription: "",
    description: "",
    origin: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    variants: [{ name: "Default", purchasePrice: "", unitPrice: "", price: "", isDefault: true }],
    media: [] // { mediaUrl, mediaType, isDefault }
  });

  const load = useCallback(async () => {
    setErr("");
    try {
      const [products, cats] = await Promise.all([fetchWarehouseProducts(), fetchCategories()]);
      setRows(products);
      setCategories(cats);
    } catch (e) {
      setErr(getErrorMessage(e, "Không tải được sản phẩm."));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;
    const s = search.toLowerCase();
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(s) ||
        (r.categoryName && r.categoryName.toLowerCase().includes(s))
    );
  }, [rows, search]);

  const openNew = () => {
    setEditing(null);
    setForm({
      name: "",
      categoryId: "",
      shortDescription: "",
      description: "",
      origin: "",
      weight: "",
      length: "",
      width: "",
      height: "",
      variants: [{ name: "Default", purchasePrice: "", unitPrice: "", price: "", isDefault: true }],
      media: []
    });
    setOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      name: row.name || "",
      categoryId: row.categoryId || "",
      shortDescription: row.shortDescription || "",
      description: row.description || "",
      origin: row.origin || "",
      weight: row.weight ?? "",
      length: row.length ?? "",
      width: row.width ?? "",
      height: row.height ?? "",
      variants: (row.variants && row.variants.length > 0)
        ? row.variants.map((v) => ({
          name: v.name || "",
          purchasePrice: v.purchasePrice ?? "",
          unitPrice: v.unitPrice ?? "",
          price: v.price ?? "",
          isDefault: Boolean(v.isDefault)
        }))
        : [{ name: "Default", purchasePrice: "", unitPrice: "", price: "", isDefault: true }],
      media: (row.media && row.media.length > 0)
        ? row.media.map(m => ({
          mediaUrl: m.mediaUrl,
          mediaType: m.mediaType,
          isDefault: m.isDefault
        }))
        : []
    });
    setOpen(true);
  };

  const save = async () => {
    try {
      if (!form.name.trim()) throw new Error("Vui lòng nhập tên sản phẩm.");
      if (!form.categoryId) throw new Error("Vui lòng chọn danh mục.");
      if (form.variants.length === 0) throw new Error("Sản phẩm phải có ít nhất một biến thể.");

      form.variants.forEach((v, idx) => {
        if (!v.name.trim()) throw new Error(`Tên biến thể hàng ${idx + 1} không được để trống.`);
        if (v.purchasePrice === "" || Number(v.purchasePrice) < 0) throw new Error(`Giá nhập hàng ${idx + 1} phải >= 0.`);
        if (v.price === "" || Number(v.price) < 0) throw new Error(`Giá bán hàng ${idx + 1} phải >= 0.`);
      });

      const payload = {
        name: form.name.trim(),
        categoryId: form.categoryId,
        shortDescription: form.shortDescription || undefined,
        description: form.description || undefined,
        origin: form.origin || undefined,
        weight: form.weight === "" ? 0 : Number(form.weight),
        length: form.length === "" ? 0 : Number(form.length),
        width: form.width === "" ? 0 : Number(form.width),
        height: form.height === "" ? 0 : Number(form.height),
        variants: form.variants.map((v, idx) => ({
          name: String(v.name || "").trim(),
          purchasePrice: Number(v.purchasePrice),
          unitPrice: Number(v.unitPrice),
          price: Number(v.price),
          isDefault: idx === 0 ? true : Boolean(v.isDefault)
        })),
        media: form.media.map(m => ({
          mediaUrl: m.mediaUrl,
          mediaType: m.mediaType,
          isDefault: m.isDefault
        }))
      };
      if (editing) {
        await updateWarehouseProduct(editing.id, payload);
      } else {
        await createWarehouseProduct(payload);
      }
      setOpen(false);
      await load()
    } catch (e) {
      setErr(getErrorMessage(e, "Không lưu được sản phẩm."));
    }
  };

  const updateVariant = (index, key, value) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((v, i) => (i === index ? { ...v, [key]: value } : v))
    }));
  };

  const addVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, { name: "", purchasePrice: "", unitPrice: "", price: "", isDefault: false }]
    }));
  };

  const removeVariant = (index) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
    try {
      await deleteWarehouseProduct(id);
      await load();
    } catch (e) {
      setErr(getErrorMessage(e, "Không xóa được sản phẩm."));
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateWarehouseProductStatus(id, status);
      await load();
    } catch (e) {
      setErr(getErrorMessage(e, "Không cập nhật được trạng thái."));
    }
  };

  return (
    <Box>
      {err && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {err}
        </Alert>
      )}
      <Paper sx={{ p: 2, mb: 2, bgcolor: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)" }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button variant="contained" onClick={openNew}>Tạo sản phẩm mới</Button>
          <TextField
            size="small"
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 300 }}
          />
        </Stack>
      </Paper>

      <TableContainer component={Paper} sx={{ bgcolor: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell>Biến thể</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Cập nhật</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((r) => {
              const mainStatus = normalizeProductStatus(r.variants?.[0]?.status);
              const isHidden = mainStatus === "HIDDEN";
              const statusCfg = STATUS_LABELS[mainStatus] || { label: mainStatus, color: "default" };
              return (
                <TableRow key={r.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{r.name}</Typography>
                  </TableCell>
                  <TableCell>{r.categoryName || "—"}</TableCell>
                  <TableCell>{r.variants?.length || 0}</TableCell>
                  <TableCell>
                    <Chip size="small" label={statusCfg.label} color={statusCfg.color} sx={{ fontWeight: 500 }} />
                  </TableCell>
                  <TableCell>{r.updatedAt ? String(r.updatedAt).replace("T", " ").slice(0, 16) : "—"}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                      <Button size="small" variant="outlined" onClick={() => openEdit(r)}>Sửa</Button>

                      {isHidden ? (
                        <Button size="small" color="success" onClick={() => handleStatusChange(r.id, true)}>Hiện</Button>
                      ) : (
                        <Button size="small" color="warning" onClick={() => handleStatusChange(r.id, false)}>Ẩn</Button>
                      )}

                      <Button size="small" color="error" onClick={() => handleDelete(r.id)}>Xóa</Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? "Chỉnh sửa sản phẩm" : "Tạo sản phẩm mới"}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0.2 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="Tên sản phẩm" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} fullWidth required />
            </Grid>
            <Grid size={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Danh mục</InputLabel>
                <Select label="Danh mục" value={form.categoryId} onChange={(e) => {
                  const catId = e.target.value;
                  const cat = categories.find(c => c.id === catId);
                  const rate = cat?.taxRate || 0;
                  setForm((p) => ({
                    ...p,
                    categoryId: catId,
                    variants: p.variants.map(v => ({
                      ...v,
                      unitPrice: v.price ? (Number(v.price) * (1 + rate / 100)).toFixed(0) : v.unitPrice
                    }))
                  }));
                }}>
                  {categories.map((c) => (
                    <MenuItem key={c.id} value={c.id}>{c.name} ({c.taxRate ?? 0}%)</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={12}>
              <TextField label="Mô tả ngắn" value={form.shortDescription} onChange={(e) => setForm((p) => ({ ...p, shortDescription: e.target.value }))} fullWidth />
            </Grid>
            <Grid size={12}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 700 }}>Mô tả chi tiết</Typography>
              <Box sx={{ bgcolor: "white", color: "black", borderRadius: 1, overflow: "hidden" }}>
                <ReactQuill
                  theme="snow"
                  value={form.description}
                  onChange={(val) => setForm((p) => ({ ...p, description: val }))}
                  style={{ height: "200px", marginBottom: "42px" }}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}><TextField type="number" label="Weight (Kg)" value={form.weight} onChange={(e) => setForm((p) => ({ ...p, weight: e.target.value }))} fullWidth /></Grid>
            <Grid size={{ xs: 12, md: 3 }}><TextField type="number" label="Length (cm)" value={form.length} onChange={(e) => setForm((p) => ({ ...p, length: e.target.value }))} fullWidth /></Grid>
            <Grid size={{ xs: 12, md: 3 }}><TextField type="number" label="Width (cm)" value={form.width} onChange={(e) => setForm((p) => ({ ...p, width: e.target.value }))} fullWidth /></Grid>
            <Grid size={{ xs: 12, md: 3 }}><TextField type="number" label="Height (cm)" value={form.height} onChange={(e) => setForm((p) => ({ ...p, height: e.target.value }))} fullWidth /></Grid>

            <Grid size={12}>
              <Divider sx={{ my: 2 }} />
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Hình ảnh & Video</Typography>
                <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />} size="small">
                  Tải ảnh lên
                  <input type="file" hidden multiple accept="image/*" onChange={async (e) => {
                    const files = Array.from(e.target.files || []);
                    for (const file of files) {
                      try {
                        const url = await uploadToCloudinary(file);
                        if (url) {
                          setForm(prev => ({
                            ...prev,
                            media: [...prev.media, { mediaUrl: url, mediaType: 'IMAGE', isDefault: prev.media.length === 0 }]
                          }));
                        }
                      } catch (err) {
                        setErr("Không thể tải ảnh: " + file.name);
                      }
                    }
                  }} />
                </Button>
              </Stack>

              <Grid container spacing={2}>
                {form.media.filter(m => m.mediaType === 'IMAGE').map((m, idx) => (
                  <Grid size={{ xs: 4, md: 2 }} key={idx}>
                    <Box sx={{ position: 'relative', pt: '100%', border: '1px solid var(--color-border)', borderRadius: 2, overflow: 'hidden' }}>
                      <img src={m.mediaUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                      <IconButton
                        size="small"
                        onClick={() => setForm(prev => ({ ...prev, media: prev.media.filter((_, i) => i !== prev.media.indexOf(m)) }))}
                        sx={{ position: 'absolute', top: 2, right: 2, bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      {m.isDefault && (
                        <Chip label="Main" size="small" sx={{ position: 'absolute', bottom: 2, left: 2, scale: '0.8', bgcolor: 'var(--color-accent-gold)', color: '#000', fontWeight: 900 }} />
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Stack direction="row" spacing={2} sx={{ mt: 3 }} alignItems="flex-end">
                <TextField
                  fullWidth
                  size="small"
                  label="Video URL (YouTube/Cloudinary)"
                  placeholder="Dán link video tại đây..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const val = e.target.value.trim();
                      if (val) {
                        setForm(prev => ({
                          ...prev,
                          media: [...prev.media, { mediaUrl: val, mediaType: 'VIDEO', isDefault: false }]
                        }));
                        e.target.value = '';
                      }
                    }
                  }}
                />
                <Button variant="contained" onClick={(e) => {
                  const input = e.currentTarget.previousSibling.querySelector('input');
                  if (input.value) {
                    setForm(prev => ({
                      ...prev,
                      media: [...prev.media, { mediaUrl: input.value, mediaType: 'VIDEO', isDefault: false }]
                    }));
                    input.value = '';
                  }
                }}>Thêm</Button>
              </Stack>
              {form.media.filter(m => m.mediaType === 'VIDEO').map((v, idx) => (
                <Stack key={idx} direction="row" alignItems="center" spacing={2} sx={{ mt: 1, p: 1.5, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2, border: '1px solid var(--color-border)' }}>
                  <PlayCircleOutlineIcon sx={{ color: 'var(--color-accent-gold)' }} />
                  <Typography variant="body2" sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }} noWrap>{v.mediaUrl}</Typography>
                  <IconButton size="small" color="error" onClick={() => setForm(prev => ({ ...prev, media: prev.media.filter((_, i) => i !== prev.media.indexOf(v)) }))}><DeleteIcon fontSize="small" /></IconButton>
                </Stack>
              ))}
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Biến thể</Typography>
          <Stack spacing={1.5}>
            {form.variants.map((v, idx) => (
              <Box key={idx} sx={{ p: 2, border: "1px solid var(--color-border)", borderRadius: 1, bgcolor: "rgba(255,255,255,0.01)" }}>
                <Grid container spacing={1.5} alignItems="center">
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField label="Tên biến thể" value={v.name} onChange={(e) => updateVariant(idx, "name", e.target.value)} fullWidth size="small" />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField type="number" label="Giá nhập" value={v.purchasePrice} onChange={(e) => updateVariant(idx, "purchasePrice", e.target.value)} fullWidth size="small" />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                      type="number"
                      label="Giá bán (trước thuế)"
                      value={v.price}
                      onChange={(e) => {
                        const val = e.target.value;
                        const cat = categories.find((c) => c.id === form.categoryId);
                        const rate = cat?.taxRate || 0;
                        const unitPrice = val ? (Number(val) * (1 + rate / 100)).toFixed(0) : "";
                        setForm((prev) => ({
                          ...prev,
                          variants: prev.variants.map((varItem, i) => (i === idx ? { ...varItem, price: val, unitPrice } : varItem))
                        }));
                      }}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 1 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Default</InputLabel>
                      <Select
                        label="Default"
                        value={String(v.isDefault)}
                        onChange={(e) => updateVariant(idx, "isDefault", e.target.value === "true")}
                      >
                        <MenuItem value="true">Yes</MenuItem>
                        <MenuItem value="false">No</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 6, md: 1 }} sx={{ textAlign: "right" }}>
                    <Button color="error" disabled={form.variants.length <= 1} onClick={() => removeVariant(idx)}>
                      Xóa
                    </Button>
                  </Grid>

                  <Grid size={12}>
                    <TextField
                      label="Giá niêm yết (sau thuế) - Kết quả tính tự động"
                      value={v.unitPrice}
                      fullWidth
                      size="small"
                      disabled
                      InputProps={{
                        readOnly: true,
                        sx: { bgcolor: "rgba(0,0,0,0.08)", fontWeight: 700, color: "primary.main" }
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Stack>
          <Button sx={{ mt: 1.5 }} onClick={addVariant}>+ Thêm biến thể</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={save}>Lưu</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default function WarehouseWorkspace() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const normalizedPath = location.pathname === "/admin/shipping" ? "/admin/orders" : location.pathname;
  const tabIndex = useMemo(() => {
    const idx = WH_TAB_CONFIG.findIndex((tab) => tab.path === normalizedPath);
    return idx >= 0 ? idx : 0;
  }, [normalizedPath]);

  const renderContent = () => {
    const path = WH_TAB_CONFIG[tabIndex]?.path;
    switch (path) {
      case "/admin/products":
        return <ProductsTab />;
      case "/admin/categories":
        return <CategoriesTab />;
      case "/admin/inventory/import":
        return <ImportTab />;
      case "/admin/orders":
      case "/admin/shipping":
        return <OrdersTab />;
      case "/admin/inventory/suppliers":
        return <SuppliersTab />;
      case "/admin/brands":
        return <BrandsTab />;
      case "/admin/inventory/reports":
        return <ReportsTab />;
      case "/admin/inventory":
      default:
        return <InventoryTab />;
    }
  };

  return (
    <Box sx={{ animation: "fadeUp 0.4s ease-out" }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        {t("warehouse.workspace_title", "Kho hàng")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {t("warehouse.workspace_sub", "Tồn kho, nhập hàng, xử lý đơn, vận chuyển và nhà cung cấp.")}
      </Typography>

      <Paper sx={{ mb: 2.5, bgcolor: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)" }}>
        <Tabs
          value={tabIndex}
          onChange={(_, next) => navigate(WH_TAB_CONFIG[next].path)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ px: 1.5, pt: 0.5 }}
        >
          {WH_TAB_CONFIG.map((tab) => (
            <Tab key={tab.path} label={tab.label} />
          ))}
        </Tabs>
      </Paper>

      {renderContent()}

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </Box>
  );
}

function InventoryTab() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");
  const [editRow, setEditRow] = useState(null);
  const [thresholdInput, setThresholdInput] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const list = await fetchInventory();
      setRows(list);
    } catch (e) {
      setErr(getErrorMessage(e, "Không tải được tồn kho."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        (r.productName && r.productName.toLowerCase().includes(q)) ||
        (r.variantName && r.variantName.toLowerCase().includes(q))
    );
  }, [rows, search]);

  const saveThreshold = async () => {
    if (!editRow) return;
    const v = parseInt(thresholdInput, 10);
    if (Number.isNaN(v) || v < 0) return;
    try {
      await updateInventoryThreshold(editRow.inventoryId, v);
      setEditRow(null);
      await load();
    } catch (e) {
      setErr(getErrorMessage(e, "Không lưu được ngưỡng."));
    }
  };

  return (
    <Box>
      {err && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErr("")}>
          {err}
        </Alert>
      )}
      <Paper sx={{ p: 2, mb: 2, bgcolor: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)" }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}>
          <TextField
            size="small"
            label="Tìm theo tên sản phẩm / biến thể"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
          />
          <Button variant="outlined" onClick={load} disabled={loading}>
            Làm mới
          </Button>
        </Stack>
      </Paper>

      <TableContainer component={Paper} sx={{ bgcolor: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Sản phẩm</TableCell>
              <TableCell>Biến thể</TableCell>
              <TableCell align="right">Tồn</TableCell>
              <TableCell align="right">Ngưỡng cảnh báo</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <LinearProgress />
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((r) => (
                <TableRow key={r.inventoryId} hover>
                  <TableCell>{r.productName}</TableCell>
                  <TableCell>{r.variantName}</TableCell>
                  <TableCell align="right">{r.stockQuantity}</TableCell>
                  <TableCell align="right">{r.lowStockThreshold}</TableCell>
                  <TableCell>
                    {r.lowStock ? <Chip size="small" color="warning" label="Sắp hết" /> : <Chip size="small" label="Ổn định" />}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setEditRow(r);
                        setThresholdInput(String(r.lowStockThreshold ?? 5));
                      }}
                    >
                      Sửa ngưỡng
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={Boolean(editRow)} onClose={() => setEditRow(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Ngưỡng cảnh báo tồn thấp</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {editRow?.productName} — {editRow?.variantName}
          </Typography>
          <TextField
            fullWidth
            type="number"
            label="Ngưỡng (≤ sẽ cảnh báo)"
            value={thresholdInput}
            onChange={(e) => setThresholdInput(e.target.value)}
            inputProps={{ min: 0 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditRow(null)}>Hủy</Button>
          <Button variant="contained" onClick={saveThreshold}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function ImportTab() {
  const [inventoryRows, setInventoryRows] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    productId: "",
    productVariantId: "",
    quantity: "",
    supplierId: "",
    receiptRef: "",
    note: ""
  });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    try {
      const [inv, sup, prd] = await Promise.all([fetchInventory(), fetchSuppliers(), fetchWarehouseProducts()]);
      setInventoryRows(inv);
      setSuppliers(sup);
      setProducts(prd);
    } catch (e) {
      setErr(getErrorMessage(e, "Không tải dữ liệu."));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async () => {
    setErr("");
    setMsg("");
    const qty = parseInt(form.quantity, 10);
    if (!form.productVariantId || Number.isNaN(qty) || qty < 1) {
      setErr("Chọn biến thể và nhập số lượng hợp lệ.");
      return;
    }
    try {
      await importStock({
        productVariantId: form.productVariantId,
        quantity: qty,
        supplierId: form.supplierId || undefined,
        receiptRef: form.receiptRef || undefined,
        note: form.note || undefined
      });
      setMsg("Đã ghi nhận phiếu nhập kho.");
      setForm((p) => ({ ...p, quantity: "", receiptRef: "", note: "" }));
      await load();
    } catch (e) {
      setErr(getErrorMessage(e, "Nhập kho thất bại."));
    }
  };

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === form.productId),
    [products, form.productId]
  );

  const variantOptions = useMemo(
    () => selectedProduct?.variants || [],
    [selectedProduct]
  );

  const visibleProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => {
      const byName = (p.name || "").toLowerCase().includes(q);
      const byCategory = (p.categoryName || "").toLowerCase().includes(q);
      const byVariant = (p.variants || []).some((v) => (v.name || "").toLowerCase().includes(q));
      return byName || byCategory || byVariant;
    });
  }, [products, search]);

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 7 }}>
        <Paper sx={{ p: 2.5, bgcolor: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)" }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Phiếu nhập kho
          </Typography>
          {err && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {err}
            </Alert>
          )}
          {msg && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {msg}
            </Alert>
          )}
          <Stack spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Sản phẩm</InputLabel>
              <Select
                label="Sản phẩm"
                value={form.productId}
                onChange={(e) => setForm((p) => ({ ...p, productId: e.target.value, productVariantId: "" }))}
              >
                {products.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name} ({p.variants?.length || 0} biến thể)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Biến thể sản phẩm</InputLabel>
              <Select
                label="Biến thể sản phẩm"
                value={form.productVariantId}
                onChange={(e) => setForm((p) => ({ ...p, productVariantId: e.target.value }))}
                disabled={!form.productId}
              >
                {variantOptions.map((v) => {
                  const inv = inventoryRows.find((r) => r.variantId === v.id);
                  return (
                    <MenuItem key={v.id} value={v.id}>
                      {v.name} (tồn: {inv?.stockQuantity ?? 0})
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            {!form.productId && (
              <Typography variant="caption" color="text.secondary">
                Chọn sản phẩm trước khi chọn biến thể.
              </Typography>
            )}
            {form.productVariantId && (
              <Typography variant="body2" color="text.secondary">
                Tồn hiện tại:{" "}
                {
                  inventoryRows.find((r) => r.variantId === form.productVariantId)?.stockQuantity ??
                  0
                }
              </Typography>
            )}
            <TextField
              size="small"
              label="Số lượng nhập"
              type="number"
              value={form.quantity}
              onChange={(e) => setForm((p) => ({ ...p, quantity: e.target.value }))}
              fullWidth
              inputProps={{ min: 1 }}
            />
            <FormControl fullWidth size="small">
              <InputLabel>Nhà cung cấp (tuỳ chọn)</InputLabel>
              <Select
                label="Nhà cung cấp (tuỳ chọn)"
                value={form.supplierId}
                onChange={(e) => setForm((p) => ({ ...p, supplierId: e.target.value }))}
              >
                <MenuItem value="">
                  <em>Không chọn</em>
                </MenuItem>
                {suppliers.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              size="small"
              label="Số phiếu / hóa đơn NCC"
              value={form.receiptRef}
              onChange={(e) => setForm((p) => ({ ...p, receiptRef: e.target.value }))}
              fullWidth
            />
            <TextField
              size="small"
              label="Ghi chú"
              value={form.note}
              onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
              fullWidth
              multiline
              minRows={2}
            />
            <Button variant="contained" onClick={submit}>
              Xác nhận nhập kho
            </Button>
          </Stack>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <Paper sx={{ p: 2, bgcolor: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)" }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
            <Typography variant="subtitle2" fontWeight={700}>
              Danh sách sản phẩm
            </Typography>
            <Chip size="small" label={`${visibleProducts.length} sản phẩm`} />
          </Stack>
          <TextField
            size="small"
            placeholder="Tìm sản phẩm hoặc biến thể..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            sx={{ mb: 1.5 }}
          />
          <TableContainer sx={{ maxHeight: 360, border: "1px solid var(--color-border)", borderRadius: 1 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Sản phẩm</TableCell>
                  <TableCell>Biến thể</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleProducts.map((p) => (
                  <TableRow
                    key={p.id}
                    hover
                    onClick={() => setForm((prev) => ({ ...prev, productId: p.id, productVariantId: "" }))}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {p.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{p.variants?.map((v) => v.name).join(", ") || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  );
}

function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ACTIVE"); // ACTIVE, ALL, NEW, CONFIRMED, SHIPPING, COMPLETED, CANCELLED
  const [searchTerm, setSearchTerm] = useState("");
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({
    ghnOrderCode: "",
    status: "IN_TRANSIT",
    trackingNote: "",
    shippedDate: "",
    estimatedDelivery: ""
  });

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const [orderList, shipmentList] = await Promise.all([
        fetchOrdersByStatus(statusFilter === "NEW" ? "CREATED" : statusFilter === "COMPLETED" ? "DELIVERED" : statusFilter === "SHIPPING" ? "SHIPPED" : statusFilter),
        fetchShipments()
      ]);
      setOrders(orderList);
      setShipments(shipmentList);
    } catch (e) {
      setErr(getErrorMessage(e, "Không tải đơn hàng."));
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const confirm = async (id) => {
    if (!window.confirm("Xác nhận đơn đã được staff kho duyệt chuẩn bị hàng?")) return;
    try {
      await confirmOrder(id);
      await load();
    } catch (e) {
      setErr(getErrorMessage(e, "Không cập nhật được trạng thái xác nhận."));
    }
  };

  const createWaybill = async (id) => {
    if (!window.confirm("Tạo vận đơn GHN thật cho đơn này? Tồn kho sẽ bị trừ ngay sau khi tạo thành công.")) return;
    try {
      await createShipmentOrder(id);
      await load();
    } catch (e) {
      setErr(getErrorMessage(e, "Không tạo được vận đơn GHN."));
    }
  };

  const cancel = async (id) => {
    if (!window.confirm("Hủy đơn này? Chỉ áp dụng cho đơn chưa giao.")) return;
    try {
      await cancelOrder(id);
      await load();
    } catch (e) {
      setErr(getErrorMessage(e, "Không hủy được đơn."));
    }
  };

  const openEdit = (shipment) => {
    setEdit(shipment);
    setForm({
      ghnOrderCode: shipment.ghnOrderCode || "",
      status: shipment.status || "IN_TRANSIT",
      trackingNote: shipment.trackingNote || "",
      shippedDate: shipment.shippedDate || "",
      estimatedDelivery: shipment.estimatedDelivery || ""
    });
  };

  const saveShipment = async () => {
    if (!edit) return;
    try {
      await updateShipment(edit.id, {
        ghnOrderCode: form.ghnOrderCode || undefined,
        status: form.status,
        trackingNote: form.trackingNote || undefined,
        shippedDate: form.shippedDate || undefined,
        estimatedDelivery: form.estimatedDelivery || undefined
      });
      setEdit(null);
      await load();
    } catch (e) {
      setErr(getErrorMessage(e, "Không lưu được trạng thái vận chuyển."));
    }
  };

  const syncByOrder = async (orderId) => {
    try {
      await syncShipmentByOrder(orderId);
      await load();
    } catch (e) {
      setErr(getErrorMessage(e, "Không đồng bộ được trạng thái GHN."));
    }
  };

  const shipmentMap = useMemo(() => {
    const map = new Map();
    shipments.forEach((s) => map.set(s.orderId, s));
    return map;
  }, [shipments]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchSearch = (o.code?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (o.shippingSummary?.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchSearch;
    });
  }, [orders, searchTerm]);

  const ORDER_TABS = [
    { value: "ACTIVE", label: "Đang xử lý" },
    { value: "NEW", label: "Đơn mới/Chờ duyệt" },
    { value: "CONFIRMED", label: "Duyệt/Chờ lấy" },
    { value: "SHIPPING", label: "Đang giao" },
    { value: "COMPLETED", label: "Hoàn tất" },
    { value: "CANCELLED", label: "Đã hủy" },
    { value: "ALL", label: "Tất cả" },
  ];

  return (
    <Box>
      {err && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {err}
        </Alert>
      )}

      {/* Header with Search and Refresh */}
      <Paper sx={{ p: 2, mb: 0, bgcolor: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)", borderBottom: "none", borderRadius: "8px 8px 0 0" }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between" alignItems="center">
          <TextField
            size="small"
            placeholder="Tìm mã đơn, địa chỉ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: { xs: "100%", md: 400 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              )
            }}
          />
          <Button variant="outlined" onClick={load} disabled={loading} startIcon={loading && <LinearProgress sx={{ width: 20 }} />}>
            {loading ? "Đang tải..." : "Tải lại dữ liệu"}
          </Button>
        </Stack>
      </Paper>

      {/* Status Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "rgba(255,255,255,0.02)" }}>
        <Tabs
          value={statusFilter}
          onChange={(e, val) => setStatusFilter(val)}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
        >
          {ORDER_TABS.map(t => (
            <Tab key={t.value} label={t.label} value={t.value} sx={{ fontWeight: 600, textTransform: "none" }} />
          ))}
        </Tabs>
      </Box>

      <TableContainer component={Paper} sx={{ bgcolor: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)", borderTop: "none", borderRadius: "0 0 8px 8px" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Mã đơn</TableCell>
              <TableCell>Thanh toán</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Vận chuyển</TableCell>
              <TableCell>Ngày đặt</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <LinearProgress sx={{ my: 2 }} />
                </TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6, opacity: 0.5 }}>
                  <Typography>Không có đơn hàng nào.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((o) => (
                <TableRow key={o.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{o.code}</Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="column">
                      <Typography variant="caption" color="textSecondary">{o.paymentMethod || "COD"}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={
                        o.status && typeof o.status === "object" ? o.status.displayName ?? o.status.name : String(o.status ?? "")
                      }
                      color={o.statusCode === "DELIVERED" ? "success" : o.statusCode === "CANCELLED" ? "error" : "default"}
                    />
                  </TableCell>
                  <TableCell>
                    {o.shipmentCreated ? (
                      <Chip size="small" variant="outlined" color="success" label="Đã có vận đơn" />
                    ) : (
                      <Typography variant="caption" color="textSecondary">Chờ xử lý</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">{o.orderAt ? String(o.orderAt).replace("T", " ").slice(0, 16) : "—"}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button size="small" variant="text" onClick={() => setDetail(o)}>Chi tiết</Button>

                      {/* Contextual Buttons */}
                      {(o.statusCode === "CREATED" || o.statusCode === "PAID") && (
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          onClick={() => confirm(o.id)}
                        >
                          Xác nhận & Duyệt
                        </Button>
                      )}

                      {o.statusCode === "CONFIRMED" && !o.shipmentCreated && (
                        <Button
                          size="small"
                          variant="contained"
                          color="secondary"
                          onClick={() => createWaybill(o.id)}
                        >
                          Tạo vận đơn
                        </Button>
                      )}

                      {(o.statusCode === "SHIPPED" || o.shipmentCreated) && (
                        <>
                          <Button
                            size="small"
                            variant="outlined"
                            disabled={!shipmentMap.get(o.id)}
                            onClick={() => openEdit(shipmentMap.get(o.id))}
                          >
                            Tracking
                          </Button>
                          <IconButton size="small" color="primary" disabled={!shipmentMap.get(o.id)} onClick={() => syncByOrder(o.id)} title="Đồng bộ GHN">
                            <PlayCircleOutlineIcon fontSize="small" />
                          </IconButton>
                        </>
                      )}

                      {!["SHIPPED", "DELIVERED", "CANCELLED"].includes(o.statusCode) && (
                        <Button
                          size="small"
                          color="error"
                          variant="text"
                          onClick={() => cancel(o.id)}
                        >
                          Hủy
                        </Button>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={Boolean(detail)} onClose={() => setDetail(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Chi tiết đơn {detail?.code}</DialogTitle>
        <DialogContent dividers>
          {detail && (
            <Stack spacing={1}>
              <Typography variant="body2">
                <strong>Địa chỉ:</strong> {detail.shippingSummary || "—"}
              </Typography>
              <Divider />
              <Typography fontWeight={700}>Dòng hàng</Typography>
              {detail.items?.map((it) => (
                <Typography key={it.orderItemId} variant="body2">
                  {it.productName} ({it.variantName}) × {it.quantity}
                </Typography>
              ))}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetail(null)}>Đóng</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={Boolean(edit)} onClose={() => setEdit(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Cập nhật vận chuyển</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 0.5 }}>
            <TextField
              size="small"
              label="Mã đơn GHN / tracking"
              value={form.ghnOrderCode}
              onChange={(e) => setForm((p) => ({ ...p, ghnOrderCode: e.target.value }))}
              fullWidth
            />
            <FormControl fullWidth size="small">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                label="Trạng thái"
                value={form.status}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
              >
                {SHIPMENT_STATUS_OPTS.map((st) => (
                  <MenuItem key={st} value={st}>
                    {st}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              size="small"
              type="date"
              label="Ngày gửi"
              InputLabelProps={{ shrink: true }}
              value={form.shippedDate}
              onChange={(e) => setForm((p) => ({ ...p, shippedDate: e.target.value }))}
              fullWidth
            />
            <TextField
              size="small"
              type="date"
              label="Dự kiến giao"
              InputLabelProps={{ shrink: true }}
              value={form.estimatedDelivery}
              onChange={(e) => setForm((p) => ({ ...p, estimatedDelivery: e.target.value }))}
              fullWidth
            />
            <TextField
              size="small"
              label="Ghi chú"
              value={form.trackingNote}
              onChange={(e) => setForm((p) => ({ ...p, trackingNote: e.target.value }))}
              fullWidth
              multiline
              minRows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEdit(null)}>Hủy</Button>
          <Button variant="contained" onClick={saveShipment}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function BrandsTab() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    countryOfOrigin: "",
    website: "",
    active: true
  });

  const load = useCallback(async () => {
    setErr("");
    try {
      setRows(await fetchBrands());
    } catch (e) {
      setErr(getErrorMessage(e, "Không tải được nhãn hiệu."));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;
    const s = search.toLowerCase();
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(s) ||
        (r.countryOfOrigin && r.countryOfOrigin.toLowerCase().includes(s))
    );
  }, [rows, search]);

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", description: "", countryOfOrigin: "", website: "", active: true });
    setOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      name: row.name || "",
      description: row.description || "",
      countryOfOrigin: row.countryOfOrigin || "",
      website: row.website || "",
      active: row.active !== false
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.name.trim()) return;
    try {
      const payload = { ...form, name: form.name.trim() };
      if (editing) {
        await updateBrand(editing.id, payload);
      } else {
        await createBrand(payload);
      }
      setOpen(false);
      await load();
    } catch (e) {
      setErr(getErrorMessage(e, "Không lưu được nhãn hiệu."));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xác nhận xóa nhãn hiệu này?")) return;
    try {
      await deleteBrand(id);
      await load();
    } catch (e) {
      setErr(getErrorMessage(e, "Không xóa được nhãn hiệu."));
    }
  };

  return (
    <Box>
      {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}
      <Paper sx={{ p: 2, mb: 2, bgcolor: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)" }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button variant="contained" onClick={openNew}>Tạo nhãn hiệu</Button>
          <TextField
            size="small"
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 300 }}
          />
        </Stack>
      </Paper>
      <TableContainer component={Paper} sx={{ bgcolor: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Tên nhãn hiệu</TableCell>
              <TableCell>Xuất xứ</TableCell>
              <TableCell>Website</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((r) => (
              <TableRow key={r.id} hover>
                <TableCell><Typography variant="body2" sx={{ fontWeight: 600 }}>{r.name}</Typography></TableCell>
                <TableCell>{r.countryOfOrigin || "—"}</TableCell>
                <TableCell>{r.website || "—"}</TableCell>
                <TableCell>
                  <Chip size="small" color={r.active ? "success" : "warning"} label={r.active ? "Active" : "Inactive"} />
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button size="small" variant="outlined" onClick={() => openEdit(r)}>Sửa</Button>
                    <Button size="small" color="error" onClick={() => handleDelete(r.id)}>Xóa</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? "Chỉnh sửa nhãn hiệu" : "Tạo nhãn hiệu mới"}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 0.5 }}>
            <TextField label="Tên nhãn hiệu" value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} fullWidth required />
            <TextField label="Xuất xứ" value={form.countryOfOrigin} onChange={(e) => setForm(p => ({ ...p, countryOfOrigin: e.target.value }))} fullWidth />
            <TextField label="Website" value={form.website} onChange={(e) => setForm(p => ({ ...p, website: e.target.value }))} fullWidth />
            <TextField label="Mô tả" value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} fullWidth multiline minRows={2} />
            <FormControl fullWidth size="small">
              <InputLabel>Trạng thái</InputLabel>
              <Select label="Trạng thái" value={String(form.active)} onChange={(e) => setForm(p => ({ ...p, active: e.target.value === "true" }))}>
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={save}>Lưu</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function SuppliersTab() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    contactName: "",
    phone: "",
    email: "",
    address: "",
    taxCode: "",
    note: ""
  });

  const load = useCallback(async () => {
    setErr("");
    try {
      setRows(await fetchSuppliers());
    } catch (e) {
      setErr(getErrorMessage(e, "Không tải nhà cung cấp."));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", contactName: "", phone: "", email: "", address: "", taxCode: "", note: "" });
    setOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      name: row.name || "",
      contactName: row.contactName || "",
      phone: row.phone || "",
      email: row.email || "",
      address: row.address || "",
      taxCode: row.taxCode || "",
      note: row.note || ""
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.name.trim()) return;
    try {
      if (editing) {
        await updateSupplier(editing.id, { ...form, active: true });
      } else {
        await createSupplier({ ...form, active: true });
      }
      setOpen(false);
      await load();
    } catch (e) {
      setErr(getErrorMessage(e, "Không lưu được."));
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Ngừng hợp tác với NCC này? (ẩn khỏi danh sách hoạt động)")) return;
    try {
      await deleteSupplier(id);
      await load();
    } catch (e) {
      setErr(getErrorMessage(e, "Không xoá được."));
    }
  };

  return (
    <Box>
      {err && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {err}
        </Alert>
      )}
      <Paper sx={{ p: 2, mb: 2, bgcolor: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)" }}>
        <Button variant="contained" onClick={openNew}>
          Thêm nhà cung cấp
        </Button>
      </Paper>
      <TableContainer component={Paper} sx={{ bgcolor: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Tên</TableCell>
              <TableCell>Người liên hệ</TableCell>
              <TableCell>Điện thoại</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Địa chỉ</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id} hover>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.contactName || "—"}</TableCell>
                <TableCell>{r.phone || "—"}</TableCell>
                <TableCell>{r.email || "—"}</TableCell>
                <TableCell sx={{ maxWidth: 200 }}>
                  <Typography variant="body2" noWrap title={r.address}>
                    {r.address || "—"}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Button size="small" sx={{ mr: 1 }} onClick={() => openEdit(r)}>
                    Sửa
                  </Button>
                  <Button size="small" color="error" onClick={() => remove(r.id)}>
                    Ngừng
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? "Sửa nhà cung cấp" : "Thêm nhà cung cấp"}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 0.5 }}>
            <TextField label="Tên NCC" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} fullWidth required />
            <TextField label="Người liên hệ" value={form.contactName} onChange={(e) => setForm((p) => ({ ...p, contactName: e.target.value }))} fullWidth />
            <TextField label="Điện thoại" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} fullWidth />
            <TextField label="Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} fullWidth />
            <TextField label="Địa chỉ" value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} fullWidth multiline minRows={2} />
            <TextField label="Mã số thuế" value={form.taxCode} onChange={(e) => setForm((p) => ({ ...p, taxCode: e.target.value }))} fullWidth />
            <TextField label="Ghi chú" value={form.note} onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))} fullWidth multiline minRows={2} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={save}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function ReportsTab() {
  const [from, setFrom] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().slice(0, 10);
  });
  const [to, setTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [report, setReport] = useState(null);
  const [movements, setMovements] = useState([]);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    setErr("");
    try {
      const [r, m] = await Promise.all([fetchWarehouseReport(from, to), fetchMovements(from, to)]);
      setReport(r);
      setMovements(m);
    } catch (e) {
      setErr(getErrorMessage(e, "Không tải báo cáo."));
    }
  }, [from, to]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Box>
      {err && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {err}
        </Alert>
      )}
      <Paper sx={{ p: 2, mb: 2, bgcolor: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)" }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}>
          <TextField
            size="small"
            type="date"
            label="Từ ngày"
            InputLabelProps={{ shrink: true }}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          <TextField
            size="small"
            type="date"
            label="Đến ngày"
            InputLabelProps={{ shrink: true }}
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          <Button variant="contained" onClick={load}>
            Xem báo cáo
          </Button>
        </Stack>
      </Paper>

      {report && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(5, 1fr)" },
            gap: 2,
            mb: 2
          }}
        >
          <StatMini title="Nhập (đơn vị)" value={String(report.importUnits ?? 0)} />
          <StatMini title="Xuất thủ công" value={String(report.exportUnits ?? 0)} />
          <StatMini title="Bán / giao" value={String(report.saleShipUnits ?? 0)} />
          <StatMini title="Kiểm kê (tổng Δ)" value={String(report.adjustmentDeltaSum ?? 0)} />
          <StatMini title="Số dòng biến động" value={String(report.movementCount ?? 0)} />
        </Box>
      )}

      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        Chi tiết biến động
      </Typography>
      <TableContainer component={Paper} sx={{ bgcolor: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Thời gian</TableCell>
              <TableCell>Loại</TableCell>
              <TableCell>Sản phẩm</TableCell>
              <TableCell align="right">Δ</TableCell>
              <TableCell>Tham chiếu</TableCell>
              <TableCell>Ghi chú</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movements.map((m) => (
              <TableRow key={m.id} hover>
                <TableCell>{m.createdAt ? String(m.createdAt).replace("T", " ").slice(0, 19) : "—"}</TableCell>
                <TableCell>{MOVEMENT_LABELS[m.movementType] || m.movementType}</TableCell>
                <TableCell>
                  {m.productName} — {m.variantName}
                </TableCell>
                <TableCell align="right">{m.delta}</TableCell>
                <TableCell>{m.reference || m.orderCode || "—"}</TableCell>
                <TableCell sx={{ maxWidth: 200 }}>
                  <Typography variant="body2" noWrap title={m.note}>
                    {m.note || "—"}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
