// ─── DATA.JS ─────────────────────────────────────────────────────────────────
// Semua data statis untuk AI Professional Studio.
// Scene tags digunakan untuk smart-filter pakaian berdasarkan lokasi.
//
// SCENE TAG SYSTEM:
//   studio        → Studio foto, background polos
//   indoor        → Dalam ruangan umum (ruang tamu, kamar, dll)
//   cafe          → Kafe, coffee shop, restoran casual
//   restaurant    → Restoran fine dining, makan malam formal
//   office        → Kantor, coworking space
//   urban         → Jalanan kota, urban outdoor
//   nature        → Alam, taman, pegunungan, pantai (non-laut)
//   beach         → Pantai, tepi laut, resort
//   underwater    → Bawah air, kolam renang
//   yacht         → Kapal, laut lepas
//   sports        → Lapangan olahraga
//   vehicle       → Interior kendaraan, mobil, pesawat
//   escalator     → Eskalator, bandara, mall
//   festive       → Hari raya, perayaan
//   all           → Cocok di semua scene

// ─── GENDERS & VIEW MODES ────────────────────────────────────────────────────

export const GENDERS = ['Pria', 'Wanita', 'Unisex'];

export const VIEW_MODES = [
  { id: '1-photo',   label: '1 Foto Besar (Single Portrait)' },
  { id: '4-styles',  label: 'Grid: 4 Variasi Gaya' },
  { id: '4-angles',  label: 'Grid: 4 Sudut Pandang' },
];

// ─── COMPOSITIONS ────────────────────────────────────────────────────────────

export const COMPOSITIONS = [
  { id: 'Natural and balanced composition', label: 'Default / Natural (Bawaan)' },
  { id: 'Rule of Thirds composition, asymmetrical visual balance', label: 'Rule of Thirds (Sepertiga Frame)' },
  { id: 'Perfect Symmetry and Balance, subject perfectly centered', label: 'Symmetry (Simetris Tengah)' },
  { id: 'Golden Ratio composition, natural cinematic visual flow', label: 'Golden Ratio (Fibonacci)' },
  { id: "Strong leading lines guiding the viewer's eye towards the subject", label: 'Leading Lines (Garis Pengarah)' },
  { id: 'Fill the frame completely, extreme tight composition', label: 'Fill the Frame (Penuh)' },
  { id: 'Vast negative space, minimalist composition', label: 'Negative Space (Ruang Kosong)' },
];

// ─── BODY TYPES ──────────────────────────────────────────────────────────────

export const BODY_TYPES = [
  { id: 'Original reference body', label: 'Sesuai Referensi Asli' },
  { id: 'Slim body type', label: 'Slim (Ramping)' },
  { id: 'Slightly muscular, toned body', label: 'Slight Muscle (Berotot Ringan)' },
  { id: 'Curvy, voluptuous body type', label: 'Curvy (Berisi/Lekuk Tubuh)' },
  { id: 'Athletic, highly muscular body', label: 'Athletic / Muscular' },
];

// ─── SHOOT STYLES ────────────────────────────────────────────────────────────

export const SHOOT_STYLES = [
  { id: 'Standard professional portrait', label: 'Standard Portrait' },
  { id: 'Professional corporate headshot', label: 'Professional Corporate Shoot' },
  { id: 'Casual and approachable LinkedIn profile photo', label: 'Casual LinkedIn Shoot' },
  { id: 'High-end fashion editorial photography', label: 'Fashion Editorial' },
  { id: 'Cinematic portrait with dramatic storytelling', label: 'Cinematic Portrait' },
  { id: 'Official ID photo style, front-facing, formal', label: 'ID Photo / Pasfoto Resmi' },
  { id: 'Lifestyle candid photography', label: 'Lifestyle Shoot' },
  { id: 'Edgy streetwear and hip-hop editorial shoot', label: 'Hip-hop / Streetwear Editorial' },
  { id: 'High-end resort and luxury vacation editorial', label: 'Resort / Vacation Editorial' },
  { id: 'Technical outdoor and Gorpcore lifestyle photography', label: 'Outdoor / Gorpcore Shoot' },
  { id: 'Underwater ethereal photography', label: 'Underwater / Bawah Air Shoot' },
  { id: 'Cozy cafe lifestyle editorial photography', label: 'Cafe / Coffee Shop Lifestyle' },
  { id: 'Fine dining and luxury gastronomy editorial', label: 'Fine Dining Editorial' },
  { id: 'Sport and action photography', label: 'Sport / Action Shoot' },
];

// ─── POSES ───────────────────────────────────────────────────────────────────

export const POSES = [
  { group: 'Dasar & Referensi', items: [
    { id: 'Pose matching the original reference', label: 'Sesuai Referensi Asli (Default)', allowedTypes: ['all'] },
    { id: 'Front-facing close-up headshot', label: 'Front-Facing Close-up (Pasfoto)', allowedTypes: ['all'] },
    { id: 'match_bg_pose', label: 'Ikuti Pose dari Gambar Latar Upload', allowedTypes: ['image_ref_bg'] },
  ]},
  { group: 'Kasual & Dinamis', items: [
    { id: 'Casual half-body medium shot, arms and hands naturally visible in frame', label: 'Casual Half-Body (Tangan Terlihat)', allowedTypes: ['all'] },
    { id: 'Casual half-body medium shot, highly natural and fluid candid posture, perfectly formed hand anatomy, avoiding stiff or awkward poses', label: 'Casual Half-Body (Tangan Natural & Dinamis)', allowedTypes: ['all'] },
    { id: 'Casual half-body portrait, standing with a relaxed natural curve, hands resting comfortably, candid lifestyle photography', label: 'Casual Half-Body (Santai & Rileks)', allowedTypes: ['all'] },
    { id: 'Standing perfectly straight facing the camera in an open landscape, both arms resting naturally by the sides', label: 'Berdiri Lurus Menatap Kamera, Lengan Natural', allowedTypes: ['nature', 'urban'] },
    { id: 'Side profile shot, looking 45 degrees away', label: 'Side Profile (Menyamping 45°)', allowedTypes: ['all'] },
    { id: 'Side profile shot, looking far into the distance, explicitly not looking at the camera', label: 'Side Profile, Memandang Jauh', allowedTypes: ['nature', 'urban', 'yacht', 'sports'] },
    { id: 'Candid shot, subject looking away from the camera', label: 'Candid Looking Away', allowedTypes: ['all'] },
    { id: 'Standing straight facing the camera, both hands tucked fully and deeply inside the pockets', label: 'Berdiri Lurus, Tangan di Saku', allowedTypes: ['all'] },
    { id: 'Standing relaxed in the middle of the street facing the camera, one leg slightly bent, both hands in pockets', label: 'Berdiri Santai di Jalan, Satu Kaki Ditekuk', allowedTypes: ['urban'] },
    { id: 'Looking slightly up and smiling gently', label: 'Melihat ke Atas Sambil Tersenyum', allowedTypes: ['all'] },
    { id: 'Standing facing the camera laughing happily, giving a double thumbs up', label: 'Pose Dua Jempol (Double Thumbs Up)', allowedTypes: ['all'] },
    { id: 'Dynamic candid shot, subject walking forward naturally towards the camera with a confident strut', label: 'Berjalan ke Arah Kamera (Dynamic Strut)', allowedTypes: ['urban', 'nature', 'indoor'] },
    { id: 'Candid walking, stepping forward confidently, looking straight ahead with natural arm swings', label: 'Candid Berjalan Mantap Menatap Lurus', allowedTypes: ['urban', 'nature', 'indoor'] },
  ]},
  { group: 'Profesional & Ekspresif', items: [
    { id: 'Confident professional pose, arms crossed over chest', label: 'Professional Confident (Tangan Bersilang)', allowedTypes: ['studio', 'urban', 'indoor', 'office'] },
    { id: 'Standing straight formally in the middle of the frame, both hands neatly clasped or stacked below the stomach', label: 'Berdiri Formal, Tangan Bertautan di Bawah Perut', allowedTypes: ['studio', 'indoor', 'urban', 'office'] },
    { id: 'Standing perfectly straight and symmetrical, staring intensely straight into the camera, arms flat by the sides', label: 'Berdiri Simetris Tegap (Menatap Lurus)', allowedTypes: ['all'] },
    { id: 'Adjusting suit jacket and tie with both hands, looking serious and confident directly at the camera', label: 'Membenarkan Jas/Dasi dengan Dua Tangan', allowedTypes: ['all'] },
    { id: 'Low angle shot, subject looking slightly up, establishing a dominant presence', label: 'Low Angle (Mendongak Sedikit)', allowedTypes: ['all'] },
    { id: 'Low-angle shot, standing tall facing the camera, looking down with a sharp, dominant and powerful gaze', label: 'Low Angle Dominan (Menunduk Tajam)', allowedTypes: ['studio', 'urban'] },
    { id: 'Powerful boss pose, looking slightly down at the camera with confidence', label: 'Pose Wibawa/Bos (Melihat ke Bawah)', allowedTypes: ['studio', 'indoor', 'urban', 'office'] },
    { id: 'Hand gently resting on the jawline, highlighting facial bone structure', label: 'Tangan Menunjukkan Jawline', allowedTypes: ['all'] },
    { id: 'Resting chin on hand, looking pensive and thoughtful', label: 'Menopang Pipi/Dagu (Pensive)', allowedTypes: ['all'] },
    { id: 'Masculine confident pose, one hand combing or running fingers backward through the hair', label: 'Menyisir Rambut ke Belakang (Confident)', allowedTypes: ['studio', 'urban', 'vehicle'] },
  ]},
  { group: 'Duduk & Bersandar', items: [
    { id: 'Sitting gracefully on a chair with legs crossed, looking casually at the camera', label: 'Duduk di Kursi, Kaki Menyilang (Graceful)', allowedTypes: ['studio', 'indoor', 'urban', 'cafe', 'office'] },
    { id: 'Sitting cross-legged on a wooden bench, both hands resting softly on thighs', label: 'Duduk Sila di Bangku Kayu, Tangan di Paha', allowedTypes: ['nature', 'urban', 'indoor'] },
    { id: 'Sitting casually on a tall wooden stool, both hands resting relaxed on the knees, soft smile', label: 'Duduk Santai di Stool, Tangan di Lutut', allowedTypes: ['all'] },
    { id: 'Sitting casually on a modern chair, legs slightly spread apart in a relaxed posture', label: 'Duduk Santai di Kursi (Relaxed/Spread)', allowedTypes: ['studio', 'indoor', 'urban', 'cafe', 'office'] },
    { id: 'Sitting relaxed and leaning back on a plush sofa, right leg casually crossed over the left', label: 'Duduk Bersandar di Sofa, Kaki Menyilang', allowedTypes: ['indoor', 'studio'] },
    { id: 'Sitting gracefully on the edge of a bed, one hand playfully running through the hair near the neck', label: 'Duduk di Tepi Kasur, Tangan Mainkan Rambut', allowedTypes: ['indoor', 'studio'] },
    { id: 'Sitting elegantly on an outdoor wooden chair, legs crossed, hands resting relaxed in the lap', label: 'Duduk Elegan di Kursi Kayu Outdoor', allowedTypes: ['urban', 'nature', 'cafe', 'all'] },
    { id: 'Sitting relaxed in a comfortable seat, looking out a window pensively', label: 'Duduk Rileks, Pandangan ke Jendela (Candid)', allowedTypes: ['indoor', 'vehicle', 'cafe'] },
    { id: 'Sitting confidently in the middle of modern stairs, leaning slightly forward, hands clasped together resting between the knees', label: 'Duduk Confident di Tangga, Tangan Bertautan', allowedTypes: ['indoor', 'urban'] },
    { id: 'Sitting on a large rock, both hands holding the brim of a hat, looking away upwards thoughtfully', label: 'Duduk di Batu, Pegang Pinggiran Topi', allowedTypes: ['nature'] },
    { id: 'Sitting casually on a rock or surface, one leg slightly bent, one hand relaxed on knee, the other hand supporting body weight backwards', label: 'Duduk Santai, Satu Tangan Menopang ke Belakang', allowedTypes: ['nature', 'urban', 'yacht'] },
    { id: 'Sitting and leaning back comfortably on the hood of a car, legs crossed loosely forward, both hands inside pockets', label: 'Duduk Bersandar di Kap Mobil, Kaki Menyilang', allowedTypes: ['urban'] },
    { id: 'Casual pose, leaning comfortably against a wall or object', label: 'Bersandar Santai di Dinding/Objek', allowedTypes: ['urban', 'indoor', 'studio', 'cafe'] },
    { id: 'Cool pose leaning casually against a car or surface, hands clasped loosely together in front of the waist', label: 'Bersandar Santai, Tangan Bertautan di Depan', allowedTypes: ['urban'] },
    { id: 'Leaning casually on a glass railing with back towards the camera, looking back over the shoulder', label: 'Bersandar di Pagar Kaca, Menoleh ke Belakang', allowedTypes: ['urban', 'yacht', 'indoor'] },
    { id: 'Leaning on a concrete pillar, arms crossed over chest, legs slightly crossed, looking down with a cool and melancholic expression', label: 'Bersandar di Pilar, Lengan Bersilang, Cool', allowedTypes: ['urban', 'indoor'] },
    { id: 'Sitting sweetly on a wooden swing, hands resting politely in lap, looking straight with a slight smile', label: 'Duduk Manis di Ayunan Kayu', allowedTypes: ['nature', 'urban'] },
  ]},
  { group: 'Aktivitas Kafe & Kuliner', items: [
    { id: "Sitting at a cafe table, both hands elegantly wrapped around a warm coffee mug, looking at the camera with a soft smile", label: 'Duduk di Kafe, Genggam Mug Kopi (Soft Smile)', allowedTypes: ['cafe', 'indoor', 'urban'] },
    { id: "Sitting at a cafe table leaning slightly forward, one hand playfully resting on the table as if holding a partner's hand, POV shot", label: 'Duduk di Kafe, Condong ke Depan (POV Pasangan)', allowedTypes: ['cafe', 'urban', 'indoor'] },
    { id: "Barista pose: standing behind a counter, one hand resting on an espresso machine, looking confidently at the camera", label: 'Pose Barista: Berdiri di Balik Counter, Tangan di Mesin Espresso', allowedTypes: ['cafe', 'indoor'] },
    { id: "Standing holding a beautiful latte art coffee cup at chest height with both hands, gentle smile", label: 'Berdiri, Pegang Cangkir Latte Art (Senyum Manis)', allowedTypes: ['cafe', 'indoor', 'urban', 'nature'] },
    { id: "Sitting at a table, looking down at an open notebook or laptop, one hand holding a coffee cup, candid study vibe", label: 'Duduk Fokus, Laptop & Kopi (Study/Work Vibe)', allowedTypes: ['cafe', 'indoor', 'urban'] },
    { id: "Sitting at a cafe, holding a cold drink (iced coffee, juice) up near the face in a cheerful pose", label: 'Duduk di Kafe, Angkat Minuman Dingin (Cheerful)', allowedTypes: ['cafe', 'indoor', 'urban', 'nature', 'beach'] },
    { id: "Standing for a mirror selfie at a cafe bathroom, holding a coffee cup with one hand and phone with the other", label: 'Mirror Selfie di Toilet Kafe, Pegang Kopi & HP', allowedTypes: ['cafe', 'indoor'] },
  ]},
  { group: 'Aktivitas & Interaksi Umum', items: [
    { id: 'Standing for a mirror selfie, legs casually crossed, both hands holding a smartphone at chest height', label: 'Mirror Selfie, Kaki Bersilang, Pegang HP', allowedTypes: ['indoor', 'vehicle', 'urban'] },
    { id: 'Sitting on the edge of a boat with legs dangling, extending one arm holding a smartphone for a selfie', label: 'Duduk di Tepi Kapal, Selfie dengan HP', allowedTypes: ['yacht'] },
    { id: 'Standing, right hand shading eyes from the sun, left hand making a peace sign', label: 'Tangan Menghalangi Matahari & Peace Sign', allowedTypes: ['nature', 'urban', 'sports', 'yacht', 'beach'] },
    { id: 'Side profile shot looking forward, right hand holding a black umbrella, left hand tucked into coat pocket', label: 'Menyamping Pegang Payung, Tangan Kiri di Saku', allowedTypes: ['urban', 'nature'] },
    { id: 'Standing straight and sporty, both hands holding a padel racket and a ball in front of the stomach', label: 'Berdiri Tegap, Memegang Raket Padel & Bola', allowedTypes: ['sports'] },
    { id: 'Sitting cross-legged, looking down focused on typing on a smartphone held with both hands', label: 'Duduk Kaki Menyilang, Fokus Mengetik HP', allowedTypes: ['urban', 'indoor', 'nature', 'cafe'] },
    { id: 'Walking casually towards the camera, looking slightly to the right, holding the strap of a sling bag', label: 'Berjalan, Pegang Tali Tas Selempang', allowedTypes: ['urban', 'nature', 'indoor'] },
    { id: 'Walking towards the camera, looking straight ahead, casually holding a smartphone', label: 'Berjalan Lurus Menatap Kamera + Pegang HP', allowedTypes: ['urban', 'indoor', 'nature'] },
    { id: 'Standing on an escalator, hands in pockets, looking casually to the side', label: 'Berdiri di Eskalator, Tangan di Saku', allowedTypes: ['escalator'] },
    { id: 'Lying prone on a paddleboard, legs bent upwards, one hand making a peace sign, the other holding an action camera', label: 'Tengkurap di Paddleboard, Peace Sign & Action Cam', allowedTypes: ['nature', 'yacht', 'beach'] },
  ]},
  { group: 'Hari Raya & Perayaan', items: [
    { id: 'Standing with hands clasped together in front of the chest in a traditional Indonesian greeting/apology gesture', label: 'Gestur Minta Maaf / Sungkem (Lebaran)', allowedTypes: ['all'] },
    { id: 'Standing with one hand cupped over the other fist in a traditional Chinese greeting gesture (Gong Xi Fa Cai)', label: 'Gestur Salam Gong Xi Fa Cai (Imlek)', allowedTypes: ['all'] },
    { id: 'Standing joyfully with hands pressed together in front of the chest in a traditional Balinese greeting (Om Swastiastu)', label: 'Gestur Salam Panganjali (Galungan/Bali)', allowedTypes: ['all'] },
    { id: 'Holding a beautifully wrapped gift box and smiling warmly', label: 'Memegang Kotak Kado (Natal / Hadiah)', allowedTypes: ['all'] },
  ]},
  { group: 'Bawah Air (Underwater)', items: [
    { id: 'Floating weightlessly underwater, relaxed limbs, looking up towards the light source', label: 'Mengambang Bebas (Menatap Cahaya Permukaan)', allowedTypes: ['underwater'] },
    { id: 'Swimming gracefully underwater horizontally', label: 'Berenang Horizontal Bawah Air', allowedTypes: ['underwater'] },
    { id: 'Diving downwards into the deep water', label: 'Menyelam ke Bawah (Diving)', allowedTypes: ['underwater'] },
    { id: 'Standing on the pool floor underwater, looking at the camera', label: 'Berdiri di Dasar Kolam Bawah Air', allowedTypes: ['underwater'] },
  ]},
  { group: 'Edgy & Subkultur', items: [
    { id: 'Edgy punk rock pose, rebellious attitude', label: 'Edgy Punk/Rocker Pose', allowedTypes: ['studio', 'urban', 'indoor'] },
    { id: 'Heavy metal pose, aggressive and energetic', label: 'Metalhead Pose', allowedTypes: ['studio', 'urban', 'indoor'] },
    { id: 'One hand covering the mouth, mysterious and edgy vibe', label: 'Menutup Mulut dengan Tangan', allowedTypes: ['all'] },
    { id: 'High-fashion editorial pose, one hand confidently on the hip', label: 'Satu Tangan di Pinggang (High-Fashion)', allowedTypes: ['studio', 'urban', 'indoor', 'nature'] },
  ]},
  { group: 'Pose Tambahan', items: [
    { id: 'Sitting on stairs, leaning forward, resting on forearms at the knees, one hand supporting the chin in a pensive pose', label: 'Duduk di Tangga, Condong ke Depan, Menopang Dagu', allowedTypes: ['urban', 'indoor'] },
    { id: 'Half-body medium portrait, standing, smiling, one hand raised to lips in a blowing a kiss gesture', label: 'Half-Body: Senyum, Tangan ke Bibir Meniup Ciuman', allowedTypes: ['all'] },
    { id: 'Half-body medium portrait, standing, facing the camera with a cheerful smile, one arm raised with the hand gently resting near the ear or side of the head, relaxed posture', label: 'Half-Body: Tersenyum, Satu Tangan ke Samping Kepala', allowedTypes: ['all'] },
    { id: 'Half-body medium portrait, standing perfectly straight facing the camera, both arms resting down naturally by the sides, calm and composed expression', label: 'Half-Body: Berdiri Tegap, Lengan Natural di Sisi', allowedTypes: ['all'] },
    { id: 'Half-body medium portrait, standing, facing the camera, one index finger placed to the lips in a shush gesture', label: 'Half-Body: Satu Jari di Bibir, Pose "Diam"', allowedTypes: ['all'] },
    { id: 'Half-body medium portrait, looking slightly upwards with closed eyes, one hand resting on the opposite shoulder', label: 'Half-Body: Mendongak, Mata Terpejam, Tangan di Bahu', allowedTypes: ['all'] },
    { id: 'Standing with both hands raised high behind the head, elbows pulled back, a slight stretching, and smiling', label: 'Berdiri, Kedua Tangan di Belakang Kepala, Peregangan', allowedTypes: ['all'] },
    { id: 'Crouching low on the floor, sideways, looking back over the shoulder from a rear low angle', label: 'Duduk Jongkok Rendah, Miring, Menoleh ke Belakang', allowedTypes: ['urban', 'indoor'] },
  ]},
];

// ─── CAMERA LENSES ───────────────────────────────────────────────────────────

export const CAMERA_LENSES = [
  { id: 'Standard portrait lens (50mm)', label: 'Standard Lens (Normal)', allowedTypes: ['all'] },
  { id: 'Wide angle lens, capturing more of the subject and environment', label: 'Wide Angle Lens (Ekspansif)', allowedTypes: ['all'] },
  { id: 'Full-frame fisheye lens, distorted ultra-wide perspective with bulging center, 10mm ultra-wide lens with barrel distortion, edge-to-edge frame coverage, bright corners, absolutely zero vignette and no black borders', label: 'Fisheye Lens (Distorsi Melengkung)', allowedTypes: ['all'] },
  { id: 'Telephoto lens (85mm), compressed background with strong bokeh blur', label: 'Telephoto Lens (Fokus, Background Blur)', allowedTypes: ['all'] },
  { id: 'Telephoto zoom lens (200mm), paparazzi editorial style with high compression', label: 'Telephoto Paparazzi (Jarak Jauh)', allowedTypes: ['urban', 'nature', 'sports', 'yacht', 'beach'] },
  { id: 'Macro lens, extreme close-up details', label: 'Macro Lens (Extreme Close-up)', allowedTypes: ['all'] },
  { id: "Bird's eye view, top-down shot from directly above", label: "Bird's Eye View (Dari Atas 90°)", allowedTypes: ['all'] },
  { id: 'Dutch angle, intentionally tilted camera for dynamic fashion editorial vibe', label: 'Dutch Angle (Kamera Miring)', allowedTypes: ['all'] },
  { id: 'Underwater dome port camera lens, half underwater and half above water split shot', label: 'Dome Port (Setengah Air Setengah Darat)', allowedTypes: ['underwater'] },
];

// ─── LIGHTING STYLES ─────────────────────────────────────────────────────────

export const LIGHTING_STYLES = [
  { group: 'Natural & Outdoor', items: [
    { id: 'Standard natural daylight', label: 'Standard / Natural Lighting', allowedTypes: ['all'] },
    { id: 'Bright sunny daylight with hard sharp shadows', label: 'Cahaya Terik Siang Hari (Bayangan Keras)', allowedTypes: ['urban', 'nature', 'yacht', 'sports', 'beach'] },
    { id: 'Warm golden hour sunlight', label: 'Golden Hour (Cahaya Sore)', allowedTypes: ['all'] },
    { id: "Warm golden hour backlighting, creating a beautiful glowing rim light effect around the subject's hair and shoulders", label: 'Golden Hour Backlighting (Rim Light)', allowedTypes: ['urban', 'nature', 'yacht', 'sports', 'beach'] },
    { id: 'Hard natural side lighting, creating strong crisp shadows on half the face', label: 'Hard Natural Side Light (Cahaya Tajam Samping)', allowedTypes: ['all'] },
    { id: 'Beautiful pastel sunset sky lighting', label: 'Sunset Pastel (Cahaya Senja Lembut)', allowedTypes: ['all'] },
  ]},
  { group: 'Cafe & Indoor Ambience', items: [
    { id: 'Warm cozy cafe window light, soft natural daylight streaming through glass, creating a bokeh background', label: 'Cahaya Jendela Kafe (Hangat & Bokeh)', allowedTypes: ['cafe', 'indoor'] },
    { id: 'Warm vintage Edison bulb string light bokeh background, cozy cafe ambience', label: 'Lampu Edison String Light Bokeh (Cafe Vintage)', allowedTypes: ['cafe', 'indoor', 'urban'] },
    { id: 'Warm cozy indoor ambient lighting', label: 'Pencahayaan Ruangan Dalam Hangat (Cozy Indoor)', allowedTypes: ['all'] },
    { id: 'Moody dark cafe lighting with strong light beam highlighting the subject', label: 'Moody Cafe Lighting (Dark & Dramatic)', allowedTypes: ['cafe', 'indoor', 'restaurant'] },
    { id: 'Bright airy and clean indoor daylight, minimalist cafe vibes', label: 'Bright Airy Indoor (Minimalist Cafe)', allowedTypes: ['cafe', 'indoor'] },
  ]},
  { group: 'Studio & Dramatic', items: [
    { id: 'Black and white monochrome photography', label: 'Black and White (Monochrome / B&W)', allowedTypes: ['all'] },
    { id: 'Cinematic dramatic studio lighting', label: 'Cinematic Dramatic Studio', allowedTypes: ['all'] },
    { id: 'Strong Chiaroscuro lighting, dramatic contrast, brightly illuminated face emerging from a pitch-black background', label: 'Chiaroscuro (Kontras Tinggi)', allowedTypes: ['studio', 'indoor', 'vehicle', 'cafe', 'restaurant'] },
    { id: 'Classic Rembrandt lighting, featuring a distinct triangle of light on the shadowed cheek', label: 'Rembrandt Lighting (Segitiga Cahaya)', allowedTypes: ['studio', 'indoor', 'vehicle'] },
    { id: 'Professional studio softbox lighting with gentle fill light, creating perfectly soft diffused shadows on the face', label: 'Softbox & Fill Light (Studio Lembut)', allowedTypes: ['all'] },
  ]},
  { group: 'Creative & Effects', items: [
    { id: 'Sharp, dramatic shadow patterns cast across the face and body (Gobo lighting effect / Window blind shadows)', label: 'Pola Bayangan Tajam Jendela (Gobo Lighting)', allowedTypes: ['all'] },
    { id: "Ring light illumination, showing prominent circular catchlights clearly visible in the subject's eyes", label: 'Ring Light (Catchlight Mata)', allowedTypes: ['studio', 'indoor'] },
    { id: 'Honeycomb grid lighting, focused dramatic beam highlighting the face with deep shadows', label: 'Honeycomb Grid Lighting', allowedTypes: ['studio', 'indoor'] },
    { id: 'Vibrant dual-tone color gel lighting (split red and blue lighting on the face)', label: 'Dual-tone Red & Blue Gel Lighting', allowedTypes: ['studio', 'indoor', 'urban'] },
    { id: 'Vibrant neon street lighting', label: 'Neon Street Lighting', allowedTypes: ['all'] },
    { id: 'Vibrant red colored backlighting, creating a glowing silhouette against a dark background', label: 'Colored Backlighting (Merah)', allowedTypes: ['studio', 'indoor'] },
  ]},
  { group: 'Bawah Air (Underwater)', items: [
    { id: 'Underwater caustic lighting with beautiful sunlight rays piercing and bending through the water surface', label: 'Cahaya Caustics (Sinar Matahari Tembus Air)', allowedTypes: ['underwater'] },
    { id: 'Deep blue diffuse underwater lighting, mysterious and ethereal', label: 'Cahaya Biru Dalam (Deep Diffuse)', allowedTypes: ['underwater'] },
    { id: 'Bright clear swimming pool lighting', label: 'Cahaya Terang Kolam Renang Jernih', allowedTypes: ['underwater'] },
  ]},
];

// ─── HAIRSTYLES ──────────────────────────────────────────────────────────────

export const HAIRSTYLES = {
  Pria: [
    'Original hairstyle from reference image (Sesuai Asli)', 'Buzz Cut', 'Fade', 'Taper Fade',
    'Pompadour', 'Undercut', 'Comb Over', 'Quiff', 'French Crop', 'Mullet', 'Slick Back',
    'Edgar Cut', 'Crew Cut', 'Faux Hawk', 'Korean Comma Hair', 'Korean Two-Block Cut',
    'Long Wavy Hair', 'Long Straight Hair', 'Emo Fringe Hair (Long swept bangs)', 'Man Bun',
    'Samurai Top Knot', 'Harajuku Style Hair (Heavily textured and layered)',
    'Visual Kei Hair (Voluminous, asymmetrical, and spiky)',
    'Cornrows', 'Small Afro', 'Big Afro', 'Box Braids', 'Dreadlocks',
  ],
  Wanita: [
    'Original hairstyle from reference image (Sesuai Asli)',
    'Hime Cut (Straight hair with blunt cheek-length sidelocks and front bangs)',
    'Wolf Cut (Messy layered shag with longer mullet vibe back)',
    'Butterfly Haircut (Bouncy long layers framing the face)',
    'Jellyfish Haircut (Avant-garde short bob top with long underlying tentacle layers)',
    'Hush Cut (Soft Korean lightweight layers with wispy bangs)',
    'Pixie Cut (Super short cropped hair)', 'Bixie Cut (Textured bob-pixie hybrid)',
    'Blunt Bob (Straight perfectly even cut short bob)',
    'French Bob (Short chin-length bob with natural wavy texture)',
    'Asymmetrical Bob (Uneven length short bob)', 'Long Bob (Lob, collarbone length)',
    'Shaggy Cut (Choppy textured rock-and-roll layers)',
    'Classic Layered Cut (Voluminous stepped layers)',
    'Long Blunt Cut (Straight perfectly even ends, zero layers)',
    'Long V-Cut (Long hair tapering to a V-shape at the back)',
    'Long U-Cut (Long hair with a soft U-shaped curve at the back)',
    'Long Wavy Hair', 'Shoulder-length Straight Hair',
    'Curtain Bangs (Long center-parted bangs framing the face)',
    'Wispy See-through Bangs (Thin delicate Korean style front fringe)',
    'Micro Bangs / Baby Bangs (Super short fringe above eyebrows)',
    'Ponytail', 'French Braids', 'Messy Bun', 'Elegant Updo',
    'Neat Flight Attendant Bun (Sanggul Rapi Pramugari)',
    'Traditional Javanese Hairbun (Sanggul Tradisional)',
    'Double Buns (Cepol Dua/Pucca style)', 'Two Classic Braids (Kepang Dua)',
    'Harajuku Style Hair (Heavily textured and layered)',
    'Visual Kei Hair (Voluminous, asymmetrical)',
    'Box Braids', 'Cornrows', 'Curly Voluminous', 'Small Afro', 'Big Afro',
  ],
  Unisex: [
    'Original hairstyle from reference image (Sesuai Asli)',
    'Dreadlocks', 'Shag', 'Small Afro', 'Big Afro', 'Bald', 'Bowl Cut', 'Messy Medium',
    'Long Emo Fringe Hair', 'Harajuku Style Hair', 'Visual Kei Hair',
    'Cornrows', 'Box Braids', 'Long Hair', 'Man Bun',
  ],
};

export const COLOR_TYPES = ['One Tone', 'Two Tone (Ombre)', 'Tri Tone', 'Highlight'];
export const BASE_COLORS = [
  'Black', 'Dark Brown', 'Light Brown', 'Ash Blonde', 'Platinum Blonde', 'Strawberry Blonde',
  'Burgundy', 'Fire Engine Red', 'Silver/Grey', 'Electric Blue', 'Neon Pink', 'Pastel Peach',
  'Vibrant Violet', 'Mint Green', 'Rose Gold',
];

// ─── ACCESSORIES ─────────────────────────────────────────────────────────────

export const ACCESSORIES_DATABASE = [
  { group: 'Kacamata (Eyewear)', items: [
    { id: 'Reading glasses', label: 'Kacamata Baca' },
    { id: 'Thin round frame glasses', label: 'Kacamata Bingkai Bulat Tipis' },
    { id: 'Sunglasses', label: 'Kacamata Hitam' },
    { id: 'Oversized sunglasses', label: 'Kacamata Hitam Oversized' },
    { id: 'White frame sunglasses', label: 'Kacamata Bingkai Putih' },
    { id: 'Blue sunglasses resting on head', label: 'Kacamata Biru di Atas Kepala' },
    { id: 'Trendy square frame glasses', label: 'Kacamata Frame Kotak (Trendy)' },
  ]},
  { group: 'Topi & Kepala', items: [
    { id: 'Pink and yellow flower hair clip', label: 'Jepit Rambut Bunga (Pink/Kuning)' },
    { id: 'Cream and white hair scrunchie', label: 'Scrunchie Rambut Krem/Putih' },
    { id: 'Green plain beanie hat', label: 'Beanie/Kupluk Hijau' },
    { id: 'Black-and-white knit beanie hat', label: 'Beanie/Kupluk Rajut Hitam-Putih' },
    { id: 'White baseball cap', label: 'Topi Bisbol Putih' },
    { id: 'Green baseball cap', label: 'Topi Bisbol Hijau' },
    { id: 'Black baseball cap worn backwards', label: 'Topi Bisbol Hitam (Dibalik ke Belakang)' },
    { id: 'Khaki bucket hat with a neck strap', label: 'Topi Bucket Khaki (dengan Tali)' },
    { id: 'Tupac style tied bandana on head', label: 'Bandana Ikat (Tupac Style)' },
    { id: 'Silky durag tied on head', label: 'Durag Penutup Kepala (Rapper Style)' },
    { id: 'Black wireless headphones worn over the ears or around the neck', label: 'Headphone Nirkabel Hitam' },
    { id: 'Classic beret hat, worn slightly tilted', label: 'Baret (Beret Hat, Miring Stylish)' },
    { id: 'Wide brim straw hat', label: 'Topi Jerami Lebar (Pantai/Resort)' },
  ]},
  { group: 'Perhiasan & Tindik', items: [
    { id: 'Nose piercing', label: 'Tindik Hidung' },
    { id: 'Septum piercing', label: 'Tindik Septum' },
    { id: 'Eyebrow piercing', label: 'Tindik Alis' },
    { id: 'Lip piercing', label: 'Tindik Bibir' },
    { id: 'Single ear piercing (stud)', label: 'Tindik Satu Telinga (Stud)' },
    { id: 'Double ear piercings', label: 'Tindik Dua Telinga' },
    { id: 'Large punk style hoop earrings', label: 'Anting Ring Besar (Punk/Edgy)' },
    { id: 'Gold chain necklace', label: 'Kalung Emas (Chain)' },
    { id: 'Silver necklace', label: 'Kalung Perak' },
    { id: 'Chunky hip-hop chain with a massive iced-out diamond pendant', label: 'Kalung Rantai Besar + Permata (Rapper)' },
    { id: 'Diamond iced-out teeth grillz', label: 'Grillz Gigi (Iced Out/Diamond)' },
    { id: 'Leather bracelet', label: 'Gelang Kulit' },
    { id: 'Chrome Hearts silver rings on fingers', label: 'Cincin Chrome Hearts' },
    { id: 'Diamond engagement ring', label: 'Cincin Berlian' },
    { id: 'Gold signet ring', label: 'Cincin Emas (Signet)' },
    { id: 'Elegant pearl necklace', label: 'Kalung Mutiara Elegan' },
    { id: 'Pearl stud earrings', label: 'Anting Mutiara' },
    { id: 'Vintage pearl brooch pinned on chest', label: 'Bros Mutiara (Vintage Brooch)' },
    { id: 'Delicate gold layered necklaces (2-3 chains)', label: 'Kalung Emas Berlapis (2-3 Rantai Tipis)' },
    { id: 'Shell or pearl anklet bracelet on wrist', label: 'Gelang Tangan Kerang/Mutiara (Beach Vibe)' },
  ]},
  { group: 'Dasi, Syal & Kaos Kaki', items: [
    { id: 'Knit tie', label: 'Dasi Rajut (Knit Tie)' },
    { id: 'Striped necktie', label: 'Dasi Motif Garis' },
    { id: 'Red necktie', label: 'Dasi Merah' },
    { id: 'Blue necktie', label: 'Dasi Biru' },
    { id: 'Elegant silk neckerchief or ascot tie', label: 'Syal Sutra / Ascot (Elegan)' },
    { id: 'Thick wool winter scarf', label: 'Syal Wol Musim Dingin' },
    { id: 'Light chiffon scarf loosely draped around the neck', label: 'Selendang Sifon Ringan di Leher' },
    { id: 'High white calf-length socks', label: 'Kaos Kaki Putih Sebetis' },
    { id: 'White knee-high socks', label: 'Kaos Kaki Putih Selutut' },
    { id: 'Patterned socks with fun motifs', label: 'Kaos Kaki Bermotif (Fun Socks)' },
  ]},
  { group: 'Tas & Kantong', items: [
    { id: 'Woven rattan or straw tote bag', label: 'Tote Bag Anyaman Rotan/Jerami' },
    { id: 'Pink canvas tote bag', label: 'Tote Bag Kanvas Pink' },
    { id: 'Cream backpack', label: 'Tas Ransel Krem' },
    { id: 'Black leather shoulder bag', label: 'Shoulder Bag Kulit Hitam' },
    { id: 'White crossbody sling bag', label: 'Tas Selempang Putih (Crossbody)' },
    { id: 'Sports duffel bag', label: 'Tas Duffel Olahraga' },
    { id: 'Classic leather briefcase', label: 'Tas Kerja (Briefcase Kulit Klasik)' },
    { id: 'Trendy mini shoulder bag', label: 'Mini Shoulder Bag (Trendy)' },
    { id: 'Aesthetic paper bag from a boutique store', label: 'Paper Bag Estetik (Boutique)' },
    { id: 'Alfamart plastic shopping bag', label: 'Kantong Kresek Alfamart' },
    { id: 'Indomaret plastic shopping bag', label: 'Kantong Kresek Indomaret' },
    { id: 'FamilyMart plastic shopping bag', label: 'Kantong Kresek FamilyMart' },
  ]},
  { group: 'Properti Kafe & Kuliner', items: [
    { id: 'Ceramic coffee mug with latte art', label: 'Mug Keramik Kopi (Latte Art)' },
    { id: 'Iced coffee in a transparent glass with a straw', label: 'Es Kopi di Gelas Transparan (Sedotan)' },
    { id: 'Elegant espresso cup (demitasse)', label: 'Cangkir Espresso Elegan (Demitasse)' },
    { id: 'Pastel-colored macaroon or dessert plate', label: 'Piring Dessert Warna Pastel (Macaron)' },
    { id: 'Open journal/notebook and pen on a cafe table', label: 'Buku Jurnal Terbuka + Pena (di Meja Kafe)' },
    { id: 'Small potted succulent plant on a cafe table', label: 'Tanaman Succulent Kecil di Meja Kafe' },
    { id: 'Croissant or pastry on a plate', label: 'Croissant / Pastri di Atas Piring' },
  ]},
  { group: 'Lainnya (Properti)', items: [
    { id: 'Black leather driving gloves', label: 'Sarung Tangan Kulit Hitam' },
    { id: 'Red electric guitar', label: 'Gitar Elektrik Merah' },
    { id: 'Acoustic guitar', label: 'Gitar Akustik' },
    { id: 'Action camera (GoPro)', label: 'Kamera Aksi (GoPro)' },
    { id: 'Vintage film camera held in hand', label: 'Kamera Film Vintage di Tangan' },
    { id: 'Festival wristbands', label: 'Gelang Festival' },
    { id: 'Flowers bouquet held in hand', label: 'Buket Bunga di Tangan' },
    { id: 'Classic paperback book held in hand', label: 'Novel/Buku Tipis di Tangan' },
  ]},
];

export const LUXURY_WATCHES = [
  { id: 'No watch', label: 'Tanpa Jam Tangan' },
  { id: 'Rolex Submariner watch', label: 'Rolex Submariner' },
  { id: 'Rolex Daytona watch', label: 'Rolex Daytona' },
  { id: 'Rolex Datejust watch', label: 'Rolex Datejust' },
  { id: 'Rolex Lady-Datejust watch', label: 'Rolex Lady-Datejust (Wanita)' },
  { id: 'Audemars Piguet Royal Oak watch', label: 'Audemars Piguet Royal Oak' },
  { id: 'Patek Philippe Nautilus watch', label: 'Patek Philippe Nautilus' },
  { id: 'Patek Philippe Aquanaut watch', label: 'Patek Philippe Aquanaut' },
  { id: 'Cartier Tank watch', label: 'Cartier Tank' },
  { id: 'Cartier Santos watch', label: 'Cartier Santos' },
  { id: 'Cartier Crash watch', label: 'Cartier Crash (Ikonik)' },
  { id: 'Richard Mille watch', label: 'Richard Mille' },
  { id: 'Casio G-Shock watch', label: 'G-Shock (Kasual)' },
  { id: 'Smartwatch (Apple Watch style)', label: 'Smartwatch (Apple Watch)' },
];

export const FACIAL_HAIR = [
  { id: 'Clean shaven', label: 'Tanpa Brewok (Clean Shaven)' },
  { id: 'Thin mustache', label: 'Kumis Tipis' },
  { id: 'Thick mustache', label: 'Kumis Tebal' },
  { id: 'Goatee', label: 'Goatee' },
  { id: 'Full beard', label: 'Janggut Penuh' },
  { id: 'Stubble beard', label: 'Stubble (Brewok Tipis)' },
];

export const HIJAB_STYLES = [
  { id: 'Pashmina hijab, draped elegantly', label: 'Pashmina (Menjuntai Elegan)' },
  { id: 'Loose Pashmina hijab, draped naturally over the head and shoulders', label: 'Pashmina Longgar (Draped Natural)' },
  { id: 'Square hijab (Hijab Segi Empat), classic Indonesian style', label: 'Hijab Segi Empat (Klasik)' },
  { id: 'Hijab cleanly wrapped and tied closely around the neck (lilit leher style)', label: 'Lilit Leher (Clean Wrapped)' },
  { id: 'Turban style hijab', label: 'Turban (Modis)' },
  { id: 'Modern turban style hijab with volume', label: 'Turban Modern (Voluminous)' },
  { id: 'Khimar hijab, long and modest covering the chest', label: 'Khimar (Syari Menutup Dada)' },
  { id: 'Sport hijab, tight and aerodynamic', label: 'Hijab Sport (Ketat/Aerodinamis)' },
  { id: 'Bergo instant hijab with a soft pet/visor', label: 'Bergo (Instan dengan Pet)' },
  { id: 'Hijab cleanly tucked into the shirt collar for a neat professional look', label: 'Tucked-in (Dimasukkan ke Kerah)' },
];

export const EXPRESSIONS = [
  { id: 'Natural neutral expression', label: 'Natural' },
  { id: 'Slight smile with a calm, pensive look', label: 'Senyum Tipis (Pensive)' },
  { id: 'Smiling', label: 'Tersenyum' },
  { id: 'Laughing', label: 'Tertawa' },
  { id: 'Winking one eye', label: 'Wink (Berkedip)' },
  { id: 'One eyebrow raised skeptically', label: 'Satu Alis Terangkat' },
  { id: 'Playful pouty lips (duck face)', label: 'Bibir Manyun (Pouty / Duck Face)' },
  { id: 'Fierce, intense stare', label: 'Fierce/Tajam' },
  { id: 'Showing teeth with grillz, hip-hop attitude', label: 'Senyum Pamer Gigi (Attitude Grillz)' },
];

export const MAKEUP_STYLES = [
  { id: 'Natural look, no visible makeup', label: 'Bawaan Asli (No Makeup/Natural)' },
  { id: 'Minimalist clean girl makeup', label: 'Minimalist Makeup' },
  { id: 'Korean idol makeup, glass skin, gradient lips', label: 'Korean Idol Makeup (Female)' },
  { id: 'K-pop boyband makeup, subtle eyeliner, flawless skin, tinted lip balm', label: 'K-Pop Boyband Makeup (Male)' },
  { id: 'Chinese Douyin style makeup, glittery eyes, bold lips', label: 'Chinese Douyin Makeup' },
  { id: 'Indonesian traditional glamorous makeup', label: 'Indonesian Makeup' },
  { id: 'Filipina Bebot style makeup', label: 'Bebot Makeup' },
  { id: 'Latina makeup, sharp contour, thick lashes', label: 'Latina Makeup' },
  { id: 'Arabic/Farsi makeup, heavy dark eyeliner, dramatic eyes', label: 'Arabic/Farsi Makeup' },
  { id: 'Dark Emo makeup, heavy black eyeliner and dark lips', label: 'Emo / Goth Makeup' },
  { id: 'Glam metal rock band makeup, dramatic theatrical', label: 'Glam Rock / Band Makeup' },
  { id: 'Visual Kei / Harajuku makeup, extreme styling, dramatic contour', label: 'Visual Kei / Harajuku Makeup' },
  { id: 'SFX Makeup: Realistic facial scars and stitches', label: 'Efek Wajah (Bekas Luka/Jahitan)' },
];

// ─── BACKGROUNDS ─────────────────────────────────────────────────────────────
// Setiap background memiliki `type` yang digunakan sebagai scene tag untuk
// smart-filter pakaian, pose, lensa, dan pencahayaan.

export const BACKGROUNDS = [
  { group: 'Kustom & Referensi', items: [
    { id: 'custom_bg', type: 'all', label: 'Tulis Lokasi / Latar Belakang Sendiri' },
    { id: 'image_ref_bg', type: 'all', label: '📸 Gunakan Latar dari Gambar Upload (Match BG/Angle)' },
  ]},
  { group: 'Basic & Studio', items: [
    { id: 'Original background from the reference image', type: 'studio', label: 'Original Background' },
    { id: 'Clean white studio background', type: 'studio', label: 'Studio Putih Bersih' },
    { id: 'Dark grey studio background', type: 'studio', label: 'Studio Abu-abu Gelap' },
    { id: 'Pitch black studio background', type: 'studio', label: 'Latar Hitam Gelap / Pitch Black' },
    { id: 'Vibrant teal or cyan solid studio background', type: 'studio', label: 'Studio Teal/Cyan (Pop Color)' },
    { id: 'Dramatic dark red studio background, moody lighting', type: 'studio', label: 'Latar Studio Merah Gelap Dramatis' },
    { id: 'Solid red background (Official ID photo style)', type: 'studio', label: 'Latar Merah (Pasfoto)' },
    { id: 'Solid blue background (Official ID photo style)', type: 'studio', label: 'Latar Biru (Pasfoto)' },
    { id: 'Abstract elegant gradient background', type: 'studio', label: 'Gradient Abstract (Studio)' },
    { id: 'Plain minimalist blue wall indoors with a simple wooden bench', type: 'studio', label: 'Tembok Biru Minimalis & Bangku Kayu' },
  ]},
  { group: '☕ Kafe & Kuliner', items: [
    { id: 'Inside a cozy third-wave specialty coffee shop with exposed brick walls and warm Edison bulb lighting', type: 'cafe', label: 'Kafe Spesialti (Bata Merah, Lampu Edison)' },
    { id: 'Bright minimalist Scandinavian-style cafe with white walls and large windows', type: 'cafe', label: 'Kafe Minimalis Skandinavia (White & Natural)' },
    { id: 'Japanese-style pour-over coffee bar, clean wooden counter and shelf of specialty beans', type: 'cafe', label: 'Japanese Pour-Over Coffee Bar (Kayu & Bersih)' },
    { id: 'Industrial style dark roast coffee shop with black steel shelves and concrete floors', type: 'cafe', label: 'Kafe Industrial Dark Roast (Baja & Beton)' },
    { id: 'Outdoor cafe terrace with rattan chairs, colorful potted flowers and a charming cobblestone street view', type: 'cafe', label: 'Teras Kafe Outdoor (Kursi Rotan & Bunga)' },
    { id: 'Sidewalk in front of a blue-painted bakery cafe at dusk with soft warm lighting inside', type: 'cafe', label: 'Depan Kafe/Bakery Biru (Senja)' },
    { id: 'Inside a vintage record store slash cafe with warm lighting, vinyl records on the wall, and retro decor', type: 'cafe', label: 'Kafe Vintage Record Store (Retro & Hangat)' },
    { id: 'Parisian style street cafe with outdoor seating and round marble tables on a cobblestone street', type: 'cafe', label: 'Kafe Jalanan Paris (Meja Marmer Bulat)' },
    { id: 'Behind the bar counter of a coffee shop, surrounded by espresso machines and coffee equipment', type: 'cafe', label: 'Di Balik Bar Counter Kafe (Barista Area)' },
    { id: 'Outdoor cafe seating area with red brick walls and dry creeping vines', type: 'cafe', label: 'Outdoor Kafe (Bata Merah & Tanaman Rambat)' },
    { id: 'A vibrant brunch spot with pastel walls, hanging plants, and natural light streaming through big windows', type: 'cafe', label: 'Brunch Spot Pastel (Tanaman Gantung & Cahaya Natural)' },
    { id: 'Sidewalk outside a classic European cafe with wooden windows and subtle Christmas ornaments', type: 'cafe', label: 'Kafe Klasik Jendela Kayu (Ornamen Natal)' },
  ]},
  { group: '🍽️ Restoran & Fine Dining', items: [
    { id: 'Aesthetic fine dining restaurant booth with warm vintage lighting', type: 'restaurant', label: 'Restoran Mewah (Fine Dining Booth, Vintage)' },
    { id: 'High-end fine dining restaurant in a tall skyscraper overlooking the vibrant city skyline of Jakarta at night', type: 'restaurant', label: 'Fine Dining Gedung Tinggi (Jakarta Skyline Malam)' },
    { id: 'High-end fine dining restaurant in a tall skyscraper overlooking the bright city skyline of New York City at night', type: 'restaurant', label: 'Fine Dining Gedung Tinggi (New York Skyline Malam)' },
    { id: 'Stunning outdoor cafe terrace with iron chairs, overlooking the breathtaking Amalfi Coast (Positano) with colorful cliffside houses', type: 'restaurant', label: 'Kafe Outdoor Amalfi Coast (Positano, Italia)' },
    { id: 'In front of a coffee shop with visible menu and VND prices, daytime Vietnam street vibe', type: 'cafe', label: 'Depan Kedai Kopi (Menu VND / Vietnam Vibe)' },
    { id: 'Luxury high-end hair salon interior with large vanity mirrors and stylish chairs', type: 'indoor', label: 'Luxury Hair Salon Interior' },
  ]},
  { group: '🏙️ Architecture & City Vibe', items: [
    { id: 'Urban pedestrian bridge or walkway with iron railings, city apartment background', type: 'urban', label: 'Jembatan Penyeberangan Kota' },
    { id: 'Modern city sidewalk near a wooden bench and green plants during daytime', type: 'urban', label: 'Trotoar Kota Modern (Bangku & Tanaman)' },
    { id: 'Modern city sidewalk in front of a glass and concrete building during daytime', type: 'urban', label: 'Trotoar Kota Depan Gedung Kaca & Beton' },
    { id: 'City sidewalk during light rain, classic building walls and pedestrians with umbrellas', type: 'urban', label: 'Trotoar Kota Hujan Gerimis (Berpayung)' },
    { id: 'Underground subway station near escalators and digital billboards, moody underground lighting', type: 'urban', label: 'Stasiun Kereta Bawah Tanah (Subway)' },
    { id: 'Busy Japanese intersection crosswalk, visible shop signs and road markings (Shibuya style)', type: 'urban', label: 'Persimpangan Jalanan Jepang (Shibuya)' },
    { id: 'Busy metropolitan avenue during golden hour with iconic yellow cabs and skyscrapers (NYC style)', type: 'urban', label: 'Jalan Raya Metropolitan Sore (NYC)' },
    { id: 'Historical cobblestone streets of Edinburgh, Scotland, with classic gothic architecture', type: 'urban', label: 'Jalanan Bersejarah Edinburgh, Skotlandia' },
    { id: 'London city street with a red telephone box and a red double-decker bus in the background', type: 'urban', label: 'Jalanan London (Boks Telepon & Bus Merah)' },
    { id: 'Standing near the iconic Eiffel Tower in Paris, clear sunny day', type: 'urban', label: 'Landmark Menara Eiffel, Paris' },
    { id: 'Ancient streets of Rome near the Colosseum, golden hour lighting', type: 'urban', label: 'Jalanan Bersejarah Roma (Colosseum)' },
    { id: 'Inside the luxurious Galleria Vittorio Emanuele II in Milan, stunning glass architecture and luxury boutiques', type: 'indoor', label: 'Galleria Vittorio Emanuele II, Milan' },
    { id: 'Standing inside the vibrant red torii gates of Fushimi Inari Shrine in Kyoto, Japan', type: 'urban', label: 'Gerbang Kuil Merah (Fushimi Inari, Jepang)' },
    { id: 'Traditional historic street in Kyoto, Japan, surrounded by classic wooden machiya houses and cherry blossoms', type: 'urban', label: 'Jalanan Tradisional Kyoto (Machiya & Sakura)' },
    { id: 'High balcony in the city center with a background of towering skyscrapers', type: 'urban', label: 'Balkon Gedung Tinggi (City Skyscraper View)' },
    { id: 'European city building rooftop terrace with potted plants and views of old roofs', type: 'urban', label: 'Teras Atap Eropa (Rooftop & Tanaman)' },
    { id: 'Narrow cobblestone European old city street during the day', type: 'urban', label: 'Jalanan Berbatu Eropa Kuno (Cobblestone)' },
    { id: 'Outdoor stairs in Santorini, Greece, surrounded by iconic white buildings and blue domes', type: 'urban', label: 'Santorini, Yunani (Bangunan Putih & Kubah Biru)' },
    { id: 'Simple aesthetic street in Japan, standing next to a classic Japanese vending machine during the day', type: 'urban', label: 'Jalanan Jepang Estetik (Vending Machine Siang)' },
    { id: 'Simple aesthetic street in Japan, standing next to a classic Japanese vending machine at night', type: 'urban', label: 'Jalanan Jepang Estetik (Vending Machine Malam)' },
    { id: 'Vibrant futuristic city street at night', type: 'urban', label: 'Jalanan Kota Futuristik (Malam)' },
    { id: 'Open train station platform on a cloudy day with wet floors from recent rain, a green train in the background', type: 'urban', label: 'Peron Stasiun Terbuka (Mendung & Lantai Basah)' },
    { id: 'Dark city alleyway at night, leaning near a concrete pillar and a roll-up door', type: 'urban', label: 'Gang Kota Malam Hari (Pilar Beton & Pintu Gulung)' },
    { id: 'Modern dark futuristic staircase illuminated by sleek neon LED strip lighting', type: 'indoor', label: 'Tangga Gelap Modern (Cahaya Strip LED/Neon)' },
    { id: 'Standing on a flat escalator (travelator) in an airport or subway tunnel with cool white lighting', type: 'escalator', label: 'Lorong Travelator Bandara/Stasiun' },
    { id: 'Modern escalator in a bright shopping mall or airport', type: 'escalator', label: 'Di Atas Eskalator (Mall / Bandara Modern)' },
  ]},
  { group: '🏠 Indoor & Luxury Spaces', items: [
    { id: 'Nighttime indoors, luxurious velvet sofa in a warm and cozy living room', type: 'indoor', label: 'Sofa Beludru Mewah di Ruang Tamu (Malam)' },
    { id: 'Luxury Jakarta apartment bedroom with floor-to-ceiling windows showing city skyline', type: 'indoor', label: 'Kamar Apartemen Mewah Jakarta (City Skyline)' },
    { id: 'Bright hotel bedroom with a white bed, open balcony door revealing a breathtaking ocean view', type: 'indoor', label: 'Kamar Hotel Terang (Pemandangan Laut dari Balkon)' },
    { id: 'Inside a luxurious hotel room in Las Vegas, large windows showing the neon city lights', type: 'indoor', label: 'Kamar Hotel Mewah Las Vegas (City Lights)' },
    { id: 'Inside an art gallery or museum, framed art prints on the white walls, motion-blurred silhouettes of people walking by', type: 'indoor', label: 'Galeri Seni / Museum (Siluet Orang Berjalan)' },
    { id: 'Professional vintage barbershop background with classic chairs and mirrors', type: 'indoor', label: 'Professional Barbershop' },
    { id: 'Inside a cozy vintage bookstore with warm lighting and floor-to-ceiling bookshelves', type: 'indoor', label: 'Toko Buku Vintage (Cozy, Rak Buku Tinggi)' },
    { id: 'Cozy home study room with a wooden desk, books and warm lamp light', type: 'indoor', label: 'Ruang Belajar/Kerja di Rumah (Desk & Lampu Hangat)' },
    { id: 'Outdoor music festival main stage with colorful banners during the day', type: 'indoor', label: 'Festival Musik Outdoor (Panggung & Banner)' },
  ]},
  { group: '🚗 Luxury & Transport', items: [
    { id: 'Inside a luxurious private jet cabin, looking out the window', type: 'vehicle', label: 'Interior Pesawat Pribadi (Private Jet)' },
    { id: 'Inside a premium luxury car, plush leather seats', type: 'vehicle', label: 'Interior Mobil Mewah (Di Kursi Belakang)' },
    { id: 'Inside a metal-walled elevator cabin under bright artificial lighting', type: 'vehicle', label: 'Kabin Lift Metal (Pencahayaan Terang)' },
    { id: 'Luxury airline business class cabin, spacious private seat pods', type: 'vehicle', label: 'Kabin Business Class Maskapai' },
    { id: 'Standing next to a classic vintage car on a city street', type: 'urban', label: 'Bersandar di Mobil Klasik/Vintage' },
    { id: 'Asphalt city street at night next to a modified sports car, illuminated by vibrant street lights', type: 'urban', label: 'Jalanan Kota Malam (Mobil Sport & Lampu Jalan)' },
    { id: 'Deck of a sailing yacht in the open sea, white wake and windy sunny weather', type: 'yacht', label: 'Di Atas Dek Kapal Layar (Laut Lepas, Berangin)' },
    { id: 'Deck of a yacht or speedboat with a backdrop of iconic limestone cliffs (Thailand style) at golden hour', type: 'yacht', label: 'Di Atas Kapal Latar Tebing Kapur (Thailand, Senja)' },
    { id: 'Deck of a luxury yacht cruising the Mediterranean Sea, Amalfi coast cliffside villages in the background', type: 'yacht', label: 'Di Atas Yacht Mewah (Amalfi Coast / Mediterania)' },
    { id: 'Sailing on a wooden boat in Labuan Bajo, Komodo National Park, clear turquoise water and iconic rugged islands', type: 'yacht', label: 'Di Atas Kapal (Labuan Bajo, NTT)' },
  ]},
  { group: '🏋️ Olahraga & Aktivitas', items: [
    { id: 'Green hard tennis court on a sunny day', type: 'sports', label: 'Lapangan Tenis (Tennis Court)' },
    { id: 'Semi-indoor padel court with large windows providing ample natural daylight', type: 'sports', label: 'Lapangan Padel Semi-Indoor' },
    { id: '5-star luxury hotel infinity pool with tropical palm trees', type: 'beach', label: 'Kolam Renang Hotel Bintang 5' },
    { id: 'Middle of calm open sea on a white paddleboard, distant island during daytime', type: 'beach', label: 'Di Atas Paddleboard Tengah Laut' },
  ]},
  { group: '🌿 Nature & Scenic', items: [
    { id: 'Turquoise glacier mountain lake with pine trees and snowy peaks (Moraine Lake style)', type: 'nature', label: 'Danau Pegunungan Biru Toska' },
    { id: 'Pine forest with a rushing waterfall in the background', type: 'nature', label: 'Hutan Pinus & Air Terjun Mengalir' },
    { id: 'High rocky mountain peak overlooking a vast pine forest valley', type: 'nature', label: 'Puncak Gunung Berbatu (Pemandangan Lembah)' },
    { id: 'Standing in the vast sea of sand at Mount Bromo during sunrise, epic volcanic landscape', type: 'nature', label: 'Lautan Pasir Gunung Bromo (Sunrise)' },
    { id: 'Snowy arctic landscape near the North Pole at night, illuminated by a breathtaking green Aurora Borealis', type: 'nature', label: 'Malam Kutub Utara (Aurora Borealis)' },
    { id: 'Walking through the towering green Arashiyama Bamboo Grove in Kyoto, Japan, ethereal natural light', type: 'nature', label: 'Hutan Bambu (Arashiyama, Jepang)' },
    { id: 'Wooden pier by the sea during a pastel sunset', type: 'nature', label: 'Dermaga Kayu Tepi Laut (Senja/Pastel)' },
    { id: 'Beach with a wooden pier and hanging string lights at sunset', type: 'beach', label: 'Pantai dengan Dermaga Kayu & Lampu Gantung' },
    { id: 'Dusk at the beach with crashing waves and a vibrant orange-blue sunset sky', type: 'beach', label: 'Pantai Senja (Ombak & Langit Jingga-Biru)' },
    { id: 'Tropical white sand beach in Okinawa, Japan, with crystal clear blue water and sunny sky', type: 'beach', label: 'Pantai Tropis Okinawa, Jepang' },
    { id: 'White rocky beach with crystal clear blue water', type: 'beach', label: 'Pantai Berbatu Putih & Air Biru Jernih' },
    { id: 'Rocky coastline with dramatic sea stacks rising from the blue ocean', type: 'nature', label: 'Tebing Laut & Kapal (Rocky Coastline)' },
    { id: 'Country road beside a field of bright orange flowers during golden hour', type: 'nature', label: 'Jalan Pedesaan & Ladang Bunga Oranye (Golden Hour)' },
    { id: 'Lush pine forest tourist area with distant mountains', type: 'nature', label: 'Hutan Pinus Wisata (Pegunungan Jauh)' },
    { id: 'Clear bright blue sky, vast open backdrop', type: 'nature', label: 'Langit Biru Cerah (Clear Blue Sky)' },
    { id: 'A field of tall golden grass at sunset', type: 'nature', label: 'Ladang Rumput Ilalang (Sunset)' },
    { id: 'Lush city park pathway with shady green trees during daytime', type: 'nature', label: 'Jalan Setapak Taman Kota yang Asri' },
    { id: 'Foggy green grassy hillside with towering mountain cliffs in the background', type: 'nature', label: 'Lereng Bukit Hijau Berkabut & Tebing Pegunungan' },
    { id: 'Sunny outdoor balcony terrace with wooden chairs and glass railings, overlooking a vast blue ocean and distant coastal hills', type: 'nature', label: 'Teras Balkon Outdoor (Pemandangan Laut & Bukit)' },
    { id: 'Outside a cozy wooden cabin by the shores of Loch Ness, misty and atmospheric landscape', type: 'nature', label: 'Kabin Tepi Danau (Loch Ness / Berkabut)' },
    { id: 'Cobblestone street with colorful stacked houses on a coastal cliff, Cinque Terre Italy style', type: 'urban', label: 'Jalanan Berbatu Pesisir (Cinque Terre / Rumah Warna-warni)' },
  ]},
  { group: '🤿 Bawah Air (Underwater)', items: [
    { id: 'Underwater looking at a vibrant coral reef with swimming fish', type: 'underwater', label: 'Bawah Air (Terumbu Karang & Ikan)' },
    { id: 'Underwater in the middle of the deep blue ocean, vast and empty', type: 'underwater', label: 'Bawah Air (Lautan Biru Dalam / Deep Ocean)' },
    { id: 'Underwater inside a clear blue tiled swimming pool', type: 'underwater', label: 'Bawah Air (Kolam Renang Jernih)' },
    { id: 'Underwater in a mystical cenote with light beams hitting the bottom', type: 'underwater', label: 'Bawah Air (Gua Cenote / Sinar Masuk)' },
  ]},
  { group: '🎉 Tema Hari Raya & Perayaan', items: [
    { id: 'Cozy living room elegantly decorated for Eid al-Fitr (Lebaran) with warm lighting, subtle ketupat ornaments, and beautiful Islamic geometric patterns', type: 'festive', label: 'Lebaran / Idul Fitri (Ruang Tamu Hangat)' },
    { id: 'Warm living room with a glowing beautifully decorated Christmas tree, wrapped presents, and a cozy fireplace', type: 'festive', label: 'Natal / Christmas (Pohon Natal & Perapian)' },
    { id: 'Traditional Chinese interior elegantly decorated for Lunar New Year with glowing red lanterns and gold accents', type: 'festive', label: 'Imlek / Lunar New Year (Lampion Merah)' },
    { id: 'Balinese traditional pavilion (Bale) beautifully decorated for Galungan with woven palm leaves and majestic Penjor', type: 'festive', label: 'Galungan / Kuningan (Bale Bali & Penjor)' },
    { id: 'Festive room setup with party decorations, subtle confetti, and sparkling New Year lights', type: 'festive', label: 'Tahun Baru / New Year Eve (Dekorasi Pesta)' },
  ]},
];

// ─── CLOTHING MATERIALS ──────────────────────────────────────────────────────

export const CLOTHING_MATERIALS = [
  { id: 'Original material', label: 'Bawaan Asli (Original)' },
  { id: 'Silk fabric', label: 'Sutra (Silk)' },
  { id: 'Glossy Satin fabric', label: 'Satin (Glossy)' },
  { id: 'Lace / Brocade fabric', label: 'Brokat / Renda (Lace)' },
  { id: 'Knitted fabric', label: 'Rajut (Knit)' },
  { id: 'Leather material', label: 'Kulit (Leather)' },
  { id: 'Velvet fabric', label: 'Beludru (Velvet)' },
  { id: 'Cotton fabric', label: 'Katun (Cotton)' },
  { id: 'Linen fabric', label: 'Linen (Linen)' },
  { id: 'Tweed fabric', label: 'Tweed (Tweed)' },
  { id: 'Denim fabric', label: 'Denim (Jeans)' },
  { id: 'Chiffon fabric', label: 'Sifon (Chiffon)' },
];

export const COLOR_THEMES = [
  { id: 'Original colors', label: 'Sesuai Asli / Bebas', colors: null },
  { id: 'Manual', label: 'Pilih Manual (Maks 3 Warna)', colors: ['#8b5cf6', '#ec4899', '#10b981'] },
  { id: 'Monochrome color scheme', label: 'Monochrome (Satu Warna Gradasi)', colors: ['#1e3a8a', '#3b82f6', '#bfdbfe'] },
  { id: 'Complementary color scheme', label: 'Complementary (Warna Kontras)', colors: ['#ea580c', '#0284c7', '#f8fafc'] },
  { id: 'Analogous color scheme', label: 'Analogous (Warna Senada)', colors: ['#e11d48', '#f59e0b', '#fbbf24'] },
  { id: 'Pastel color palette', label: 'Pastel (Warna Lembut)', colors: ['#fbcfe8', '#bbf7d0', '#bfdbfe'] },
  { id: 'Vibrant Neon color palette', label: 'Neon (Terang & Mencolok)', colors: ['#ff00ff', '#00ffff', '#8a2be2'] },
  { id: 'Earth tones color palette', label: 'Earth Tones (Warna Alam)', colors: ['#5d4037', '#92400e', '#d4d4d8'] },
  { id: 'Jewel tones color palette', label: 'Jewel Tones (Warna Permata)', colors: ['#4c1d95', '#065f46', '#9f1239'] },
];

// ─── CLOTHING DATABASE ────────────────────────────────────────────────────────
// Tags:
//   male / female / unisex   → gender compatibility
//   hijab_approved            → modest/hijab-friendly
//   scenes: ['cafe','indoor','urban',...] → mana saja outfit ini cocok
//   Jika scenes kosong / tidak ada → cocok di semua scene (all)

export const CLOTHING_DATABASE = [
  { group: 'Bawaan Asli (Original)', items: [
    { id: 'Original clothing from reference', label: 'Pakaian Sesuai Referensi Asli', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['all'] },
  ]},
  { group: '☕ Kafe, Barista & Kuliner', items: [
    { id: 'Plain white t-shirt layered under a brown barista apron, paired with dark trousers or jeans', label: 'Kaos Putih + Celemek (Apron) Barista Cokelat', tags: ['male', 'female', 'unisex'], scenes: ['cafe', 'indoor', 'urban'] },
    { id: 'Black barista apron over a light-colored long-sleeve shirt, paired with dark chino trousers', label: 'Celemek Barista Hitam + Kemeja Lengan Panjang (Professional)', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['cafe', 'indoor'] },
    { id: 'Loose long-sleeve linen shirt in earthy tones, paired with relaxed light trousers and leather sandals, aesthetic cafe vibe', label: 'Kemeja Linen Longgar + Celana Santai (Aesthetic Cafe Vibe)', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['cafe', 'urban', 'indoor', 'nature'] },
    { id: 'Korean minimalist cafe outfit: beige oversized knit top, high-waisted wide-leg trousers, and slip-on shoes', label: 'Korean Minimalist Cafe Outfit (Beige Knit + Wide-leg Trousers)', tags: ['female', 'unisex'], scenes: ['cafe', 'indoor', 'urban'] },
    { id: 'Cute light blue denim overalls over a plain white fitted t-shirt, paired with white sneakers — cozy cafe look', label: 'Denim Overalls Biru Muda + Kaos Putih (Cozy Cafe Look)', tags: ['female', 'unisex'], scenes: ['cafe', 'indoor', 'urban'] },
    { id: 'Casual plaid flannel shirt over a white t-shirt paired with slim dark jeans and white sneakers, weekend cafe look', label: 'Flannel Plaid + Kaos Putih + Jeans Gelap (Weekend Cafe Look)', tags: ['male', 'unisex'], scenes: ['cafe', 'urban', 'indoor'] },
    { id: 'Feminine flowy midi skirt in cream with a tucked-in pastel blouse, elegant casual for a brunch date', label: 'Rok Midi Krem + Blus Pastel (Elegant Brunch Look)', tags: ['female'], scenes: ['cafe', 'restaurant', 'indoor', 'urban'] },
    { id: 'Stylish chef uniform: classic double-breasted white chef coat with black-and-white checkered trousers', label: 'Seragam Chef (Jas Masak Putih + Celana Kotak-kotak)', tags: ['male', 'female', 'unisex'], scenes: ['cafe', 'indoor', 'restaurant'] },
    { id: 'Trendy monochromatic all-brown outfit: turtle neck top, long flowing skirt, and loafer shoes — aesthetic cafe', label: 'Monochromatic All-Brown Outfit (Turtleneck + Rok Panjang)', tags: ['female', 'hijab_approved'], scenes: ['cafe', 'indoor', 'restaurant', 'urban'] },
  ]},
  { group: '🌊 Resort & Beach Bohemian', items: [
    { id: 'Loose long-sleeve linen shirt with the sleeves rolled up and partially unbuttoned', label: 'Kemeja Linen Lengan Digulung (Longgar)', tags: ['male', 'female', 'unisex'], scenes: ['beach', 'nature', 'yacht', 'urban', 'cafe'] },
    { id: 'Floral two-piece outfit featuring a crop top and a matching short skirt', label: 'Setelan Floral Two-Piece (Crop Top & Rok Mini)', tags: ['female'], scenes: ['beach', 'nature', 'cafe', 'urban'] },
    { id: 'Floral sundress with a beautiful sweetheart neckline', label: 'Gaun Terusan Motif Bunga (Floral Sundress)', tags: ['female'], scenes: ['beach', 'nature', 'cafe', 'urban', 'resort'] },
    { id: 'Flowy modest long-sleeve linen maxi dress', label: 'Maxi Dress Linen Panjang (Modest)', tags: ['female', 'hijab_approved'], scenes: ['beach', 'nature', 'cafe', 'urban', 'resort'] },
    { id: 'Blue long-sleeve off-shoulder Sabrina top paired with a white tiered maxi skirt and woven straw slip-on shoes', label: 'Atasan Off-Shoulder Sabrina Biru + Rok Maxi Putih', tags: ['female'], scenes: ['beach', 'nature', 'urban', 'cafe'] },
    { id: 'White cotton linen trousers paired with a relaxed button-up shirt and brown leather slide sandals', label: 'Celana Linen Putih & Kemeja Santai + Sandal Kulit', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['beach', 'nature', 'cafe', 'urban', 'yacht'] },
    { id: 'Tailored short pants paired with a breezy summer shirt', label: 'Celana Pendek Tailored & Kemeja Santai', tags: ['male', 'female', 'unisex'], scenes: ['beach', 'nature', 'cafe', 'urban', 'yacht'] },
    { id: 'Flowy silk kaftan dress with a vibrant geometric bohemian print and deep V-neck, cinched at the waist with a tasseled rope belt', label: 'Gaun Kaftan Sutra Motif Geometris Boho + Sabuk Tali Rumbai', tags: ['female'], scenes: ['beach', 'nature', 'cafe', 'yacht'] },
    { id: 'Loose embroidered bohemian tunic in terracotta worn over wide-leg linen palazzo pants, paired with flat sandals', label: 'Tunik Boho Bordir Terakota + Celana Palazzo Linen + Sandal', tags: ['female', 'hijab_approved'], scenes: ['beach', 'nature', 'cafe', 'urban'] },
    { id: 'Long fringed sheer floral kimono worn over a simple camisole and distressed denim cut-off shorts', label: 'Kimono Transparan Rumbai Motif Bunga + Kamisol + Celana Denim Pendek', tags: ['female'], scenes: ['beach', 'nature', 'cafe', 'urban'] },
    { id: 'Unbuttoned short-sleeve viscose shirt with a tropical leaf print over a plain white tank top, paired with beige linen shorts', label: 'Kemeja Tropis Terbuka + Tank Top Putih + Celana Pendek Linen', tags: ['male'], scenes: ['beach', 'nature', 'cafe', 'urban', 'yacht'] },
    { id: 'Relaxed fit cream seersucker shirt with short sleeves, paired with olive green drawstring shorts and brown leather boat shoes', label: 'Kemeja Seersucker Krem + Celana Pendek Tali Serut Olive', tags: ['male', 'unisex'], scenes: ['beach', 'nature', 'cafe', 'urban', 'yacht'] },
  ]},
  { group: '👔 Smart-Casual & Preppy', items: [
    { id: 'Polo shirt paired with tailored cream trousers and a knit sweater draped elegantly over the shoulders', label: 'Polo Shirt + Celana Krem + Sweater Disampirkan (Preppy)', tags: ['male', 'female', 'unisex'], scenes: ['urban', 'cafe', 'indoor', 'restaurant', 'sports'] },
    { id: 'Classic blue denim jacket layered over a striped shirt and a dark knit tie, paired with dark tailored trousers', label: 'Jaket Denim + Kemeja & Dasi Rajut + Celana Bahan', tags: ['male', 'unisex'], scenes: ['urban', 'cafe', 'indoor'] },
    { id: 'Navy blue short-sleeve polo shirt tucked into a grey pleated mini skirt, paired with black leather loafers and white knee-high socks', label: 'Polo Shirt Navy + Rok Lipit Abu + Kaos Kaki Selutut', tags: ['female'], scenes: ['urban', 'cafe', 'indoor', 'sports'] },
    { id: 'Classic school uniform style featuring a white shirt, black pleated skirt, and a red necktie, worn with loafers', label: 'Seragam Sekolah (Kemeja Putih, Dasi Merah, Rok Hitam)', tags: ['female'], scenes: ['urban', 'indoor', 'cafe'] },
    { id: 'Cable-knit crewneck sweater layered over a light blue collared shirt', label: 'Sweater Rajut Cable-Knit di Atas Kemeja (Layering)', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['urban', 'cafe', 'indoor', 'nature'] },
    { id: 'Olive green corduroy suit paired with a black turtleneck', label: 'Setelan Jas Corduroy Hijau Olive + Turtleneck', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['urban', 'cafe', 'indoor', 'restaurant'] },
    { id: 'Sleeveless silk blouse paired with a dark pleated midi skirt', label: 'Blus Sutra Tanpa Lengan + Rok Plisket', tags: ['female'], scenes: ['urban', 'cafe', 'indoor', 'restaurant'] },
    { id: 'Navy tailored blazer over a crisp white button-up shirt and a red tartan pleated mini skirt, paired with black oxford shoes', label: 'Blazer Navy + Kemeja Putih + Rok Tartan Merah + Sepatu Oxford', tags: ['female'], scenes: ['urban', 'indoor', 'cafe', 'restaurant'] },
    { id: 'Light blue oxford button-down shirt with rolled-up sleeves, neatly tucked into beige chino pants, paired with brown suede loafers', label: 'Kemeja Oxford Biru Muda + Celana Chino Beige + Loafers Suede', tags: ['male', 'unisex'], scenes: ['urban', 'cafe', 'indoor', 'restaurant'] },
    { id: 'Houndstooth knit vest layered over a white long-sleeve balloon-sleeve blouse, paired with wide-leg beige trousers', label: 'Rompi Rajut Houndstooth + Blus Lengan Balon + Celana Lebar', tags: ['female', 'hijab_approved'], scenes: ['urban', 'cafe', 'indoor'] },
    { id: 'Classic beige double-breasted trench coat worn open over a black turtleneck midi dress, paired with pointed-toe ankle boots', label: 'Trench Coat Beige + Gaun Midi Turtleneck + Sepatu Boots', tags: ['female', 'hijab_approved'], scenes: ['urban', 'cafe', 'indoor', 'restaurant'] },
    { id: 'Dark grey pinafore dress layered over a white short-sleeve blouse with a Peter Pan collar, paired with Mary Jane shoes', label: 'Pinafore Dress Abu + Blus Kerah Peter Pan + Sepatu Mary Jane', tags: ['female'], scenes: ['urban', 'cafe', 'indoor'] },
  ]},
  { group: '🧶 Cozy & Knitwear Casual', items: [
    { id: 'Fuzzy knit cardigan over a plain tank top, paired with loose light blue baggy jeans', label: 'Kardigan Rajut Berbulu + Tank Top + Baggy Jeans', tags: ['female', 'unisex', 'hijab_approved'], scenes: ['cafe', 'indoor', 'urban'] },
    { id: 'Grey and black horizontal striped long-sleeve t-shirt, paired with dark flowy casual trousers', label: 'Kaos Lengan Panjang Garis Horizontal + Celana Kain Jatuh', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['cafe', 'indoor', 'urban'] },
    { id: 'Relaxed long-sleeve shirt in light yellow crinkle material, paired with dark loose pants', label: 'Kemeja Santai Lengan Panjang Crinkle + Celana Longgar', tags: ['female', 'unisex', 'hijab_approved'], scenes: ['cafe', 'indoor', 'urban', 'nature'] },
    { id: 'Light grey hoodie worn under a black denim vest, paired with loose jeans', label: 'Hoodie Abu-abu Muda + Rompi Denim Hitam', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['cafe', 'indoor', 'urban'] },
    { id: 'Thick oversized cream sweater paired with loose comfortable trousers', label: 'Sweater Rajut Oversized Krem + Celana Nyaman', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['cafe', 'indoor', 'urban', 'nature'] },
    { id: 'Chunky knit strawberry-patterned cardigan over a simple white midi dress, paired with Mary Jane shoes and frilly socks', label: 'Kardigan Rajut Stroberi + Gaun Midi Putih + Sepatu Mary Jane', tags: ['female'], scenes: ['cafe', 'indoor', 'urban'] },
  ]},
  { group: '🎀 Playful & Cute Casual', items: [
    { id: 'Light yellow oversized t-shirt with cute pastel graphics, paired with black sweatshorts and slip-on white shoes with black polka dots', label: 'Kaos Oversize Kuning (Grafis Lucu) + Celana Pendek + Slip-on Polkadot', tags: ['female', 'unisex'], scenes: ['cafe', 'indoor', 'urban'] },
    { id: 'White Y2K style baby tee with brown trims and graphics, paired with a pleated mini skirt and chunky white sneakers with mid-calf socks', label: 'Y2K Baby Tee Putih + Rok Lipit Mini + Sepatu Chunky', tags: ['female'], scenes: ['cafe', 'indoor', 'urban'] },
    { id: 'Pastel pink corduroy overalls worn over a white long-sleeve striped shirt, paired with white canvas sneakers', label: 'Celana Kodok Pink Pastel Korduroi + Kaos Garis Lengan Panjang', tags: ['female', 'hijab_approved'], scenes: ['cafe', 'indoor', 'urban'] },
    { id: 'Oversized mint green hoodie with a cartoon bear graphic, paired with loose light blue denim shorts and chunky colorful sneakers', label: 'Hoodie Oversize Mint (Grafis Beruang) + Celana Pendek Denim', tags: ['male', 'unisex'], scenes: ['cafe', 'indoor', 'urban'] },
    { id: 'Color-blocked windbreaker jacket in pastel pink, yellow, and blue, paired with light wash baggy jeans and retro sneakers', label: 'Jaket Windbreaker Blok Warna Pastel + Celana Jeans Baggy', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['cafe', 'indoor', 'urban', 'nature'] },
    { id: 'Short-sleeve button-up shirt with a playful doodle pattern, worn open over a plain white tee, paired with mustard yellow shorts', label: 'Kemeja Lengan Pendek Motif Doodle Terbuka + Celana Pendek Mustard', tags: ['male'], scenes: ['cafe', 'indoor', 'urban', 'beach', 'nature'] },
    { id: 'Floral print sleeveless playsuit with a tie-front detail, paired with strappy sandals and a woven crossbody bag', label: 'Playsuit Motif Bunga (Tanpa Lengan) + Sandal Tali + Tas Selempang Anyam', tags: ['female'], scenes: ['cafe', 'urban', 'beach', 'nature', 'yacht'] },
  ]},
  { group: '🏙️ Urban Casual & Workwear', items: [
    { id: 'Classic plain white t-shirt with straight-leg jeans and white canvas sneakers', label: 'Kaos Polos Klasik + Celana Jeans Lurus', tags: ['male', 'female', 'unisex'], scenes: ['urban', 'cafe', 'indoor', 'nature'] },
    { id: 'Thick olive green chore jacket/overshirt left open over a plain t-shirt, paired with jeans', label: 'Chore Jacket Terbuka + Kaos Polos + Jeans', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['urban', 'cafe', 'indoor', 'nature'] },
    { id: 'Long dark trench coat/overcoat worn over a plain black t-shirt', label: 'Trench Coat Panjang + Kaos Hitam', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['urban', 'indoor', 'restaurant'] },
    { id: 'Retro bottle green camp collar short-sleeve shirt paired with straight cream trousers', label: 'Kemeja Lengan Pendek Kerah Camp Retro + Celana Krem', tags: ['male', 'unisex'], scenes: ['urban', 'cafe', 'indoor', 'beach', 'nature'] },
    { id: 'Oversized t-shirt with a pink shirt tied around the waist or arm (festival style)', label: 'Kaos Oversize + Kemeja Pink Diikat (Gaya Festival)', tags: ['female', 'unisex'], scenes: ['urban', 'cafe', 'nature'] },
    { id: 'Casual dress', label: 'Gaun Kasual', tags: ['female'], scenes: ['cafe', 'urban', 'indoor', 'nature'] },
    { id: 'Heavyweight black hoodie layered under a tan utility vest with multiple pockets, paired with dark green cargo pants and chunky black combat boots', label: 'Hoodie Hitam + Rompi Utilitas (Banyak Saku) + Celana Cargo Hijau', tags: ['male', 'unisex', 'hijab_approved'], scenes: ['urban', 'nature'] },
    { id: 'Sage green oversized nylon bomber jacket over a black turtleneck, paired with baggy faded black jeans and retro running sneakers', label: 'Jaket Bomber Oversize Hijau Sage + Turtleneck Hitam + Jeans Baggy', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['urban', 'cafe', 'indoor'] },
    { id: 'Classic blue denim dungarees worn over a fitted long-sleeve striped mock neck shirt, paired with sturdy brown leather work boots', label: 'Celana Kodok Denim (Dungarees) + Kaos Lengan Panjang Garis', tags: ['female', 'hijab_approved'], scenes: ['urban', 'cafe', 'indoor', 'nature'] },
    { id: 'Thick red and black plaid flannel shirt worn open over a graphic vintage tee, paired with distressed slim-fit black jeans and skate shoes', label: 'Kemeja Flannel Kotak-kotak Tebal Terbuka + Kaos Vintage + Jeans Hitam Sobek', tags: ['male', 'unisex'], scenes: ['urban', 'indoor', 'cafe'] },
    { id: 'Ribbed knit bodycon midi dress in charcoal grey, layered under an oversized faded black denim jacket, paired with chunky white sneakers', label: 'Gaun Midi Rajut Ketat Abu Tua + Jaket Denim Hitam Oversize', tags: ['female'], scenes: ['urban', 'cafe', 'indoor'] },
  ]},
  { group: '👔 Business Casual & Formal', items: [
    { id: 'Sleek dark tailored suit with a matching tie and a vest (three-piece suit)', label: 'Setelan Jas Tiga Potong (Jas, Rompi, Dasi)', tags: ['male'], scenes: ['office', 'restaurant', 'indoor', 'urban'] },
    { id: 'Navy blue tailored blazer jacket over a crisp white dress shirt', label: 'Blazer Jas Navy + Kemeja Putih Rapi', tags: ['male', 'female', 'hijab_approved'], scenes: ['office', 'restaurant', 'indoor', 'urban', 'cafe'] },
    { id: 'Formal button-up shirt (No Tie)', label: 'Kemeja Formal (Tanpa Dasi)', tags: ['male', 'female', 'hijab_approved'], scenes: ['office', 'indoor', 'urban', 'cafe'] },
    { id: 'Sleek all-black tailored suit with a fitted black turtleneck underneath', label: 'All-Black Sleek: Jas Hitam + Turtleneck Hitam', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['office', 'restaurant', 'indoor', 'urban'] },
    { id: 'Light blue striped dress shirt with a navy striped necktie, khaki chinos, and carrying a navy blazer in hand', label: 'Kemeja Garis + Dasi + Chino + Jas di Tangan', tags: ['male', 'unisex'], scenes: ['office', 'indoor', 'urban', 'restaurant'] },
    { id: 'Sleek all-black pantsuit with a fine-knit fitted turtleneck', label: 'All-Black Pantsuit + Turtleneck Halus', tags: ['female', 'hijab_approved'], scenes: ['office', 'restaurant', 'indoor', 'urban'] },
    { id: 'Dress shirt with a suit vest (waistcoat) and a tie', label: 'Kemeja + Rompi Jas (Vest) + Dasi', tags: ['male'], scenes: ['office', 'indoor', 'restaurant'] },
    { id: 'Turtleneck sweater worn under a tailored blazer jacket', label: 'Turtleneck + Blazer', tags: ['male', 'female', 'hijab_approved'], scenes: ['office', 'indoor', 'urban', 'cafe', 'restaurant'] },
    { id: 'Elegant blouse', label: 'Kemeja Blus Elegan', tags: ['female'], scenes: ['office', 'cafe', 'indoor', 'restaurant'] },
    { id: 'Elegant evening gown', label: 'Gaun Malam Elegance', tags: ['female'], scenes: ['restaurant', 'indoor', 'vehicle'] },
    { id: 'Modest elegant long evening gown, fully covered with long sleeves', label: 'Gaun Malam Tertutup (Modest)', tags: ['female', 'hijab_approved'], scenes: ['restaurant', 'indoor', 'vehicle'] },
    { id: 'Elegant modest style with a long trench coat', label: 'Trench Coat Panjang (Gaya Elegan)', tags: ['female', 'hijab_approved'], scenes: ['urban', 'indoor', 'restaurant'] },
    { id: 'Intricately beaded formal black jacket', label: 'Jaket Formal Manik-manik Hitam', tags: ['male', 'unisex'], scenes: ['restaurant', 'indoor', 'vehicle'] },
  ]},
  { group: '🎤 Streetwear & 90s', items: [
    { id: 'Oversized Varsity jacket layered over a polo shirt, paired with black jeans and a baseball cap', label: 'Jaket Varsity Oversized + Polo + Jeans + Topi', tags: ['male', 'unisex', 'hijab_approved'], scenes: ['urban', 'indoor', 'cafe'] },
    { id: 'Oversized Varsity jacket worn over a crop top with biker shorts', label: 'Jaket Varsity + Crop Top + Biker Shorts', tags: ['female'], scenes: ['urban', 'indoor', 'cafe'] },
    { id: 'Brown plaid flannel shirt acting as an outer layer over a black hoodie, paired with black joggers', label: 'Kemeja Flanel di luar Hoodie + Jogger (Layering)', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['urban', 'indoor', 'cafe'] },
    { id: 'Retro green and yellow track jacket paired with baggy denim jeans', label: 'Jaket Track Retro + Celana Jeans Baggy', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['urban', 'indoor', 'cafe'] },
    { id: 'Black sweatshirt paired with casual shorts and bright yellow sneakers', label: 'Sweatshirt Hitam + Celana Pendek + Sepatu Kuning', tags: ['male', 'unisex'], scenes: ['urban', 'indoor', 'cafe'] },
    { id: 'White ribbed singlet tank top (wife beater)', label: 'Kaos Singlet Putih (Rapper Style)', tags: ['male', 'unisex'], scenes: ['urban', 'indoor', 'beach'] },
    { id: 'Oversized baggy hip-hop t-shirt', label: 'Kaos Oversize (Rapper Style)', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['urban', 'indoor', 'cafe'] },
    { id: 'Oversized American football jersey', label: 'Jersey American Football', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['urban', 'indoor', 'sports'] },
  ]},
  { group: '🏃 Olahraga, Gym & Renang', items: [
    { id: 'Shirtless, bare-chested, revealing well-defined torso muscles and abs', label: 'Topless / Tanpa Baju (Mengekspos Otot)', tags: ['male'], scenes: ['beach', 'sports', 'underwater', 'nature', 'studio'] },
    { id: 'Tight athletic compression tank top emphasizing the physique', label: 'Tank Top Ketat (Compression / Muscle Shirt)', tags: ['male', 'unisex'], scenes: ['sports', 'indoor', 'studio'] },
    { id: 'Sports bra and athletic compression leggings', label: 'Sports Bra & Legging Olahraga', tags: ['female'], scenes: ['sports', 'indoor', 'studio'] },
    { id: 'Athletic sports t-shirt and running shorts', label: 'Setelan Lari (Kaos Olahraga & Celana Pendek)', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['sports', 'indoor', 'urban', 'nature'] },
    { id: 'One-piece swimsuit', label: 'Baju Renang One-Piece', tags: ['female'], scenes: ['beach', 'underwater', 'sports'] },
    { id: 'Tankini set', label: 'Set Tankini', tags: ['female'], scenes: ['beach', 'underwater', 'sports'] },
    { id: 'Bikini swimsuit', label: 'Baju Renang Bikini', tags: ['female'], scenes: ['beach', 'underwater', 'sports'] },
    { id: 'Swimming trunks / board shorts', label: 'Celana Renang (Board Shorts)', tags: ['male'], scenes: ['beach', 'underwater', 'sports', 'nature', 'yacht'] },
    { id: 'Cabana set', label: 'Setelan Cabana Pria', tags: ['male'], scenes: ['beach', 'yacht', 'nature'] },
    { id: 'Rash guard set', label: 'Set Baju & Celana Selancar', tags: ['male'], scenes: ['beach', 'underwater', 'sports', 'yacht'] },
    { id: 'Full body black neoprene wetsuit', label: 'Wetsuit Penyelam (Scuba Penuh)', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['underwater', 'beach', 'sports'] },
    { id: 'Modest swimwear / burkini', label: 'Baju Renang Muslimah (Burkini)', tags: ['female', 'hijab_approved'], scenes: ['beach', 'underwater', 'sports'] },
  ]},
  { group: '⛰️ Gorpcore & Outdoor / Hiking', items: [
    { id: 'Dark grey and olive green fleece polar jacket layered over a t-shirt, paired with olive green sweatshorts and brown hiking boots with cream socks', label: 'Jaket Fleece/Polar Hijau Abu + Celana Pendek + Sepatu Gunung', tags: ['male', 'female', 'unisex'], scenes: ['nature', 'urban', 'sports'] },
    { id: 'Blue-green plaid flannel overshirt left open over a t-shirt, paired with cargo pants and a bucket hat', label: 'Kemeja Flanel Biru-Hijau Terbuka + Celana Kargo + Bucket Hat', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['nature', 'urban', 'sports'] },
    { id: 'Technical navy blue windbreaker raincoat paired with camouflage cargo pants and black hiking boots', label: 'Jaket Windbreaker Navy + Celana Kargo Loreng + Sepatu Hiking', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['nature', 'urban', 'sports'] },
    { id: 'Cropped technical windbreaker paired with olive green cargo pants and modern trail running shoes', label: 'Cropped Windbreaker + Celana Kargo Olive + Sepatu Trail', tags: ['female'], scenes: ['nature', 'urban', 'sports'] },
    { id: 'Green zip-up outdoor hiking jacket paired with comfortable outdoor trousers', label: 'Jaket Zip-Up Hiking Hijau + Celana Outdoor', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['nature', 'urban', 'sports'] },
  ]},
  { group: '❄️ Winter & Cold Weather', items: [
    { id: 'Long camel overcoat paired with dark trousers, a cream shirt, and a patterned silk ascot at the neck', label: 'Mantel Overcoat Panjang + Celana Bahan + Syal Sutra Ascot', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['urban', 'indoor', 'restaurant', 'cafe'] },
    { id: 'Long black wrap overcoat with a tied belt, paired with a dark turtleneck', label: 'Mantel Wrap Hitam Panjang + Turtleneck Gelap', tags: ['female', 'unisex', 'hijab_approved'], scenes: ['urban', 'indoor', 'cafe', 'restaurant'] },
    { id: 'Dark grey wind-resistant trench coat paired with a black top and a thick striped wool scarf', label: 'Trench Coat Tahan Angin + Baju Hitam + Syal Wol Tebal', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['urban', 'indoor', 'cafe'] },
    { id: 'Thick knit turtleneck sweater featuring a geometric argyle pattern', label: 'Sweater Rajut Tebal Kerah Turtleneck (Motif Wajik Geometris)', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['urban', 'indoor', 'cafe', 'nature'] },
    { id: 'Heavy duty Arctic expedition parka with a thick faux fur lined hood and thermal layers', label: 'Jaket Parka Ekspedisi Kutub (Bulu Tebal)', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['nature', 'urban'] },
  ]},
  { group: '🔥 Edgy & Modern Minimalist', items: [
    { id: 'Grey half-zip mock neck knit top, fitted black trousers with a subtle flare, and black leather gloves', label: 'Atasan Mock Neck Half-Zip + Celana Flare Hitam + Sarung Tangan Kulit', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['urban', 'indoor', 'studio', 'restaurant'] },
    { id: 'Edgy school uniform style layered under a black leather jacket with fishnet tights and high white socks', label: 'Seragam Edgy + Jaket Kulit + Fishnet + Kaos Kaki Tinggi', tags: ['female'], scenes: ['urban', 'indoor', 'studio'] },
    { id: 'Punk rock outfit with studded leather jacket', label: 'Punk Rock Leather Jacket', tags: ['male', 'female', 'unisex'], scenes: ['urban', 'indoor', 'studio'] },
    { id: 'Emo style outfit with band tee and arm warmers', label: 'Emo Band Tee', tags: ['male', 'female', 'unisex'], scenes: ['urban', 'indoor', 'studio'] },
    { id: 'Heavy metal attire with denim battle vest', label: 'Metalhead Battle Vest', tags: ['male', 'female', 'unisex'], scenes: ['urban', 'indoor', 'studio'] },
  ]},
  { group: '✈️ Gaya Destinasi & Travel', items: [
    { id: 'Parisian chic style with a classic boatneck striped shirt, tailored trousers, and a stylish beret', label: 'Gaya Parisian Chic (Baju Garis & Beret)', tags: ['female', 'unisex'], scenes: ['urban', 'cafe', 'indoor', 'restaurant'] },
    { id: 'Classic Scottish tartan plaid blazer layered over a fine knit turtleneck', label: 'Blazer Tartan Skotlandia + Turtleneck', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['urban', 'indoor', 'cafe', 'nature'] },
    { id: 'Vibrant tropical floral print shirt left unbuttoned over a white t-shirt, relaxed fit', label: 'Kemeja Motif Floral Tropis (Bali Vibe)', tags: ['male', 'unisex'], scenes: ['beach', 'nature', 'cafe', 'urban', 'yacht'] },
    { id: 'Haute couture avant-garde asymmetrical dress with bold structural elements', label: 'Gaun Haute Couture Milan (Avant-Garde)', tags: ['female'], scenes: ['indoor', 'restaurant', 'studio', 'urban'] },
    { id: 'Flashy sequined evening party outfit, glamorous and bold', label: 'Baju Pesta Payet Glamor (Vegas Vibe)', tags: ['female'], scenes: ['restaurant', 'indoor', 'vehicle', 'festive'] },
    { id: 'Japanese minimalist streetwear with an oversized drop-shoulder shirt and wide-leg cropped pants', label: 'Streetwear Minimalis Jepang (Oversized)', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['urban', 'cafe', 'indoor'] },
    { id: 'Thick rustic fair isle sweater paired with durable corduroy pants', label: 'Sweater Rustic Fair Isle (Gaya Kabin)', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['nature', 'indoor', 'cafe', 'urban'] },
    { id: 'Nautical style navy blue blazer with gold buttons over a crisp white shirt', label: 'Blazer Nautical Navy (Gaya Pelaut/Yacht)', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['yacht', 'urban', 'restaurant', 'indoor'] },
    { id: 'Bohemian patterned woven poncho layered over casual outdoor wear', label: 'Ponco Tenun Bohemian (Gaya Bromo/Gurun)', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['nature', 'urban', 'beach'] },
  ]},
  { group: '🎉 Hari Raya & Perayaan (Festive)', items: [
    { id: 'Elegant modest Muslim attire for Eid al-Fitr, beautiful Kaftan for women and stylish Baju Koko for men, pastel and earthy colors', label: 'Lebaran (Kaftan, Gamis, & Koko Elegan)', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['festive', 'indoor', 'all'] },
    { id: 'Cozy matching Christmas sweaters (Festive Sweaters) in red and green hues', label: 'Natal Kasual (Matching Christmas Sweater)', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['festive', 'indoor', 'all'] },
    { id: 'Elegant Christmas evening wear, dark red dresses and sharp tailored suits', label: 'Natal Formal (Gaun Merah & Jas Rapi)', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['festive', 'restaurant', 'indoor'] },
    { id: 'Traditional Chinese New Year attire, elegant red and gold Cheongsam and Tangzhuang jackets', label: 'Imlek (Cheongsam & Jas Tangzhuang)', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['festive', 'indoor', 'all'] },
    { id: 'Traditional Balinese ceremonial attire for Galungan, beautiful Kebaya Bali with sash and Kamen', label: 'Galungan (Pakaian Adat Bali Lengkap)', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['festive', 'indoor', 'nature', 'all'] },
  ]},
  { group: '🧣 Tradisional & Kultural', items: [
    { id: 'Indonesian Batik shirt', label: 'Kemeja Batik (Indonesia)', tags: ['male', 'female', 'unisex'], scenes: ['office', 'indoor', 'urban', 'festive'] },
    { id: 'Long-sleeve Indonesian Batik shirt', label: 'Batik Lengan Panjang', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['office', 'indoor', 'urban', 'festive'] },
    { id: 'Indonesian Baju Koko (Muslim men shirt)', label: 'Baju Koko', tags: ['male'], scenes: ['festive', 'indoor', 'office', 'all'] },
    { id: 'Javanese Beskap traditional suit', label: 'Beskap Jawa', tags: ['male'], scenes: ['festive', 'indoor', 'all'] },
    { id: 'Javanese Lurik woven shirt', label: 'Baju Lurik Jawa', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['festive', 'indoor', 'urban', 'all'] },
    { id: 'Indonesian Kebaya traditional blouse', label: 'Kebaya Modern', tags: ['female'], scenes: ['festive', 'indoor', 'all'] },
    { id: 'Modest Indonesian Kebaya with long sleeves and covered chest', label: 'Kebaya Tertutup (Modest)', tags: ['female', 'hijab_approved'], scenes: ['festive', 'indoor', 'all'] },
    { id: 'Balinese Kebaya with a tied sash (selendang)', label: 'Kebaya Bali', tags: ['female'], scenes: ['festive', 'indoor', 'nature', 'all'] },
    { id: 'Modest Baju Kurung', label: 'Baju Kurung (Modest)', tags: ['female', 'hijab_approved'], scenes: ['festive', 'indoor', 'office', 'all'] },
    { id: 'Traditional Indian Saree', label: 'Sari India', tags: ['female', 'hijab_approved'], scenes: ['festive', 'indoor', 'all'] },
    { id: 'Chinese Cheongsam (Qipao) dress', label: 'Cheongsam / Qipao', tags: ['female'], scenes: ['festive', 'indoor', 'restaurant', 'all'] },
    { id: 'Chinese Tangzhuang traditional jacket', label: 'Tangzhuang (Tangzu)', tags: ['male', 'unisex'], scenes: ['festive', 'indoor', 'all'] },
    { id: 'Japanese Kimono', label: 'Kimono', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['festive', 'indoor', 'urban', 'all'] },
    { id: 'Japanese Yukata', label: 'Yukata', tags: ['male', 'female', 'unisex'], scenes: ['festive', 'indoor', 'urban', 'nature'] },
    { id: 'Korean traditional Hanbok', label: 'Hanbok Korea', tags: ['male', 'female', 'hijab_approved'], scenes: ['festive', 'indoor', 'all'] },
    { id: 'Vietnamese Ao Dai dress', label: 'Ao Dai Vietnam', tags: ['female'], scenes: ['festive', 'indoor', 'urban', 'all'] },
    { id: 'Traditional Thai Chut Thai dress', label: 'Chut Thai', tags: ['female'], scenes: ['festive', 'indoor', 'all'] },
  ]},
  { group: '✈️ Seragam Spesifik & Maskapai', items: [
    { id: 'Indonesian TNI military uniform', label: 'Seragam Militer TNI', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['all'] },
    { id: 'Indonesian Polri police uniform', label: 'Seragam Polisi Polri', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['all'] },
    { id: 'Indonesian civil servant (PNS) wearing brown safari uniform', label: 'PNS (Safari Coklat)', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['office', 'indoor', 'all'] },
    { id: 'Indonesian civil servant (PNS) wearing blue Korpri batik uniform', label: 'PNS (Batik Korpri)', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['office', 'indoor', 'all'] },
    { id: 'Doctor wearing a white lab coat with a stethoscope around the neck', label: 'Dokter + Jas Putih & Stetoskop', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['indoor', 'all'] },
    { id: 'Nurse uniform', label: 'Seragam Suster/Perawat', tags: ['female', 'male'], scenes: ['indoor', 'all'] },
    { id: 'Long-sleeve modest nurse uniform', label: 'Seragam Perawat Tertutup', tags: ['female', 'hijab_approved'], scenes: ['indoor', 'all'] },
    { id: 'Commercial airline pilot uniform with epaulettes', label: 'Seragam Pilot', tags: ['male', 'female', 'hijab_approved'], scenes: ['vehicle', 'indoor', 'all'] },
    { id: 'Firefighter uniform with reflective stripes', label: 'Seragam Pemadam Kebakaran', tags: ['male', 'female', 'unisex', 'hijab_approved'], scenes: ['urban', 'all'] },
    { id: 'Garuda Indonesia flight attendant uniform (Tosca green/orange kebaya top and batik skirt)', label: 'Pramugari Garuda Indonesia', tags: ['female'], scenes: ['vehicle', 'indoor', 'all'] },
    { id: 'Garuda Indonesia modest flight attendant uniform with long sleeves (Tosca green kebaya)', label: 'Pramugari Garuda (Modest/Hijab)', tags: ['female', 'hijab_approved'], scenes: ['vehicle', 'indoor', 'all'] },
    { id: 'AirAsia flight attendant uniform (Iconic red tailored blazer and white shirt)', label: 'Pramugari AirAsia (Red Blazer)', tags: ['female'], scenes: ['vehicle', 'indoor', 'all'] },
    { id: 'AirAsia modest flight attendant uniform (Long-sleeve red blazer and trousers)', label: 'Pramugari AirAsia (Modest/Hijab)', tags: ['female', 'hijab_approved'], scenes: ['vehicle', 'indoor', 'all'] },
    { id: 'Super Air Jet flight attendant uniform (Khaki safari style, casual)', label: 'Pramugari Super Air Jet (Khaki)', tags: ['female', 'male', 'unisex'], scenes: ['vehicle', 'indoor', 'all'] },
    { id: 'Super Air Jet modest flight attendant uniform (Long-sleeve khaki safari style)', label: 'Pramugari Super Air Jet (Modest)', tags: ['female', 'hijab_approved'], scenes: ['vehicle', 'indoor', 'all'] },
    { id: 'Batik Air flight attendant uniform (White cheongsam-style top and batik skirt)', label: 'Pramugari Batik Air', tags: ['female'], scenes: ['vehicle', 'indoor', 'all'] },
    { id: 'Batik Air modest flight attendant uniform (Long-sleeve white top and batik skirt)', label: 'Pramugari Batik Air (Modest)', tags: ['female', 'hijab_approved'], scenes: ['vehicle', 'indoor', 'all'] },
  ]},
];

// ─── SMART CLOTHING FILTER ───────────────────────────────────────────────────
// Fungsi untuk mendapatkan skor kompatibilitas pakaian dengan scene tertentu.
// Digunakan untuk mengurutkan / menandai pakaian yang "Cocok" vs "Kurang Cocok".

export const getClothingSceneScore = (clothingItem, sceneType) => {
  if (!sceneType || sceneType === 'all') return 2; // always compatible
  if (!clothingItem.scenes) return 2; // no scene restriction = always ok
  if (clothingItem.scenes.includes('all')) return 2;
  if (clothingItem.scenes.includes(sceneType)) return 2;
  // Check for related/partial match (e.g. 'beach' scene accepts 'nature' clothing)
  const relatedScenes = {
    beach:      ['nature', 'yacht', 'sports', 'urban'],
    nature:     ['beach', 'sports', 'urban'],
    restaurant: ['indoor', 'cafe', 'office'],
    office:     ['indoor', 'restaurant', 'urban'],
    yacht:      ['beach', 'nature', 'urban'],
    festive:    ['indoor', 'all'],
    vehicle:    ['indoor', 'office'],
    escalator:  ['urban', 'indoor'],
    sports:     ['nature', 'beach', 'urban'],
    underwater: ['beach', 'sports'],
    cafe:       ['indoor', 'urban'],
  };
  const related = relatedScenes[sceneType] || [];
  if (clothingItem.scenes.some(s => related.includes(s))) return 1; // partial match
  return 0; // incompatible
};
