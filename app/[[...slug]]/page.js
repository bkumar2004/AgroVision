"use client";
import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Search, Activity, Sprout, ArrowRight, UploadCloud, Microscope, TestTube, CheckCircle, LayoutDashboard, Settings, User, LogOut, AlertTriangle, Image as ImageIcon, Wind } from 'lucide-react';

// ─── NAVBAR ───
function Navbar() {
  const router = useRouter();
  const [username, setUsername] = useState(null);
  useEffect(() => { setUsername(localStorage.getItem("agro_username")); }, []);
  const logout = () => { localStorage.removeItem("agro_username"); localStorage.removeItem("agro_name"); setUsername(null); router.push('/'); };

  return (
    <motion.nav initial={{y:-50,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.2}} className="nav glass">
      <Link href="/" style={{display:'flex',alignItems:'center',gap:12,color:'#fff',fontWeight:700,fontSize:'1.4rem'}}>
        <Sprout color="#22C55E" size={28}/> Agro<span className="grad">Vision</span>
      </Link>
      <div style={{display:'flex',gap:32,alignItems:'center'}}>
        <Link href="/upload">Detect</Link>
        {username ? (<>
          <Link href="/dashboard" className="btn-p" style={{padding:'10px 24px'}}>Dashboard <ArrowRight size={18}/></Link>
          <button onClick={logout} className="btn-s" style={{padding:'10px 24px'}}><LogOut size={16}/> Logout</button>
        </>) : (
          <Link href="/login" className="btn-p" style={{padding:'10px 24px'}}>Login <ArrowRight size={18}/></Link>
        )}
      </div>
    </motion.nav>
  );
}

// ─── LANDING ───
function Landing() {
  return (
    <div style={{paddingTop:140}}>
      <section style={{minHeight:'75vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',padding:'0 20px'}}>
        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.8}} style={{maxWidth:800}}>
          <motion.div animate={{y:[0,-12,0]}} transition={{repeat:Infinity,duration:4}}
            style={{display:'inline-flex',alignItems:'center',gap:10,padding:'8px 20px',borderRadius:999,background:'rgba(34,197,94,0.1)',color:'#4ADE80',fontWeight:600,marginBottom:32}}>
            <Leaf size={18}/> Powered by Advanced Neural Networks
          </motion.div>
          <h1 style={{fontSize:'4.5rem',fontWeight:700,lineHeight:1.1,marginBottom:24,letterSpacing:'-0.02em'}}>
            Detect Crop Diseases <br/><span className="grad">Instantly Using AI</span>
          </h1>
          <p style={{fontSize:'1.25rem',color:'var(--muted)',marginBottom:48,maxWidth:600,marginInline:'auto',fontWeight:300}}>
            Protect your yield and ensure healthy harvests. Upload a leaf image and let our computer vision algorithms instantly identify pathogens.
          </p>
          <div style={{display:'flex',gap:24,justifyContent:'center'}}>
            <Link href="/upload" className="btn-p" style={{fontSize:'1.15rem'}}>Upload Leaf Image <UploadCloud size={20}/></Link>
            <Link href="/register" className="btn-s" style={{fontSize:'1.15rem'}}>Create Account</Link>
          </div>
        </motion.div>
      </section>
      <section style={{padding:'120px 5%'}}>
        <h2 style={{textAlign:'center',fontSize:'2.5rem',marginBottom:80,fontWeight:600}}>Core Capabilities</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))',gap:40}}>
          {[
            {icon:<Microscope size={40} color="#4ADE80"/>,title:"AI Disease Detection",desc:"Deep learning models identifying 50+ unique plant diseases with 99% accuracy."},
            {icon:<Activity size={40} color="#FACC15"/>,title:"Instant Diagnosis",desc:"Get real-time insights in under 3 seconds on any device."},
            {icon:<TestTube size={40} color="#4ADE80"/>,title:"Treatment Suggestions",desc:"Receive immediate organic and scientific mitigation strategies."}
          ].map((f,i)=>(
            <motion.div key={i} className="glass" style={{padding:48}} initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.2}} whileHover={{y:-12,scale:1.02}}>
              <div style={{marginBottom:24}}>{f.icon}</div>
              <h3 style={{fontSize:'1.5rem',marginBottom:16}}>{f.title}</h3>
              <p style={{color:'var(--muted)',fontSize:'1.05rem',lineHeight:1.6}}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── UPLOAD ───
function Upload() {
  const router = useRouter();
  const fileRef = useRef(null);
  const [file,setFile] = useState(null);
  const [preview,setPreview] = useState(null);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState('');
  const [dragOver,setDragOver] = useState(false);

  const handleFile = f => {
    if(!f) return;
    if(!f.type.startsWith('image/')){ setError('Please select an image file'); return; }
    setError(''); setFile(f); setPreview(URL.createObjectURL(f));
  };

  const scan = async () => {
    if(!file){ setError('Please select an image first.'); return; }
    setLoading(true); setError('');
    try {
      const username = localStorage.getItem('agro_username');
      const fd = new FormData(); fd.append('file',file);
      const url = username ? `/api/predict?username=${encodeURIComponent(username)}` : '/api/predict';
      const r = await fetch(url,{method:'POST',body:fd});
      const d = await r.json();
      if(!r.ok) throw new Error(d.detail || 'Prediction failed');
      sessionStorage.setItem('agro_result',JSON.stringify({...d,preview}));
      router.push('/result');
    } catch(e) { setError(e.message); setLoading(false); }
  };

  return (
    <div style={{minHeight:'100vh',paddingTop:140,paddingBottom:60,display:'flex',justifyContent:'center'}}>
      <motion.div className="glass" style={{width:'100%',maxWidth:700,padding:56,textAlign:'center'}} initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}>
        <h2 style={{fontSize:'2.5rem',marginBottom:16}}>Diagnostics Scanner</h2>
        <p style={{color:'var(--muted)',fontSize:'1.1rem',marginBottom:48}}>Upload a clear photo of the affected crop leaf for analysis.</p>
        {loading ? (
          <div style={{padding:'80px 0',display:'flex',flexDirection:'column',alignItems:'center',gap:24}}>
            <motion.div animate={{rotate:360}} transition={{repeat:Infinity,ease:'linear',duration:2}}><Microscope size={64} color="#22C55E"/></motion.div>
            <h3 style={{fontSize:'1.5rem',color:'#4ADE80'}}>Running Neural Network...</h3>
            <p style={{color:'var(--muted)'}}>Identifying pathogens and cellular damage.</p>
          </div>
        ) : (<>
          <div className="upload-zone" style={{borderColor:dragOver?'#22C55E':undefined,background:dragOver?'rgba(34,197,94,0.08)':undefined}}
            onDragOver={e=>{e.preventDefault();setDragOver(true)}} onDragLeave={()=>setDragOver(false)}
            onDrop={e=>{e.preventDefault();setDragOver(false);handleFile(e.dataTransfer.files[0])}}
            onClick={()=>fileRef.current?.click()}>
            <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={e=>handleFile(e.target.files[0])}/>
            {preview ? (
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:16}}>
                <img src={preview} alt="Leaf" style={{maxHeight:220,maxWidth:'100%',borderRadius:16,objectFit:'cover',border:'2px solid rgba(34,197,94,0.4)'}}/>
                <p style={{color:'#4ADE80',fontSize:'0.95rem'}}>{file.name}</p>
                <p style={{color:'var(--muted)',fontSize:'0.85rem'}}>Click to change image</p>
              </div>
            ) : (<>
              <UploadCloud size={64} color="#4ADE80" style={{marginBottom:24}}/>
              <h3 style={{fontSize:'1.4rem',marginBottom:8}}>Drag & drop image here</h3>
              <p style={{color:'var(--muted)',marginBottom:24}}>or click to browse — .jpg, .png, .webp</p>
              <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'10px 24px',borderRadius:999,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',color:'var(--text)',fontSize:'0.95rem'}}>
                <ImageIcon size={16}/> Browse Files
              </div>
            </>)}
          </div>
          {error && <div style={{marginTop:20,display:'flex',alignItems:'center',gap:10,color:'var(--danger)',background:'rgba(239,68,68,0.1)',padding:'12px 20px',borderRadius:10}}><AlertTriangle size={18}/> {error}</div>}
          <div style={{marginTop:40}}>
            <button className="btn-p" style={{width:'100%',padding:18,fontSize:'1.2rem',justifyContent:'center',opacity:file?1:0.5}} onClick={scan}>
              {file ? 'Scan Leaf Now' : 'Select an Image First'} <Search size={20}/>
            </button>
          </div>
        </>)}
      </motion.div>
    </div>
  );
}

// ─── RESULT ───
function ResultPage() {
  const router = useRouter();
  const [result,setResult] = useState(null);
  useEffect(() => {
    const s = sessionStorage.getItem('agro_result');
    if(s) setResult(JSON.parse(s)); else router.push('/upload');
  },[]);
  if(!result) return null;
  const isHealthy = result.disease?.toLowerCase().includes('healthy');

  return (
    <div style={{minHeight:'100vh',paddingTop:140,paddingBottom:60,display:'flex',justifyContent:'center'}}>
      <motion.div className="glass" style={{width:'100%',maxWidth:800,padding:56}} initial={{opacity:0,y:30}} animate={{opacity:1,y:0}}>
        <div style={{display:'flex',alignItems:'center',gap:32,marginBottom:48,flexWrap:'wrap'}}>
          {result.preview && <img src={result.preview} alt="Leaf" style={{width:140,height:140,borderRadius:20,objectFit:'cover',border:`2px solid ${isHealthy?'#22C55E':'#FACC15'}`}}/>}
          <div>
            <p style={{color:'var(--muted)',fontSize:'1.1rem',marginBottom:8,display:'flex',alignItems:'center',gap:8}}><CheckCircle size={18} color="#22C55E"/> Scan Complete — {result.filename}</p>
            <h2 style={{fontSize:'2.8rem',color:isHealthy?'#4ADE80':'#FACC15',marginBottom:8}}>{result.disease}</h2>
            <div style={{display:'flex',gap:10,flexWrap:'wrap',marginTop:4}}>
              <div style={{display:'inline-flex',background:'rgba(34,197,94,0.15)',color:'#4ADE80',padding:'6px 16px',borderRadius:999,fontWeight:500}}>{result.confidence}% Confidence</div>
              {result.severity && result.severity!=='unknown' && <div style={{display:'inline-flex',padding:'6px 16px',borderRadius:999,fontWeight:500,fontSize:'0.9rem',textTransform:'capitalize',
                background:result.severity==='none'?'rgba(34,197,94,0.15)':result.severity==='moderate'?'rgba(250,204,21,0.15)':'rgba(239,68,68,0.15)',
                color:result.severity==='none'?'#4ADE80':result.severity==='moderate'?'#FACC15':'#EF4444'}}>Severity: {result.severity}</div>}
            </div>
          </div>
        </div>
        <div style={{background:'rgba(0,0,0,0.2)',padding:32,borderRadius:20}}>
          <h3 style={{fontSize:'1.4rem',marginBottom:16,color:'#4ADE80'}}>Treatment Protocol</h3>
          <p style={{color:'var(--text)',lineHeight:1.7}}>{result.treatment}</p>
        </div>
        <div style={{marginTop:48,display:'flex',gap:24}}>
          <button className="btn-s" style={{flex:1,justifyContent:'center'}} onClick={()=>router.push('/upload')}>Scan Another</button>
          <button className="btn-p" style={{flex:1,justifyContent:'center'}} onClick={()=>router.push('/dashboard')}>Go to Dashboard</button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── LOGIN ───
function Login() {
  const router = useRouter();
  const [loginId,setLoginId] = useState(''); const [password,setPassword] = useState(''); const [error,setError] = useState('');
  const submit = async e => {
    e.preventDefault();
    try {
      const r = await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({login_id:loginId,password})});
      const d = await r.json();
      if(r.ok){ localStorage.setItem('agro_username',d.username); localStorage.setItem('agro_name',d.name); router.push('/dashboard'); }
      else setError(d.detail);
    } catch { setError('Network error'); }
  };
  return (
    <div style={{display:'flex',minHeight:'100vh'}}>
      <div style={{flex:1.2,display:'flex',flexDirection:'column',justifyContent:'center',padding:'120px 60px 60px'}}>
        <motion.div initial={{opacity:0,x:-30}} animate={{opacity:1,x:0}} transition={{duration:0.7}}>
          <motion.div animate={{y:[0,-14,0]}} transition={{repeat:Infinity,duration:5}} style={{fontSize:'6rem',marginBottom:32}}>🌿</motion.div>
          <h1 style={{fontSize:'3.5rem',fontWeight:700,lineHeight:1.15,marginBottom:20}}>Welcome back,<br/><span className="grad">Farmer.</span></h1>
          <p style={{color:'var(--muted)',fontSize:'1.2rem',maxWidth:400}}>Track your crop health, review past diagnoses, and protect your yield.</p>
        </motion.div>
      </div>
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:40,background:'rgba(0,0,0,0.2)',borderLeft:'1px solid rgba(255,255,255,0.05)'}}>
        <motion.form onSubmit={submit} className="glass" style={{width:'100%',maxWidth:480,padding:48}} initial={{opacity:0,x:30}} animate={{opacity:1,x:0}}>
          <h2 style={{fontSize:'2rem',marginBottom:8}}>Sign In</h2>
          <p style={{color:'var(--muted)',marginBottom:32}}>Use your username or email address</p>
          {error && <p style={{color:'var(--danger)',marginBottom:16,padding:'10px 16px',background:'rgba(239,68,68,0.1)',borderRadius:8}}>{error}</p>}
          <input className="inp" placeholder="Username or Email" value={loginId} onChange={e=>setLoginId(e.target.value)} required/>
          <input className="inp" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required/>
          <button type="submit" className="btn-p" style={{width:'100%',justifyContent:'center',padding:16,fontSize:'1.1rem',marginTop:8}}>Login to AgroVision</button>
          <div style={{marginTop:28,display:'flex',justifyContent:'space-between',fontSize:'0.95rem'}}>
            <Link href="/forgot-password" style={{color:'#4ADE80'}}>Forgot password?</Link>
            <Link href="/register" style={{color:'#4ADE80'}}>New here? Register</Link>
          </div>
        </motion.form>
      </div>
    </div>
  );
}

// ─── REGISTER ───
function Register() {
  const router = useRouter();
  const [form,setForm] = useState({name:'',father_name:'',mobile:'',email:'',dob:'',username:'',password:'',confirm_password:''});
  const [error,setError] = useState('');
  const handle = e => setForm({...form,[e.target.id]:e.target.value});
  const submit = async e => {
    e.preventDefault();
    if(form.password !== form.confirm_password){ setError('Passwords do not match'); return; }
    try {
      const r = await fetch('/api/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
      const d = await r.json();
      if(r.ok) router.push('/login'); else setError(d.detail);
    } catch { setError('Network error'); }
  };
  const fields = [
    {id:'name',label:'Full Name',type:'text'},{id:'father_name',label:"Father's Name",type:'text'},
    {id:'email',label:'Email ID',type:'email'},{id:'mobile',label:'Mobile Number',type:'tel'},
    {id:'dob',label:'Date of Birth',type:'date'},{id:'username',label:'Username',type:'text'},
    {id:'password',label:'Password',type:'password'},{id:'confirm_password',label:'Confirm Password',type:'password'}
  ];
  return (
    <div style={{minHeight:'100vh',paddingTop:120,paddingBottom:60,display:'flex',justifyContent:'center',alignItems:'center'}}>
      <motion.form onSubmit={submit} className="glass" style={{width:'100%',maxWidth:640,padding:52}} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
        <h2 style={{fontSize:'2rem',marginBottom:8}}>Create Account</h2>
        <p style={{color:'var(--muted)',marginBottom:32}}>Register to access crop diagnostics and farm analytics</p>
        {error && <p style={{color:'var(--danger)',marginBottom:20,padding:'10px 16px',background:'rgba(239,68,68,0.1)',borderRadius:8}}>{error}</p>}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 20px'}}>
          {fields.map(f=><input key={f.id} id={f.id} type={f.type} placeholder={f.label} className="inp" value={form[f.id]} onChange={handle} required/>)}
        </div>
        <button type="submit" className="btn-p" style={{width:'100%',justifyContent:'center',padding:16,fontSize:'1.1rem',marginTop:12}}>Create My Account</button>
        <div style={{textAlign:'center',marginTop:24}}><Link href="/login" style={{color:'#4ADE80',fontSize:'0.95rem'}}>Already have an account? Login</Link></div>
      </motion.form>
    </div>
  );
}

// ─── FORGOT PASSWORD ───
function ForgotPassword() {
  const router = useRouter();
  const [recoveryId,setRecoveryId] = useState(''); const [newPw,setNewPw] = useState(''); const [step,setStep] = useState(1);
  const [msg,setMsg] = useState(''); const [error,setError] = useState('');
  const verify = async e => {
    e.preventDefault();
    try {
      const r = await fetch('/api/forgot-password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({recovery_id:recoveryId})});
      const d = await r.json();
      if(r.ok){ setMsg(d.message); setError(''); setStep(2); } else { setError(d.detail); setMsg(''); }
    } catch { setError('Network error'); }
  };
  const reset = async e => {
    e.preventDefault();
    try {
      const r = await fetch('/api/reset-password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({recovery_id:recoveryId,new_password:newPw})});
      if(r.ok) router.push('/login'); else { const d = await r.json(); setError(d.detail); }
    } catch { setError('Network error'); }
  };
  return (
    <div style={{minHeight:'100vh',paddingTop:120,display:'flex',justifyContent:'center',alignItems:'center'}}>
      <motion.div className="glass" style={{width:'100%',maxWidth:480,padding:52}} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
        <h2 style={{fontSize:'2rem',marginBottom:8}}>Password Recovery</h2>
        <p style={{color:'var(--muted)',marginBottom:32}}>{step===1?'Enter your registered email or mobile number.':'Enter your new password.'}</p>
        {error && <p style={{color:'var(--danger)',marginBottom:16,padding:'10px 16px',background:'rgba(239,68,68,0.1)',borderRadius:8}}>{error}</p>}
        {msg && <p style={{color:'#22C55E',marginBottom:16,padding:'10px 16px',background:'rgba(34,197,94,0.1)',borderRadius:8}}>{msg}</p>}
        {step===1 ? (
          <form onSubmit={verify}>
            <input className="inp" placeholder="Registered Email or Mobile" value={recoveryId} onChange={e=>setRecoveryId(e.target.value)} required/>
            <button type="submit" className="btn-p" style={{width:'100%',justifyContent:'center',padding:16,marginTop:8}}>Verify Account</button>
          </form>
        ) : (
          <form onSubmit={reset}>
            <input className="inp" type="password" placeholder="New Password" value={newPw} onChange={e=>setNewPw(e.target.value)} required/>
            <button type="submit" className="btn-p" style={{width:'100%',justifyContent:'center',padding:16,marginTop:8}}>Reset Password</button>
          </form>
        )}
        <div style={{textAlign:'center',marginTop:28}}><Link href="/login" style={{color:'#4ADE80'}}>Back to Login</Link></div>
      </motion.div>
    </div>
  );
}

// ─── DASHBOARD ───
function Dashboard() {
  const router = useRouter();
  const [username,setUsername] = useState('Guest');
  const [scans,setScans] = useState([]); const [loading,setLoading] = useState(true);
  useEffect(() => {
    const u = localStorage.getItem('agro_username');
    if(!u){ router.push('/login'); return; }
    setUsername(u);
    fetch(`/api/scans?username=${encodeURIComponent(u)}`).then(r=>r.json()).then(d=>{setScans(Array.isArray(d)?d:[]); setLoading(false);}).catch(()=>setLoading(false));
  },[]);
  const totalScans = scans.length;
  const diseased = scans.filter(s=>!s.disease.toLowerCase().includes('healthy')).length;
  const healthy = scans.filter(s=>s.disease.toLowerCase().includes('healthy')).length;

  return (
    <div style={{display:'flex',minHeight:'100vh',paddingTop:90}}>
      <div style={{width:280,padding:32,borderRight:'1px solid rgba(255,255,255,0.1)',background:'rgba(0,0,0,0.2)'}}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:40}}>
          <div style={{width:44,height:44,borderRadius:'50%',background:'rgba(34,197,94,0.2)',display:'flex',alignItems:'center',justifyContent:'center'}}><User size={24} color="#4ADE80"/></div>
          <div><p style={{fontWeight:600}}>{username}</p><p style={{color:'var(--muted)',fontSize:'0.85rem'}}>Farmer Account</p></div>
        </div>
        <nav style={{display:'flex',flexDirection:'column',gap:8}}>
          <a href="#" style={{padding:'14px 20px',background:'rgba(34,197,94,0.1)',color:'#4ADE80',borderRadius:14,textDecoration:'none',display:'flex',alignItems:'center',gap:12,fontWeight:500}}><LayoutDashboard size={20}/> Overview</a>
          <Link href="/upload" style={{padding:'14px 20px',color:'var(--text)',borderRadius:14,display:'flex',alignItems:'center',gap:12}}><Leaf size={20}/> Scan Crop</Link>
          <a href="#" style={{padding:'14px 20px',color:'var(--text)',borderRadius:14,textDecoration:'none',display:'flex',alignItems:'center',gap:12}}><Wind size={20}/> Weather</a>
          <a href="#" style={{padding:'14px 20px',color:'var(--text)',borderRadius:14,textDecoration:'none',display:'flex',alignItems:'center',gap:12}}><Settings size={20}/> Settings</a>
        </nav>
      </div>
      <div style={{flex:1,padding:48}}>
        <h1 style={{fontSize:'2.5rem',marginBottom:12}}>Farm Intelligence</h1>
        <p style={{color:'var(--muted)',marginBottom:40}}>Welcome back, <strong style={{color:'#4ADE80'}}>{username}</strong>.</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:28,marginBottom:48}}>
          {[{title:'Total Scans',val:totalScans,icon:<Search size={24} color="#4ADE80"/>},{title:'Diseases Detected',val:diseased,icon:<Activity size={24} color="#FACC15"/>},{title:'Healthy Plants',val:healthy,icon:<Leaf size={24} color="#22C55E"/>}].map((s,i)=>(
            <motion.div key={i} className="glass" style={{padding:32}} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:16}}><span style={{color:'var(--muted)'}}>{s.title}</span>{s.icon}</div>
              <h3 style={{fontSize:'3rem',fontWeight:600}}>{s.val}</h3>
            </motion.div>
          ))}
        </div>
        <motion.div className="glass" style={{padding:40}} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
            <h3 style={{fontSize:'1.4rem',fontWeight:500}}>Recent Scan History</h3>
            <Link href="/upload" className="btn-p" style={{padding:'10px 20px',fontSize:'0.9rem'}}>+ New Scan</Link>
          </div>
          {loading ? <p style={{color:'var(--muted)',textAlign:'center',padding:'40px 0'}}>Loading scans...</p>
          : scans.length===0 ? (
            <div style={{textAlign:'center',padding:'60px 0'}}>
              <Microscope size={48} color="var(--muted)" style={{marginBottom:16}}/>
              <p style={{color:'var(--muted)',fontSize:'1.1rem'}}>No scans yet. Upload a leaf image!</p>
              <Link href="/upload" className="btn-p" style={{marginTop:20,display:'inline-flex'}}>Start Scanning</Link>
            </div>
          ) : (
            <div style={{display:'grid',gap:16}}>
              {scans.map((s,i)=>(
                <motion.div key={s.id} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}
                  style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 28px',background:'rgba(0,0,0,0.2)',borderRadius:16}}>
                  <div style={{display:'flex',alignItems:'center',gap:20}}>
                    <div style={{width:48,height:48,borderRadius:12,background:'rgba(255,255,255,0.05)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <Leaf color={s.disease.toLowerCase().includes('healthy')?'#4ADE80':'#FACC15'}/>
                    </div>
                    <div><h4 style={{fontSize:'1.1rem',marginBottom:4}}>{s.disease}</h4><p style={{color:'var(--muted)',fontSize:'0.85rem'}}>{s.filename} · {s.scanned_at}</p></div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{color:s.disease.toLowerCase().includes('healthy')?'#22C55E':'#FACC15',fontWeight:600,fontSize:'1.1rem'}}>{s.confidence}%</div>
                    <div style={{color:'var(--muted)',fontSize:'0.8rem'}}>{s.disease.toLowerCase().includes('healthy')?'All Clear':'Treatment Needed'}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// ─── ROUTER ───
const pages = {
  '/': Landing, '/upload': Upload, '/result': ResultPage, '/login': Login,
  '/register': Register, '/forgot-password': ForgotPassword, '/dashboard': Dashboard,
};

export default function Page() {
  const pathname = usePathname();
  const Comp = pages[pathname] || Landing;
  return (
    <>
      <div className="bg-mesh"/>
      <Navbar/>
      <AnimatePresence mode="wait"><Comp key={pathname}/></AnimatePresence>
    </>
  );
}
