import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Sparkles, RefreshCcw, Scissors, Palette, Glasses, CheckCircle2,
  Copy, Check, Image as ImageIcon, User, Camera, Watch, FileJson,
  FileText, Layers, Scan, Cpu, AlertTriangle, Coffee, MapPin, Lock,
  Users, ChevronDown, ChevronUp, Shield
} from 'lucide-react';
import {
  GENDERS, VIEW_MODES, COMPOSITIONS, BODY_TYPES, SHOOT_STYLES,
  POSES, CAMERA_LENSES, LIGHTING_STYLES, HAIRSTYLES, COLOR_TYPES,
  BASE_COLORS, ACCESSORIES_DATABASE, LUXURY_WATCHES, FACIAL_HAIR,
  HIJAB_STYLES, EXPRESSIONS, MAKEUP_STYLES, BACKGROUNDS,
  CLOTHING_MATERIALS, COLOR_THEMES, CLOTHING_DATABASE,
  getClothingSceneScore
} from './data.js';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const ID_PHOTO_SHOOT_STYLE_ID = 'Official ID photo style, front-facing, formal';

const ID_PHOTO_LOCKED = {
  pose: 'Front-facing close-up headshot',
  composition: 'Perfect Symmetry and Balance, subject perfectly centered',
  cameraLens: 'Standard portrait lens (50mm)',
  lighting: 'Bright, even flat studio lighting, no shadows on face',
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const getBgType = (bgId) => {
  for (const group of BACKGROUNDS) {
    for (const item of group.items) {
      if (item.id === bgId) return item.type || 'all';
    }
  }
  return 'all';
};

const filterPosesByBg = (bgId, bgType) => {
  return POSES.map(group => {
    const filteredItems = group.items.filter(item => {
      if (item.id === 'match_bg_pose') return bgId === 'image_ref_bg';
      return !item.allowedTypes || item.allowedTypes.includes('all') || item.allowedTypes.includes(bgType);
    });
    return { ...group, items: filteredItems };
  }).filter(group => group.items.length > 0);
};

const filterOptionsByBg = (optionsArray, bgType) => {
  return optionsArray.map(group => {
    if (!group.items) return group;
    const filteredItems = group.items.filter(item =>
      !item.allowedTypes || item.allowedTypes.includes('all') || item.allowedTypes.includes(bgType)
    );
    return { ...group, items: filteredItems };
  }).filter(group => group.items && group.items.length > 0);
};

const filterArrayByBg = (array, bgType) => {
  return array.filter(item =>
    !item.allowedTypes || item.allowedTypes.includes('all') || item.allowedTypes.includes(bgType)
  );
};

const isClothingValidForGender = (clothingId, gender, isHijab) => {
  if (clothingId === 'Original clothing from reference') return true;
  for (const group of CLOTHING_DATABASE) {
    for (const item of group.items) {
      if (item.id === clothingId) {
        if (gender === 'Wanita') return isHijab ?
          item.tags.includes('hijab_approved') : (item.tags.includes('female') || item.tags.includes('unisex'));
        if (gender === 'Pria') return item.tags.includes('male') || item.tags.includes('unisex');
        return true;
      }
    }
  }
  return false;
};

const hslToHex = (h, s, l) => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

// ─── DEFAULT SUBJECT FACTORY ──────────────────────────────────────────────────

const createDefaultSubject = (idx) => ({
  id: idx,
  gender: 'Pria',
  expression: 'Natural neutral expression',
  useHijab: false,
  hairstyle: (HAIRSTYLES['Pria'] || HAIRSTYLES['Unisex'] || [])[0] || '',
  hijab: (HIJAB_STYLES || [])[0]?.id || '',
  facialHair: (FACIAL_HAIR || [])[0]?.id || '',
  makeup: (MAKEUP_STYLES || [])[0]?.id || '',
  clothing: 'Original clothing from reference',
  clothingMaterial: (CLOTHING_MATERIALS || [])[0]?.id || '',
  colorTheme: (COLOR_THEMES || [])[0]?.id || 'Original colors',
  manualColor1: '#8b5cf6',
  manualColor2: '#ec4899',
  manualColor3: '#10b981',
});

// ─── SCENE BADGE ──────────────────────────────────────────────────────────────

const SceneBadge = ({ score }) => {
  if (score === 2) return null;
  if (score === 1) return (
    <span className="ml-1 text-[9px] px-1.5 py-0.5 rounded-full bg-amber-900/50 text-amber-300 border border-amber-700/50 font-bold shrink-0">
      ~ cocok
    </span>
  );
  return (
    <span className="ml-1 text-[9px] px-1.5 py-0.5 rounded-full bg-red-900/40 text-red-300 border border-red-700/40 font-bold shrink-0 flex items-center gap-0.5">
      <AlertTriangle className="w-2.5 h-2.5" /> kurang cocok
    </span>
  );
};

// ─── LOCK BADGE ──────────────────────────────────────────────────────────────

const LockBadge = () => (
  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-900/40 text-amber-300 border border-amber-600/40 font-bold">
    <Lock className="w-2.5 h-2.5" /> Terkunci
  </span>
);

// ─── SUBJECT PANEL COMPONENT ──────────────────────────────────────────────────

const SubjectPanel = ({ subject, idx, onChange }) => {
  const [expanded, setExpanded] = useState(true);
  const [clothCategory, setClothCategory] = useState('');

  const subjectDynamicClothing = useMemo(() => {
    return CLOTHING_DATABASE.map(group => ({
      group: group.group,
      items: group.items.filter(item => {
        if (subject.gender === 'Wanita') return subject.useHijab ?
          item.tags.includes('hijab_approved') : (item.tags.includes('female') || item.tags.includes('unisex'));
        if (subject.gender === 'Pria') return item.tags.includes('male') || item.tags.includes('unisex');
        return true;
      }),
    })).filter(group => group.items.length > 0);
  }, [subject.gender, subject.useHijab]);

  // sync clothCategory when dynamicClothing changes
  useEffect(() => {
    if (subjectDynamicClothing.length > 0) {
      const valid = subjectDynamicClothing.some(g => g.group === clothCategory);
      if (!valid) setClothCategory(subjectDynamicClothing[0].group);
    }
  }, [subjectDynamicClothing, clothCategory]);

  const hairstyleList = useMemo(() => HAIRSTYLES[subject.gender] || HAIRSTYLES['Unisex'] || [], [subject.gender]);

  const handleGenderChange = (e) => {
    const newGender = e.target.value;
    const list = HAIRSTYLES[newGender] || HAIRSTYLES['Unisex'] || [];
    const newHijab = newGender !== 'Wanita' ? false : subject.useHijab;
    onChange(idx, {
      gender: newGender,
      useHijab: newHijab,
      hairstyle: list[0] || '',
      clothing: 'Original clothing from reference',
    });
  };

  const personAccents = [
    { border: 'border-indigo-500', text: 'text-indigo-400', bg: 'bg-indigo-500', gradient: 'from-indigo-500/10 to-purple-500/5 border-indigo-500/30' },
    { border: 'border-pink-500', text: 'text-pink-400', bg: 'bg-pink-500', gradient: 'from-pink-500/10 to-rose-500/5 border-pink-500/30' },
    { border: 'border-emerald-500', text: 'text-emerald-400', bg: 'bg-emerald-500', gradient: 'from-emerald-500/10 to-teal-500/5 border-emerald-500/30' },
    { border: 'border-amber-500', text: 'text-amber-400', bg: 'bg-amber-500', gradient: 'from-amber-500/10 to-orange-500/5 border-amber-500/30' },
  ];
  const accent = personAccents[idx] || personAccents[0];

  return (
    <div className={`rounded-2xl border bg-gradient-to-br ${accent.gradient} overflow-hidden transition-all duration-300`}>
      {/* Header toggle */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full bg-neutral-800/80 border-2 ${accent.border} flex items-center justify-center text-sm font-bold ${accent.text}`}>
            {idx + 1}
          </div>
          <div className="text-left">
            <div className={`font-semibold text-sm ${accent.text}`}>
              Orang ke-{idx + 1}
            </div>
            <div className="text-xs text-neutral-400">
              {subject.gender} · {subject.useHijab ? 'Berhijab' : 'Non-hijab'} · {(subject.expression || '').split(',')[0]}
            </div>
          </div>
        </div>
        {expanded
          ? <ChevronUp className="w-4 h-4 text-neutral-400" />
          : <ChevronDown className="w-4 h-4 text-neutral-400" />}
      </button>

      {/* Body */}
      {expanded && (
        <div className="px-4 pb-5 space-y-4 border-t border-white/5 pt-4">

          {/* Gender + Expression */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-400">Gender</label>
              <select value={subject.gender} onChange={handleGenderChange}
                className="w-full bg-neutral-900/80 border border-neutral-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-neutral-100">
                {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-400">Ekspresi</label>
              <select value={subject.expression} onChange={e => onChange(idx, { expression: e.target.value })}
                className="w-full bg-neutral-900/80 border border-neutral-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-neutral-100">
                {EXPRESSIONS.map(ex => <option key={ex.id} value={ex.id}>{ex.label}</option>)}
              </select>
            </div>
          </div>

          {/* Hijab toggle */}
          {subject.gender === 'Wanita' && (
            <label className="flex items-center gap-2 text-sm bg-neutral-900/50 px-3 py-2 rounded-lg border border-neutral-700 cursor-pointer hover:border-indigo-500/50 transition-colors">
              <input type="checkbox" checked={subject.useHijab}
                onChange={e => onChange(idx, { useHijab: e.target.checked, clothing: 'Original clothing from reference' })}
                className="rounded text-indigo-500 bg-neutral-800 border-neutral-600" />
              <span className="text-neutral-300 text-sm">Gunakan Hijab</span>
            </label>
          )}

          {/* Hair / Hijab selector */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-400">
              {subject.useHijab ? 'Gaya Hijab' : 'Gaya Rambut'}
            </label>
            {subject.useHijab ? (
              <select value={subject.hijab} onChange={e => onChange(idx, { hijab: e.target.value })}
                className="w-full bg-neutral-900/80 border border-neutral-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-neutral-100">
                {HIJAB_STYLES.map(h => <option key={h.id} value={h.id}>{h.label}</option>)}
              </select>
            ) : (
              <select value={subject.hairstyle} onChange={e => onChange(idx, { hairstyle: e.target.value })}
                className="w-full bg-neutral-900/80 border border-neutral-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-neutral-100">
                {hairstyleList.map((h, i) => (
                  <option key={i} value={h}>{h.length > 60 ? h.substring(0, 60) + '…' : h}</option>
                ))}
              </select>
            )}
          </div>

          {/* Facial Hair (male only) */}
          {subject.gender !== 'Wanita' && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-400">Kumis & Janggut</label>
              <select value={subject.facialHair} onChange={e => onChange(idx, { facialHair: e.target.value })}
                className="w-full bg-neutral-900/80 border border-neutral-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-neutral-100">
                {FACIAL_HAIR.map(fh => <option key={fh.id} value={fh.id}>{fh.label}</option>)}
              </select>
            </div>
          )}

          {/* Makeup */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-400">Makeup & Efek Wajah</label>
            <select value={subject.makeup} onChange={e => onChange(idx, { makeup: e.target.value })}
              className="w-full bg-neutral-900/80 border border-neutral-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-neutral-100">
              {MAKEUP_STYLES.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
            </select>
          </div>

          {/* Clothing */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-400">Pakaian</label>
            <div className="flex gap-1.5 flex-wrap">
              {subjectDynamicClothing.map(g => (
                <button key={g.group} onClick={() => setClothCategory(g.group)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-all ${clothCategory === g.group
                    ? 'bg-indigo-600/80 border-indigo-500 text-white'
                    : 'bg-neutral-900/50 border-neutral-700 text-neutral-400 hover:border-neutral-500'}`}>
                  {g.group}
                </button>
              ))}
            </div>
            <select value={subject.clothing} onChange={e => onChange(idx, { clothing: e.target.value })}
              className="w-full bg-neutral-900/80 border border-neutral-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-neutral-100">
              <option value="Original clothing from reference">Original clothing from reference</option>
              {subjectDynamicClothing
                .filter(g => g.group === clothCategory)
                .flatMap(g => g.items)
                .map(item => (
                  <option key={item.id} value={item.id}>
                    {item.label.length > 65 ? item.label.substring(0, 65) + '…' : item.label}
                  </option>
                ))}
            </select>
          </div>

          {/* Color Theme */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-400">Tema Warna Pakaian</label>
            <select value={subject.colorTheme} onChange={e => onChange(idx, { colorTheme: e.target.value })}
              className="w-full bg-neutral-900/80 border border-neutral-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-neutral-100">
              {COLOR_THEMES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>

          {subject.colorTheme !== 'Original colors' && (
            <div className="flex gap-3 items-center">
              {[
                ['manualColor1', subject.manualColor1],
                ['manualColor2', subject.manualColor2],
                ['manualColor3', subject.manualColor3],
              ].map(([key, val]) => (
                <div key={key} className="flex flex-col items-center gap-1">
                  <input type="color" value={val}
                    onChange={e => onChange(idx, { [key]: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-neutral-700 bg-transparent" />
                  <span className="text-[9px] text-neutral-500">{val}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function App() {
  const [outputFormat, setOutputFormat] = useState('json');
  const [generatedPrompt, setGeneratedPrompt] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [showSmartAlert, setShowSmartAlert] = useState(false);
  const [smartAlertMsg, setSmartAlertMsg] = useState('');
  const alertTimerRef = useRef(null);

  // ── Primary (Single) Subject State ────────────────────────────────────────
  const [gender, setGender] = useState('Pria');
  const [bodyType, setBodyType] = useState(BODY_TYPES[0].id);
  const [viewMode, setViewMode] = useState('1-photo');
  const [shootStyle, setShootStyle] = useState(SHOOT_STYLES[2].id);
  const [pose, setPose] = useState(POSES[0].items[0].id);
  const [composition, setComposition] = useState(COMPOSITIONS[0].id);
  const [lighting, setLighting] = useState(LIGHTING_STYLES[0].items[0].id);
  const [cameraLens, setCameraLens] = useState(CAMERA_LENSES[0].id);

  const [hairstyles, setHairstyles] = useState([
    'Original hairstyle from reference image (Sesuai Asli)',
    'Original hairstyle from reference image (Sesuai Asli)',
    'Original hairstyle from reference image (Sesuai Asli)',
    'Original hairstyle from reference image (Sesuai Asli)',
  ]);
  const [colorType, setColorType] = useState('One Tone');
  const [color1, setColor1] = useState('Dark Brown');
  const [color2, setColor2] = useState('Blonde');
  const [color3, setColor3] = useState('Pink');

  const [accessories, setAccessories] = useState([]);
  const [watch, setWatch] = useState('No watch');
  const [facialHair, setFacialHair] = useState(FACIAL_HAIR[0].id);
  const [useHijab, setUseHijab] = useState(false);
  const [hijabs, setHijabs] = useState([
    HIJAB_STYLES[0].id, HIJAB_STYLES[1].id, HIJAB_STYLES[2].id, HIJAB_STYLES[3].id,
  ]);
  const [expression, setExpression] = useState(EXPRESSIONS[0].id);
  const [makeup, setMakeup] = useState(MAKEUP_STYLES[0].id);

  const [useClothingReference, setUseClothingReference] = useState(false);
  const [clothingMaterial, setClothingMaterial] = useState(CLOTHING_MATERIALS[0].id);
  const [colorTheme, setColorTheme] = useState(COLOR_THEMES[0].id);
  const [manualColor1, setManualColor1] = useState('#8b5cf6');
  const [manualColor2, setManualColor2] = useState('#ec4899');
  const [manualColor3, setManualColor3] = useState('#10b981');
  const [clothing, setClothing] = useState('Original clothing from reference');

  const [bgCategory, setBgCategory] = useState(BACKGROUNDS[1].group);
  const [background, setBackground] = useState(BACKGROUNDS[1].items[0].id);
  const [customBackground, setCustomBackground] = useState('');
  const [accCategory, setAccCategory] = useState(ACCESSORIES_DATABASE[0].group);
  const [clothCategory, setClothCategory] = useState(CLOTHING_DATABASE[0].group);

  // ── Multi-Subject State ───────────────────────────────────────────────────
  const [subjectCount, setSubjectCount] = useState(1);
  const [subjects, setSubjects] = useState(() => [
    createDefaultSubject(0),
    createDefaultSubject(1),
    createDefaultSubject(2),
    createDefaultSubject(3),
  ]);

  // ── ID Photo Lock ─────────────────────────────────────────────────────────
  const isIdPhotoMode = useMemo(() => shootStyle === ID_PHOTO_SHOOT_STYLE_ID, [shootStyle]);

  useEffect(() => {
    if (isIdPhotoMode) {
      setPose(ID_PHOTO_LOCKED.pose);
      setComposition(ID_PHOTO_LOCKED.composition);
      setCameraLens(ID_PHOTO_LOCKED.cameraLens);
      setLighting(ID_PHOTO_LOCKED.lighting);
    }
  }, [isIdPhotoMode]);

  // ── Alert ─────────────────────────────────────────────────────────────────
  const triggerSmartAlert = useCallback((msg = 'Logika Cerdas Aktif: Pilihan yang tidak cocok otomatis direset.') => {
    if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
    setSmartAlertMsg(msg);
    setShowSmartAlert(true);
    alertTimerRef.current = setTimeout(() => setShowSmartAlert(false), 3500);
  }, []);

  // ── Derived data ──────────────────────────────────────────────────────────
  const currentBgType = useMemo(() => getBgType(background), [background]);

  const dynamicClothingGroups = useMemo(() => {
    return CLOTHING_DATABASE.map(group => ({
      group: group.group,
      items: group.items.filter(item => {
        if (gender === 'Wanita') return useHijab
          ? item.tags.includes('hijab_approved')
          : (item.tags.includes('female') || item.tags.includes('unisex'));
        if (gender === 'Pria') return item.tags.includes('male') || item.tags.includes('unisex');
        return true;
      }),
    })).filter(group => group.items.length > 0);
  }, [gender, useHijab]);

  const dynamicAccessoryGroups = useMemo(() => {
    const groups = ACCESSORIES_DATABASE.map(g => ({ ...g, items: [...g.items] }));
    if (gender === 'Wanita') {
      const headwearGroup = groups.find(g => g.group === 'Topi & Kepala');
      const jewelryGroup = groups.find(g => g.group === 'Perhiasan & Tindik');
      if (useHijab && headwearGroup) {
        headwearGroup.items.push({ id: 'Decorative hijab brooch', label: 'Bros Hijab (Brooch)' });
      } else if (!useHijab && jewelryGroup) {
        jewelryGroup.items.push({ id: 'Small stud earrings', label: 'Anting Stud Kecil' });
        jewelryGroup.items.push({ id: 'Dangling earrings', label: 'Anting Panjang (Dangling)' });
      }
    }
    return groups;
  }, [gender, useHijab]);

  const dynamicPoses = useMemo(() => filterPosesByBg(background, currentBgType), [background, currentBgType]);
  const dynamicLighting = useMemo(() => filterOptionsByBg(LIGHTING_STYLES, currentBgType), [currentBgType]);
  const dynamicLenses = useMemo(() => filterArrayByBg(CAMERA_LENSES, currentBgType), [currentBgType]);

  const currentClothingSceneScore = useMemo(() => {
    const clothItem = CLOTHING_DATABASE.flatMap(g => g.items).find(i => i.id === clothing);
    if (!clothItem) return 2;
    return getClothingSceneScore(clothItem, currentBgType);
  }, [clothing, currentBgType]);

  useEffect(() => {
    const isValidCategory = dynamicClothingGroups.some(g => g.group === clothCategory);
    if (!isValidCategory && dynamicClothingGroups.length > 0) {
      setClothCategory(dynamicClothingGroups[0].group);
    }
  }, [dynamicClothingGroups, clothCategory]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleGenderChange = useCallback((e) => {
    const newGender = e.target.value;
    setGender(newGender);
    const list = HAIRSTYLES[newGender] || HAIRSTYLES['Unisex'];
    setHairstyles([list[0], list[1 % list.length], list[2 % list.length], list[3 % list.length]]);
    let newHijab = useHijab;
    if (newGender !== 'Wanita') { setUseHijab(false); newHijab = false; }
    if (!isClothingValidForGender(clothing, newGender, newHijab)) {
      setClothing('Original clothing from reference');
      triggerSmartAlert('Gender berubah: Pakaian direset ke Referensi Asli.');
    }
  }, [useHijab, clothing, triggerSmartAlert]);

  const handleHijabChange = useCallback((e) => {
    const checked = e.target.checked;
    setUseHijab(checked);
    if (!isClothingValidForGender(clothing, gender, checked)) {
      setClothing('Original clothing from reference');
      triggerSmartAlert('Mode Hijab berubah: Pakaian direset.');
    }
  }, [clothing, gender, triggerSmartAlert]);

  const handleHairstyleChange = useCallback((idx, value) => {
    setHairstyles(prev => { const next = [...prev]; next[idx] = value; return next; });
  }, []);

  const handleHijabStyleChange = useCallback((idx, value) => {
    setHijabs(prev => { const next = [...prev]; next[idx] = value; return next; });
  }, []);

  const handleAccessoryToggle = useCallback((id) => {
    setAccessories(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  }, []);

  const handleSubjectChange = useCallback((idx, changes) => {
    setSubjects(prev => prev.map((s, i) => i === idx ? { ...s, ...changes } : s));
  }, []);

  const handleCopy = useCallback(async () => {
    if (!generatedPrompt) return;
    const textToCopy = outputFormat === 'json' ? generatedPrompt.json : generatedPrompt.structured;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const ta = document.createElement('textarea');
        ta.value = textToCopy;
        ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) { console.error('Failed to copy:', err); }
  }, [generatedPrompt, outputFormat]);

  // ── Generate ──────────────────────────────────────────────────────────────
  const handleGenerate = useCallback(() => {
    const effectivePose = isIdPhotoMode ? ID_PHOTO_LOCKED.pose : pose;
    const effectiveComposition = isIdPhotoMode ? ID_PHOTO_LOCKED.composition : composition;
    const effectiveLens = isIdPhotoMode ? ID_PHOTO_LOCKED.cameraLens : cameraLens;
    const effectiveLighting = isIdPhotoMode ? ID_PHOTO_LOCKED.lighting : lighting;

    let colors = color1;
    if (colorType.includes('Two') || colorType === 'Highlight') colors += ` and ${color2} ${colorType}`;
    if (colorType.includes('Tri')) colors += `, ${color2}, and ${color3} ${colorType}`;

    const accNames = [...accessories];
    if (watch !== 'No watch') accNames.push(watch);
    const accessoriesString = accNames.length > 0 ? accNames.join(', ') : 'None';

    const finalBackground = background === 'custom_bg' && customBackground.trim() !== ''
      ? customBackground
      : (background === 'custom_bg' ? 'A studio background' : background);

    const isMulti = subjectCount > 1;
    const activeSubjects = subjects.slice(0, subjectCount);

    let promptText = '';

    // ── ID Photo strict header ────────────────────────────────────────────
    if (isIdPhotoMode) {
      promptText += 'OFFICIAL ID PHOTO / PASSPORT PHOTO GENERATION. ';
      promptText += 'This is a STRICTLY FORMAL government-grade identification photograph. ';
      promptText += 'MANDATORY: Subject MUST face DIRECTLY forward (0° angle, no tilt, no side view). ';
      promptText += 'Expression: neutral and calm. Mouth closed. Absolutely NO smiling, NO teeth visible. ';
      promptText += 'Eyes MUST be fully open, looking straight into the camera. Head perfectly upright. ';
      promptText += 'Composition: perfectly centered and symmetrical. ';
      promptText += 'Lighting: completely flat and even, zero shadows on face or background. ';
      promptText += 'Standard 50mm lens — NO distortion, NO bokeh, NO blur. ';
      promptText += 'Background: uniform solid plain color (as specified). ';
      promptText += 'ZERO artistic styling. ZERO creative angles. ZERO dramatic effects. ';
      promptText += '\n[STRICT ID PHOTO VALIDATION]: Any tilt, smile, side angle, bokeh, dramatic light, or artistic element is STRICTLY FORBIDDEN. ';
    } else {
      if (viewMode === '1-photo') {
        promptText += 'Create a single high-quality photographic image. Do NOT create a grid. ';
      } else {
        promptText += 'Create a 2x2 grid image panel with a 3:4 aspect ratio per panel. ';
      }
    }

    // ── Multi subject block ────────────────────────────────────────────────
    if (isMulti) {
      promptText += `\n[MULTI-SUBJECT SCENE]: This image MUST contain EXACTLY ${subjectCount} people. `;
      promptText += `Do NOT omit any person. Generate all ${subjectCount} as specified. `;
      promptText += '\nEach person has their own distinct facial identity. Maintain consistent identity per person. ';

      activeSubjects.forEach((s, i) => {
        const gLabel = s.gender === 'Pria' ? 'Male' : s.gender === 'Wanita' ? 'Female' : 'Unisex';
        const styleStr = s.useHijab ? `Wearing ${s.hijab}` : `Hairstyle: ${s.hairstyle}`;
        const clothStr = s.clothing !== 'Original clothing from reference' ? s.clothing : 'Original clothing from their reference';
        const colorStr = s.colorTheme !== 'Original colors'
          ? ` Color palette: ${s.colorTheme} (${s.manualColor1}, ${s.manualColor2}, ${s.manualColor3}).`
          : '';
        promptText += `\n\n--- PERSON ${i + 1} (${gLabel}) ---`;
        promptText += `\nFace Identity: Use Face Reference Image ${i + 1}. `;
        promptText += `Expression: ${s.expression}. `;
        promptText += `${styleStr}. `;
        if (s.gender !== 'Wanita' && s.facialHair !== FACIAL_HAIR[0].id) promptText += `Facial Hair: ${s.facialHair}. `;
        if (s.makeup !== MAKEUP_STYLES[0].id) promptText += `Makeup: ${s.makeup}. `;
        promptText += `Clothing: ${clothStr}.${colorStr}`;
      });

      promptText += '\n\n[SCENE & ENVIRONMENT]';
    } else {
      // Single subject
      promptText += "\nSTRICT FACIAL CONSISTENCY MODE: Use the provided **Face Reference Image** to maintain subject identity. ";
      promptText += `\nSubject: Single (${gender === 'Pria' ? 'Male' : gender === 'Wanita' ? 'Female' : 'Androgynous/Unisex'}). `;
      promptText += '\n[ENTITY COUNT]: CRITICAL — EXACTLY ONE person. NO extra characters. NO clones. ';
      if (bodyType !== BODY_TYPES[0].id) promptText += `Body Type: ${bodyType}. `;
      if (accessoriesString !== 'None') promptText += `Accessories: ${accessoriesString}. `;
      if (facialHair !== FACIAL_HAIR[0].id && gender !== 'Wanita') promptText += `Facial Hair: ${facialHair}. `;
      promptText += `Facial Expression: ${expression}. `;
      if (makeup !== MAKEUP_STYLES[0].id) promptText += `Makeup & Face Details: ${makeup}. `;

      if (useClothingReference) {
        promptText += "Clothing & Attire: EXACTLY match the clothing style, layering, and silhouette shown in the **Secondary Style Reference Image**. ";
        if (clothingMaterial !== 'Original material') promptText += `Alter the primary fabric to ${clothingMaterial}. `;
      } else {
        let outfitDesc = '';
        if (clothing !== 'Original clothing from reference') {
          outfitDesc += `Clothing: ${clothing}`;
          outfitDesc += clothingMaterial !== 'Original material' ? `, made from ${clothingMaterial}. ` : '. ';
        } else if (clothingMaterial !== 'Original material') {
          outfitDesc += `Update the original clothing from the reference image to ${clothingMaterial}. `;
        }
        if (colorTheme !== 'Original colors') {
          if (colorTheme === 'Manual') {
            outfitDesc += `Outfit color palette must be hex colors ${manualColor1}, ${manualColor2}, ${manualColor3}. `;
          } else {
            outfitDesc += `Outfit must feature a ${colorTheme} (incorporating hex colors ${manualColor1}, ${manualColor2}, ${manualColor3}). `;
          }
        }
        promptText += outfitDesc;
      }
    }

    // Background
    if (background === 'image_ref_bg') {
      promptText += "Background, Lighting & Camera Angle: EXACTLY match the environment, lighting, and perspective from the **Background Reference Image**. ";
      if (!isMulti) promptText += "\n[CRITICAL]: Do NOT copy the face from the Background Reference. Face MUST match **Image 1: Face Reference** only. ";
    } else if (finalBackground !== 'Original background from the reference image') {
      promptText += `Background Setting: ${finalBackground}. `;
    }

    // Single 1-photo photography settings
    if (!isMulti && viewMode === '1-photo') {
      const styleStr = useHijab
        ? `Wearing ${hijabs[0]}`
        : (hairstyles[0].includes('Original hairstyle') ? `Hairstyle: ${hairstyles[0]}` : `Hairstyle: ${hairstyles[0]}, Hair Color: ${colors}`);
      promptText += `\nStyle: ${styleStr}. `;
      promptText += `\nPhotography Style & Vibe: ${shootStyle}. `;

      if (!isIdPhotoMode) {
        if (effectiveComposition !== COMPOSITIONS[0].id) promptText += `Composition Rule: ${effectiveComposition}. `;
        if (background !== 'image_ref_bg') {
          if (effectiveLens !== CAMERA_LENSES[0].id) promptText += `Camera Lens: Use a ${effectiveLens}. `;
          if (effectivePose !== 'Pose matching the original reference') promptText += `Camera Angle & Pose: ${effectivePose}. `;
          if (effectiveLighting !== 'Standard natural daylight') {
            promptText += `Lighting: ${effectiveLighting}. `;
            if (effectiveLighting.includes('Chiaroscuro')) promptText += '(CRITICAL: Strong chiaroscuro, face bright, background dark). ';
            if (effectiveLighting.includes('Gobo') || effectiveLighting.includes('gobo')) promptText += '(CRITICAL: Clear aesthetic shadow stripes across subject). ';
            if (effectiveLighting.includes('Golden Hour Backlighting')) promptText += "(CRITICAL: Strong warm rim light on hair and shoulders). ";
            if (effectiveLighting.toLowerCase().includes('softbox') || effectiveLighting.toLowerCase().includes('ring light')) {
              promptText += '\n(CRITICAL: Do NOT show any physical lighting equipment in frame. Only the lighting EFFECT).';
            }
          }
        } else {
          if (effectivePose === 'match_bg_pose') {
            promptText += 'Camera Angle & Pose: MATCH the pose from the Background Reference Image. ';
          } else if (effectivePose !== 'Pose matching the original reference') {
            promptText += `Camera Angle & Pose: ${effectivePose} (Adapted to the provided background reference). `;
          }
        }
      }
      promptText += '\nLayout Instruction: SINGLE image only.';
    } else if (!isMulti && viewMode === '4-angles') {
      const styleStr = useHijab
        ? `Wearing ${hijabs[0]}`
        : (hairstyles[0].includes('Original hairstyle') ? `Hairstyle: ${hairstyles[0]}` : `Hairstyle: ${hairstyles[0]}, Hair Color: ${colors}`);
      promptText += `\nStyle: ${styleStr}. `;
      promptText += '\nLayout Instruction: The 2x2 grid must show the EXACT SAME person from 4 angles: Top-Left (Front), Top-Right (Left Profile), Bottom-Left (Right Profile), Bottom-Right (Back).';
    } else if (!isMulti) {
      promptText += '\nLayout Instruction: The 2x2 grid shows 4 stylistic variations. Front-facing portrait for ALL panels.';
      if (useHijab) {
        hijabs.forEach((h, i) => { promptText += `\n- Panel ${i + 1}: ${h}.`; });
      } else {
        hairstyles.forEach((h, i) => { promptText += `\n- Panel ${i + 1}: ${h}.`; });
        promptText += `\nHair Color for all panels: ${colors} (Unless original is selected).`;
      }
    }

    // ── Required inputs ───────────────────────────────────────────────────
    const requiredInputs = isMulti
      ? activeSubjects.map((_, i) => `Image ${i + 1}: Face Reference for Person ${i + 1}`)
      : ['Image 1: Face Reference (For Identity)'];
    if (!isMulti && useClothingReference) requiredInputs.push(`Image ${requiredInputs.length + 1}: Style Reference (Clothing/Outfit)`);
    if (background === 'image_ref_bg') requiredInputs.push(`Image ${requiredInputs.length + 1}: Background Reference (Location, Angle & Lighting)`);

    // ── JSON Object ───────────────────────────────────────────────────────
    const jsonObj = {
      app_name: 'AI Professional Studio',
      system_directive: isIdPhotoMode
        ? 'ID PHOTO STRICT MODE ENABLED'
        : isMulti
          ? `MULTI-SUBJECT MODE (${subjectCount} PEOPLE)`
          : 'STRICT FACIAL CONSISTENCY ENABLED',
      required_inputs: requiredInputs,
      parameters: isMulti ? {
        mode: 'Multi-Subject',
        subject_count: subjectCount,
        subjects: activeSubjects.map((s, i) => ({
          person: i + 1,
          gender: s.gender === 'Pria' ? 'Male' : s.gender === 'Wanita' ? 'Female' : 'Unisex',
          expression: s.expression,
          style: s.useHijab ? `Hijab: ${s.hijab}` : `Hairstyle: ${s.hairstyle}`,
          facial_hair: s.gender !== 'Wanita' ? s.facialHair : 'N/A',
          makeup: s.makeup,
          clothing: s.clothing,
          color_theme: s.colorTheme !== 'Original colors'
            ? `${s.colorTheme} (${s.manualColor1}, ${s.manualColor2}, ${s.manualColor3})`
            : 'Original colors',
        })),
        background: background === 'image_ref_bg' ? 'USE EXTERNAL BACKGROUND REFERENCE IMAGE' : finalBackground,
        photography: viewMode === '1-photo' ? {
          shoot_style: shootStyle,
          composition_rule: effectiveComposition,
          camera_lens: background === 'image_ref_bg' ? 'Matched to BG Image' : effectiveLens,
          pose_framing: effectivePose,
          lighting_artistic: background === 'image_ref_bg' ? 'Matched to BG Image' : effectiveLighting,
        } : 'N/A (Grid mode)',
      } : {
        subject_gender: gender === 'Pria' ? 'Male' : gender === 'Wanita' ? 'Female' : 'Unisex',
        entity_count_constraint: 'CRITICAL: EXACTLY ONE person. NO extra characters.',
        body_type: bodyType,
        layout_mode: viewMode === '1-photo' ? 'Single Portrait' : viewMode === '4-angles' ? 'Grid 2x2 (4 Angles)' : 'Grid 2x2 (4 Styles)',
        hair_or_hijab: useHijab ? 'Hijab' : 'Hair',
        styles_list: (viewMode === '4-angles' || viewMode === '1-photo')
          ? [useHijab ? hijabs[0] : hairstyles[0]]
          : (useHijab ? hijabs : hairstyles),
        hair_color: useHijab ? 'N/A' : colors,
        makeup_and_fx: makeup,
        facial_hair: gender === 'Wanita' ? 'N/A' : facialHair,
        expression,
        clothing: useClothingReference ? 'USE EXTERNAL STYLE REFERENCE IMAGE' : clothing,
        clothing_material: clothingMaterial,
        color_palette: useClothingReference ? 'N/A' : (colorTheme === 'Original colors' ? 'Original colors' : `${colorTheme === 'Manual' ? 'Manual' : colorTheme} (${manualColor1}, ${manualColor2}, ${manualColor3})`),
        accessories: accessoriesString,
        background: background === 'image_ref_bg' ? 'USE EXTERNAL BACKGROUND REFERENCE IMAGE' : finalBackground,
        photography: viewMode === '1-photo' ? {
          shoot_style: shootStyle,
          id_photo_mode_locked: isIdPhotoMode,
          composition_rule: isIdPhotoMode ? `🔒 LOCKED: ${effectiveComposition}` : effectiveComposition,
          camera_lens: background === 'image_ref_bg' ? 'Matched to BG Image' : (isIdPhotoMode ? `🔒 LOCKED: ${effectiveLens}` : effectiveLens),
          pose_framing: isIdPhotoMode ? `🔒 LOCKED: ${effectivePose}` : (pose === 'match_bg_pose' ? 'Matched to BG Image' : effectivePose),
          lighting_artistic: background === 'image_ref_bg' ? 'Matched to BG Image' : (isIdPhotoMode ? `🔒 LOCKED: ${effectiveLighting}` : effectiveLighting),
        } : 'N/A',
      },
      text_prompt: promptText,
    };

    // ── Structured text output ────────────────────────────────────────────
    const structuredStr = isIdPhotoMode
      ? `[SYSTEM INSTRUCTIONS]
> ⚠️ ID PHOTO STRICT MODE ACTIVE — All photography settings LOCKED for official ID/Passport compliance.

[REQUIRED IMAGES]
${requiredInputs.map(r => `- ${r}`).join('\n')}

[SUBJECT DETAILS]
- Gender: ${jsonObj.parameters.subject_gender}
- Expression: Neutral (Locked — no smiling, mouth closed)
- Head Position: Front-facing only, perfectly upright (Locked)
${useHijab ? `- Hijab Style: ${hijabs[0]}` : `- Hairstyle: ${hairstyles[0]}`}
- Clothing: ${clothing !== 'Original clothing from reference' ? clothing : 'Original from reference'}

[PHOTOGRAPHY — LOCKED 🔒]
- Shoot Style: ID Photo / Pasfoto Resmi (Official)
- Composition: 🔒 Perfect Symmetry, centered
- Camera Lens: 🔒 Standard 50mm
- Pose: 🔒 Front-facing headshot only
- Lighting: 🔒 Flat even studio lighting, zero shadows
- Background: ${finalBackground}

[FINAL GENERATION PROMPT]
${promptText}
`
      : isMulti
        ? `[SYSTEM INSTRUCTIONS]
> MULTI-SUBJECT MODE: ${subjectCount} people in one image. Each person has their own face reference image.

[REQUIRED IMAGES]
${requiredInputs.map(r => `- ${r}`).join('\n')}

[SUBJECTS]
${activeSubjects.map((s, i) => `
Person ${i + 1} (${s.gender === 'Pria' ? 'Male' : s.gender === 'Wanita' ? 'Female' : 'Unisex'}):
  - Expression: ${s.expression}
  - ${s.useHijab ? `Hijab: ${s.hijab}` : `Hairstyle: ${s.hairstyle}`}
  ${s.gender !== 'Wanita' ? `- Facial Hair: ${s.facialHair}` : ''}
  - Makeup: ${s.makeup}
  - Clothing: ${s.clothing}
  - Color Theme: ${s.colorTheme}
`).join('')}

[PHOTOGRAPHY & ENVIRONMENT]
- Shoot Style: ${shootStyle}
- Background: ${background === 'image_ref_bg' ? 'USE EXTERNAL BACKGROUND REFERENCE' : finalBackground}
${viewMode === '1-photo' ? `- Composition: ${effectiveComposition}
- Camera Lens: ${background === 'image_ref_bg' ? 'Matched to BG Image' : effectiveLens}
- Pose: ${effectivePose}
- Lighting: ${background === 'image_ref_bg' ? 'Matched to BG Image' : effectiveLighting}` : ''}

[FINAL GENERATION PROMPT]
${promptText}
`
        : `[SYSTEM INSTRUCTIONS]
> STRICT FACIAL CONSISTENCY MODE: Prioritize facial features from the provided reference image. Maintain subject identity accurately.

[REQUIRED IMAGES]
${requiredInputs.map(r => `- ${r}`).join('\n')}

[SUBJECT DETAILS]
- Gender: ${jsonObj.parameters.subject_gender}
- Entity Constraint: ${jsonObj.parameters.entity_count_constraint}
- Body Type: ${jsonObj.parameters.body_type}
- Expression: ${jsonObj.parameters.expression}
${gender !== 'Wanita' ? `- Facial Hair: ${jsonObj.parameters.facial_hair}` : ''}
- Makeup & FX: ${jsonObj.parameters.makeup_and_fx}

[STYLE & ATTIRE]
${useHijab
        ? `- Hijab Style(s): ${jsonObj.parameters.styles_list.join(' | ')}`
        : `- Hairstyle(s): ${jsonObj.parameters.styles_list.join(' | ')}\n- Hair Color: ${jsonObj.parameters.hair_color}`
      }
- Clothing: ${jsonObj.parameters.clothing}
- Material/Fabric: ${jsonObj.parameters.clothing_material}
- Color Palette: ${jsonObj.parameters.color_palette}
- Accessories: ${jsonObj.parameters.accessories}

[PHOTOGRAPHY & ENVIRONMENT]
- Background: ${jsonObj.parameters.background}
- Layout: ${jsonObj.parameters.layout_mode}
${viewMode === '1-photo' ? `- Shoot Style: ${jsonObj.parameters.photography.shoot_style}
- Composition: ${jsonObj.parameters.photography.composition_rule}
- Camera Lens: ${jsonObj.parameters.photography.camera_lens}
- Camera Pose: ${jsonObj.parameters.photography.pose_framing}
- Lighting: ${jsonObj.parameters.photography.lighting_artistic}` : ''}

[FINAL GENERATION PROMPT]
${promptText}
`;

    setGeneratedPrompt({ json: JSON.stringify(jsonObj, null, 2), structured: structuredStr });
    setOutputFormat('json');
    setIsCopied(false);
  }, [
    gender, bodyType, viewMode, shootStyle, pose, composition, lighting, cameraLens,
    hairstyles, colorType, color1, color2, color3, accessories, watch, facialHair,
    useHijab, hijabs, expression, makeup, useClothingReference, clothingMaterial,
    colorTheme, manualColor1, manualColor2, manualColor3, clothing, background,
    customBackground, subjectCount, subjects, isIdPhotoMode,
  ]);

  // ── Render helpers ────────────────────────────────────────────────────────
  const selectedBgLabel = useMemo(() => {
    for (const group of BACKGROUNDS) {
      for (const item of group.items) {
        if (item.id === background) return item.label;
      }
    }
    return '';
  }, [background]);

  const sceneTagLabel = useMemo(() => {
    const labels = {
      cafe: '☕ Kafe', restaurant: '🍽️ Restoran', urban: '🏙️ Kota', nature: '🌿 Alam',
      beach: '🏖️ Pantai', indoor: '🏠 Indoor', studio: '📷 Studio', sports: '🏋️ Olahraga',
      underwater: '🤿 Bawah Air', yacht: '⛵ Yacht', vehicle: '🚗 Kendaraan',
      escalator: '🏬 Eskalator', festive: '🎉 Perayaan', office: '💼 Kantor', all: '✅ Semua',
    };
    return labels[currentBgType] || currentBgType;
  }, [currentBgType]);

  const isMultiSubject = subjectCount > 1 && viewMode === '1-photo';

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 font-sans p-4 md:p-8">

      {/* Smart Alert Toast */}
      {showSmartAlert && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-indigo-600/90 backdrop-blur-md border border-indigo-500/60 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 text-sm font-medium">
          <Cpu className="w-4 h-4" /> {smartAlertMsg}
        </div>
      )}

      {/* ID Photo Mode Banner */}
      {isIdPhotoMode && (
        <div className="fixed top-5 right-5 z-50 bg-amber-900/80 backdrop-blur-md border border-amber-500/60 text-amber-200 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-semibold">
          <Shield className="w-4 h-4 text-amber-300" /> Mode Pasfoto Aktif
        </div>
      )}

      {/* App Header */}
      <div className="max-w-[1600px] mx-auto mb-7">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
              AI Professional Studio
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">Advanced Prompt Generator for AI Image Models</p>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ══════════════════════════════
            LEFT PANEL
        ══════════════════════════════ */}
        <div className="lg:col-span-6 space-y-4">

          {/* ─── Layout & Subject Count ─── */}
          <div className="bg-neutral-800/40 rounded-2xl border border-neutral-700/50 p-5 space-y-4">
            <div className="flex items-center gap-2 text-neutral-200 font-semibold text-sm pb-3 border-b border-neutral-700/60">
              <Layers className="w-4 h-4 text-indigo-400" /> Layout & Jumlah Subjek
            </div>

            {/* View Mode Tabs */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-400">Mode Layout</label>
              <div className="grid grid-cols-3 gap-2">
                {VIEW_MODES.map(vm => (
                  <button key={vm.id} onClick={() => setViewMode(vm.id)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-medium border transition-all ${viewMode === vm.id
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                      : 'bg-neutral-900/60 border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-neutral-200'}`}>
                    {vm.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Count Selector — only for 1-photo */}
            {viewMode === '1-photo' && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-400" /> Jumlah Orang dalam Foto
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map(n => (
                    <button key={n} onClick={() => setSubjectCount(n)}
                      className={`py-3 rounded-xl text-sm font-bold border transition-all flex flex-col items-center ${subjectCount === n
                        ? 'bg-gradient-to-b from-indigo-500 to-indigo-700 border-indigo-400 text-white shadow-lg shadow-indigo-500/25'
                        : 'bg-neutral-900/60 border-neutral-700 text-neutral-400 hover:border-indigo-500/50 hover:text-neutral-200'}`}>
                      <span className="text-lg leading-none">{n}</span>
                      <span className="text-[10px] mt-0.5 opacity-70">Orang</span>
                    </button>
                  ))}
                </div>
                {isMultiSubject && (
                  <div className="flex items-start gap-2 text-xs text-indigo-300 bg-indigo-950/30 px-3 py-2.5 rounded-xl border border-indigo-800/40 mt-1">
                    <Users className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>Mode Multi-Subjek aktif. Siapkan <strong>{subjectCount} foto referensi wajah</strong> yang berbeda untuk di-upload ke AI.</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ─── Multi-Subject Per-Person Panels ─── */}
          {isMultiSubject && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <Users className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-semibold text-neutral-300">Pengaturan Per Orang</span>
                <span className="ml-auto text-xs text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded-full border border-indigo-800/40">
                  {subjectCount} subjek
                </span>
              </div>
              {subjects.slice(0, subjectCount).map((subject, idx) => (
                <SubjectPanel
                  key={idx}
                  subject={subject}
                  idx={idx}
                  onChange={handleSubjectChange}
                />
              ))}
            </div>
          )}

          {/* ─── Single Subject Settings ─── */}
          {!isMultiSubject && (
            <>
              {/* Subject */}
              <div className="bg-neutral-800/40 rounded-2xl border border-neutral-700/50 p-5 space-y-4">
                <div className="flex items-center gap-2 text-neutral-200 font-semibold text-sm pb-3 border-b border-neutral-700/60">
                  <User className="w-4 h-4 text-pink-400" /> Subjek
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-400">Gender</label>
                    <select value={gender} onChange={handleGenderChange}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-pink-500 outline-none text-neutral-100">
                      {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-400">Tipe Tubuh</label>
                    <select value={bodyType} onChange={e => setBodyType(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-pink-500 outline-none text-neutral-100">
                      {BODY_TYPES.map(bt => <option key={bt.id} value={bt.id}>{bt.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-400">Ekspresi</label>
                    <select value={expression} onChange={e => setExpression(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-pink-500 outline-none text-neutral-100">
                      {EXPRESSIONS.map(ex => <option key={ex.id} value={ex.id}>{ex.label}</option>)}
                    </select>
                  </div>
                </div>

                {gender !== 'Wanita' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-400">Kumis & Janggut</label>
                    <select value={facialHair} onChange={e => setFacialHair(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-pink-500 outline-none text-neutral-100">
                      {FACIAL_HAIR.map(fh => <option key={fh.id} value={fh.id}>{fh.label}</option>)}
                    </select>
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-400">Gaya Makeup & Efek Wajah</label>
                  <select value={makeup} onChange={e => setMakeup(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-pink-500 outline-none text-neutral-100">
                    {MAKEUP_STYLES.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Hair / Hijab */}
              <div className="bg-neutral-800/40 rounded-2xl border border-neutral-700/50 p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-700/60">
                  <div className="flex items-center gap-2 text-neutral-200 font-semibold text-sm">
                    <Scissors className="w-4 h-4 text-indigo-400" /> Kepala (Rambut / Hijab)
                  </div>
                  {gender === 'Wanita' && (
                    <label className="flex items-center gap-2 text-xs bg-neutral-900 px-3 py-1.5 rounded-xl border border-neutral-700 cursor-pointer hover:border-indigo-500/50 transition-colors">
                      <input type="checkbox" checked={useHijab} onChange={handleHijabChange}
                        className="rounded text-indigo-500 bg-neutral-800 border-neutral-600" />
                      <span className="text-neutral-300">Gunakan Hijab</span>
                    </label>
                  )}
                </div>

                {useHijab ? (
                  <div className="space-y-3">
                    <label className="text-xs font-medium text-neutral-400">Gaya Hijab</label>
                    {(viewMode === '4-angles' || viewMode === '1-photo') ? (
                      <select value={hijabs[0]} onChange={e => handleHijabStyleChange(0, e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-neutral-100">
                        {HIJAB_STYLES.map(h => <option key={h.id} value={h.id}>{h.label}</option>)}
                      </select>
                    ) : (
                      <div className="space-y-2">
                        {[0, 1, 2, 3].map(i => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="text-xs text-neutral-500 w-14 shrink-0">Panel {i + 1}</span>
                            <select value={hijabs[i]} onChange={e => handleHijabStyleChange(i, e.target.value)}
                              className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none text-neutral-100">
                              {HIJAB_STYLES.map(h => <option key={h.id} value={h.id}>{h.label}</option>)}
                            </select>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(viewMode === '4-angles' || viewMode === '1-photo') ? (
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-neutral-400">Gaya Rambut</label>
                        <select value={hairstyles[0]} onChange={e => handleHairstyleChange(0, e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-neutral-100">
                          {(HAIRSTYLES[gender] || HAIRSTYLES['Unisex']).map((h, i) => (
                            <option key={i} value={h}>{h.length > 58 ? h.substring(0, 58) + '…' : h}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {[0, 1, 2, 3].map(i => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="text-xs text-neutral-500 w-14 shrink-0">Panel {i + 1}</span>
                            <select value={hairstyles[i]} onChange={e => handleHairstyleChange(i, e.target.value)}
                              className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none text-neutral-100">
                              {(HAIRSTYLES[gender] || HAIRSTYLES['Unisex']).map((h, j) => (
                                <option key={j} value={h}>{h.length > 52 ? h.substring(0, 52) + '…' : h}</option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-neutral-400">Tipe Warna</label>
                        <select value={colorType} onChange={e => setColorType(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-neutral-100">
                          {COLOR_TYPES.map(ct => <option key={ct} value={ct}>{ct}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-neutral-400">Warna 1</label>
                        <select value={color1} onChange={e => setColor1(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-neutral-100">
                          {BASE_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    {(colorType.includes('Two') || colorType === 'Highlight' || colorType.includes('Tri')) && (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-neutral-400">Warna 2</label>
                          <select value={color2} onChange={e => setColor2(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-neutral-100">
                            {BASE_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        {colorType.includes('Tri') && (
                          <div className="space-y-1.5">
                            <label className="text-xs font-medium text-neutral-400">Warna 3</label>
                            <select value={color3} onChange={e => setColor3(e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-neutral-100">
                              {BASE_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Accessories */}
              <div className="bg-neutral-800/40 rounded-2xl border border-neutral-700/50 p-5 space-y-4">
                <div className="flex items-center gap-2 text-neutral-200 font-semibold text-sm pb-3 border-b border-neutral-700/60">
                  <Glasses className="w-4 h-4 text-emerald-400" /> Aksesori & Jam Tangan
                </div>

                <div className="flex gap-1.5 flex-wrap">
                  {ACCESSORIES_DATABASE.map(g => (
                    <button key={g.group} onClick={() => setAccCategory(g.group)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all ${accCategory === g.group
                        ? 'bg-emerald-700/60 border-emerald-500 text-emerald-100'
                        : 'bg-neutral-900/60 border-neutral-700 text-neutral-400 hover:border-neutral-500'}`}>
                      {g.group}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {(dynamicAccessoryGroups.find(g => g.group === accCategory)?.items || []).map(item => {
                    const isSelected = accessories.includes(item.id);
                    return (
                      <button key={item.id} onClick={() => handleAccessoryToggle(item.id)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${isSelected
                          ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200'
                          : 'bg-neutral-900/60 border-neutral-700 text-neutral-400 hover:border-neutral-500'}`}>
                        {isSelected && '✓ '}{item.label}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-400 flex items-center gap-1.5">
                    <Watch className="w-3.5 h-3.5" /> Jam Tangan
                  </label>
                  <select value={watch} onChange={e => setWatch(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-neutral-100">
                    {LUXURY_WATCHES.map(w => <option key={w.id} value={w.id}>{w.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Clothing */}
              <div className="bg-neutral-800/40 rounded-2xl border border-neutral-700/50 p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-700/60">
                  <div className="flex items-center gap-2 text-neutral-200 font-semibold text-sm">
                    <ImageIcon className="w-4 h-4 text-purple-400" />
                    Pakaian & Material
                    {currentClothingSceneScore < 2 && <SceneBadge score={currentClothingSceneScore} />}
                  </div>
                  <label className="flex items-center gap-2 text-xs bg-neutral-900 px-3 py-1.5 rounded-xl border border-neutral-700 cursor-pointer hover:border-purple-500/50 transition-colors">
                    <input type="checkbox" checked={useClothingReference} onChange={e => setUseClothingReference(e.target.checked)}
                      className="rounded text-purple-500 bg-neutral-800 border-neutral-600" />
                    <span className="text-neutral-300">Gunakan Ref Gambar</span>
                  </label>
                </div>

                {!useClothingReference && (
                  <>
                    <div className="flex gap-1.5 flex-wrap">
                      {dynamicClothingGroups.map(g => (
                        <button key={g.group} onClick={() => setClothCategory(g.group)}
                          className={`text-xs px-2.5 py-1 rounded-full border transition-all ${clothCategory === g.group
                            ? 'bg-purple-700/60 border-purple-500 text-purple-100'
                            : 'bg-neutral-900/60 border-neutral-700 text-neutral-400 hover:border-neutral-500'}`}>
                          {g.group}
                        </button>
                      ))}
                    </div>
                    <select value={clothing} onChange={e => setClothing(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none text-neutral-100">
                      <option value="Original clothing from reference">Original clothing from reference</option>
                      {dynamicClothingGroups.filter(g => g.group === clothCategory).flatMap(g =>
                        g.items.map(item => {
                          const score = getClothingSceneScore(item, currentBgType);
                          return (
                            <option key={item.id} value={item.id}>
                              {score === 0 ? '⚠ ' : score === 1 ? '~ ' : ''}
                              {item.label.length > 65 ? item.label.substring(0, 65) + '…' : item.label}
                            </option>
                          );
                        })
                      )}
                    </select>
                  </>
                )}

                {useClothingReference && (
                  <div className="bg-purple-900/20 border border-purple-800/40 rounded-xl p-3 text-xs text-purple-300">
                    Pakaian akan diambil dari <strong>Gambar Referensi Style</strong> yang Anda upload ke AI.
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-400">Material Kain</label>
                    <select value={clothingMaterial} onChange={e => setClothingMaterial(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none text-neutral-100">
                      {CLOTHING_MATERIALS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-400">Tema Warna</label>
                    <select value={colorTheme} onChange={e => setColorTheme(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none text-neutral-100">
                      {COLOR_THEMES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                  </div>
                </div>

                {colorTheme !== 'Original colors' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-neutral-400">
                        {colorTheme === 'Manual' ? 'Pilih 3 warna dominan secara manual.' : 'Klik warna untuk mengubah, atau tekan "Acak".'}
                      </label>
                      {colorTheme !== 'Manual' && (
                        <button onClick={() => {
                          const h1 = Math.floor(Math.random() * 360);
                          const h2 = (h1 + 120) % 360;
                          const h3 = (h1 + 240) % 360;
                          setManualColor1(hslToHex(h1, 70, 55));
                          setManualColor2(hslToHex(h2, 70, 55));
                          setManualColor3(hslToHex(h3, 70, 55));
                        }} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                          <RefreshCcw className="w-3 h-3" /> Acak
                        </button>
                      )}
                    </div>
                    <div className="flex gap-3 items-center">
                      {[[manualColor1, setManualColor1], [manualColor2, setManualColor2], [manualColor3, setManualColor3]].map(([val, setter], i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                          <input type="color" value={val} onChange={e => setter(e.target.value)}
                            className="w-12 h-12 rounded-xl cursor-pointer border border-neutral-700 bg-transparent" />
                          <span className="text-[9px] text-neutral-500">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ─── Background ─── */}
          <div className="bg-neutral-800/40 rounded-2xl border border-neutral-700/50 p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-700/60">
              <MapPin className="w-4 h-4 text-sky-400" />
              <span className="text-neutral-200 font-semibold text-sm">Latar Belakang</span>
              <span className="ml-auto text-xs text-sky-400 bg-sky-900/25 px-2 py-0.5 rounded-full border border-sky-800/40">
                Scene: {sceneTagLabel}
              </span>
            </div>

            <div className="flex gap-1.5 flex-wrap">
              {BACKGROUNDS.map(g => (
                <button key={g.group} onClick={() => setBgCategory(g.group)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-all ${bgCategory === g.group
                    ? 'bg-sky-700/60 border-sky-500 text-sky-100'
                    : 'bg-neutral-900/60 border-neutral-700 text-neutral-400 hover:border-neutral-500'}`}>
                  {g.group}
                </button>
              ))}
            </div>

            <select value={background} onChange={e => {
              const newBg = e.target.value;
              const newBgType = getBgType(newBg);
              setBackground(newBg);
              if (!isIdPhotoMode) {
                const validPoses = filterPosesByBg(newBg, newBgType);
                const allPoseIds = validPoses.flatMap(g => g.items.map(i => i.id));
                if (!allPoseIds.includes(pose)) setPose(validPoses[0]?.items[0]?.id || pose);
              }
            }} className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-sky-500 outline-none text-neutral-100">
              {BACKGROUNDS.filter(g => g.group === bgCategory).flatMap(g => g.items).map(item => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </select>

            {background === 'custom_bg' && (
              <input type="text"
                placeholder="Contoh: A futuristic neon-lit alley in Tokyo at night..."
                value={customBackground}
                onChange={e => setCustomBackground(e.target.value)}
                className="w-full bg-neutral-900 border border-sky-700/40 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-sky-500 outline-none text-neutral-100 placeholder-neutral-600" />
            )}
          </div>

          {/* ─── Photography ─── */}
          {viewMode === '1-photo' && (
            <div className={`rounded-2xl border p-5 space-y-4 transition-all duration-300 ${isIdPhotoMode
              ? 'bg-amber-950/15 border-amber-600/35'
              : background === 'image_ref_bg'
                ? 'bg-indigo-950/20 border-indigo-500/25'
                : 'bg-neutral-800/40 border-neutral-700/50'}`}>
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-700/60">
                <Camera className="w-4 h-4 text-indigo-400" />
                <span className="text-neutral-200 font-semibold text-sm">Fotografi</span>
                {isIdPhotoMode && (
                  <span className="ml-2 inline-flex items-center gap-1 text-xs text-amber-300 font-medium">
                    <Shield className="w-3 h-3" /> Mode Pasfoto Aktif
                  </span>
                )}
                {background === 'image_ref_bg' && !isIdPhotoMode && (
                  <span className="ml-auto text-xs text-indigo-400">Smart: Mengikuti Gambar Latar</span>
                )}
              </div>

              {/* Shoot Style */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-400">Tema Shoot</label>
                <select value={shootStyle} onChange={e => setShootStyle(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-neutral-100">
                  {SHOOT_STYLES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
                {isIdPhotoMode && (
                  <div className="flex items-start gap-2 text-xs text-amber-300 bg-amber-950/25 px-3 py-2.5 rounded-xl border border-amber-700/35 mt-1">
                    <Shield className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>Pose, Komposisi, Lensa, dan Pencahayaan dikunci otomatis untuk memastikan hasil pasfoto formal yang valid.</span>
                  </div>
                )}
              </div>

              {/* Composition */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-400 flex items-center gap-2">
                  Komposisi Bingkai {isIdPhotoMode && <LockBadge />}
                </label>
                <select
                  disabled={isIdPhotoMode}
                  value={isIdPhotoMode ? ID_PHOTO_LOCKED.composition : composition}
                  onChange={e => setComposition(e.target.value)}
                  className={`w-full border rounded-xl p-2.5 text-sm outline-none text-neutral-100 ${isIdPhotoMode
                    ? 'bg-amber-950/20 border-amber-700/40 opacity-60 cursor-not-allowed'
                    : 'bg-neutral-900 border-neutral-700 focus:ring-2 focus:ring-indigo-500'}`}>
                  {isIdPhotoMode
                    ? <option>{ID_PHOTO_LOCKED.composition}</option>
                    : COMPOSITIONS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Lens */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-indigo-300 flex items-center gap-1.5">
                    Lensa Kamera {isIdPhotoMode && <LockBadge />}
                  </label>
                  <select
                    disabled={background === 'image_ref_bg' || isIdPhotoMode}
                    value={isIdPhotoMode ? ID_PHOTO_LOCKED.cameraLens : (background === 'image_ref_bg' ? '' : cameraLens)}
                    onChange={e => setCameraLens(e.target.value)}
                    className={`w-full border rounded-xl p-2.5 text-sm outline-none text-indigo-100 ${(background === 'image_ref_bg' || isIdPhotoMode)
                      ? 'bg-indigo-950/20 border-amber-700/40 opacity-60 cursor-not-allowed'
                      : 'bg-neutral-900 border-neutral-700 focus:ring-2 focus:ring-indigo-500'}`}>
                    {background === 'image_ref_bg' ? <option>🔒 Mengikuti Latar</option>
                      : isIdPhotoMode ? <option>{ID_PHOTO_LOCKED.cameraLens}</option>
                        : dynamicLenses.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
                  </select>
                </div>

                {/* Pose */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-indigo-300 flex items-center gap-1.5">
                    Pose / Camera Angle {isIdPhotoMode && <LockBadge />}
                  </label>
                  <select
                    disabled={isIdPhotoMode}
                    value={isIdPhotoMode ? ID_PHOTO_LOCKED.pose : pose}
                    onChange={e => setPose(e.target.value)}
                    className={`w-full border rounded-xl p-2.5 text-sm outline-none text-indigo-100 ${isIdPhotoMode
                      ? 'bg-amber-950/20 border-amber-700/40 opacity-60 cursor-not-allowed'
                      : 'bg-neutral-900 border-neutral-700 focus:ring-2 focus:ring-indigo-500'}`}>
                    {isIdPhotoMode
                      ? <option>{ID_PHOTO_LOCKED.pose}</option>
                      : dynamicPoses.map(group => (
                        <optgroup key={group.group} label={`── ${group.group} ──`}>
                          {group.items.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
                        </optgroup>
                      ))}
                  </select>
                </div>
              </div>

              {/* Lighting */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-indigo-300 flex items-center gap-1.5">
                  Pencahayaan {isIdPhotoMode && <LockBadge />}
                </label>
                <select
                  disabled={background === 'image_ref_bg' || isIdPhotoMode}
                  value={isIdPhotoMode ? ID_PHOTO_LOCKED.lighting : (background === 'image_ref_bg' ? '' : lighting)}
                  onChange={e => setLighting(e.target.value)}
                  className={`w-full border rounded-xl p-2.5 text-sm outline-none text-indigo-100 ${(background === 'image_ref_bg' || isIdPhotoMode)
                    ? 'bg-indigo-950/20 border-amber-700/40 opacity-60 cursor-not-allowed'
                    : 'bg-neutral-900 border-neutral-700 focus:ring-2 focus:ring-indigo-500'}`}>
                  {background === 'image_ref_bg' ? <option>🔒 Mengikuti Latar</option>
                    : isIdPhotoMode ? <option>{ID_PHOTO_LOCKED.lighting}</option>
                      : dynamicLighting.map(group => (
                        <optgroup key={group.group} label={`── ${group.group} ──`}>
                          {group.items.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
                        </optgroup>
                      ))}
                </select>
              </div>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            className={`w-full p-4 rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-2.5 text-base text-white ${isIdPhotoMode
              ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-500/25'
              : isMultiSubject
                ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:via-indigo-500 hover:to-pink-500 shadow-purple-500/25'
                : 'bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-indigo-500/25'
            } hover:scale-[1.01] active:scale-[0.99]`}>
            {isIdPhotoMode
              ? <><Shield className="w-5 h-5" /> Generate Prompt Pasfoto Resmi</>
              : isMultiSubject
                ? <><Users className="w-5 h-5" /> Generate Prompt {subjectCount} Orang</>
                : <><Sparkles className="w-5 h-5" /> Generate English Prompt</>
            }
          </button>
        </div>

        {/* ══════════════════════════════
            RIGHT PANEL — Output
        ══════════════════════════════ */}
        <div className="lg:col-span-6 flex flex-col h-[calc(100vh-140px)] bg-neutral-950 rounded-2xl border border-neutral-800 relative overflow-hidden">

          {/* Empty state */}
          {!generatedPrompt && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-4 max-w-sm mx-auto p-6">
              <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center mx-auto border border-neutral-800 shadow-xl">
                <Scan className="w-10 h-10 text-neutral-600" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-300">Menunggu Generate</h3>
              <p className="text-sm text-neutral-500">Sesuaikan parameter di panel kiri lalu klik tombol Generate. Output JSON/Teks siap disalin ke AI Image Generator.</p>
              {isIdPhotoMode && (
                <div className="inline-flex items-center gap-2 text-xs text-amber-400 bg-amber-900/20 px-4 py-2 rounded-full border border-amber-700/40">
                  <Shield className="w-3.5 h-3.5" /> Mode Pasfoto Resmi Aktif
                </div>
              )}
              {isMultiSubject && (
                <div className="inline-flex items-center gap-2 text-xs text-indigo-400 bg-indigo-900/20 px-4 py-2 rounded-full border border-indigo-700/40">
                  <Users className="w-3.5 h-3.5" /> {subjectCount} orang dikonfigurasi
                </div>
              )}
            </div>
          )}

          {/* Output */}
          {generatedPrompt && (
            <div className="w-full h-full flex flex-col">
              {/* Tab bar */}
              <div className="flex items-center bg-neutral-900 border-b border-neutral-800 p-2 gap-2">
                <button onClick={() => setOutputFormat('json')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${outputFormat === 'json'
                    ? 'bg-neutral-800 text-indigo-400 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/50'}`}>
                  <FileJson className="w-4 h-4" /> JSON Format
                </button>
                <button onClick={() => setOutputFormat('structured')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${outputFormat === 'structured'
                    ? 'bg-neutral-800 text-indigo-400 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/50'}`}>
                  <FileText className="w-4 h-4" /> Structured Text
                </button>
                <button onClick={handleCopy}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isCopied
                    ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-600/40'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}`}>
                  {isCopied ? <><Check className="w-4 h-4" /> Tersalin!</> : <><Copy className="w-4 h-4" /> Salin</>}
                </button>
              </div>

              {/* Mode badges */}
              <div className="flex gap-2 px-4 pt-3 pb-1 flex-wrap">
                {isIdPhotoMode && (
                  <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-amber-900/30 border border-amber-600/40 text-amber-300 font-semibold">
                    <Shield className="w-3 h-3" /> ID Photo Strict Mode
                  </span>
                )}
                {isMultiSubject && (
                  <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-purple-900/30 border border-purple-600/40 text-purple-300 font-semibold">
                    <Users className="w-3 h-3" /> Multi-Subject: {subjectCount} Orang
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-emerald-900/20 border border-emerald-700/30 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" /> Prompt Generated
                </span>
              </div>

              {/* Prompt content */}
              <div className="flex-1 overflow-y-auto p-4">
                <pre className="text-xs text-neutral-300 whitespace-pre-wrap font-mono leading-relaxed">
                  {outputFormat === 'json' ? generatedPrompt.json : generatedPrompt.structured}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
