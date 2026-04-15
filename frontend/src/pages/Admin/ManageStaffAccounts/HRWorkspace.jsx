import React, { useMemo, useState } from "react";
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
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  TextField,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import HRManagement from "./HRManagement";

const HR_TAB_CONFIG = [
  { label: "Nhân viên", path: "/admin/hr" },
  { label: "Tuyển dụng", path: "/admin/hr/recruitment" },
  { label: "Chấm công", path: "/admin/hr/attendance" },
  { label: "Hợp đồng", path: "/admin/hr/contracts" },
  { label: "Lương thưởng", path: "/admin/hr/payroll" },
  { label: "Báo cáo", path: "/admin/hr/reports" }
];

function StatCard({ title, value, progress }) {
  return (
    <Card sx={{ bgcolor: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)" }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
          {value}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ mt: 1.5, height: 6, borderRadius: 999 }}
        />
      </CardContent>
    </Card>
  );
}

function RecruitmentTab() {
  const [jobs, setJobs] = useState([
    { id: "JOB-001", title: "Frontend Developer", applicants: 24, stage: "Interviewing", owner: "HR Team", source: "TopCV" },
    { id: "JOB-002", title: "Warehouse Supervisor", applicants: 12, stage: "Screening", owner: "Operations", source: "Facebook" },
    { id: "JOB-003", title: "Customer Support Agent", applicants: 31, stage: "Offer", owner: "CS Team", source: "Referral" }
  ]);
  const [candidates, setCandidates] = useState([
    {
      id: "C-1001",
      fullName: "Nguyen Van D",
      position: "Frontend Developer",
      source: "TopCV",
      cvLink: "https://topcv.vn/candidate/1001",
      phone: "0901111222",
      email: "nguyenvand@mail.com",
      note: "Strong React skill, available in 2 weeks",
      status: "Screening"
    },
    {
      id: "C-1002",
      fullName: "Tran Thi E",
      position: "Warehouse Supervisor",
      source: "Facebook",
      cvLink: "https://facebook.com/messages/t/123",
      phone: "0902333444",
      email: "tranthie@mail.com",
      note: "Has 5 years warehouse experience",
      status: "Interviewing"
    }
  ]);

  const [createJobOpen, setCreateJobOpen] = useState(false);
  const [detailCandidate, setDetailCandidate] = useState(null);
  const [jobForm, setJobForm] = useState({
    title: "",
    owner: "",
    source: "TopCV",
    description: "",
    applyInstruction: "Ung vien gui CV qua TopCV/Facebook va HR nhap vao he thong."
  });
  const [candidateForm, setCandidateForm] = useState({
    fullName: "",
    position: "",
    source: "TopCV",
    cvLink: "",
    phone: "",
    email: "",
    note: ""
  });

  const handleCreateJob = () => {
    if (!jobForm.title.trim()) return;
    setJobs((prev) => [
      ...prev,
      {
        id: `JOB-${String(prev.length + 1).padStart(3, "0")}`,
        title: jobForm.title.trim(),
        applicants: 0,
        stage: "Open",
        owner: jobForm.owner || "HR Team",
        source: jobForm.source
      }
    ]);
    setJobForm({
      title: "",
      owner: "",
      source: "TopCV",
      description: "",
      applyInstruction: "Ung vien gui CV qua TopCV/Facebook va HR nhap vao he thong."
    });
    setCreateJobOpen(false);
  };

  const handleIntakeCandidate = () => {
    if (!candidateForm.fullName.trim() || !candidateForm.position.trim() || !candidateForm.cvLink.trim()) return;
    setCandidates((prev) => [
      ...prev,
      {
        id: `C-${1000 + prev.length + 1}`,
        ...candidateForm,
        status: "Screening"
      }
    ]);
    setJobs((prev) =>
      prev.map((job) =>
        job.title === candidateForm.position ? { ...job, applicants: job.applicants + 1 } : job
      )
    );
    setCandidateForm({
      fullName: "",
      position: "",
      source: "TopCV",
      cvLink: "",
      phone: "",
      email: "",
      note: ""
    });
  };

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        <Grid item xs={12} md={4}><StatCard title="Tin tuyển dụng mở" value={String(jobs.length)} progress={72} /></Grid>
        <Grid item xs={12} md={4}><StatCard title="Ứng viên trong pipeline" value={String(candidates.length)} progress={67} /></Grid>
        <Grid item xs={12} md={4}><StatCard title="Lịch phỏng vấn hôm nay" value="11" progress={83} /></Grid>
      </Grid>

      <Paper sx={{ p: 2, mb: 2.5, bgcolor: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)" }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <Button variant="contained" onClick={() => setCreateJobOpen(true)}>Tạo bài tuyển dụng</Button>
        </Stack>
      </Paper>

      <TableContainer component={Paper} sx={{ bgcolor: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Vị trí</TableCell>
              <TableCell>Ứng viên</TableCell>
              <TableCell>Nguon</TableCell>
              <TableCell>Giai đoạn</TableCell>
              <TableCell>Phụ trách</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id} hover>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.applicants}</TableCell>
                <TableCell>{job.source}</TableCell>
                <TableCell><Chip size="small" label={job.stage} /></TableCell>
                <TableCell>{job.owner}</TableCell>
                <TableCell align="right"><Button size="small" variant="outlined">Xem chi tiết</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Paper sx={{ p: 2.5, mt: 2.5, bgcolor: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)" }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Tiếp nhận ứng viên từ kênh ngoài</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}><TextField fullWidth label="Ho va ten" value={candidateForm.fullName} onChange={(e) => setCandidateForm((p) => ({ ...p, fullName: e.target.value }))} /></Grid>
          <Grid item xs={12} md={4}><TextField fullWidth label="Vi tri ung tuyen" value={candidateForm.position} onChange={(e) => setCandidateForm((p) => ({ ...p, position: e.target.value }))} /></Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Nguon</InputLabel>
              <Select label="Nguon" value={candidateForm.source} onChange={(e) => setCandidateForm((p) => ({ ...p, source: e.target.value }))}>
                <MenuItem value="TopCV">TopCV</MenuItem>
                <MenuItem value="Facebook">Facebook</MenuItem>
                <MenuItem value="LinkedIn">LinkedIn</MenuItem>
                <MenuItem value="Referral">Referral</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}><TextField fullWidth label="Link CV / ho so" value={candidateForm.cvLink} onChange={(e) => setCandidateForm((p) => ({ ...p, cvLink: e.target.value }))} /></Grid>
          <Grid item xs={12} md={3}><TextField fullWidth label="So dien thoai" value={candidateForm.phone} onChange={(e) => setCandidateForm((p) => ({ ...p, phone: e.target.value }))} /></Grid>
          <Grid item xs={12} md={3}><TextField fullWidth label="Email" value={candidateForm.email} onChange={(e) => setCandidateForm((p) => ({ ...p, email: e.target.value }))} /></Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              multiline
              minRows={1}
              maxRows={3}
              label="Ghi chu ban dau"
              value={candidateForm.note}
              onChange={(e) => setCandidateForm((p) => ({ ...p, note: e.target.value }))}
              sx={{ "& .MuiInputBase-input": { py: 0.75 } }}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="caption" color="text.secondary">Staff/HR co the copy CV link tu FB, TopCV, email vao day de tap trung hoa pipeline.</Typography>
          <Button variant="contained" onClick={handleIntakeCandidate}>Luu ung vien</Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 2.5, mt: 2.5, bgcolor: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)" }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Danh sach ung vien</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Ung vien</TableCell>
              <TableCell>Vi tri</TableCell>
              <TableCell>Nguon</TableCell>
              <TableCell>Trang thai</TableCell>
              <TableCell align="right">Hanh dong</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {candidates.map((candidate) => (
              <TableRow key={candidate.id}>
                <TableCell>{candidate.fullName}</TableCell>
                <TableCell>{candidate.position}</TableCell>
                <TableCell>{candidate.source}</TableCell>
                <TableCell><Chip size="small" label={candidate.status} /></TableCell>
                <TableCell align="right"><Button size="small" onClick={() => setDetailCandidate(candidate)}>Xem chi tiet</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={createJobOpen} onClose={() => setCreateJobOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Tạo bài tuyển dụng</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 0.5 }}>
            <TextField label="Vi tri tuyen dung" value={jobForm.title} onChange={(e) => setJobForm((p) => ({ ...p, title: e.target.value }))} fullWidth />
            <TextField label="Nguoi phu trach" value={jobForm.owner} onChange={(e) => setJobForm((p) => ({ ...p, owner: e.target.value }))} fullWidth />
            <FormControl fullWidth>
              <InputLabel>Kenh dang tin uu tien</InputLabel>
              <Select label="Kenh dang tin uu tien" value={jobForm.source} onChange={(e) => setJobForm((p) => ({ ...p, source: e.target.value }))}>
                <MenuItem value="TopCV">TopCV</MenuItem>
                <MenuItem value="Facebook">Facebook</MenuItem>
                <MenuItem value="LinkedIn">LinkedIn</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Mo ta cong viec" multiline minRows={3} value={jobForm.description} onChange={(e) => setJobForm((p) => ({ ...p, description: e.target.value }))} />
            <TextField label="Huong dan nop CV" multiline minRows={2} value={jobForm.applyInstruction} onChange={(e) => setJobForm((p) => ({ ...p, applyInstruction: e.target.value }))} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateJobOpen(false)}>Huy</Button>
          <Button variant="contained" onClick={handleCreateJob}>Tạo bài</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(detailCandidate)} onClose={() => setDetailCandidate(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Thong tin ung vien</DialogTitle>
        <DialogContent dividers>
          {detailCandidate && (
            <Stack spacing={1.2}>
              <Typography><strong>Ho ten:</strong> {detailCandidate.fullName}</Typography>
              <Typography><strong>Vi tri:</strong> {detailCandidate.position}</Typography>
              <Typography><strong>Nguon:</strong> {detailCandidate.source}</Typography>
              <Typography><strong>Email:</strong> {detailCandidate.email || "-"}</Typography>
              <Typography><strong>So dien thoai:</strong> {detailCandidate.phone || "-"}</Typography>
              <Typography><strong>Link CV:</strong> {detailCandidate.cvLink}</Typography>
              <Typography><strong>Ghi chu:</strong> {detailCandidate.note || "-"}</Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailCandidate(null)}>Dong</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function addMonthsToDateString(endDateStr, months) {
  const d = new Date(endDateStr + "T12:00:00");
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

function AttendanceTab() {
  const [leaves, setLeaves] = useState([
    { id: "LV-01", name: "Nguyen Van A", type: "Nghi phep nam", days: 1, reason: "Viec gia dinh", status: "Pending", fromDate: "2026-04-16", toDate: "2026-04-16", submittedAt: "2026-04-14" },
    { id: "LV-02", name: "Tran Thi B", type: "Nghi om", days: 2, reason: "Om sot", status: "Approved", fromDate: "2026-04-18", toDate: "2026-04-19", submittedAt: "2026-04-17" },
    { id: "LV-03", name: "Le Van C", type: "Nghi khong luong", days: 1, reason: "Xu ly viec ca nhan", status: "Pending", fromDate: "2026-04-22", toDate: "2026-04-22", submittedAt: "2026-04-20" }
  ]);

  const pendingCount = leaves.filter((l) => l.status === "Pending").length;

  const updateLeaveStatus = (leaveId, status) => {
    setLeaves((prev) => prev.map((leave) => (leave.id === leaveId ? { ...leave, status } : leave)));
  };

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 2 }}>
        Don nghi phep do nhan vien gui tu cong cua ho (portal / ung dung noi bo). HR chi xem va duyet hoac tu choi, khong tao don thay nhan vien.
      </Alert>
      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        <Grid item xs={12} md={3}><StatCard title="Nhan su di lam hom nay" value="72/80" progress={90} /></Grid>
        <Grid item xs={12} md={3}><StatCard title="Di tre" value="6" progress={28} /></Grid>
        <Grid item xs={12} md={3}><StatCard title="Don nghi cho duyet" value={String(pendingCount)} progress={46} /></Grid>
        <Grid item xs={12} md={3}><StatCard title="OT tuan nay" value="31 gio" progress={52} /></Grid>
      </Grid>
      <Paper sx={{ p: 2, bgcolor: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)" }}>
        <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700 }}>Don xin nghi can xu ly</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nhan vien</TableCell>
              <TableCell>Loai</TableCell>
              <TableCell>Tu ngay - Den ngay</TableCell>
              <TableCell>Ly do</TableCell>
              <TableCell>Gui luc</TableCell>
              <TableCell>Trang thai</TableCell>
              <TableCell align="right">Thao tac</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaves.map((leave) => {
              const pending = leave.status === "Pending";
              return (
                <TableRow key={leave.id} hover>
                  <TableCell>{leave.name}</TableCell>
                  <TableCell>{leave.type}</TableCell>
                  <TableCell>{leave.fromDate} {"->"} {leave.toDate}</TableCell>
                  <TableCell sx={{ maxWidth: 220 }}><Typography variant="body2" noWrap title={leave.reason}>{leave.reason}</Typography></TableCell>
                  <TableCell>{leave.submittedAt}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      color={leave.status === "Approved" ? "success" : leave.status === "Rejected" ? "error" : "warning"}
                      label={leave.status}
                    />
                  </TableCell>
                  <TableCell align="right">
                    {pending ? (
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Button size="small" variant="contained" color="success" onClick={() => updateLeaveStatus(leave.id, "Approved")}>Duyet</Button>
                        <Button size="small" variant="outlined" color="error" onClick={() => updateLeaveStatus(leave.id, "Rejected")}>Tu choi</Button>
                      </Stack>
                    ) : (
                      <Typography variant="caption" color="text.secondary">—</Typography>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}

const RENEWAL_OPTIONS = [
  { id: "3m", label: "Gia han 3 thang", months: 3 },
  { id: "6m", label: "Gia han 6 thang", months: 6 },
  { id: "12m", label: "Gia han 12 thang (1 nam)", months: 12 },
  { id: "24m", label: "Gia han 24 thang (2 nam)", months: 24 },
  { id: "probation_2m", label: "Gia han thu viec them 2 thang", months: 2 },
  { id: "probation_1m", label: "Gia han thu viec them 1 thang", months: 1 }
];

function ContractsTab() {
  const [contracts, setContracts] = useState([
    { code: "CTR-2026-101", employee: "Pham Minh D", type: "Chinh thuc", endDate: "2026-12-31", phone: "0901234567", status: "Active" },
    { code: "CTR-2026-087", employee: "Do Thi E", type: "Thu viec", endDate: "2026-04-20", phone: "0902233445", status: "Expiring soon" },
    { code: "CTR-2026-041", employee: "Nguyen Van F", type: "Chinh thuc", endDate: "2027-02-01", phone: "0909988776", status: "Active" }
  ]);
  const [renewContract, setRenewContract] = useState(null);
  const [renewDecision, setRenewDecision] = useState("");
  const [renewalOptionId, setRenewalOptionId] = useState("12m");
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    code: "",
    employee: "",
    type: "Chinh thuc",
    startDate: "",
    endDate: "",
    phone: "",
    note: ""
  });

  const expiringSoon = contracts.filter((c) => c.status === "Expiring soon").length;

  const newEndDatePreview = renewContract && renewDecision === "continue" && renewalOptionId
    ? addMonthsToDateString(renewContract.endDate, RENEWAL_OPTIONS.find((o) => o.id === renewalOptionId)?.months ?? 12)
    : "";

  const confirmRenewal = () => {
    if (!renewContract || !renewDecision) return;
    if (renewDecision === "stop") {
      setContracts((prev) =>
        prev.map((item) =>
          item.code === renewContract.code ? { ...item, status: "Ended" } : item
        )
      );
    } else if (renewDecision === "continue") {
      const months = RENEWAL_OPTIONS.find((o) => o.id === renewalOptionId)?.months ?? 12;
      const nextEnd = addMonthsToDateString(renewContract.endDate, months);
      setContracts((prev) =>
        prev.map((item) =>
          item.code === renewContract.code
            ? { ...item, endDate: nextEnd, status: "Renewed" }
            : item
        )
      );
    }
    setRenewContract(null);
    setRenewDecision("");
    setRenewalOptionId("12m");
  };

  const handleCreateContract = () => {
    if (!createForm.code.trim() || !createForm.employee.trim() || !createForm.startDate || !createForm.endDate) return;
    setContracts((prev) => [
      ...prev,
      {
        code: createForm.code.trim(),
        employee: createForm.employee.trim(),
        type: createForm.type,
        endDate: createForm.endDate,
        phone: createForm.phone.trim() || "—",
        status: "Active"
      }
    ]);
    setCreateForm({ code: "", employee: "", type: "Chinh thuc", startDate: "", endDate: "", phone: "", note: "" });
    setCreateOpen(false);
  };

  const closeRenew = () => {
    setRenewContract(null);
    setRenewDecision("");
    setRenewalOptionId("12m");
  };

  return (
    <Paper sx={{ p: 2.5, bgcolor: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Quan ly hop dong</Typography>
        <Button variant="contained" onClick={() => setCreateOpen(true)}>Tao hop dong</Button>
      </Box>
      <Alert severity="warning" sx={{ mb: 2 }}>
        Co {expiringSoon} hop dong sap het han. HR lien he nhan vien truoc, trao doi tiep tuc, sau do chon loai gia han va thoi han.
      </Alert>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Ma hop dong</TableCell>
            <TableCell>Nhan vien</TableCell>
            <TableCell>Loai</TableCell>
            <TableCell>Ngay het han</TableCell>
            <TableCell>Trang thai</TableCell>
            <TableCell align="right">Hanh dong</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contracts.map((contract) => (
            <TableRow key={contract.code}>
              <TableCell>{contract.code}</TableCell>
              <TableCell>{contract.employee}</TableCell>
              <TableCell>{contract.type}</TableCell>
              <TableCell>{contract.endDate}</TableCell>
              <TableCell>
                <Chip
                  size="small"
                  color={
                    contract.status === "Expiring soon"
                      ? "warning"
                      : contract.status === "Renewed"
                        ? "success"
                        : contract.status === "Ended"
                          ? "error"
                          : "default"
                  }
                  label={contract.status}
                />
              </TableCell>
              <TableCell align="right">
                <Button
                  size="small"
                  disabled={contract.status === "Ended"}
                  onClick={() => {
                    setRenewContract(contract);
                    setRenewalOptionId(contract.type === "Thu viec" ? "probation_2m" : "12m");
                  }}
                >
                  Gia han
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Tao hop dong moi</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 0.5 }}>
            <TextField
              size="small"
              label="Ma hop dong"
              value={createForm.code}
              onChange={(e) => setCreateForm((p) => ({ ...p, code: e.target.value }))}
              fullWidth
            />
            <TextField
              size="small"
              label="Ten nhan vien"
              value={createForm.employee}
              onChange={(e) => setCreateForm((p) => ({ ...p, employee: e.target.value }))}
              fullWidth
            />
            <FormControl fullWidth size="small">
              <InputLabel>Loai hop dong</InputLabel>
              <Select
                label="Loai hop dong"
                value={createForm.type}
                onChange={(e) => setCreateForm((p) => ({ ...p, type: e.target.value }))}
              >
                <MenuItem value="Thu viec">Thu viec</MenuItem>
                <MenuItem value="Chinh thuc">Chinh thuc</MenuItem>
                <MenuItem value="Thoi vu">Thoi vu</MenuItem>
              </Select>
            </FormControl>
            <TextField
              size="small"
              type="date"
              label="Ngay bat dau"
              InputLabelProps={{ shrink: true }}
              value={createForm.startDate}
              onChange={(e) => setCreateForm((p) => ({ ...p, startDate: e.target.value }))}
              fullWidth
            />
            <TextField
              size="small"
              type="date"
              label="Ngay ket thuc"
              InputLabelProps={{ shrink: true }}
              value={createForm.endDate}
              onChange={(e) => setCreateForm((p) => ({ ...p, endDate: e.target.value }))}
              fullWidth
            />
            <TextField
              size="small"
              label="So dien thoai lien he"
              value={createForm.phone}
              onChange={(e) => setCreateForm((p) => ({ ...p, phone: e.target.value }))}
              fullWidth
            />
            <TextField
              size="small"
              multiline
              minRows={2}
              maxRows={4}
              label="Ghi chu (tuy chon)"
              value={createForm.note}
              onChange={(e) => setCreateForm((p) => ({ ...p, note: e.target.value }))}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Huy</Button>
          <Button variant="contained" onClick={handleCreateContract}>Luu hop dong</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(renewContract)} onClose={closeRenew} maxWidth="sm" fullWidth>
        <DialogTitle>Gia han hop dong</DialogTitle>
        <DialogContent dividers>
          {renewContract && (
            <Stack spacing={2}>
              <Typography><strong>Nhan vien:</strong> {renewContract.employee}</Typography>
              <Typography component="span" sx={{ display: "block" }}>
                <strong>So lien he:</strong>{" "}
                {(() => {
                  const p = String(renewContract.phone ?? "");
                  const digits = p.replace(/\D/g, "");
                  const canDial = digits.length >= 9 && digits.length <= 12;
                  return canDial ? (
                    <Button size="small" variant="text" href={`tel:${digits}`} sx={{ p: 0, minWidth: 0, textTransform: "none" }}>
                      {p}
                    </Button>
                  ) : (
                    p || "—"
                  );
                })()}
                {" "}(goi trao doi truoc khi gia han)
              </Typography>
              <Typography><strong>Ngay het han hien tai:</strong> {renewContract.endDate}</Typography>
              <Alert severity="info">
                Buoc 1: Lien he truc tiep de thong nhat dieu kien. Buoc 2: Neu tiep tuc, chon loai gia han — he thong tinh ngay het han moi tu ngay cuoi cua hop dong hien tai.
              </Alert>
              <FormControl fullWidth size="small">
                <InputLabel>Ket qua trao doi</InputLabel>
                <Select
                  label="Ket qua trao doi"
                  value={renewDecision || "none"}
                  onChange={(e) => {
                    const v = e.target.value;
                    setRenewDecision(v === "none" ? "" : v);
                  }}
                >
                  <MenuItem value="none" disabled>
                    Chon ket qua trao doi
                  </MenuItem>
                  <MenuItem value="continue">Dong y tiep tuc — gia han</MenuItem>
                  <MenuItem value="stop">Khong tiep tuc — ket thuc hop dong</MenuItem>
                </Select>
              </FormControl>
              {renewDecision === "continue" && (
                <>
                  <FormControl fullWidth size="small">
                    <InputLabel>Loai gia han</InputLabel>
                    <Select
                      label="Loai gia han"
                      value={renewalOptionId}
                      onChange={(e) => setRenewalOptionId(e.target.value)}
                    >
                      {RENEWAL_OPTIONS.map((opt) => (
                        <MenuItem key={opt.id} value={opt.id}>{opt.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Alert severity="success">
                    Ngay het han moi du kien: <strong>{newEndDatePreview}</strong>
                  </Alert>
                </>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRenew}>Huy</Button>
          <Button variant="contained" disabled={!renewDecision} onClick={confirmRenewal}>Xac nhan</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

function PayrollTab() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 2.5, bgcolor: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)", minHeight: 280 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Bảng lương tháng này</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Tổng quỹ lương: 1.280.000.000đ - Thưởng KPI: 94.000.000đ - Khấu trừ: 21.000.000đ
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Button variant="outlined" sx={{ mr: 1 }}>Xuất bảng lương</Button>
          <Button variant="contained">Duyệt thanh toán</Button>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <StatCard title="Tổng nhân sự nhận lương" value="80" progress={100} />
        <Box sx={{ mt: 2 }}><StatCard title="Nhân sự đạt KPI thưởng" value="34" progress={42} /></Box>
      </Grid>
    </Grid>
  );
}

function ReportsTab() {
  return (
    <Box>
      <Alert severity="info" sx={{ mb: 2 }}>
        Co che bao cao HR: he thong tong hop du lieu tu 3 nguon - danh sach nhan su, don nghi phep, pipeline tuyen dung.
      </Alert>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={4}><StatCard title="Headcount hien tai" value="80" progress={80} /></Grid>
        <Grid item xs={12} md={4}><StatCard title="Turnover (30 ngay)" value="4.2%" progress={42} /></Grid>
        <Grid item xs={12} md={4}><StatCard title="Time-to-hire TB" value="18 ngay" progress={60} /></Grid>
      </Grid>
      <Paper sx={{ p: 2.5, bgcolor: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)" }}>
        <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700 }}>Cach tinh va flow</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Chi so</TableCell>
              <TableCell>Cach tinh</TableCell>
              <TableCell>Nguon du lieu</TableCell>
              <TableCell>Chu ky cap nhat</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Turnover rate</TableCell>
              <TableCell>(So nhan vien nghi viec trong ky / Headcount trung binh) * 100%</TableCell>
              <TableCell>Hop dong + danh sach nhan su</TableCell>
              <TableCell>Hang thang</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Time-to-hire</TableCell>
              <TableCell>Ngay nhan CV den ngay accept offer (trung binh)</TableCell>
              <TableCell>Tuyen dung</TableCell>
              <TableCell>Hang tuan</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Leave approval SLA</TableCell>
              <TableCell>Thoi gian tu luc gui don den luc HR phe duyet/tu choi</TableCell>
              <TableCell>Cham cong & nghi phep</TableCell>
              <TableCell>Hang ngay</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}

export default function HRWorkspace() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const tabIndex = useMemo(() => {
    const idx = HR_TAB_CONFIG.findIndex((tab) => tab.path === location.pathname);
    return idx >= 0 ? idx : 0;
  }, [location.pathname]);

  const renderContent = () => {
    const currentPath = HR_TAB_CONFIG[tabIndex]?.path;
    switch (currentPath) {
      case "/admin/hr/recruitment":
        return <RecruitmentTab />;
      case "/admin/hr/attendance":
        return <AttendanceTab />;
      case "/admin/hr/contracts":
        return <ContractsTab />;
      case "/admin/hr/payroll":
        return <PayrollTab />;
      case "/admin/hr/reports":
        return <ReportsTab />;
      case "/admin/hr":
      default:
        return <HRManagement />;
    }
  };

  return (
    <Box sx={{ animation: "fadeUp 0.4s ease-out" }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
        {t("hr.title")}
      </Typography>
      <br/>

      <Paper sx={{ mb: 2.5, bgcolor: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)" }}>
        <Tabs
          value={tabIndex}
          onChange={(_, next) => navigate(HR_TAB_CONFIG[next].path)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ px: 1.5, pt: 0.5 }}
        >
          {HR_TAB_CONFIG.map((tab) => (
            <Tab key={tab.path} label={tab.label} />
          ))}
        </Tabs>
      </Paper>

      {renderContent()}
    </Box>
  );
}
