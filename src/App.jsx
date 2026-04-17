import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Sparkles, RefreshCcw, Scissors, Palette, Glasses, CheckCircle2,
  Copy, Check, Image as ImageIcon, User, Camera, Watch, FileJson,
  FileText, Layers, Scan, Cpu, AlertTriangle, Coffee, MapPin
} from 'lucide-react';
import {
  GENDERS, VIEW_MODES, COMPOSITIONS, BODY_TYPES, SHOOT_STYLES,
  POSES, CAMERA_LENSES, LIGHTING_STYLES, HAIRSTYLES, COLOR_TYPES,
  BASE_COLORS, ACCESSORIES_DATABASE, LUXURY_WATCHES, FACIAL_HAIR,
  HIJAB_STYLES, EXPRESSIONS, MAKEUP_STYLES, BACKGROUNDS,
  CLOTHING_MATERIALS, COLOR_THEMES, CLOTHING_DATABASE,
  getClothingSceneScore
} from './data.js';

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
        if (gender === 'Wanita') return isHijab ? item.tags.includes('hijab_approved') : (item.tags.includes('female') || item.tags.includes('unisex'));
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

// ─── SCENE BADGE ──────────────────────────────────────────────────────────────

const SceneBadge = ({ score }) => {
  if (score === 2) return null; // perfect match — no badge needed
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

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function App() {
  const [outputFormat, setOutputFormat] = useState('json');
  const [generatedPrompt, setGeneratedPrompt] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [showSmartAlert, setShowSmartAlert] = useState(false);
  const [smartAlertMsg, setSmartAlertMsg] = useState('');
  const alertTimerRef = useRef(null);

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
  const [hijabs, setHijabs] = useState([HIJAB_STYLES[0].id, HIJAB_STYLES[1].id, HIJAB_STYLES[2].id, HIJAB_STYLES[3].id]);
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

  // FIX: debounced single alert
  const triggerSmartAlert = useCallback((msg = 'Logika Cerdas Aktif: Pilihan yang tidak cocok otomatis direset.') => {
    if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
    setSmartAlertMsg(msg);
    setShowSmartAlert(true);
    alertTimerRef.current = setTimeout(() => setShowSmartAlert(false), 3500);
  }, []);

  // ── Derived data (memoized) ────────────────────────────────────────────────

  const currentBgType = useMemo(() => getBgType(background), [background]);

  const dynamicClothingGroups = useMemo(() => {
    return CLOTHING_DATABASE.map(group => ({
      group: group.group,
      items: group.items.filter(item => {
        if (gender === 'Wanita') return useHijab ? item.tags.includes('hijab_approved') : (item.tags.includes('female') || item.tags.includes('unisex'));
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

  // Smart scene-clothing score for current outfit
  const currentClothingSceneScore = useMemo(() => {
    const clothItem = CLOTHING_DATABASE.flatMap(g => g.items).find(i => i.id === clothing);
    if (!clothItem) return 2;
    return getClothingSceneScore(clothItem, currentBgType);
  }, [clothing, currentBgType]);

  // FIX: useEffect with memoized dep
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
    setAccessories(prev => prev.filter(a => !['Decorative hijab brooch', 'Small stud earrings', 'Dangling earrings'].includes(a)));
    if (!isClothingValidForGender(clothing, gender, checked)) {
      setClothing('Original clothing from reference');
      triggerSmartAlert('Mode Hijab berubah: Pakaian direset ke Referensi Asli.');
    }
  }, [clothing, gender, triggerSmartAlert]);

  const handleBgSelection = useCallback((newBg) => {
    setBackground(newBg);
    const newBgType = getBgType(newBg);
    let didReset = false;

    const filteredPoses = filterPosesByBg(newBg, newBgType);
    const validPoseIds = filteredPoses.flatMap(g => g.items.map(i => i.id));
    if (!validPoseIds.includes(pose)) { setPose(validPoseIds[0] || POSES[0].items[0].id); didReset = true; }

    const filteredLighting = filterOptionsByBg(LIGHTING_STYLES, newBgType);
    const validLightIds = filteredLighting.flatMap(g => g.items.map(i => i.id));
    if (!validLightIds.includes(lighting)) { setLighting(validLightIds[0] || LIGHTING_STYLES[0].items[0].id); didReset = true; }

    const filteredLenses = filterArrayByBg(CAMERA_LENSES, newBgType);
    const validLensIds = filteredLenses.map(l => l.id);
    if (!validLensIds.includes(cameraLens)) { setCameraLens(validLensIds[0] || CAMERA_LENSES[0].id); didReset = true; }

    if (didReset) triggerSmartAlert('Lokasi berubah: Beberapa pengaturan tidak kompatibel direset otomatis.');
  }, [pose, lighting, cameraLens, triggerSmartAlert]);

  const handleThemeChange = useCallback((e) => {
    const themeId = e.target.value;
    setColorTheme(themeId);
    const t = COLOR_THEMES.find(t => t.id === themeId);
    if (t?.colors) { setManualColor1(t.colors[0]); setManualColor2(t.colors[1]); setManualColor3(t.colors[2] || t.colors[0]); }
  }, []);

  const randomizeThemeColors = useCallback((themeId) => {
    const randHue = () => Math.floor(Math.random() * 360);
    let c1, c2, c3;
    switch (themeId) {
      case 'Monochrome color scheme': { const h = randHue(); c1 = hslToHex(h,80,20); c2 = hslToHex(h,80,50); c3 = hslToHex(h,80,80); break; }
      case 'Complementary color scheme': { const h = randHue(); c1 = hslToHex(h,80,50); c2 = hslToHex((h+180)%360,80,50); c3 = hslToHex(h,10,95); break; }
      case 'Analogous color scheme': { const h = randHue(); c1 = hslToHex(h,80,50); c2 = hslToHex((h+30)%360,80,50); c3 = hslToHex((h+330)%360,80,50); break; }
      case 'Pastel color palette': c1 = hslToHex(randHue(),70,85); c2 = hslToHex(randHue(),70,85); c3 = hslToHex(randHue(),70,85); break;
      case 'Vibrant Neon color palette': { const n=[300,180,280,60,120,15]; const g=()=>hslToHex(n[Math.floor(Math.random()*n.length)],100,50); c1=g();c2=g();c3=g(); break; }
      case 'Earth tones color palette': { const e=()=>hslToHex(20+Math.random()*30,30+Math.random()*30,20+Math.random()*40); c1=e();c2=e();c3=e(); break; }
      case 'Jewel tones color palette': { const j=[350,160,240,20,280]; const g=()=>hslToHex(j[Math.floor(Math.random()*j.length)],90,35); c1=g();c2=g();c3=g(); break; }
      default: c1=hslToHex(randHue(),70,50); c2=hslToHex(randHue(),70,50); c3=hslToHex(randHue(),70,50);
    }
    setManualColor1(c1); setManualColor2(c2); setManualColor3(c3);
  }, []);

  const toggleAccessory = useCallback((id) => {
    setAccessories(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
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
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) { console.error('Failed to copy:', err); }
  }, [generatedPrompt, outputFormat]);

  // ── Generate ──────────────────────────────────────────────────────────────

  const handleGenerate = useCallback(() => {
    let colors = color1;
    if (colorType.includes('Two') || colorType === 'Highlight') colors += ` and ${color2} ${colorType}`;
    if (colorType.includes('Tri')) colors += `, ${color2}, and ${color3} ${colorType}`;

    const accNames = [...accessories];
    if (watch !== 'No watch') accNames.push(watch);
    const accessoriesString = accNames.length > 0 ? accNames.join(', ') : 'None';

    const finalBackground = background === 'custom_bg' && customBackground.trim() !== ''
      ? customBackground
      : (background === 'custom_bg' ? 'A studio background' : background);

    let promptText = '';
    if (viewMode === '1-photo') {
      promptText += 'Create a single high-quality photographic image. Do NOT create a grid. ';
    } else {
      promptText += 'Create a 2x2 grid image panel with a 3:4 aspect ratio per panel. ';
    }

    promptText += "STRICT FACIAL CONSISTENCY MODE: Prioritize the exact facial features, identity, and core facial structure from the provided **Face Reference Image** for all generations. Maintain the primary subject's identity accurately while adapting the pose, lighting, and background. Do not alter the core facial structure. ";
    promptText += `\nSubject: Single Subject (${gender === 'Pria' ? 'Male' : gender === 'Wanita' ? 'Female' : 'Androgynous/Unisex'}). `;
    promptText += '\n[ENTITY COUNT VALIDATION]: CRITICAL: There MUST be EXACTLY ONE person in the final image. NO extra background characters, NO clones. ';

    if (bodyType !== BODY_TYPES[0].id) promptText += `Body Type: ${bodyType}. `;
    if (accessoriesString !== 'None') promptText += `Accessories: ${accessoriesString}. `;
    if (facialHair !== FACIAL_HAIR[0].id && gender !== 'Wanita') promptText += `Facial Hair: ${facialHair}. `;
    promptText += `Facial Expression: ${expression}. `;
    if (makeup !== MAKEUP_STYLES[0].id) promptText += `Makeup & Face Details: ${makeup}. `;

    if (useClothingReference) {
      promptText += "Clothing & Attire: EXACTLY match the clothing style, layering, and silhouette shown in the provided **Secondary Style Reference Image**. ";
      if (clothingMaterial !== 'Original material') promptText += `However, alter the primary fabric of this outfit so it is made of ${clothingMaterial}. `;
    } else {
      let outfitDesc = '';
      if (clothing !== 'Original clothing from reference') {
        outfitDesc += `Clothing: ${clothing}`;
        outfitDesc += clothingMaterial !== 'Original material' ? `, made specifically from ${clothingMaterial}. ` : '. ';
      } else if (clothingMaterial !== 'Original material') {
        outfitDesc += `Clothing Update: Update the original clothing from the reference image to be made entirely of ${clothingMaterial}. `;
      }
      if (colorTheme !== 'Original colors') {
        if (colorTheme === 'Manual') {
          outfitDesc += `The outfit and overall styling must strictly follow a color palette of hex colors ${manualColor1}, ${manualColor2}, and ${manualColor3}. `;
        } else {
          outfitDesc += `The outfit and overall styling must feature a ${colorTheme} (incorporating hex colors ${manualColor1}, ${manualColor2}, and ${manualColor3}). `;
        }
      }
      promptText += outfitDesc;
    }

    if (background === 'image_ref_bg') {
      promptText += "Background, Lighting & Camera Angle: EXACTLY match the environment, lighting conditions, and camera perspective shown in the provided **Background Reference Image**. ";
      promptText += "\n[CRITICAL IDENTITY OVERRIDE]: Do NOT copy the face from the Background Reference Image. The generated face MUST flawlessly match **Image 1: Face Reference**. Image 3 is ONLY for the environment. ";
    } else if (finalBackground !== 'Original background from the reference image') {
      promptText += `Background Setting: ${finalBackground}. `;
    }

    if (viewMode === '1-photo') {
      const styleStr = useHijab
        ? `Wearing ${hijabs[0]}`
        : (hairstyles[0].includes('Original hairstyle') ? `Hairstyle: ${hairstyles[0]}` : `Hairstyle: ${hairstyles[0]}, Hair Color: ${colors}`);
      promptText += `\nStyle: ${styleStr}. `;
      promptText += `\nPhotography Style & Vibe: ${shootStyle}. `;
      if (composition !== COMPOSITIONS[0].id) promptText += `Composition Rule: ${composition}. `;

      if (background !== 'image_ref_bg') {
        if (cameraLens !== CAMERA_LENSES[0].id) promptText += `Camera Lens / Perspective: Use a ${cameraLens}. `;
        if (pose !== 'Pose matching the original reference') promptText += `Camera Angle & Pose: ${pose}. `;
        if (lighting !== 'Standard natural daylight') {
          promptText += `Lighting: ${lighting}. `;
          if (lighting.includes('Chiaroscuro')) promptText += '(CRITICAL: Strong chiaroscuro effect, face bright, background dark). ';
          if (lighting.includes('Gobo') || lighting.includes('gobo')) promptText += '(CRITICAL: Ensure clear, aesthetic shadow stripes across the subject). ';
          if (lighting.includes('Golden Hour Backlighting')) promptText += "(CRITICAL: Ensure strong, warm rim light highlighting the subject's hair and shoulders). ";
          if (lighting.toLowerCase().includes('softbox') || lighting.toLowerCase().includes('ring light')) {
            promptText += '\n(CRITICAL INSTRUCTION: Do NOT render or show any physical lighting equipment, softboxes, umbrellas, or light stands in the frame. Only render the lighting EFFECT).';
          }
        }
      } else {
        if (pose === 'match_bg_pose') {
          promptText += 'Camera Angle & Pose: MATCH the pose of the subject in the Background Reference Image. ';
        } else if (pose !== 'Pose matching the original reference') {
          promptText += `Camera Angle & Pose: ${pose} (Adapt this pose into the provided background reference). `;
        }
      }
      promptText += '\nLayout Instruction: SINGLE image only.';
    } else if (viewMode === '4-angles') {
      const styleStr = useHijab
        ? `Wearing ${hijabs[0]}`
        : (hairstyles[0].includes('Original hairstyle') ? `Hairstyle: ${hairstyles[0]}` : `Hairstyle: ${hairstyles[0]}, Hair Color: ${colors}`);
      promptText += `\nStyle: ${styleStr}. `;
      promptText += '\nLayout Instruction: The 2x2 grid must show the EXACT SAME person from 4 different angles: Top-Left (Front view), Top-Right (Left Profile), Bottom-Left (Right Profile), Bottom-Right (Back of head).';
    } else {
      promptText += '\nLayout Instruction: The 2x2 grid must show 4 slightly different stylistic variations on the exact same person. Front-facing portrait for ALL panels.';
      if (useHijab) {
        hijabs.forEach((h, i) => { promptText += `\n- Panel ${i + 1}: ${h}.`; });
      } else {
        hairstyles.forEach((h, i) => { promptText += `\n- Panel ${i + 1}: ${h}.`; });
        promptText += `\nHair Color for all panels: ${colors} (Unless original hairstyle is selected).`;
      }
    }

    const requiredInputs = ['Image 1: Face Reference (For Identity)'];
    if (useClothingReference) requiredInputs.push('Image 2: Style Reference (For Clothing/Outfit)');
    if (background === 'image_ref_bg') requiredInputs.push('Image 3: Background Reference (For Location, Angle & Lighting)');

    const jsonObj = {
      app_name: 'AI Professional Studio',
      system_directive: 'STRICT FACIAL CONSISTENCY ENABLED',
      required_inputs: requiredInputs,
      parameters: {
        subject_gender: gender === 'Pria' ? 'Male' : gender === 'Wanita' ? 'Female' : 'Unisex',
        entity_count_constraint: 'CRITICAL: EXACTLY ONE person in the final image. NO extra background characters.',
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
        color_palette: useClothingReference ? 'N/A' : (colorTheme === 'Original colors' ? 'Original colors' : `${colorTheme === 'Manual' ? 'Manual Palette' : colorTheme} (${manualColor1}, ${manualColor2}, ${manualColor3})`),
        accessories: accessoriesString,
        background: background === 'image_ref_bg' ? 'USE EXTERNAL BACKGROUND REFERENCE IMAGE' : finalBackground,
        photography: viewMode === '1-photo' ? {
          shoot_style: shootStyle,
          composition_rule: composition,
          camera_lens: background === 'image_ref_bg' ? 'Matched to Background Image' : cameraLens,
          pose_framing: pose === 'match_bg_pose' ? 'Matched to Background Image' : pose,
          lighting_artistic: background === 'image_ref_bg' ? 'Matched to Background Image' : lighting,
        } : 'N/A',
      },
      text_prompt: promptText,
    };

    const structuredStr = `[SYSTEM INSTRUCTIONS]
> STRICT FACIAL CONSISTENCY MODE: Prioritize the facial features from the provided reference image. Maintain the subject's identity accurately. Do not alter the core facial structure.

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
    customBackground,
  ]);

  // ── Render ────────────────────────────────────────────────────────────────

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

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 font-sans p-4 md:p-8">

      {showSmartAlert && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-indigo-600/90 backdrop-blur-sm border border-indigo-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50">
          <Cpu className="w-5 h-5 text-indigo-200 shrink-0" />
          <span className="text-sm font-medium">{smartAlertMsg}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">

        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-neutral-800">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent flex items-center gap-2">
              <Camera className="w-8 h-8 text-indigo-500" />
              AI Professional Studio
            </h1>
            <p className="text-neutral-400 mt-1">Context-Aware Prompts dengan Smart Scene-Clothing Matching.</p>
          </div>
          <div className="flex items-center gap-2 bg-neutral-800 px-4 py-2 rounded-full text-sm border border-neutral-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-neutral-300">Strict Facial Consistency: <strong className="text-emerald-400">ON</strong></span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ── LEFT ── */}
          <div className="lg:col-span-6 space-y-6 bg-neutral-800/50 p-6 rounded-2xl border border-neutral-800 h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar">

            {/* Gender & Layout */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-400">Gender</label>
                <select value={gender} onChange={handleGenderChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                  {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-400">Mode Layout</label>
                <select value={viewMode} onChange={e => setViewMode(e.target.value)} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                  {VIEW_MODES.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                </select>
              </div>
            </div>

            {/* Body & Face */}
            <div className="space-y-4 pt-4 border-t border-neutral-700">
              <div className="flex items-center gap-2 text-pink-400 font-medium">
                <User className="w-5 h-5" /> Karakteristik Tubuh & Wajah
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-400">Tipe Badan</label>
                  <select value={bodyType} onChange={e => setBodyType(e.target.value)} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-pink-500 outline-none">
                    {BODY_TYPES.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-400">Ekspresi Wajah</label>
                  <select value={expression} onChange={e => setExpression(e.target.value)} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-pink-500 outline-none">
                    {EXPRESSIONS.map(ex => <option key={ex.id} value={ex.id}>{ex.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {(gender === 'Pria' || gender === 'Unisex') && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-400">Kumis & Janggut</label>
                    <select value={facialHair} onChange={e => setFacialHair(e.target.value)} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-pink-500 outline-none">
                      {FACIAL_HAIR.map(fh => <option key={fh.id} value={fh.id}>{fh.label}</option>)}
                    </select>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-400">Gaya Makeup & Efek Wajah</label>
                  <select value={makeup} onChange={e => setMakeup(e.target.value)} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-pink-500 outline-none">
                    {MAKEUP_STYLES.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Hair / Hijab */}
            <div className="space-y-4 pt-4 border-t border-neutral-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-400 font-medium">
                  <Scissors className="w-5 h-5" /> Kepala (Rambut / Hijab)
                </div>
                {gender === 'Wanita' && (
                  <label className="flex items-center gap-2 text-sm bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-700 cursor-pointer hover:border-indigo-500/50 transition-colors">
                    <input type="checkbox" checked={useHijab} onChange={handleHijabChange} className="rounded text-indigo-500 bg-neutral-800 border-neutral-600" />
                    <span className="text-neutral-300">Gunakan Hijab</span>
                  </label>
                )}
              </div>
              {useHijab ? (
                <div className="space-y-3 bg-neutral-900/30 p-4 rounded-xl border border-neutral-700/50">
                  <label className="text-sm font-medium text-neutral-400">Gaya Hijab</label>
                  {(viewMode === '4-angles' || viewMode === '1-photo') ? (
                    <select value={hijabs[0]} onChange={e => setHijabs([e.target.value, hijabs[1], hijabs[2], hijabs[3]])} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                      {HIJAB_STYLES.map(h => <option key={h.id} value={h.id}>{h.label}</option>)}
                    </select>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {[0,1,2,3].map(idx => (
                        <div key={idx} className="space-y-1">
                          <label className="text-xs text-neutral-500">Panel {idx+1}</label>
                          <select value={hijabs[idx]} onChange={e => { const nh=[...hijabs];nh[idx]=e.target.value;setHijabs(nh); }} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none">
                            {HIJAB_STYLES.map(h => <option key={h.id} value={h.id}>{h.label}</option>)}
                          </select>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="space-y-3 bg-neutral-900/30 p-4 rounded-xl border border-neutral-700/50">
                    <label className="text-sm font-medium text-neutral-400">Gaya Rambut</label>
                    {(viewMode === '4-angles' || viewMode === '1-photo') ? (
                      <select value={hairstyles[0]} onChange={e => setHairstyles([e.target.value, hairstyles[1], hairstyles[2], hairstyles[3]])} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                        {(HAIRSTYLES[gender] || HAIRSTYLES['Unisex']).map(h => <option key={h} value={h}>{h}</option>)}
                      </select>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        {[0,1,2,3].map(idx => (
                          <div key={idx} className="space-y-1">
                            <label className="text-xs text-neutral-500">Panel {idx+1}</label>
                            <select value={hairstyles[idx]} onChange={e => { const ns=[...hairstyles];ns[idx]=e.target.value;setHairstyles(ns); }} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none">
                              {(HAIRSTYLES[gender]||HAIRSTYLES['Unisex']).map(h => <option key={h} value={h}>{h}</option>)}
                            </select>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="space-y-3 bg-neutral-900/50 p-4 rounded-xl border border-neutral-700/50">
                    <label className="text-sm font-medium text-neutral-300">Pewarnaan Rambut</label>
                    <select value={colorType} onChange={e => setColorType(e.target.value)} className="w-full bg-neutral-800 border border-neutral-600 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none mb-2">
                      {COLOR_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <div className="grid grid-cols-3 gap-2">
                      <select value={color1} onChange={e=>setColor1(e.target.value)} className="bg-neutral-800 border border-neutral-600 rounded-lg p-2 text-xs">{BASE_COLORS.map(c=><option key={c} value={c}>{c}</option>)}</select>
                      {(colorType.includes('Two')||colorType.includes('Tri')||colorType==='Highlight')&&<select value={color2} onChange={e=>setColor2(e.target.value)} className="bg-neutral-800 border border-neutral-600 rounded-lg p-2 text-xs">{BASE_COLORS.map(c=><option key={c} value={c}>{c}</option>)}</select>}
                      {colorType.includes('Tri')&&<select value={color3} onChange={e=>setColor3(e.target.value)} className="bg-neutral-800 border border-neutral-600 rounded-lg p-2 text-xs">{BASE_COLORS.map(c=><option key={c} value={c}>{c}</option>)}</select>}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Accessories */}
            <div className="space-y-4 pt-4 border-t border-neutral-700">
              <label className="text-sm font-medium text-neutral-400 flex items-center gap-2">
                <Glasses className="w-4 h-4" /> Aksesori & Properti
              </label>
              <div className="flex flex-wrap gap-2">
                {dynamicAccessoryGroups.map(ag => (
                  <button key={ag.group} onClick={() => setAccCategory(ag.group)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${accCategory===ag.group?'bg-indigo-600 border-indigo-500 text-white':'bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200'}`}>
                    {ag.group}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                {dynamicAccessoryGroups.find(g=>g.group===accCategory)?.items.map(item => (
                  <label key={item.id} className="flex items-center gap-2 text-sm bg-neutral-900 p-2 rounded-lg border border-neutral-700 cursor-pointer hover:border-pink-500/50 transition-colors">
                    <input type="checkbox" checked={accessories.includes(item.id)} onChange={()=>toggleAccessory(item.id)} className="rounded text-pink-500 bg-neutral-800 border-neutral-600" />
                    <span className="text-neutral-300 select-none text-xs leading-tight">{item.label}</span>
                  </label>
                ))}
              </div>
              <div className="space-y-2 pt-2 border-t border-neutral-800">
                <label className="text-sm font-medium text-neutral-400 flex items-center gap-2">
                  <Watch className="w-4 h-4" /> Jam Tangan Mewah
                </label>
                <select value={watch} onChange={e=>setWatch(e.target.value)} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-pink-500 outline-none">
                  {LUXURY_WATCHES.map(w=><option key={w.id} value={w.id}>{w.label}</option>)}
                </select>
              </div>
            </div>

            {/* Background + Smart Clothing */}
            <div className="space-y-4 pt-4 border-t border-neutral-700">
              <div className="flex items-center gap-2 text-indigo-400 font-medium">
                <MapPin className="w-5 h-5" /> Latar Lokasi
              </div>
              <div className="flex flex-wrap gap-2">
                {BACKGROUNDS.map(bg => (
                  <button key={bg.group} onClick={()=>setBgCategory(bg.group)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${bgCategory===bg.group?'bg-indigo-600 border-indigo-500 text-white':'bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200'}`}>
                    {bg.group}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto custom-scrollbar pr-2">
                {BACKGROUNDS.find(g=>g.group===bgCategory)?.items.map(item => (
                  <button key={item.id} onClick={()=>handleBgSelection(item.id)} className={`text-left px-3 py-2.5 rounded-lg text-xs leading-tight transition-colors border ${background===item.id?'bg-indigo-500/20 border-indigo-500 text-indigo-200 shadow-inner':'bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-indigo-500/50 hover:text-neutral-200'}`}>
                    {item.label}
                  </button>
                ))}
              </div>
              {background==='custom_bg'&&(
                <input type="text" value={customBackground} onChange={e=>setCustomBackground(e.target.value)} placeholder="Ketik lokasi dalam B.Inggris (contoh: magical forest with glowing mushrooms...)" className="w-full bg-neutral-900 border border-indigo-500/50 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-white placeholder:text-neutral-400" />
              )}
              {background==='image_ref_bg'&&(
                <div className="p-3 bg-indigo-900/40 border border-indigo-500/50 rounded-lg">
                  <p className="text-xs text-indigo-200">📸 <strong>Mode Referensi Latar Aktif:</strong> Lensa dan Cahaya mengikuti gambar latar. Anda tetap bisa mengatur Pose secara manual. AI tidak meniru wajah dari gambar latar.</p>
                </div>
              )}

              {/* Active scene tag */}
              {currentBgType !== 'all' && (
                <div className="flex items-center gap-2 text-xs text-neutral-400 bg-neutral-900/60 px-3 py-2 rounded-lg border border-neutral-700/50">
                  <Coffee className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Scene aktif: <strong className="text-indigo-300">{sceneTagLabel}</strong> — Pilihan pakaian di bawah otomatis diurutkan berdasarkan kesesuaian scene ini.</span>
                </div>
              )}
            </div>

            {/* Clothing */}
            <div className="space-y-4 pt-4 border-t border-neutral-700">
              <div className="flex items-center gap-2 text-indigo-400 font-medium">
                <Palette className="w-5 h-5" /> Pakaian & Estetika
              </div>

              <div className="bg-indigo-900/20 border border-indigo-900/50 rounded-xl p-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={useClothingReference} onChange={e=>setUseClothingReference(e.target.checked)} className="rounded text-indigo-500 bg-neutral-800 border-neutral-600 w-5 h-5 cursor-pointer mt-0.5" />
                  <div>
                    <span className="text-neutral-200 font-medium group-hover:text-indigo-400 transition-colors flex items-center gap-2">
                      <Layers className="w-4 h-4" /> Gunakan Referensi Pakaian Eksternal
                    </span>
                    <p className="text-xs text-indigo-400/80 mt-1 leading-relaxed">Pakaian mengikuti persis seperti gambar inspirasi lain yang diunggah ke AI Generator.</p>
                  </div>
                </label>
              </div>

              {!useClothingReference && (
                <div className="space-y-3">
                  {/* Current outfit scene score warning */}
                  {currentClothingSceneScore < 2 && clothing !== 'Original clothing from reference' && (
                    <div className={`flex items-start gap-2 p-3 rounded-lg border text-xs ${currentClothingSceneScore === 1 ? 'bg-amber-900/20 border-amber-700/40 text-amber-300' : 'bg-red-900/20 border-red-700/40 text-red-300'}`}>
                      <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                      <div>
                        <strong>{currentClothingSceneScore === 1 ? 'Pakaian cukup cocok' : 'Pakaian kurang sesuai scene'}</strong> untuk lokasi <strong>{sceneTagLabel}</strong>.
                        {currentClothingSceneScore === 0 && ' Pertimbangkan memilih pakaian yang lebih sesuai di bawah.'}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {dynamicClothingGroups.map(cg => (
                      <button key={cg.group} onClick={()=>setClothCategory(cg.group)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${clothCategory===cg.group?'bg-indigo-600 border-indigo-500 text-white':'bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200'}`}>
                        {cg.group}
                      </button>
                    ))}
                  </div>

                  {/* Smart sorted clothing list */}
                  <div className="grid grid-cols-1 gap-1.5 max-h-72 overflow-y-auto custom-scrollbar pr-2">
                    {dynamicClothingGroups.find(g=>g.group===clothCategory)?.items
                      .map(item => ({ item, score: getClothingSceneScore(item, currentBgType) }))
                      .sort((a, b) => b.score - a.score)
                      .map(({ item, score }) => (
                        <button key={item.id} onClick={()=>setClothing(item.id)} className={`text-left px-3 py-2.5 rounded-lg text-xs leading-tight transition-colors border flex items-center justify-between gap-2 ${clothing===item.id?'bg-indigo-500/20 border-indigo-500 text-indigo-200 shadow-inner':'bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-indigo-500/50 hover:text-neutral-200'}`}>
                          <span className="flex-1">{item.label}</span>
                          <SceneBadge score={score} />
                        </button>
                      ))
                    }
                  </div>
                  {useHijab&&<p className="text-[10px] text-indigo-400/80">✨ Hijab aktif: Menampilkan Modest fashion / Hijab approved.</p>}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`space-y-2 ${useClothingReference?'md:col-span-2':''}`}>
                  <label className="text-sm font-medium text-neutral-400">Bahan Kain</label>
                  <select value={clothingMaterial} onChange={e=>setClothingMaterial(e.target.value)} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                    {CLOTHING_MATERIALS.map(m=><option key={m.id} value={m.id}>{m.label}</option>)}
                  </select>
                </div>
                <div className={`space-y-2 ${useClothingReference?'opacity-50 pointer-events-none':''}`}>
                  <label className="text-sm font-medium text-neutral-400">Tema Warna Pakaian</label>
                  <select value={colorTheme} onChange={handleThemeChange} disabled={useClothingReference} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                    {COLOR_THEMES.map(t=><option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                </div>
              </div>

              {colorTheme!=='Original colors'&&!useClothingReference&&(
                <div className="flex items-center gap-4 bg-neutral-800/50 p-3 rounded-lg border border-neutral-700">
                  <div className="flex gap-3">
                    <input type="color" value={manualColor1} onChange={e=>{setManualColor1(e.target.value);setColorTheme('Manual');}} className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0" />
                    <input type="color" value={manualColor2} onChange={e=>{setManualColor2(e.target.value);setColorTheme('Manual');}} className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0" />
                    <input type="color" value={manualColor3} onChange={e=>{setManualColor3(e.target.value);setColorTheme('Manual');}} className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0" />
                  </div>
                  <button onClick={()=>randomizeThemeColors(colorTheme)} className="p-2.5 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-indigo-400 hover:text-indigo-300 transition-colors">
                    <RefreshCcw className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] text-neutral-400 leading-tight">{colorTheme==='Manual'?'Pilih 3 warna dominan secara manual.':'Klik warna untuk mengubah, atau tekan "Acak" untuk variasi baru.'}</span>
                </div>
              )}
            </div>

            {/* Photography */}
            {viewMode==='1-photo'&&(
              <div className={`space-y-4 p-5 rounded-xl border transition-all duration-300 ${background==='image_ref_bg'?'bg-indigo-950/40 border-indigo-500/30':'bg-indigo-900/10 border-indigo-900/40'}`}>
                <div className="flex items-center gap-2 text-indigo-400 font-semibold border-b border-indigo-900/50 pb-2">
                  <Camera className="w-5 h-5" /> Fotografi (Smart Filter Aktif)
                </div>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-400">Tema Shoot</label>
                    <select value={shootStyle} onChange={e=>setShootStyle(e.target.value)} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                      {SHOOT_STYLES.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-400">Komposisi Bingkai</label>
                    <select value={composition} onChange={e=>setComposition(e.target.value)} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                      {COMPOSITIONS.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-indigo-300">Lensa Kamera</label>
                      <select disabled={background==='image_ref_bg'} value={background==='image_ref_bg'?'':cameraLens} onChange={e=>setCameraLens(e.target.value)} className="w-full bg-indigo-950/30 border border-indigo-800 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed">
                        {background==='image_ref_bg'?<option>🔒 Mengikuti Latar</option>:dynamicLenses.map(l=><option key={l.id} value={l.id}>{l.label}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-indigo-300">Sudut & Pose</label>
                      <select value={pose} onChange={e=>setPose(e.target.value)} className="w-full bg-indigo-950/30 border border-indigo-800 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-indigo-100">
                        {dynamicPoses.map(group=>(
                          <optgroup key={group.group} label={`--- ${group.group} ---`}>
                            {group.items.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-indigo-300">Pencahayaan Artistik</label>
                    <select disabled={background==='image_ref_bg'} value={background==='image_ref_bg'?'':lighting} onChange={e=>setLighting(e.target.value)} className="w-full bg-indigo-950/30 border border-indigo-800 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed">
                      {background==='image_ref_bg'?<option>🔒 Mengikuti Latar</option>:dynamicLighting.map(group=>(
                        <optgroup key={group.group} label={`--- ${group.group} ---`}>
                          {group.items.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            <button onClick={handleGenerate} className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white p-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 text-lg">
              <Sparkles className="w-5 h-5" /> Generate English Prompt
            </button>
          </div>

          {/* ── RIGHT — Output ── */}
          <div className="lg:col-span-6 flex flex-col h-[calc(100vh-140px)] bg-neutral-950 rounded-2xl border border-neutral-800 relative overflow-hidden">
            {!generatedPrompt&&(
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-4 max-w-sm mx-auto p-6">
                <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-neutral-800 shadow-xl">
                  <Scan className="w-10 h-10 text-neutral-600" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-300">Menunggu Generate</h3>
                <p className="text-sm text-neutral-500">Sesuaikan parameter di panel kiri lalu klik tombol Generate. Output JSON/Teks siap disalin ke AI Image Generator.</p>
              </div>
            )}
            {generatedPrompt&&(
              <div className="w-full h-full flex flex-col">
                <div className="flex items-center bg-neutral-900 border-b border-neutral-800 p-2 gap-2">
                  <button onClick={()=>setOutputFormat('json')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${outputFormat==='json'?'bg-neutral-800 text-indigo-400 shadow-sm':'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/50'}`}>
                    <FileJson className="w-4 h-4" /> JSON Format
                  </button>
                  <button onClick={()=>setOutputFormat('structured')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${outputFormat==='structured'?'bg-neutral-800 text-emerald-400 shadow-sm':'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/50'}`}>
                    <FileText className="w-4 h-4" /> Structured Text
                  </button>
                </div>
                <div className="flex-1 overflow-hidden relative">
                  <pre className="p-5 w-full h-full overflow-auto text-sm font-mono whitespace-pre-wrap break-words leading-relaxed custom-scrollbar text-neutral-300">
                    {outputFormat==='json'
                      ?<span className="text-pink-300">{generatedPrompt.json}</span>
                      :<span className="text-emerald-200">{generatedPrompt.structured}</span>}
                  </pre>
                  <button onClick={handleCopy} className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-indigo-900/50 z-20">
                    {isCopied?<Check className="w-4 h-4"/>:<Copy className="w-4 h-4"/>}
                    {isCopied?'Copied!':'Copy Prompt'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html:`
        .custom-scrollbar::-webkit-scrollbar{width:8px}
        .custom-scrollbar::-webkit-scrollbar-track{background:rgba(0,0,0,0.2)}
        .custom-scrollbar::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:8px}
        .custom-scrollbar::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,0.2)}
      `}}/>
    </div>
  );
}
