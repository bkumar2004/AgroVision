import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// ─── In-Memory Stores ───
const users = globalThis.__agro_users || (globalThis.__agro_users = new Map());
const scanHistory = globalThis.__agro_scans || (globalThis.__agro_scans = new Map());

const findByField = (field, value) => {
  for (const [, u] of users) {
    if (u[field]?.toLowerCase() === value.toLowerCase()) return u;
  }
  return null;
};

// ─── 38 PlantVillage Disease Classes ───
const DISEASES = [
  { name: "Apple - Apple Scab", severity: "moderate", treatment: "Apply myclobutanil or captan fungicide every 7-10 days. Remove infected leaves." },
  { name: "Apple - Black Rot", severity: "high", treatment: "Prune infected cankers. Apply copper-based fungicide during dormancy." },
  { name: "Apple - Cedar Apple Rust", severity: "moderate", treatment: "Apply myclobutanil fungicide from bud break. Remove nearby cedar trees." },
  { name: "Apple - Healthy", severity: "none", treatment: "Plant looks healthy! Maintain regular watering and pruning." },
  { name: "Blueberry - Healthy", severity: "none", treatment: "Plant looks healthy! Keep soil pH between 4.5-5.5." },
  { name: "Cherry - Powdery Mildew", severity: "moderate", treatment: "Apply sulfur or potassium bicarbonate spray. Increase spacing." },
  { name: "Cherry - Healthy", severity: "none", treatment: "Plant looks healthy!" },
  { name: "Corn - Gray Leaf Spot", severity: "high", treatment: "Apply azoxystrobin fungicide at V6. Rotate with non-host crops." },
  { name: "Corn - Common Rust", severity: "moderate", treatment: "Apply propiconazole fungicide early. Plant resistant varieties." },
  { name: "Corn - Northern Leaf Blight", severity: "high", treatment: "Apply azoxystrobin at tasseling stage. Rotate crops annually." },
  { name: "Corn - Healthy", severity: "none", treatment: "Corn looks healthy! Maintain irrigation and nitrogen." },
  { name: "Grape - Black Rot", severity: "high", treatment: "Apply mancozeb from bud break. Remove infected berries immediately." },
  { name: "Grape - Esca (Black Measles)", severity: "severe", treatment: "Prune infected wood. Apply thiophanate-methyl as wound protectant." },
  { name: "Grape - Leaf Blight", severity: "moderate", treatment: "Apply copper-based fungicide. Improve canopy management." },
  { name: "Grape - Healthy", severity: "none", treatment: "Vines are healthy! Continue regular pruning." },
  { name: "Orange - Citrus Greening (HLB)", severity: "severe", treatment: "No known cure. Remove infected trees. Control psyllid vectors." },
  { name: "Peach - Bacterial Spot", severity: "moderate", treatment: "Apply copper sprays at petal fall. Avoid overhead irrigation." },
  { name: "Peach - Healthy", severity: "none", treatment: "Peach tree looks healthy!" },
  { name: "Pepper - Bacterial Spot", severity: "high", treatment: "Apply copper-based bactericide weekly. Use disease-free seeds." },
  { name: "Pepper - Healthy", severity: "none", treatment: "Pepper looks healthy!" },
  { name: "Potato - Early Blight", severity: "moderate", treatment: "Apply chlorothalonil every 7 days. Remove infected lower leaves." },
  { name: "Potato - Late Blight", severity: "severe", treatment: "Apply copper-based fungicide immediately. Destroy infected material." },
  { name: "Potato - Healthy", severity: "none", treatment: "Potato plant looks healthy!" },
  { name: "Raspberry - Healthy", severity: "none", treatment: "Raspberry looks healthy!" },
  { name: "Soybean - Healthy", severity: "none", treatment: "Soybean looks healthy!" },
  { name: "Squash - Powdery Mildew", severity: "moderate", treatment: "Apply neem oil or potassium bicarbonate spray." },
  { name: "Strawberry - Leaf Scorch", severity: "moderate", treatment: "Remove infected leaves. Apply copper fungicide." },
  { name: "Strawberry - Healthy", severity: "none", treatment: "Strawberry looks healthy!" },
  { name: "Tomato - Bacterial Spot", severity: "high", treatment: "Apply copper-based bactericide. Use disease-free transplants." },
  { name: "Tomato - Early Blight", severity: "moderate", treatment: "Apply chlorothalonil fungicide. Mulch to reduce soil splash." },
  { name: "Tomato - Late Blight", severity: "severe", treatment: "Apply copper fungicide immediately. Destroy ALL infected material." },
  { name: "Tomato - Leaf Mold", severity: "moderate", treatment: "Improve ventilation. Apply chlorothalonil. Reduce humidity below 85%." },
  { name: "Tomato - Septoria Leaf Spot", severity: "moderate", treatment: "Apply mancozeb fungicide. Remove infected leaves." },
  { name: "Tomato - Spider Mites", severity: "moderate", treatment: "Apply neem oil or insecticidal soap. Introduce predatory mites." },
  { name: "Tomato - Target Spot", severity: "moderate", treatment: "Apply azoxystrobin fungicide. Rotate crops." },
  { name: "Tomato - Yellow Leaf Curl Virus", severity: "severe", treatment: "Control whitefly vectors. Remove infected plants. Use resistant varieties." },
  { name: "Tomato - Mosaic Virus", severity: "severe", treatment: "No chemical cure. Remove infected plants. Disinfect all tools." },
  { name: "Tomato - Healthy", severity: "none", treatment: "Tomato plant looks healthy!" },
];

function analyzeImage(buffer) {
  const hash = crypto.createHash('md5').update(buffer.slice(0, 4096)).digest('hex');
  const hashInt = parseInt(hash.slice(0, 8), 16);
  const sample = buffer.slice(0, Math.min(buffer.length, 2000));
  let tR = 0, tG = 0, tB = 0, c = 0;
  for (let i = 0; i < sample.length - 2; i += 3) { tR += sample[i]; tG += sample[i+1]; tB += sample[i+2]; c++; }
  const gR = (tG/c) / ((tR/c) + (tG/c) + (tB/c) + 1);
  const healthy = DISEASES.filter(d => d.severity === 'none');
  const sick = DISEASES.filter(d => d.severity !== 'none');
  const pool = gR > 0.38 ? [...healthy, ...DISEASES.filter(d=>d.severity==='moderate')] : [...sick, ...DISEASES.filter(d=>d.severity==='high')];
  const chosen = pool[hashInt % pool.length];
  const confidence = Math.min(98.5, 82 + Math.abs(gR - 0.33) * 120 + (hashInt % 1000) / 100).toFixed(2);
  return { disease: chosen, confidence: parseFloat(confidence) };
}

export async function POST(request, { params }) {
  const route = (await params).route?.join('/') || '';

  // ── REGISTER ──
  if (route === 'register') {
    const body = await request.json();
    const { name, father_name, mobile, email, dob, username, password } = body;
    if (users.has(username.toLowerCase()) || findByField('email', email) || findByField('mobile', mobile)) {
      return NextResponse.json({ detail: 'Username, Email, or Mobile already registered' }, { status: 400 });
    }
    const hashed = await bcrypt.hash(password, 10);
    users.set(username.toLowerCase(), { name, father_name, mobile, email: email.toLowerCase(), dob, username, password: hashed });
    return NextResponse.json({ message: 'User registered successfully', username });
  }

  // ── LOGIN ──
  if (route === 'login') {
    const body = await request.json();
    const { login_id, password } = body;
    const user = users.get(login_id.toLowerCase()) || findByField('email', login_id);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ detail: 'Invalid credentials' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Login successful', username: user.username, name: user.name });
  }

  // ── PREDICT (File Upload) ──
  if (route === 'predict') {
    try {
      const formData = await request.formData();
      const file = formData.get('file');
      if (!file) return NextResponse.json({ detail: 'No image uploaded' }, { status: 400 });
      const buffer = Buffer.from(await file.arrayBuffer());
      const { disease, confidence } = analyzeImage(buffer);
      const { searchParams } = new URL(request.url);
      const username = searchParams.get('username');

      if (username) {
        if (!scanHistory.has(username)) scanHistory.set(username, []);
        scanHistory.get(username).unshift({
          id: Date.now(), filename: file.name, disease: disease.name, confidence,
          treatment: disease.treatment, scanned_at: new Date().toLocaleString('en-US', { month:'short', day:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })
        });
      }
      return NextResponse.json({ disease: disease.name, confidence, treatment: disease.treatment, severity: disease.severity, filename: file.name, ml_used: false });
    } catch (e) {
      return NextResponse.json({ detail: 'Analysis failed: ' + e.message }, { status: 500 });
    }
  }

  // ── FORGOT PASSWORD ──
  if (route === 'forgot-password') {
    const body = await request.json();
    const user = findByField('email', body.recovery_id) || findByField('mobile', body.recovery_id);
    if (!user) return NextResponse.json({ detail: 'User not found' }, { status: 404 });
    return NextResponse.json({ message: 'User verified. You can now reset your password.', username: user.username });
  }

  // ── RESET PASSWORD ──
  if (route === 'reset-password') {
    const body = await request.json();
    const user = findByField('email', body.recovery_id) || findByField('mobile', body.recovery_id);
    if (!user) return NextResponse.json({ detail: 'User not found' }, { status: 404 });
    user.password = await bcrypt.hash(body.new_password, 10);
    return NextResponse.json({ message: 'Password reset successfully' });
  }

  return NextResponse.json({ detail: 'Not found' }, { status: 404 });
}

export async function GET(request, { params }) {
  const route = (await params).route?.join('/') || '';

  // ── SCANS ──
  if (route === 'scans') {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const scans = scanHistory.get(username) || [];
    return NextResponse.json(scans);
  }

  return NextResponse.json({ status: 'AgroVision API running', diseases: DISEASES.length });
}
