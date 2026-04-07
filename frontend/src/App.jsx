import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Search, Activity, Sprout, Wind, ArrowRight, UploadCloud, Microscope, TestTube, CheckCircle, LayoutDashboard, Settings, User, LogOut, AlertTriangle, Image } from 'lucide-react';

const RippleBtn = ({ children, className, style, onClick, type = "button" }) => (
  <motion.button
    type={type}
    whileTap={{ scale: 0.95 }}
    className={className}
    style={{ overflow: 'hidden', position: 'relative', ...style }}
    onClick={onClick}
  >
    {children}
  </motion.button>
);

const Navbar = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("agro_username");

  const handleLogout = () => {
    localStorage.removeItem("agro_username");
    localStorage.removeItem("agro_name");
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
      className="glass-card"
      style={{ position: 'fixed', top: 20, left: '5%', right: '5%', zIndex: 100, padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 999 }}
    >
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: 'white', fontWeight: 700, fontSize: '1.4rem' }}>
        <Sprout color="#22C55E" size={28} /> Agro<span className="text-gradient">Vision</span>
      </Link>
      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        <Link to="/upload" style={{ color: '#F8FAFC', textDecoration: 'none', fontWeight: 500, fontSize: '1rem' }}>Detect</Link>
        {username ? (
          <>
            <Link to="/dashboard" className="btn-primary" style={{ padding: '10px 24px' }}>Dashboard <ArrowRight size={18} /></Link>
            <button onClick={handleLogout} className="btn-secondary" style={{ padding: '10px 24px' }}><LogOut size={16}/> Logout</button>
          </>
        ) : (
          <Link to="/login" className="btn-primary" style={{ padding: '10px 24px' }}>Login <ArrowRight size={18} /></Link>
        )}
      </div>
    </motion.nav>
  );
};

// --- Pages ---

const LandingPage = () => (
  <div style={{ paddingTop: 140 }}>
    <section style={{ minHeight: '75vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 20px' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ maxWidth: 800 }}>
        <motion.div animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 4 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 20px', borderRadius: 999, background: 'rgba(34, 197, 94, 0.1)', color: '#4ADE80', fontWeight: 600, marginBottom: 32 }}>
          <Leaf size={18} /> Powered by Advanced Neural Networks
        </motion.div>
        <h1 style={{ fontSize: '4.5rem', fontWeight: 700, lineHeight: 1.1, marginBottom: 24, letterSpacing: '-0.02em' }}>
          Detect Crop Diseases <br /><span className="text-gradient">Instantly Using AI</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#94A3B8', marginBottom: 48, maxWidth: 600, marginInline: 'auto', fontWeight: 300 }}>
          Protect your yield and ensure healthy harvests. Upload a leaf image and let our computer vision algorithms instantly identify pathogens.
        </p>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center' }}>
          <Link to="/upload" style={{ textDecoration: 'none' }}>
            <RippleBtn className="btn-primary" style={{ fontSize: '1.15rem' }}>Upload Leaf Image <UploadCloud size={20} /></RippleBtn>
          </Link>
          <Link to="/register" style={{ textDecoration: 'none' }}>
            <RippleBtn className="btn-secondary" style={{ fontSize: '1.15rem' }}>Create Account</RippleBtn>
          </Link>
        </div>
      </motion.div>
    </section>

    <section style={{ padding: '120px 5%' }}>
      <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: 80, fontWeight: 600 }}>Core Capabilities</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40 }}>
        {[
          { icon: <Microscope size={40} color="#4ADE80" />, title: "AI Disease Detection", desc: "Deep learning models identifying 50+ unique plant diseases with 99% accuracy." },
          { icon: <Activity size={40} color="#FACC15" />, title: "Instant Diagnosis", desc: "Get real-time insights in under 3 seconds on any device." },
          { icon: <TestTube size={40} color="#4ADE80" />, title: "Treatment Suggestions", desc: "Receive immediate organic and scientific mitigation strategies." }
        ].map((f, i) => (
          <motion.div
            key={i} className="glass-card" style={{ padding: 48 }}
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }}
            whileHover={{ y: -12, scale: 1.02 }}
          >
            <div style={{ marginBottom: 24 }}>{f.icon}</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: 16 }}>{f.title}</h3>
            <p style={{ color: '#94A3B8', fontSize: '1.05rem', lineHeight: 1.6 }}>{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  </div>
);

// ---- UPLOAD PAGE (Real file picker + API) ----
const UploadPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (.jpg, .png, .webp)');
      return;
    }
    setError('');
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleScan = async () => {
    if (!selectedFile) { setError('Please select an image first.'); return; }
    setLoading(true);
    setError('');
    try {
      const username = localStorage.getItem('agro_username');
      const formData = new FormData();
      formData.append('file', selectedFile);
      const url = username
        ? `http://localhost:8001/predict?username=${encodeURIComponent(username)}`
        : 'http://localhost:8001/predict';

      const res = await fetch(url, { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Prediction failed');

      // Store result and navigate
      sessionStorage.setItem('agro_result', JSON.stringify({ ...data, preview }));
      navigate('/result');
    } catch (err) {
      setError(err.message || 'Failed to connect to backend. Is it running on port 8001?');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: 140, paddingBottom: 60, display: 'flex', justifyContent: 'center' }}>
      <motion.div className="glass-card" style={{ width: '100%', maxWidth: 700, padding: 56, textAlign: 'center' }} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: 16 }}>Diagnostics Scanner</h2>
        <p style={{ color: '#94A3B8', fontSize: '1.1rem', marginBottom: 48 }}>Upload a clear photo of the affected crop leaf for analysis.</p>

        {loading ? (
          <div style={{ padding: '80px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: 'linear', duration: 2 }}>
              <Microscope size={64} color="#22C55E" />
            </motion.div>
            <h3 style={{ fontSize: '1.5rem', color: '#4ADE80' }}>Running Neural Network...</h3>
            <p style={{ color: '#94A3B8' }}>Identifying pathogens and cellular damage.</p>
          </div>
        ) : (
          <>
            {/* Drop Zone */}
            <motion.div
              className="upload-zone"
              style={{
                border: dragOver ? '2px solid #22C55E' : '2px dashed rgba(34,197,94,0.4)',
                background: dragOver ? 'rgba(34,197,94,0.08)' : undefined,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              whileHover={{ scale: 1.02 }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => handleFile(e.target.files[0])}
              />

              {preview ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                  <img
                    src={preview}
                    alt="Selected leaf"
                    style={{ maxHeight: 220, maxWidth: '100%', borderRadius: 16, objectFit: 'cover', border: '2px solid rgba(34,197,94,0.4)' }}
                  />
                  <p style={{ color: '#4ADE80', fontSize: '0.95rem' }}>✅ {selectedFile.name}</p>
                  <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Click to change image</p>
                </div>
              ) : (
                <>
                  <UploadCloud size={64} color="#4ADE80" style={{ marginBottom: 24 }} />
                  <h3 style={{ fontSize: '1.4rem', marginBottom: 8 }}>Drag & drop image here</h3>
                  <p style={{ color: '#94A3B8', marginBottom: 24 }}>or click to browse — Supported: .jpg, .png, .webp</p>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 24px', borderRadius: 999, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#F8FAFC', fontSize: '0.95rem' }}>
                    <Image size={16} /> Browse Files
                  </div>
                </>
              )}
            </motion.div>

            {error && (
              <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 10, color: '#EF4444', background: 'rgba(239,68,68,0.1)', padding: '12px 20px', borderRadius: 10 }}>
                <AlertTriangle size={18} /> {error}
              </div>
            )}

            <div style={{ marginTop: 40 }}>
              <RippleBtn
                className="btn-primary"
                style={{ width: '100%', padding: '18px', fontSize: '1.2rem', justifyContent: 'center', opacity: selectedFile ? 1 : 0.5 }}
                onClick={handleScan}
              >
                {selectedFile ? 'Scan Leaf Now' : 'Select an Image First'} <Search size={20} />
              </RippleBtn>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

// ---- RESULT PAGE (Dynamic from API) ----
const ResultPage = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('agro_result');
    if (stored) {
      setResult(JSON.parse(stored));
    } else {
      navigate('/upload');
    }
  }, []);

  if (!result) return null;

  const isHealthy = result.disease?.toLowerCase().includes('healthy');

  return (
    <div style={{ minHeight: '100vh', paddingTop: 140, paddingBottom: 60, display: 'flex', justifyContent: 'center' }}>
      <motion.div className="glass-card" style={{ width: '100%', maxWidth: 800, padding: 56 }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginBottom: 48, flexWrap: 'wrap' }}>
          {result.preview && (
            <img
              src={result.preview}
              alt="Scanned leaf"
              style={{ width: 140, height: 140, borderRadius: 20, objectFit: 'cover', border: `2px solid ${isHealthy ? '#22C55E' : '#FACC15'}` }}
            />
          )}
          {!result.preview && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}
              style={{ width: 140, height: 140, borderRadius: 24, background: isHealthy ? 'rgba(34,197,94,0.1)' : 'rgba(250, 204, 21, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={64} color={isHealthy ? '#22C55E' : '#FACC15'} />
            </motion.div>
          )}
          <div>
            <p style={{ color: '#94A3B8', fontSize: '1.1rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle size={18} color="#22C55E" /> Scan Complete — {result.filename}</p>
            <h2 style={{ fontSize: '2.8rem', color: isHealthy ? '#4ADE80' : '#FACC15', marginBottom: 8 }}>{result.disease}</h2>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
              <div style={{ display: 'inline-flex', background: 'rgba(34, 197, 94, 0.15)', color: '#4ADE80', padding: '6px 16px', borderRadius: 999, fontWeight: 500 }}>
                {result.confidence}% Confidence
              </div>
              {result.severity && result.severity !== 'unknown' && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: result.severity === 'none' ? 'rgba(34,197,94,0.15)' : result.severity === 'moderate' ? 'rgba(250,204,21,0.15)' : result.severity === 'high' ? 'rgba(249,115,22,0.15)' : 'rgba(239,68,68,0.15)',
                  color: result.severity === 'none' ? '#4ADE80' : result.severity === 'moderate' ? '#FACC15' : result.severity === 'high' ? '#FB923C' : '#EF4444',
                  padding: '6px 16px', borderRadius: 999, fontWeight: 500, fontSize: '0.9rem', textTransform: 'capitalize'
                }}>
                  {result.severity === 'none' ? '✅' : result.severity === 'moderate' ? '⚠️' : result.severity === 'high' ? '🔴' : '🚨'} Severity: {result.severity}
                </div>
              )}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: result.ml_used ? 'rgba(99,102,241,0.15)' : 'rgba(148,163,184,0.15)', color: result.ml_used ? '#818CF8' : '#94A3B8', padding: '6px 16px', borderRadius: 999, fontWeight: 500, fontSize: '0.9rem' }}>
                {result.ml_used ? '🤖 AI Model' : '⚡ Simulated'}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 24 }}>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: 32, borderRadius: 20 }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: 16, color: '#4ADE80' }}>Treatment Protocol</h3>
            <p style={{ color: '#F8FAFC', lineHeight: 1.7 }}>{result.treatment}</p>
          </div>
        </div>

        <div style={{ marginTop: 48, display: 'flex', gap: 24 }}>
          <RippleBtn className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => navigate('/upload')}>Scan Another</RippleBtn>
          <RippleBtn className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => navigate('/dashboard')}>Go to Dashboard</RippleBtn>
        </div>
      </motion.div>
    </div>
  );
};

// --- Auth Pages ---

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login_id: loginId, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('agro_username', data.username);
        localStorage.setItem('agro_name', data.name);
        navigate('/dashboard');
      } else {
        setError(data.detail);
      }
    } catch {
      setError('Network error. Is the backend running?');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '120px 60px 60px' }}>
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
          <motion.div animate={{ y: [0, -14, 0] }} transition={{ repeat: Infinity, duration: 5 }} style={{ fontSize: '6rem', marginBottom: 32 }}>🌿</motion.div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 700, lineHeight: 1.15, marginBottom: 20 }}>
            Welcome back,<br /><span className="text-gradient">Farmer.</span>
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1.2rem', maxWidth: 400 }}>
            Track your crop health, review past diagnoses, and protect your yield — all from one place.
          </p>
        </motion.div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, background: 'rgba(0,0,0,0.2)', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
        <motion.form onSubmit={handleLogin} className="glass-card" style={{ width: '100%', maxWidth: 480, padding: 48 }} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
          <h2 style={{ fontSize: '2rem', marginBottom: 8 }}>Sign In</h2>
          <p style={{ color: '#94A3B8', marginBottom: 32 }}>Use your username or email address</p>
          {error && <p style={{ color: '#EF4444', marginBottom: 16, padding: '10px 16px', background: 'rgba(239,68,68,0.1)', borderRadius: 8 }}>{error}</p>}

          <input type="text" className="input-field" placeholder="Username or Email" value={loginId} onChange={e => setLoginId(e.target.value)} required />
          <input type="password" className="input-field" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />

          <RippleBtn type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1.1rem', marginTop: 8 }}>
            Login to AgroVision
          </RippleBtn>

          <div style={{ marginTop: 28, display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
            <Link to="/forgot-password" style={{ color: '#4ADE80', textDecoration: 'none' }}>Forgot password?</Link>
            <Link to="/register" style={{ color: '#4ADE80', textDecoration: 'none' }}>New here? Register</Link>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', father_name: '', mobile: '', email: '', dob: '', username: '', password: '', confirm_password: '' });
  const [error, setError] = useState('');

  const handleChange = e => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) { setError('Passwords do not match'); return; }
    try {
      const res = await fetch('http://localhost:8001/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) { navigate('/login'); }
      else { setError(data.detail); }
    } catch { setError('Network error. Is the backend running?'); }
  };

  const fields = [
    { id: 'name', label: 'Full Name', type: 'text' },
    { id: 'father_name', label: "Father's Name", type: 'text' },
    { id: 'email', label: 'Email ID', type: 'email' },
    { id: 'mobile', label: 'Mobile Number', type: 'tel' },
    { id: 'dob', label: 'Date of Birth', type: 'date' },
    { id: 'username', label: 'Username', type: 'text' },
    { id: 'password', label: 'Password', type: 'password' },
    { id: 'confirm_password', label: 'Confirm Password', type: 'password' },
  ];

  return (
    <div style={{ minHeight: '100vh', paddingTop: 120, paddingBottom: 60, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <motion.form onSubmit={handleRegister} className="glass-card" style={{ width: '100%', maxWidth: 640, padding: 52 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 style={{ fontSize: '2rem', marginBottom: 8 }}>Create Account</h2>
        <p style={{ color: '#94A3B8', marginBottom: 32 }}>Register to access crop diagnostics and farm analytics</p>
        {error && <p style={{ color: '#EF4444', marginBottom: 20, padding: '10px 16px', background: 'rgba(239,68,68,0.1)', borderRadius: 8 }}>{error}</p>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
          {fields.map(f => (
            <input key={f.id} id={f.id} type={f.type} placeholder={f.label} className="input-field" value={formData[f.id]} onChange={handleChange} required />
          ))}
        </div>

        <RippleBtn type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1.1rem', marginTop: 12 }}>
          Create My Account
        </RippleBtn>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Link to="/login" style={{ color: '#4ADE80', textDecoration: 'none', fontSize: '0.95rem' }}>Already have an account? Login</Link>
        </div>
      </motion.form>
    </div>
  );
};

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [recoveryId, setRecoveryId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8001/forgot-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recovery_id: recoveryId })
      });
      const data = await res.json();
      if (res.ok) { setMsg(data.message); setError(''); setStep(2); }
      else { setError(data.detail); setMsg(''); }
    } catch { setError('Network error'); }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8001/reset-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recovery_id: recoveryId, new_password: newPassword })
      });
      const data = await res.json();
      if (res.ok) { navigate('/login'); }
      else { setError(data.detail); }
    } catch { setError('Network error'); }
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: 120, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <motion.div className="glass-card" style={{ width: '100%', maxWidth: 480, padding: 52 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 style={{ fontSize: '2rem', marginBottom: 8 }}>Password Recovery</h2>
        <p style={{ color: '#94A3B8', marginBottom: 32 }}>
          {step === 1 ? 'Enter your registered email or mobile number.' : 'Enter your new password.'}
        </p>

        {error && <p style={{ color: '#EF4444', marginBottom: 16, padding: '10px 16px', background: 'rgba(239,68,68,0.1)', borderRadius: 8 }}>{error}</p>}
        {msg && <p style={{ color: '#22C55E', marginBottom: 16, padding: '10px 16px', background: 'rgba(34,197,94,0.1)', borderRadius: 8 }}>{msg}</p>}

        {step === 1 ? (
          <form onSubmit={handleVerify}>
            <input type="text" className="input-field" placeholder="Registered Email or Mobile" value={recoveryId} onChange={e => setRecoveryId(e.target.value)} required />
            <RippleBtn type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px', marginTop: 8 }}>Verify Account</RippleBtn>
          </form>
        ) : (
          <form onSubmit={handleReset}>
            <input type="password" className="input-field" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
            <RippleBtn type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px', marginTop: 8 }}>Reset Password</RippleBtn>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <Link to="/login" style={{ color: '#4ADE80', textDecoration: 'none' }}>← Back to Login</Link>
        </div>
      </motion.div>
    </div>
  );
};

// ---- DASHBOARD (Real scan history from DB) ----
const DashboardPage = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('agro_username') || 'Guest';
  const [scans, setScans] = useState([]);
  const [loadingScans, setLoadingScans] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('agro_username')) { navigate('/login'); return; }
    fetch(`http://localhost:8001/scans/${username}`)
      .then(r => r.json())
      .then(data => { setScans(Array.isArray(data) ? data : []); setLoadingScans(false); })
      .catch(() => setLoadingScans(false));
  }, []);

  const totalScans = scans.length;
  const diseasesDetected = scans.filter(s => !s.disease.toLowerCase().includes('healthy')).length;
  const healthyScans = scans.filter(s => s.disease.toLowerCase().includes('healthy')).length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', paddingTop: 90 }}>
      <div style={{ width: 280, padding: 32, borderRight: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={24} color="#4ADE80" />
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: '1rem' }}>{username}</p>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Farmer Account</p>
          </div>
        </div>
        <h3 style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: 20, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Navigation</h3>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <a href="#" style={{ padding: '14px 20px', background: 'rgba(34, 197, 94, 0.1)', color: '#4ADE80', borderRadius: 14, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, fontWeight: 500 }}><LayoutDashboard size={20} /> Overview</a>
          <Link to="/upload" style={{ padding: '14px 20px', color: '#F8FAFC', borderRadius: 14, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, fontWeight: 400 }}><Leaf size={20} /> Scan Crop</Link>
          <a href="#" style={{ padding: '14px 20px', color: '#F8FAFC', borderRadius: 14, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, fontWeight: 400 }}><Wind size={20} /> Weather</a>
          <a href="#" style={{ padding: '14px 20px', color: '#F8FAFC', borderRadius: 14, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, fontWeight: 400 }}><Settings size={20} /> Settings</a>
        </nav>
      </div>

      <div style={{ flex: 1, padding: 48 }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: 12 }}>Farm Intelligence</h1>
        <p style={{ color: '#94A3B8', marginBottom: 40 }}>Welcome back, <strong style={{ color: '#4ADE80' }}>{username}</strong>. Here's your farm overview.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28, marginBottom: 48 }}>
          {[
            { title: 'Total Scans', val: totalScans.toString(), icon: <Search size={24} color="#4ADE80" /> },
            { title: 'Diseases Detected', val: diseasesDetected.toString(), icon: <Activity size={24} color="#FACC15" /> },
            { title: 'Healthy Plants', val: healthyScans.toString(), icon: <Leaf size={24} color="#22C55E" /> }
          ].map((st, i) => (
            <motion.div key={i} className="glass-card" style={{ padding: 32 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ color: '#94A3B8', fontSize: '1rem' }}>{st.title}</span>
                {st.icon}
              </div>
              <h3 style={{ fontSize: '3rem', fontWeight: 600 }}>{st.val}</h3>
            </motion.div>
          ))}
        </div>

        <motion.div className="glass-card" style={{ padding: 40 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 500 }}>Recent Scan History</h3>
            <Link to="/upload" className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>+ New Scan</Link>
          </div>

          {loadingScans ? (
            <p style={{ color: '#94A3B8', textAlign: 'center', padding: '40px 0' }}>Loading scans...</p>
          ) : scans.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Microscope size={48} color="#94A3B8" style={{ marginBottom: 16 }} />
              <p style={{ color: '#94A3B8', fontSize: '1.1rem' }}>No scans yet. Upload a leaf image to get started!</p>
              <Link to="/upload" style={{ display: 'inline-block', marginTop: 20 }}>
                <RippleBtn className="btn-primary">Start Scanning</RippleBtn>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 16 }}>
              {scans.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 28px', background: 'rgba(0,0,0,0.2)', borderRadius: 16 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Leaf color={s.disease.toLowerCase().includes('healthy') ? '#4ADE80' : '#FACC15'} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', marginBottom: 4 }}>{s.disease}</h4>
                      <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>{s.filename} · {s.scanned_at}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: s.disease.toLowerCase().includes('healthy') ? '#22C55E' : '#FACC15', fontWeight: 600, fontSize: '1.1rem' }}>
                      {s.confidence}%
                    </div>
                    <div style={{ color: '#94A3B8', fontSize: '0.8rem' }}>
                      {s.disease.toLowerCase().includes('healthy') ? 'All Clear' : 'Treatment Needed'}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <div className="bg-mesh" />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}
