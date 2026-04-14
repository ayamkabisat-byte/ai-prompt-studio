import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Sparkles, RefreshCcw,
  Scissors, Palette, Glasses, LayoutGrid, CheckCircle2,
  Copy, Check, Image as ImageIcon, User, Camera, Watch, FileJson, FileText, Layers, Scan,
  Cpu
} from 'lucide-react';

// ─── DATA ─────────────────────────────────────────────────────────────────────

const GENDERS = ['Pria', 'Wanita', 'Unisex'];

const VIEW_MODES = [
  { id: '1-photo', label: '1 Foto Besar (Single Portrait)' },
  { id: '4-styles', label: 'Grid: 4 Variasi Gaya' },
  { id: '4-angles', label: 'Grid: 4 Sudut Pandang' },
];

const COMPOSITIONS = [
  { id: 'Natural and balanced composition', label: 'Default / Natural (Bawaan)' },
  { id: 'Rule of Thirds composition, asymmetrical visual balance', label: 'Rule of Thirds (Sepertiga Frame)' },
  { id: 'Perfect Symmetry and Balance, subject perfectly centered', label: 'Symmetry (Simetris Tengah)' },
  { id: 'Golden Ratio composition, natural cinematic visual flow', label: 'Golden Ratio (Fibonacci)' },
  { id: "Strong leading lines guiding the viewer's eye towards the subject", label: 'Leading Lines (Garis Pengarah)' },
  { id: 'Fill the frame completely, extreme tight composition', label: 'Fill the Frame (Penuh)' },
  { id: 'Vast negative space, minimalist composition', label: 'Negative Space (Ruang Kosong)' },
];

const BODY_TYPES = [
  { id: 'Original reference body', label: 'Sesuai Referensi Asli' },
  { id: 'Slim body type', label: 'Slim (Ramping)' },
  { id: 'Slightly muscular, toned body', label: 'Slight Muscle (Berotot Ringan)' },
  { id: 'Curvy, voluptuous body type', label: 'Curvy (Berisi/Lekuk Tubuh)' },
  { id: 'Athletic, highly muscular body', label: 'Athletic / Muscular' },
];

const SHOOT_STYLES = [
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
];

const POSES = [
  { group: 'Dasar & Referensi', items: [
    { id: 'Pose matching the original reference', label: 'Sesuai Referensi Asli (Default)', allowedTypes: ['all'] },
    { id: 'Front-facing close-up headshot', label: 'Front-Facing Close-up (Pasfoto)', allowedTypes: ['all'] },
    // FIX: match_bg_pose now only appears when image_ref_bg is selected — handled in render logic
    { id: 'match_bg_pose', label: 'Ikuti Pose dari Gambar Latar Upload', allowedTypes: ['image_ref_bg'] },
  ]},
  { group: 'Kasual & Dinamis', items: [
    { id: 'Casual half-body medium shot, arms and hands naturally visible in frame', label: 'Casual Half-Body (Original / Tangan Terlihat)', allowedTypes: ['all'] },
    { id: 'Casual half-body medium shot, highly natural and fluid candid posture, perfectly formed hand anatomy, avoiding stiff or awkward poses', label: 'Casual Half-Body (Tangan Natural & Dinamis)', allowedTypes: ['all'] },
    { id: 'Casual half-body portrait, standing with a relaxed natural curve, hands resting comfortably, candid lifestyle photography', label: 'Casual Half-Body (Santai & Rileks)', allowedTypes: ['all'] },
    { id: 'Standing perfectly straight facing the camera in an open landscape, both arms resting naturally by the sides', label: 'Berdiri Lurus Menatap Kamera, Lengan Natural', allowedTypes: ['nature', 'urban'] },
    { id: 'Side profile shot, looking 45 degrees away', label: 'Side Profile (Menyamping 45°)', allowedTypes: ['all'] },
    { id: 'Side profile shot, looking far into the distance, explicitly not looking at the camera', label: 'Side Profile, Memandang Jauh (Tidak Menatap Kamera)', allowedTypes: ['nature', 'urban', 'yacht', 'sports'] },
    { id: 'Standing sideways looking off-camera (three-quarter profile), both hands tucked inside coat pockets, candid observation', label: 'Berdiri Menyamping Mengamati, Tangan di Saku Mantel', allowedTypes: ['indoor', 'urban', 'nature', 'all'] },
    { id: 'Candid shot, subject looking away from the camera', label: 'Candid Looking Away', allowedTypes: ['all'] },
    { id: 'Standing straight facing the camera, both hands tucked fully and deeply inside the pockets', label: 'Berdiri Lurus, Kedua Tangan Masuk Penuh ke Saku', allowedTypes: ['all'] },
    { id: 'Standing relaxed in the middle of the street facing the camera, one leg slightly bent, both hands in pockets', label: 'Berdiri Santai di Tengah Jalan, Satu Kaki Ditekuk', allowedTypes: ['urban'] },
    { id: 'Standing naturally on an escalator, hands in pockets, looking casually to the side', label: 'Berdiri di Eskalator, Tangan di Saku, Menoleh ke Samping', allowedTypes: ['escalator'] },
    { id: 'Looking slightly up and smiling gently', label: 'Melihat ke Atas Sambil Tersenyum', allowedTypes: ['all'] },
    { id: 'Standing facing the camera laughing happily, giving a double thumbs up', label: 'Berdiri Tertawa Gembira, Pose Dua Jempol (Double Thumbs Up)', allowedTypes: ['all'] },
    { id: 'Dynamic candid shot, subject walking forward naturally towards the camera with a confident strut', label: 'Berjalan ke Arah Kamera (Dynamic Strut)', allowedTypes: ['urban', 'nature', 'indoor'] },
    { id: 'Candid walking, stepping forward confidently, looking straight ahead with natural arm swings', label: 'Candid Berjalan Mantap Menatap Lurus', allowedTypes: ['urban', 'nature', 'indoor'] },
  ]},
  { group: 'Profesional & Ekspresif', items: [
    { id: 'Confident professional pose, arms crossed over chest', label: 'Professional Confident (Tangan Bersilang)', allowedTypes: ['studio', 'urban', 'indoor'] },
    { id: 'Standing straight formally in the middle of the frame, both hands neatly clasped or stacked below the stomach', label: 'Berdiri Formal, Tangan Bertautan di Bawah Perut', allowedTypes: ['studio', 'indoor', 'urban'] },
    { id: 'Standing perfectly straight and symmetrical, staring intensely straight into the camera, arms flat by the sides', label: 'Berdiri Simetris Tegap (Menatap Lurus)', allowedTypes: ['all'] },
    { id: 'Adjusting suit jacket and tie with both hands, looking serious and confident directly at the camera', label: 'Membenarkan Jas/Dasi dengan Dua Tangan (Serius)', allowedTypes: ['all'] },
    { id: 'Standing, both hands holding the front lapels of a trench coat, soft smile looking at camera', label: 'Berdiri Lembut, Kedua Tangan Memegang Bagian Depan Mantel', allowedTypes: ['urban', 'nature'] },
    { id: 'Low angle shot, subject looking slightly up, establishing a dominant presence', label: 'Low Angle (Mendongak Sedikit)', allowedTypes: ['all'] },
    { id: 'Low-angle shot, standing tall facing the camera, looking down with a sharp, dominant and powerful gaze', label: 'Low Angle Dominan (Menunduk Tajam)', allowedTypes: ['studio', 'urban'] },
    { id: 'Powerful boss pose, looking slightly down at the camera with confidence', label: 'Pose Wibawa/Bos (Melihat ke Bawah)', allowedTypes: ['studio', 'indoor', 'urban'] },
    { id: 'Hand gently resting on the jawline, highlighting facial bone structure', label: 'Tangan Menunjukkan Jawline', allowedTypes: ['all'] },
    { id: 'Resting chin on hand, looking pensive and thoughtful', label: 'Menopang Pipi/Dagu (Pensive)', allowedTypes: ['all'] },
    { id: 'Masculine confident pose, one hand combing or running fingers backward through the hair', label: 'Menyisir Rambut ke Belakang (Confident)', allowedTypes: ['studio', 'urban', 'vehicle_interior'] },
  ]},
  { group: 'Duduk & Bersandar', items: [
    { id: 'Sitting gracefully on a chair with legs crossed, looking casually at the camera', label: 'Duduk di Kursi, Kaki Menyilang (Graceful)', allowedTypes: ['studio', 'indoor', 'urban'] },
    { id: 'Sitting cross-legged on a wooden bench, both hands resting softly on thighs', label: 'Duduk Sila di Bangku Kayu, Tangan di Paha', allowedTypes: ['nature', 'urban', 'indoor'] },
    { id: 'Sitting casually on a tall wooden stool, both hands resting relaxed on the knees, soft smile', label: 'Duduk Santai di Kursi Kayu Tinggi, Tangan di Lutut', allowedTypes: ['all'] },
    { id: 'Sitting casually on a modern chair, legs slightly spread apart in a relaxed posture', label: 'Duduk Santai di Kursi (Relaxed/Spread)', allowedTypes: ['studio', 'indoor', 'urban'] },
    { id: 'Sitting relaxed on a folding chair, legs comfortably spread apart in a casual open posture', label: 'Duduk Santai di Kursi Lipat (Open Posture)', allowedTypes: ['urban', 'nature', 'studio'] },
    { id: 'Sitting relaxed and leaning back on a plush sofa, right leg casually crossed over the left', label: 'Duduk Bersandar di Sofa, Kaki Menyilang', allowedTypes: ['indoor', 'studio'] },
    { id: 'Sitting gracefully on the edge of a bed, one hand playfully running through the hair near the neck', label: 'Duduk di Tepi Kasur, Tangan Memainkan Rambut', allowedTypes: ['indoor', 'studio', 'all'] },
    { id: 'Sitting elegantly on an outdoor wooden chair, legs crossed, hands resting relaxed in the lap', label: 'Duduk Elegan di Kursi Kayu Outdoor, Kaki Bersilang', allowedTypes: ['urban', 'nature', 'all'] },
    { id: 'Sitting relaxed in a comfortable seat, looking out a window pensively', label: 'Duduk Rileks, Pandangan ke Jendela (Candid)', allowedTypes: ['indoor', 'vehicle_interior'] },
    { id: 'Casual pose, leaning comfortably against a wall or object', label: 'Bersandar Santai di Dinding/Objek', allowedTypes: ['urban', 'indoor', 'studio'] },
    { id: 'Cool pose leaning casually against a car or surface, hands clasped loosely together in front of the waist', label: 'Bersandar Santai, Tangan Bertautan di Depan', allowedTypes: ['urban'] },
    { id: 'Leaning casually on a glass railing with back towards the camera, looking back over the shoulder', label: 'Bersandar di Pagar Kaca, Membelakangi Kamera & Menoleh', allowedTypes: ['urban', 'yacht', 'indoor'] },
    { id: 'Leaning back comfortably with one hand resting on the head or running through hair, relaxed high-fashion vibe', label: 'Bersandar, Tangan di Kepala (Editorial)', allowedTypes: ['studio', 'urban', 'vehicle_interior', 'indoor'] },
    { id: 'Leaning on a concrete pillar, arms crossed over chest, legs slightly crossed, looking down with a cool and melancholic expression', label: 'Bersandar di Pilar, Lengan Bersilang, Menunduk Cool', allowedTypes: ['urban', 'indoor'] },
  ]},
  { group: 'Aktivitas & Interaksi', items: [
    { id: 'Sitting casually on a wooden bench, holding a basketball in the lap, looking directly at the camera', label: 'Duduk di Bangku Kayu, Memangku Bola Basket', allowedTypes: ['all'] },
    { id: "Sitting at a cafe table leaning slightly forward, one hand playfully resting on the table as if holding a partner's hand", label: 'Duduk di Kafe, Condong ke Depan (POV Pasangan)', allowedTypes: ['urban', 'nature', 'all'] },
    { id: 'Standing for a mirror selfie, legs casually crossed, both hands holding a smartphone at chest height', label: 'Mirror Selfie, Kaki Bersilang, Pegang HP', allowedTypes: ['indoor', 'vehicle_interior', 'urban'] },
    { id: 'Sitting on the edge of a boat with legs dangling, extending one arm holding a smartphone for a selfie', label: 'Duduk di Tepi Kapal, Selfie dengan HP', allowedTypes: ['yacht'] },
    { id: 'Standing, right hand shading eyes from the sun, left hand making a peace sign', label: 'Tangan Menghalangi Matahari & Peace Sign', allowedTypes: ['nature', 'urban', 'sports', 'yacht'] },
    { id: 'Side profile shot looking forward, right hand holding a black umbrella, left hand tucked into coat pocket', label: 'Menyamping Pegang Payung, Tangan Kiri di Saku', allowedTypes: ['urban', 'nature'] },
    { id: 'Standing straight and sporty, both hands holding a padel racket and a ball in front of the stomach', label: 'Berdiri Tegap, Memegang Raket Padel & Bola', allowedTypes: ['sports'] },
    { id: 'Standing facing the camera, holding a small coffee or tea cup near the chest with both hands, sweet smile', label: 'Berdiri, Pegang Cangkir Hangat di Dada, Senyum Manis', allowedTypes: ['urban', 'indoor', 'nature'] },
    { id: 'Sitting cross-legged, looking down focused on typing on a smartphone held with both hands', label: 'Duduk Kaki Menyilang, Menunduk Fokus Mengetik HP', allowedTypes: ['urban', 'indoor', 'nature'] },
    { id: 'Walking casually towards the camera, looking slightly to the right, holding the strap of a sling bag', label: 'Berjalan Menuju Kamera, Pegang Tali Tas Selempang', allowedTypes: ['urban', 'nature', 'indoor'] },
    { id: 'Walking towards the camera, looking straight ahead, casually holding a smartphone', label: 'Berjalan Lurus Menatap Kamera Sambil Pegang HP', allowedTypes: ['urban', 'indoor', 'nature'] },
  ]},
  { group: 'Hari Raya & Perayaan (Festive)', items: [
    { id: 'Standing with hands clasped together in front of the chest in a traditional Indonesian greeting/apology gesture (Gestur salam / sungkem / minta maaf)', label: 'Gestur Minta Maaf / Sungkem (Lebaran)', allowedTypes: ['all', 'indoor', 'studio', 'nature'] },
    { id: 'Standing with one hand cupped over the other fist in a traditional Chinese greeting gesture (Gong Xi Fa Cai / Baoquan li)', label: 'Gestur Salam Gong Xi Fa Cai (Imlek)', allowedTypes: ['all', 'indoor', 'studio', 'urban'] },
    { id: 'Standing joyfully with hands pressed together in front of the chest in a traditional Balinese greeting (Om Swastiastu)', label: 'Gestur Salam Panganjali (Galungan/Bali)', allowedTypes: ['all', 'nature', 'indoor', 'studio'] },
    { id: 'Holding a beautifully wrapped gift box and smiling warmly', label: 'Memegang Kotak Kado (Natal / Hadiah)', allowedTypes: ['all', 'indoor', 'studio'] },
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
];

const CAMERA_LENSES = [
  { id: 'Standard portrait lens (50mm)', label: 'Standard Lens (Normal)', allowedTypes: ['all'] },
  { id: 'Wide angle lens, capturing more of the subject and environment', label: 'Wide Angle Lens (Ekspansif)', allowedTypes: ['all'] },
  { id: 'Full-frame fisheye lens, distorted ultra-wide perspective with bulging center, 10mm ultra-wide lens with barrel distortion, edge-to-edge frame coverage, bright corners, absolutely zero vignette and no black borders', label: 'Fisheye Lens (Distorsi Melengkung)', allowedTypes: ['all'] },
  { id: 'Telephoto lens (85mm), compressed background with strong bokeh blur', label: 'Telephoto Lens (Fokus, Background Blur)', allowedTypes: ['all'] },
  { id: 'Telephoto zoom lens (200mm), paparazzi editorial style with high compression', label: 'Telephoto Paparazzi (Jarak Jauh)', allowedTypes: ['urban', 'nature', 'sports', 'yacht'] },
  { id: 'Macro lens, extreme close-up details', label: 'Macro Lens (Extreme Close-up)', allowedTypes: ['all'] },
  { id: "Bird's eye view, top-down shot from directly above", label: "Bird's Eye View (Dari Atas 90°)", allowedTypes: ['all'] },
  { id: 'Dutch angle, intentionally tilted camera for dynamic fashion editorial vibe', label: 'Dutch Angle (Kamera Miring)', allowedTypes: ['all'] },
  { id: 'Underwater dome port camera lens, half underwater and half above water split shot', label: 'Dome Port (Setengah Air Setengah Darat)', allowedTypes: ['underwater'] },
];

const LIGHTING_STYLES = [
  { group: 'Natural & Outdoor', items: [
    { id: 'Standard natural daylight', label: 'Standard / Natural Lighting', allowedTypes: ['all', 'urban', 'nature', 'yacht', 'sports', 'escalator'] },
    { id: 'Bright sunny daylight with hard sharp shadows', label: 'Cahaya Terik Siang Hari (Bayangan Keras)', allowedTypes: ['urban', 'nature', 'yacht', 'sports'] },
    { id: 'Warm golden hour sunlight', label: 'Golden Hour (Cahaya Sore)', allowedTypes: ['all', 'urban', 'nature', 'yacht', 'sports', 'escalator'] },
    { id: "Warm golden hour backlighting, creating a beautiful glowing rim light effect around the subject's hair and shoulders", label: 'Golden Hour Backlighting (Rim Light)', allowedTypes: ['urban', 'nature', 'yacht', 'sports'] },
    { id: 'Hard natural side lighting, creating strong crisp shadows on half the face', label: 'Hard Natural Side Light (Cahaya Tajam Samping)', allowedTypes: ['all', 'urban', 'nature', 'yacht', 'sports', 'indoor'] },
    { id: 'Beautiful pastel sunset sky lighting', label: 'Sunset Pastel (Cahaya Senja Lembut)', allowedTypes: ['all', 'nature', 'yacht', 'urban'] },
  ]},
  { group: 'Studio & Dramatic', items: [
    { id: 'Black and white monochrome photography', label: 'Black and White (Monochrome / B&W)', allowedTypes: ['all'] },
    { id: 'Warm cozy indoor ambient lighting', label: 'Pencahayaan Ruangan Dalam Hangat (Cozy Indoor)', allowedTypes: ['all', 'indoor', 'vehicle_interior', 'studio', 'urban'] },
    { id: 'Cinematic dramatic studio lighting', label: 'Cinematic Dramatic Studio', allowedTypes: ['all', 'studio', 'indoor', 'vehicle_interior'] },
    { id: 'Strong Chiaroscuro lighting, dramatic contrast, brightly illuminated face emerging from a pitch-black background', label: 'Chiaroscuro (Kontras Tinggi)', allowedTypes: ['studio', 'indoor', 'vehicle_interior'] },
    { id: 'Classic Rembrandt lighting, featuring a distinct triangle of light on the shadowed cheek', label: 'Rembrandt Lighting (Segitiga Cahaya)', allowedTypes: ['studio', 'indoor', 'vehicle_interior'] },
    { id: 'Professional studio softbox lighting with gentle fill light, creating perfectly soft diffused shadows on the face', label: 'Softbox & Fill Light (Studio Lembut)', allowedTypes: ['all', 'studio', 'indoor'] },
  ]},
  { group: 'Creative & Effects', items: [
    { id: 'Sharp, dramatic shadow patterns cast across the face and body (Gobo lighting effect / Window blind shadows)', label: 'Pola Bayangan Tajam Jendela (Gobo Lighting)', allowedTypes: ['all', 'studio', 'indoor', 'urban'] },
    { id: "Ring light illumination, showing prominent circular catchlights clearly visible in the subject's eyes", label: 'Ring Light (Catchlight Mata)', allowedTypes: ['studio', 'indoor'] },
    { id: 'Honeycomb grid lighting, focused dramatic beam highlighting the face with deep shadows', label: 'Honeycomb Grid Lighting', allowedTypes: ['studio', 'indoor'] },
    { id: 'Vibrant dual-tone color gel lighting (split red and blue lighting on the face)', label: 'Dual-tone Red & Blue Gel Lighting', allowedTypes: ['studio', 'indoor', 'urban'] },
    { id: 'Vibrant neon street lighting', label: 'Neon Street Lighting', allowedTypes: ['all', 'urban', 'studio', 'indoor', 'escalator'] },
    { id: 'Vibrant red colored backlighting, creating a glowing silhouette against a dark background', label: 'Colored Backlighting (Merah)', allowedTypes: ['studio', 'indoor'] },
  ]},
  { group: 'Bawah Air (Underwater)', items: [
    { id: 'Underwater caustic lighting with beautiful sunlight rays piercing and bending through the water surface', label: 'Cahaya Caustics (Sinar Matahari Tembus Air)', allowedTypes: ['underwater'] },
    { id: 'Deep blue diffuse underwater lighting, mysterious and ethereal', label: 'Cahaya Biru Dalam (Deep Diffuse)', allowedTypes: ['underwater'] },
    { id: 'Bright clear swimming pool lighting', label: 'Cahaya Terang Kolam Renang Jernih', allowedTypes: ['underwater'] },
  ]},
];

const HAIRSTYLES = {
  Pria: [
    'Original hairstyle from reference image (Sesuai Asli)', 'Buzz Cut', 'Fade', 'Taper Fade',
    'Pompadour', 'Undercut', 'Comb Over', 'Quiff', 'French Crop', 'Mullet', 'Slick Back',
    'Edgar Cut', 'Crew Cut', 'Faux Hawk', 'Korean Comma Hair', 'Korean Two-Block Cut',
    'Long Wavy Hair', 'Long Straight Hair', 'Emo Fringe Hair (Long swept bangs)', 'Man Bun',
    'Samurai Top Knot', 'Harajuku Style Hair (Heavily textured and layered)',
    'Visual Kei Hair (Voluminous, asymmetrical, and spiky)', 'Cornrows', 'Small Afro', 'Big Afro',
    'Box Braids', 'Dreadlocks',
  ],
  Wanita: [
    'Original hairstyle from reference image (Sesuai Asli)',
    'Hime Cut (Straight hair with blunt cheek-length sidelocks and front bangs)',
    'Wolf Cut (Messy layered shag with longer mullet vibe back)',
    'Butterfly Haircut (Bouncy long layers framing the face)',
    'Jellyfish Haircut (Avant-garde short bob top with long underlying tentacle layers)',
    'Hush Cut (Soft Korean lightweight layers with wispy bangs)',
    'Pixie Cut (Super short cropped hair)', 'Bixie Cut (Textured bob-pixie hybrid)',
    'Blunt Bob (Straight perfectly even cut short bob)', 'French Bob (Short chin-length bob with natural wavy texture)',
    'Asymmetrical Bob (Uneven length short bob)', 'Long Bob (Lob, collarbone length)',
    'Shaggy Cut (Choppy textured rock-and-roll layers)', 'Classic Layered Cut (Voluminous stepped layers)',
    'Long Blunt Cut (Straight perfectly even ends, zero layers)', 'Long V-Cut (Long hair tapering to a V-shape at the back)',
    'Long U-Cut (Long hair with a soft U-shaped curve at the back)', 'Long Wavy Hair',
    'Shoulder-length Straight Hair', 'Curtain Bangs (Long center-parted bangs framing the face)',
    'Wispy See-through Bangs (Thin delicate Korean style front fringe)',
    'Micro Bangs / Baby Bangs (Super short fringe above eyebrows)', 'Ponytail', 'French Braids',
    'Messy Bun', 'Elegant Updo', 'Neat Flight Attendant Bun (Sanggul Rapi Pramugari)',
    'Traditional Javanese Hairbun (Sanggul Tradisional)', 'Double Buns (Cepol Dua/Pucca style)',
    'Two Classic Braids (Kepang Dua)', 'Harajuku Style Hair (Heavily textured and layered)',
    'Visual Kei Hair (Voluminous, asymmetrical)', 'Box Braids', 'Cornrows', 'Curly Voluminous',
    'Small Afro', 'Big Afro',
  ],
  Unisex: [
    'Original hairstyle from reference image (Sesuai Asli)', 'Dreadlocks', 'Shag', 'Small Afro',
    'Big Afro', 'Bald', 'Bowl Cut', 'Messy Medium', 'Long Emo Fringe Hair', 'Harajuku Style Hair',
    'Visual Kei Hair', 'Cornrows', 'Box Braids', 'Long Hair', 'Man Bun',
  ],
};

const COLOR_TYPES = ['One Tone', 'Two Tone (Ombre)', 'Tri Tone', 'Highlight'];
const BASE_COLORS = [
  'Black', 'Dark Brown', 'Light Brown', 'Ash Blonde', 'Platinum Blonde', 'Strawberry Blonde',
  'Burgundy', 'Fire Engine Red', 'Silver/Grey', 'Electric Blue', 'Neon Pink', 'Pastel Peach',
  'Vibrant Violet', 'Mint Green', 'Rose Gold',
];

const ACCESSORIES_DATABASE = [
  { group: 'Kacamata (Eyewear)', items: [
    { id: 'Reading glasses', label: 'Kacamata Baca' },
    { id: 'Thin round frame glasses', label: 'Kacamata Bingkai Bulat Tipis' },
    { id: 'Sunglasses', label: 'Kacamata Hitam' },
    { id: 'Oversized sunglasses', label: 'Kacamata Hitam Oversized' },
    { id: 'White frame sunglasses', label: 'Kacamata Bingkai Putih' },
    { id: 'Blue sunglasses resting on head', label: 'Kacamata Biru di Atas Kepala' },
  ]},
  { group: 'Topi & Kepala', items: [
    { id: 'Pink and yellow flower hair clip', label: 'Jepit Rambut Bunga (Pink/Kuning)' },
    { id: 'Cream and white hair scrunchie', label: 'Scrunchie Rambut Krem/Putih' },
    { id: 'Green plain beanie hat', label: 'Beanie/Kupluk Hijau' },
    { id: 'Black-and-white knit beanie hat', label: 'Beanie/Kupluk Rajut Hitam-Putih' },
    { id: 'White baseball cap', label: 'Topi Bisbol Putih' },
    { id: 'Green baseball cap', label: 'Topi Bisbol Hijau' },
    { id: 'Khaki bucket hat with a neck strap', label: 'Topi Bucket Khaki (dengan Tali)' },
    { id: 'Tupac style tied bandana on head', label: 'Bandana Ikat (Tupac Style)' },
    { id: 'Silky durag tied on head', label: 'Durag Penutup Kepala (Rapper Style)' },
    { id: 'Black wireless headphones worn over the ears or around the neck', label: 'Headphone Nirkabel Hitam' },
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
    { id: "Chunky hip-hop chain with a massive iced-out diamond pendant", label: 'Kalung Rantai Besar + Permata (Rapper)' },
    { id: 'Diamond iced-out teeth grillz', label: 'Grillz Gigi (Iced Out/Diamond)' },
    { id: 'Leather bracelet', label: 'Gelang Kulit' },
    { id: 'Chrome Hearts silver rings on fingers', label: 'Cincin Chrome Hearts' },
    { id: 'Diamond engagement ring', label: 'Cincin Berlian' },
    { id: 'Gold signet ring', label: 'Cincin Emas (Signet)' },
    { id: 'Elegant pearl necklace', label: 'Kalung Mutiara Elegan' },
    { id: 'Pearl stud earrings', label: 'Anting Mutiara (Perhiasan Mutiara)' },
    { id: 'Vintage pearl brooch pinned on chest', label: 'Bros Mutiara (Vintage Brooch)' },
  ]},
  { group: 'Dasi, Syal & Kaos Kaki', items: [
    { id: 'Knit tie', label: 'Dasi Rajut (Knit Tie)' },
    { id: 'Striped necktie', label: 'Dasi Motif Garis' },
    { id: 'Red necktie', label: 'Dasi Merah' },
    { id: 'Blue necktie', label: 'Dasi Biru' },
    { id: 'Elegant silk neckerchief or ascot tie', label: 'Syal Sutra / Ascot (Elegan)' },
    { id: 'Thick wool winter scarf', label: 'Syal Wol Musim Dingin' },
    { id: 'High white calf-length socks', label: 'Kaos Kaki Putih Sebetis' },
    { id: 'White knee-high socks', label: 'Kaos Kaki Putih Selutut' },
  ]},
  { group: 'Tas & Kantong', items: [
    { id: 'Woven rattan or straw tote bag', label: 'Tote Bag Anyaman Rotan/Jerami' },
    { id: 'Pink canvas tote bag', label: 'Tote Bag Kanvas Pink' },
    { id: 'Cream backpack', label: 'Tas Ransel Krem' },
    { id: 'Black leather shoulder bag', label: 'Shoulder Bag Kulit Hitam' },
    { id: 'White crossbody sling bag', label: 'Tas Selempang Putih (Crossbody)' },
    { id: 'Sports duffel bag', label: 'Tas Duffel Olahraga' },
    { id: 'Alfamart plastic shopping bag', label: 'Kantong Kresek Alfamart' },
    { id: 'Indomaret plastic shopping bag', label: 'Kantong Kresek Indomaret' },
    { id: 'FamilyMart plastic shopping bag', label: 'Kantong Kresek FamilyMart' },
    { id: 'Watsons plastic shopping bag', label: 'Kantong Kresek Watsons' },
  ]},
  { group: 'Lainnya (Properti)', items: [
    { id: 'Black leather driving gloves', label: 'Sarung Tangan Kulit Hitam' },
    { id: 'Red electric guitar', label: 'Gitar Elektrik Merah' },
    { id: 'Action camera (GoPro)', label: 'Kamera Aksi (GoPro)' },
    { id: 'Festival wristbands', label: 'Gelang Festival' },
  ]},
];

const LUXURY_WATCHES = [
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
  { id: 'Cartier Panthère watch', label: 'Cartier Panthère (Ikonik Wanita)' },
  { id: 'Richard Mille watch', label: 'Richard Mille' },
  { id: 'Bvlgari Serpenti watch', label: 'Bvlgari Serpenti (Gelang Ular Wanita)' },
  { id: 'Chopard Happy Diamonds watch', label: 'Chopard Happy Diamonds (Wanita)' },
  { id: 'Casio G-Shock watch', label: 'G-Shock (Kasual)' },
  { id: 'Smartwatch (Apple Watch style)', label: 'Smartwatch (Apple Watch)' },
];

const FACIAL_HAIR = [
  { id: 'Clean shaven', label: 'Tanpa Brewok (Clean Shaven)' },
  { id: 'Thin mustache', label: 'Kumis Tipis' },
  { id: 'Thick mustache', label: 'Kumis Tebal' },
  { id: 'Goatee', label: 'Goatee' },
  { id: 'Full beard', label: 'Janggut Penuh' },
  { id: 'Stubble beard', label: 'Stubble (Brewok Tipis)' },
];

const HIJAB_STYLES = [
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

const EXPRESSIONS = [
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

const MAKEUP_STYLES = [
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

const BACKGROUNDS = [
  { group: 'Kustom & Referensi', items: [
    { id: 'custom_bg', type: 'all', label: 'Tulis Lokasi / Latar Belakang Sendiri' },
    { id: 'image_ref_bg', type: 'all', label: '📸 Gunakan Latar dari Gambar Upload (Match BG/Angle)' },
  ]},
  { group: 'Basic & Studio', items: [
    { id: 'Original background from the reference image', type: 'all', label: 'Original Background' },
    { id: 'Clean white studio background', type: 'studio', label: 'Studio Putih Bersih' },
    { id: 'Dark grey studio background', type: 'studio', label: 'Studio Abu-abu Gelap' },
    { id: 'Pitch black studio background', type: 'studio', label: 'Latar Hitam Gelap / Pitch Black' },
    { id: 'Vibrant teal or cyan solid studio background', type: 'studio', label: 'Studio Teal/Cyan (Pop Color)' },
    { id: 'Dramatic dark red studio background, moody lighting', type: 'studio', label: 'Latar Studio Merah Gelap Dramatis' },
    { id: 'Solid red background (Official ID photo style)', type: 'studio', label: 'Latar Merah (Pasfoto)' },
    { id: 'Solid blue background (Official ID photo style)', type: 'studio', label: 'Latar Biru (Pasfoto)' },
    { id: 'Plain minimalist blue wall indoors with a simple wooden bench', type: 'studio', label: 'Tembok Biru Minimalis & Bangku Kayu' },
  ]},
  { group: 'Luxury & Transport', items: [
    { id: 'Nighttime indoors, luxurious velvet sofa in a warm and cozy living room', type: 'indoor', label: 'Sofa Beludru Mewah di Ruang Tamu (Malam/Hangat)' },
    { id: 'Inside a luxurious private jet cabin, looking out the window', type: 'vehicle_interior', label: 'Interior Pesawat Pribadi (Private Jet)' },
    { id: 'Inside a premium luxury car, plush leather seats', type: 'vehicle_interior', label: 'Interior Mobil Mewah (Di Kursi Belakang)' },
    { id: 'Deck of a sailing yacht in the open sea, white wake and windy sunny weather', type: 'yacht', label: 'Di Atas Dek Kapal Layar (Laut Lepas, Berangin)' },
    { id: 'Modern escalator in a bright shopping mall or airport', type: 'escalator', label: 'Di Atas Eskalator (Mall / Bandara Modern)' },
  ]},
  { group: 'Architecture & City Vibe', items: [
    { id: 'Modern city sidewalk in front of a glass and concrete building during daytime', type: 'urban', label: 'Trotoar Kota Depan Gedung Kaca & Beton' },
    { id: 'Busy Japanese intersection crosswalk, visible shop signs and road markings (Shibuya style)', type: 'urban', label: 'Persimpangan Jalanan Jepang (Shibuya Vibe)' },
    { id: 'Standing near the iconic Eiffel Tower in Paris, clear sunny day', type: 'urban', label: 'Landmark Menara Eiffel, Paris (Iconic)' },
    { id: 'Historical cobblestone streets of Edinburgh, Scotland, with classic gothic architecture', type: 'urban', label: 'Jalanan Bersejarah Edinburgh, Skotlandia' },
    { id: 'Outdoor stairs in Santorini, Greece, surrounded by iconic white buildings and blue domes', type: 'urban', label: 'Santorini, Yunani (Bangunan Putih & Kubah Biru)' },
    { id: 'Vibrant futuristic city street at night', type: 'urban', label: 'Jalanan Kota Futuristik (Malam)' },
    { id: 'Parisian style street cafe with outdoor seating and round tables', type: 'urban', label: 'Kafe Jalanan Paris (Parisian Cafe)' },
    { id: 'Standing inside the vibrant red torii gates of Fushimi Inari Shrine in Kyoto, Japan', type: 'urban', label: 'Gerbang Kuil Merah (Fushimi Inari, Jepang)' },
    { id: 'High balcony in the city center with a background of towering skyscrapers', type: 'urban', label: 'Balkon Gedung Tinggi (City Skyscraper View)' },
    { id: 'Dark city alleyway at night, leaning near a concrete pillar and a roll-up door', type: 'urban', label: 'Gang Kota Malam Hari (Pilar Beton & Pintu Gulung)' },
    { id: 'Simple aesthetic street in Japan, standing next to a classic Japanese vending machine at night', type: 'urban', label: 'Jalanan Jepang Estetik (Dekat Vending Machine Malam)' },
  ]},
  { group: 'High-End Lifestyle & Events', items: [
    { id: 'High-end fine dining restaurant in a tall skyscraper overlooking the vibrant city skyline of Jakarta at night', type: 'indoor', label: 'Fine Dining Gedung Tinggi (Jakarta Skyline Malam)' },
    { id: '5-star luxury hotel infinity pool with tropical palm trees', type: 'nature', label: 'Kolam Renang Hotel Bintang 5' },
    { id: 'Green hard tennis court on a sunny day', type: 'sports', label: 'Lapangan Tenis (Tennis Court)' },
    { id: 'Semi-indoor padel court with large windows providing ample natural daylight', type: 'sports', label: 'Lapangan Padel Semi-Indoor (Jendela Besar)' },
    { id: 'Luxury Jakarta apartment bedroom with floor-to-ceiling windows showing city skyline', type: 'indoor', label: 'Kamar Apartemen Mewah (City Skyline)' },
    { id: 'Aesthetic fine dining restaurant booth with warm vintage lighting', type: 'indoor', label: 'Restoran Mewah (Fine Dining Booth)' },
  ]},
  { group: 'Nature & Scenic', items: [
    { id: 'Turquoise glacier mountain lake with pine trees and snowy peaks (Moraine Lake style)', type: 'nature', label: 'Danau Pegunungan Biru Toska' },
    { id: 'High rocky mountain peak overlooking a vast pine forest valley', type: 'nature', label: 'Puncak Gunung Berbatu (Pemandangan Lembah)' },
    { id: 'Standing in the vast sea of sand at Mount Bromo during sunrise, epic volcanic landscape', type: 'nature', label: 'Lautan Pasir Gunung Bromo (Sunrise)' },
    { id: 'Tropical white sand beach in Okinawa, Japan, with crystal clear blue water and sunny sky', type: 'nature', label: 'Pantai Tropis Okinawa, Jepang' },
    { id: 'Snowy arctic landscape near the North Pole at night, illuminated by a breathtaking green Aurora Borealis', type: 'nature', label: 'Malam Kutub Utara (Aurora Borealis)' },
    { id: 'Walking through the towering green Arashiyama Bamboo Grove in Kyoto, Japan, ethereal natural light', type: 'nature', label: 'Hutan Bambu (Arashiyama, Jepang)' },
    { id: 'Wooden pier by the sea during a pastel sunset', type: 'nature', label: 'Dermaga Kayu Tepi Laut (Senja/Pastel)' },
    { id: 'Dusk at the beach with crashing waves and a vibrant orange-blue sunset sky', type: 'nature', label: 'Pantai Senja (Ombak & Langit Jingga-Biru)' },
    { id: 'Clear bright blue sky, vast open backdrop', type: 'nature', label: 'Langit Biru Cerah (Clear Blue Sky)' },
    { id: 'Country road beside a field of bright orange flowers during golden hour', type: 'nature', label: 'Jalan Pedesaan & Ladang Bunga Oranye (Golden Hour)' },
  ]},
  { group: 'Bawah Air (Underwater)', items: [
    { id: 'Underwater looking at a vibrant coral reef with swimming fish', type: 'underwater', label: 'Bawah Air (Terumbu Karang & Ikan)' },
    { id: 'Underwater in the middle of the deep blue ocean, vast and empty', type: 'underwater', label: 'Bawah Air (Lautan Biru Dalam / Deep Ocean)' },
    { id: 'Underwater inside a clear blue tiled swimming pool', type: 'underwater', label: 'Bawah Air (Kolam Renang Jernih)' },
    { id: 'Underwater in a mystical cenote with light beams hitting the bottom', type: 'underwater', label: 'Bawah Air (Gua Cenote / Sinar Masuk)' },
  ]},
  { group: 'Tema Hari Raya & Perayaan (Festive)', items: [
    { id: 'Cozy living room elegantly decorated for Eid al-Fitr (Lebaran) with warm lighting, subtle ketupat ornaments, and beautiful Islamic geometric patterns', type: 'indoor', label: 'Lebaran / Idul Fitri (Ruang Tamu Hangat)' },
    { id: 'Warm living room with a glowing beautifully decorated Christmas tree, wrapped presents, and a cozy fireplace', type: 'indoor', label: 'Natal / Christmas (Pohon Natal & Perapian)' },
    { id: 'Traditional Chinese interior elegantly decorated for Lunar New Year with glowing red lanterns and gold accents', type: 'indoor', label: 'Imlek / Lunar New Year (Lampion Merah)' },
  ]},
];

const CLOTHING_MATERIALS = [
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
];

const COLOR_THEMES = [
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

const CLOTHING_DATABASE = [
  { group: 'Bawaan Asli (Original)', items: [
    { id: 'Original clothing from reference', label: 'Pakaian Sesuai Referensi Asli', tags: ['male', 'female', 'unisex', 'hijab_approved'] },
  ]},
  { group: 'Resort & Beach Bohemian', items: [
    { id: 'Loose long-sleeve linen shirt with the sleeves rolled up and partially unbuttoned', label: 'Kemeja Linen Lengan Digulung (Longgar)', tags: ['male', 'female', 'unisex'] },
    { id: 'Floral sundress with a beautiful sweetheart neckline', label: 'Gaun Terusan Motif Bunga (Floral Sundress)', tags: ['female'] },
    { id: 'Flowy modest long-sleeve linen maxi dress', label: 'Maxi Dress Linen Panjang (Modest)', tags: ['female', 'hijab_approved'] },
    { id: 'White cotton linen trousers paired with a relaxed button-up shirt and brown leather slide sandals', label: 'Celana Linen Putih & Kemeja Santai + Sandal Kulit', tags: ['male', 'female', 'unisex', 'hijab_approved'] },
    { id: 'Tailored short pants paired with a breezy summer shirt', label: 'Celana Pendek Tailored & Kemeja Santai', tags: ['male', 'female', 'unisex'] },
  ]},
  { group: 'Smart-Casual & Preppy', items: [
    { id: 'Polo shirt paired with tailored cream trousers and a knit sweater draped elegantly over the shoulders', label: 'Polo Shirt + Celana Krem + Sweater Disampirkan (Preppy)', tags: ['male', 'female', 'unisex'] },
    { id: 'Classic blue denim jacket layered over a striped shirt and a dark knit tie, paired with dark tailored trousers', label: 'Jaket Denim + Kemeja & Dasi Rajut + Celana Bahan', tags: ['male', 'unisex'] },
    { id: 'Classic school uniform style featuring a white shirt, black pleated skirt, and a red necktie, worn with loafers', label: 'Seragam Sekolah (Kemeja Putih, Dasi Merah, Rok Hitam)', tags: ['female'] },
    { id: 'Cable-knit crewneck sweater layered over a light blue collared shirt', label: 'Sweater Rajut Cable-Knit di Atas Kemeja (Layering)', tags: ['male', 'female', 'unisex', 'hijab_approved'] },
    { id: 'Olive green corduroy suit paired with a black turtleneck', label: 'Setelan Jas Corduroy Hijau Olive + Turtleneck', tags: ['male', 'female', 'unisex', 'hijab_approved'] },
    { id: 'Classic beige double-breasted trench coat worn open over a black turtleneck midi dress, paired with pointed-toe ankle boots', label: 'Trench Coat Beige + Gaun Midi Turtleneck + Sepatu Boots', tags: ['female', 'hijab_approved'] },
  ]},
  { group: 'Cozy & Knitwear Casual', items: [
    { id: 'Fuzzy knit cardigan over a plain tank top, paired with loose light blue baggy jeans', label: 'Kardigan Rajut Berbulu + Tank Top + Baggy Jeans', tags: ['female', 'unisex', 'hijab_approved'] },
    { id: 'Light grey hoodie worn under a black denim vest, paired with loose jeans', label: 'Hoodie Abu-abu Muda + Rompi Denim Hitam', tags: ['male', 'female', 'unisex', 'hijab_approved'] },
    { id: 'Thick oversized cream sweater paired with loose comfortable trousers', label: 'Sweater Rajut Oversized Krem + Celana Nyaman', tags: ['male', 'female', 'unisex', 'hijab_approved'] },
  ]},
  { group: 'Urban Casual & Workwear', items: [
    { id: 'Classic plain white t-shirt with straight-leg jeans and white canvas sneakers', label: 'Kaos Polos Klasik + Celana Jeans Lurus', tags: ['male', 'female', 'unisex'] },
    { id: 'Thick olive green chore jacket/overshirt left open over a plain t-shirt, paired with jeans', label: 'Chore Jacket Terbuka + Kaos Polos + Jeans', tags: ['male', 'female', 'unisex', 'hijab_approved'] },
    { id: 'Long dark trench coat/overcoat worn over a plain black t-shirt', label: 'Trench Coat Panjang + Kaos Hitam', tags: ['male', 'female', 'unisex', 'hijab_approved'] },
    { id: 'Sage green oversized nylon bomber jacket over a black turtleneck, paired with baggy faded black jeans and retro running sneakers', label: 'Jaket Bomber Oversize Hijau Sage + Turtleneck Hitam + Jeans Baggy Pudar', tags: ['male', 'female', 'unisex', 'hijab_approved'] },
  ]},
  { group: 'Business Casual & Formal', items: [
    { id: 'Sleek dark tailored suit with a matching tie and a vest (three-piece suit)', label: 'Setelan Jas Tiga Potong (Jas, Rompi, Dasi)', tags: ['male'] },
    { id: 'Navy blue tailored blazer jacket over a crisp white dress shirt', label: 'Blazer Jas Navy + Kemeja Putih Rapi', tags: ['male', 'female', 'hijab_approved'] },
    { id: 'Formal button-up shirt (No Tie)', label: 'Kemeja Formal (Tanpa Dasi)', tags: ['male', 'female', 'hijab_approved'] },
    { id: 'Sleek all-black tailored suit with a fitted black turtleneck underneath', label: 'All-Black Sleek: Jas Hitam + Turtleneck Hitam', tags: ['male', 'female', 'unisex', 'hijab_approved'] },
    { id: 'Sleek all-black pantsuit with a fine-knit fitted turtleneck', label: 'All-Black Pantsuit + Turtleneck Halus', tags: ['female', 'hijab_approved'] },
    { id: 'Turtleneck sweater worn under a tailored blazer jacket', label: 'Turtleneck + Blazer', tags: ['male', 'female', 'hijab_approved'] },
    { id: 'Elegant evening gown', label: 'Gaun Malam Elegance', tags: ['female'] },
    { id: 'Modest elegant long evening gown, fully covered with long sleeves', label: 'Gaun Malam Tertutup (Modest)', tags: ['female', 'hijab_approved'] },
  ]},
  { group: 'Streetwear & 90s', items: [
    { id: 'Oversized Varsity jacket layered over a polo shirt, paired with black jeans and a baseball cap', label: 'Jaket Varsity Oversized + Polo + Jeans + Topi', tags: ['male', 'unisex', 'hijab_approved'] },
    { id: 'Brown plaid flannel shirt acting as an outer layer over a black hoodie, paired with black joggers', label: 'Kemeja Flanel di luar Hoodie + Jogger (Layering)', tags: ['male', 'female', 'unisex', 'hijab_approved'] },
    { id: 'Retro green and yellow track jacket paired with baggy denim jeans', label: 'Jaket Track Retro + Celana Jeans Baggy', tags: ['male', 'female', 'unisex', 'hijab_approved'] },
    { id: 'Oversized baggy hip-hop t-shirt', label: 'Kaos Oversize (Rapper Style)', tags: ['male', 'female', 'unisex', 'hijab_approved'] },
  ]},
  { group: 'Olahraga & Renang', items: [
    { id: 'Shirtless, bare-chested, revealing well-defined torso muscles and abs', label: 'Topless / Tanpa Baju (Mengekspos Otot)', tags: ['male'] },
    { id: 'Athletic sports t-shirt and running shorts', label: 'Setelan Lari (Kaos Olahraga & Celana Pendek)', tags: ['male', 'female', 'unisex', 'hijab_approved'] },
    { id: 'Bikini swimsuit', label: 'Baju Renang Bikini', tags: ['female'] },
    { id: 'Swimming trunks / board shorts', label: 'Celana Renang (Board Shorts)', tags: ['male'] },
    { id: 'Modest swimwear / burkini', label: 'Baju Renang Muslimah (Burkini)', tags: ['female', 'hijab_approved'] },
  ]},
  { group: 'Gorpcore & Outdoor / Hiking', items: [
    { id: 'Dark grey and olive green fleece polar jacket layered over a t-shirt, paired with olive green sweatshorts and brown hiking boots with cream socks', label: 'Jaket Fleece/Polar Hijau Abu + Celana Pendek + Sepatu Gunung', tags: ['male', 'female', 'unisex'] },
    { id: 'Technical navy blue windbreaker raincoat paired with camouflage cargo pants and black hiking boots', label: 'Jaket Windbreaker Navy + Celana Kargo Loreng (Camo) + Sepatu Hiking', tags: ['male', 'female', 'unisex', 'hijab_approved'] },
  ]},
  { group: 'Edgy & Modern Minimalist', items: [
    { id: 'Punk rock outfit with studded leather jacket', label: 'Punk Rock Leather Jacket', tags: ['male', 'female', 'unisex'] },
    { id: 'Emo style outfit with band tee and arm warmers', label: 'Emo Band Tee', tags: ['male', 'female', 'unisex'] },
    { id: 'Heavy metal attire with denim battle vest', label: 'Metalhead Battle Vest', tags: ['male', 'female', 'unisex'] },
  ]},
  { group: 'Tradisional & Kultural', items: [
    { id: 'Indonesian Batik shirt', label: 'Kemeja Batik (Indonesia)', tags: ['male', 'female', 'unisex'] },
    { id: 'Long-sleeve Indonesian Batik shirt', label: 'Batik Lengan Panjang', tags: ['male', 'female', 'unisex', 'hijab_approved'] },
    { id: 'Indonesian Baju Koko (Muslim men shirt)', label: 'Baju Koko', tags: ['male'] },
    { id: 'Indonesian Kebaya traditional blouse', label: 'Kebaya Modern', tags: ['female'] },
    { id: 'Modest Indonesian Kebaya with long sleeves and covered chest', label: 'Kebaya Tertutup (Modest)', tags: ['female', 'hijab_approved'] },
    { id: 'Korean traditional Hanbok', label: 'Hanbok Korea', tags: ['male', 'female', 'hijab_approved'] },
    { id: 'Japanese Kimono', label: 'Kimono', tags: ['male', 'female', 'unisex', 'hijab_approved'] },
    { id: 'Chinese Cheongsam (Qipao) dress', label: 'Cheongsam / Qipao', tags: ['female'] },
  ]},
  { group: 'Seragam Spesifik & Maskapai', items: [
    { id: 'Indonesian TNI military uniform', label: 'Seragam Militer TNI', tags: ['male', 'female', 'unisex', 'hijab_approved'] },
    { id: 'Indonesian Polri police uniform', label: 'Seragam Polisi Polri', tags: ['male', 'female', 'unisex', 'hijab_approved'] },
    { id: 'Doctor wearing a white lab coat with a stethoscope around the neck', label: 'Dokter + Jas Putih & Stetoskop', tags: ['male', 'female', 'unisex', 'hijab_approved'] },
    { id: 'Commercial airline pilot uniform with epaulettes', label: 'Seragam Pilot', tags: ['male', 'female', 'hijab_approved'] },
    { id: 'Garuda Indonesia flight attendant uniform (Tosca green/orange kebaya top and batik skirt)', label: 'Pramugari Garuda Indonesia', tags: ['female'] },
    { id: 'Garuda Indonesia modest flight attendant uniform with long sleeves (Tosca green kebaya)', label: 'Pramugari Garuda (Modest/Hijab)', tags: ['female', 'hijab_approved'] },
    { id: 'AirAsia flight attendant uniform (Iconic red tailored blazer and white shirt)', label: 'Pramugari AirAsia (Red Blazer)', tags: ['female'] },
    { id: 'AirAsia modest flight attendant uniform (Long-sleeve red blazer and trousers)', label: 'Pramugari AirAsia (Modest/Hijab)', tags: ['female', 'hijab_approved'] },
  ]},
  { group: 'Hari Raya & Perayaan (Festive)', items: [
    { id: 'Elegant modest Muslim attire for Eid al-Fitr, beautiful Kaftan for women and stylish Baju Koko for men, pastel and earthy colors', label: 'Lebaran (Kaftan, Gamis, & Koko Elegan)', tags: ['male', 'female', 'unisex', 'hijab_approved'] },
    { id: 'Cozy matching Christmas sweaters (Festive Sweaters) in red and green hues', label: 'Natal Kasual (Matching Christmas Sweater)', tags: ['male', 'female', 'unisex', 'hijab_approved'] },
    { id: 'Traditional Chinese New Year attire, elegant red and gold Cheongsam and Tangzhuang jackets', label: 'Imlek (Cheongsam & Jas Tangzhuang)', tags: ['male', 'female', 'unisex', 'hijab_approved'] },
    { id: 'Traditional Balinese ceremonial attire for Galungan, beautiful Kebaya Bali with sash and Kamen', label: 'Galungan (Pakaian Adat Bali Lengkap)', tags: ['male', 'female', 'unisex', 'hijab_approved'] },
  ]},
];

// ─── HELPER FUNCTIONS ─────────────────────────────────────────────────────────

const getBgType = (bgId) => {
  for (const group of BACKGROUNDS) {
    for (const item of group.items) {
      if (item.id === bgId) return item.type || 'all';
    }
  }
  return 'all';
};

// FIX: pose match_bg_pose only shows when background is image_ref_bg
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
        if (gender === 'Wanita') {
          return isHijab ? item.tags.includes('hijab_approved') : (item.tags.includes('female') || item.tags.includes('unisex'));
        }
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

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function App() {
  const [outputFormat, setOutputFormat] = useState('json');
  const [generatedPrompt, setGeneratedPrompt] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [showSmartAlert, setShowSmartAlert] = useState(false);
  // FIX: use a ref to debounce alert so it doesn't flash multiple times
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

  // FIX: debounced alert — prevent multiple flashes in one operation
  const triggerSmartAlert = useCallback(() => {
    if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
    setShowSmartAlert(true);
    alertTimerRef.current = setTimeout(() => setShowSmartAlert(false), 3000);
  }, []);

  // ── Derived/filtered data (memoized) ──────────────────────────────────────

  const currentBgType = useMemo(() => getBgType(background), [background]);

  // FIX: memoized clothing groups to prevent infinite loop in useEffect
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

  // FIX: memoized accessory groups (includes dynamic hijab brooch / earring items)
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

  // FIX: proper useEffect (not React.useEffect), stable dependency via memoized groups
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
    if (newGender !== 'Wanita') {
      setUseHijab(false);
      newHijab = false;
      setAccessories(prev => prev.filter(a => !['Decorative hijab brooch', 'Small stud earrings', 'Dangling earrings'].includes(a)));
    }

    // FIX: validate clothing against the *new* gender state (not stale closure)
    if (!isClothingValidForGender(clothing, newGender, newHijab)) {
      setClothing('Original clothing from reference');
      triggerSmartAlert();
    }
  }, [useHijab, clothing, triggerSmartAlert]);

  const handleHijabChange = useCallback((e) => {
    const checked = e.target.checked;
    setUseHijab(checked);
    setAccessories(prev => prev.filter(a => !['Decorative hijab brooch', 'Small stud earrings', 'Dangling earrings'].includes(a)));

    // FIX: only reset clothing if it's actually incompatible, use current gender
    if (!isClothingValidForGender(clothing, gender, checked)) {
      setClothing('Original clothing from reference');
      triggerSmartAlert();
    }
  }, [clothing, gender, triggerSmartAlert]);

  const handleBgSelection = useCallback((newBg) => {
    setBackground(newBg);
    const newBgType = getBgType(newBg);
    let didReset = false;

    const filteredPoses = filterPosesByBg(newBg, newBgType);
    const validPoseIds = filteredPoses.flatMap(g => g.items.map(i => i.id));
    if (!validPoseIds.includes(pose)) {
      setPose(validPoseIds[0] || POSES[0].items[0].id);
      didReset = true;
    }

    const filteredLighting = filterOptionsByBg(LIGHTING_STYLES, newBgType);
    const validLightIds = filteredLighting.flatMap(g => g.items.map(i => i.id));
    if (!validLightIds.includes(lighting)) {
      setLighting(validLightIds[0] || LIGHTING_STYLES[0].items[0].id);
      didReset = true;
    }

    const filteredLenses = filterArrayByBg(CAMERA_LENSES, newBgType);
    const validLensIds = filteredLenses.map(l => l.id);
    if (!validLensIds.includes(cameraLens)) {
      setCameraLens(validLensIds[0] || CAMERA_LENSES[0].id);
      didReset = true;
    }

    // FIX: single alert for the whole batch of resets
    if (didReset) triggerSmartAlert();
  }, [pose, lighting, cameraLens, triggerSmartAlert]);

  const handleThemeChange = useCallback((e) => {
    const themeId = e.target.value;
    setColorTheme(themeId);
    const selectedTheme = COLOR_THEMES.find(t => t.id === themeId);
    if (selectedTheme?.colors) {
      setManualColor1(selectedTheme.colors[0]);
      setManualColor2(selectedTheme.colors[1]);
      setManualColor3(selectedTheme.colors[2] || selectedTheme.colors[0]);
    }
  }, []);

  const randomizeThemeColors = useCallback((themeId) => {
    const randHue = () => Math.floor(Math.random() * 360);
    let c1, c2, c3;
    switch (themeId) {
      case 'Monochrome color scheme': {
        const h = randHue();
        c1 = hslToHex(h, 80, 20); c2 = hslToHex(h, 80, 50); c3 = hslToHex(h, 80, 80); break;
      }
      case 'Complementary color scheme': {
        const h = randHue();
        c1 = hslToHex(h, 80, 50); c2 = hslToHex((h + 180) % 360, 80, 50); c3 = hslToHex(h, 10, 95); break;
      }
      case 'Analogous color scheme': {
        const h = randHue();
        c1 = hslToHex(h, 80, 50); c2 = hslToHex((h + 30) % 360, 80, 50); c3 = hslToHex((h + 330) % 360, 80, 50); break;
      }
      case 'Pastel color palette':
        c1 = hslToHex(randHue(), 70, 85); c2 = hslToHex(randHue(), 70, 85); c3 = hslToHex(randHue(), 70, 85); break;
      case 'Vibrant Neon color palette': {
        const neons = [300, 180, 280, 60, 120, 15];
        const n = () => hslToHex(neons[Math.floor(Math.random() * neons.length)], 100, 50);
        c1 = n(); c2 = n(); c3 = n(); break;
      }
      case 'Earth tones color palette': {
        const e = () => hslToHex(20 + Math.random() * 30, 30 + Math.random() * 30, 20 + Math.random() * 40);
        c1 = e(); c2 = e(); c3 = e(); break;
      }
      case 'Jewel tones color palette': {
        const jewels = [350, 160, 240, 20, 280];
        const j = () => hslToHex(jewels[Math.floor(Math.random() * jewels.length)], 90, 35);
        c1 = j(); c2 = j(); c3 = j(); break;
      }
      default:
        c1 = hslToHex(randHue(), 70, 50); c2 = hslToHex(randHue(), 70, 50); c3 = hslToHex(randHue(), 70, 50);
    }
    setManualColor1(c1); setManualColor2(c2); setManualColor3(c3);
  }, []);

  const toggleAccessory = useCallback((id) => {
    setAccessories(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  }, []);

  // FIX: use navigator.clipboard instead of deprecated execCommand
  const handleCopy = useCallback(async () => {
    if (!generatedPrompt) return;
    const textToCopy = outputFormat === 'json' ? generatedPrompt.json : generatedPrompt.structured;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // graceful fallback for older environments
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
    } catch (err) {
      console.error('Failed to copy:', err);
    }
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

    promptText += 'STRICT FACIAL CONSISTENCY MODE: Prioritize the exact facial features, identity, and core facial structure from the provided **Face Reference Image** for all generations. Maintain the primary subject\'s identity accurately while adapting the pose, lighting, and background. Do not alter the core facial structure. ';
    promptText += `\nSubject: Single Subject (${gender === 'Pria' ? 'Male' : gender === 'Wanita' ? 'Female' : 'Androgynous/Unisex'}). `;
    promptText += '\n[ENTITY COUNT VALIDATION]: CRITICAL: There MUST be EXACTLY ONE person in the final image. NO extra background characters, NO clones. ';

    if (bodyType !== BODY_TYPES[0].id) promptText += `Body Type: ${bodyType}. `;
    if (accessoriesString !== 'None') promptText += `Accessories: ${accessoriesString}. `;
    if (facialHair !== FACIAL_HAIR[0].id && gender !== 'Wanita') promptText += `Facial Hair: ${facialHair}. `;
    promptText += `Facial Expression: ${expression}. `;
    if (makeup !== MAKEUP_STYLES[0].id) promptText += `Makeup & Face Details: ${makeup}. `;

    if (useClothingReference) {
      promptText += 'Clothing & Attire: EXACTLY match the clothing style, layering, and silhouette shown in the provided **Secondary Style Reference Image**. ';
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
      promptText += 'Background, Lighting & Camera Angle: EXACTLY match the environment, lighting conditions, and camera perspective shown in the provided **Background Reference Image**. ';
      promptText += '\n[CRITICAL IDENTITY OVERRIDE]: Do NOT copy the face from the Background Reference Image. The generated face MUST flawlessly match **Image 1: Face Reference**. Image 3 is ONLY for the environment. ';
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
          if (lighting.includes('Golden Hour Backlighting')) promptText += '(CRITICAL: Ensure strong, warm rim light highlighting the subject\'s hair and shoulders). ';
          if (lighting.toLowerCase().includes('softbox') || lighting.toLowerCase().includes('ring light')) {
            promptText += '\n(CRITICAL INSTRUCTION: Do NOT render or show any physical lighting equipment, softboxes, umbrellas, or light stands in the frame. Only render the lighting EFFECT on the subjects and environment).';
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
      promptText += '\nLayout Instruction: The 2x2 grid must show the EXACT SAME person and style from 4 different angles: Top-Left (Front view), Top-Right (Left Profile), Bottom-Left (Right Profile), Bottom-Right (Back of head).';
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
        color_palette: useClothingReference
          ? 'N/A (Using External Reference)'
          : (colorTheme === 'Original colors' ? 'Original colors' : `${colorTheme === 'Manual' ? 'Manual Palette' : colorTheme} (${manualColor1}, ${manualColor2}, ${manualColor3})`),
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
    // FIX: reset output format to json on each new generate so user sees fresh output
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

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 font-sans p-4 md:p-8">

      {showSmartAlert && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-indigo-600/90 backdrop-blur-sm border border-indigo-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50">
          <Cpu className="w-5 h-5 text-indigo-200" />
          <span className="text-sm font-medium">Logika Cerdas Aktif: Pilihan yang tidak cocok otomatis direset.</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">

        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-neutral-800">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent flex items-center gap-2">
              <Camera className="w-8 h-8 text-indigo-500" />
              AI Professional Studio
            </h1>
            <p className="text-neutral-400 mt-1">Context-Aware Prompts dengan Dukungan Logika Pintar.</p>
          </div>
          <div className="flex items-center gap-2 bg-neutral-800 px-4 py-2 rounded-full text-sm border border-neutral-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-neutral-300">Strict Facial Consistency: <strong className="text-emerald-400">ON</strong></span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT — Controls */}
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
                    <input type="checkbox" checked={useHijab} onChange={handleHijabChange} className="rounded text-indigo-500 bg-neutral-800 border-neutral-600 focus:ring-indigo-500" />
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
                      {[0, 1, 2, 3].map(idx => (
                        <div key={idx} className="space-y-1">
                          <label className="text-xs text-neutral-500">Panel {idx + 1}</label>
                          <select value={hijabs[idx]} onChange={e => { const nh = [...hijabs]; nh[idx] = e.target.value; setHijabs(nh); }} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none">
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
                        {[0, 1, 2, 3].map(idx => (
                          <div key={idx} className="space-y-1">
                            <label className="text-xs text-neutral-500">Panel {idx + 1}</label>
                            <select value={hairstyles[idx]} onChange={e => { const ns = [...hairstyles]; ns[idx] = e.target.value; setHairstyles(ns); }} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none">
                              {(HAIRSTYLES[gender] || HAIRSTYLES['Unisex']).map(h => <option key={h} value={h}>{h}</option>)}
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
                      <select value={color1} onChange={e => setColor1(e.target.value)} className="bg-neutral-800 border border-neutral-600 rounded-lg p-2 text-xs">{BASE_COLORS.map(c => <option key={c} value={c}>{c}</option>)}</select>
                      {(colorType.includes('Two') || colorType.includes('Tri') || colorType === 'Highlight') && (
                        <select value={color2} onChange={e => setColor2(e.target.value)} className="bg-neutral-800 border border-neutral-600 rounded-lg p-2 text-xs">{BASE_COLORS.map(c => <option key={c} value={c}>{c}</option>)}</select>
                      )}
                      {colorType.includes('Tri') && (
                        <select value={color3} onChange={e => setColor3(e.target.value)} className="bg-neutral-800 border border-neutral-600 rounded-lg p-2 text-xs">{BASE_COLORS.map(c => <option key={c} value={c}>{c}</option>)}</select>
                      )}
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
                  <button key={ag.group} onClick={() => setAccCategory(ag.group)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${accCategory === ag.group ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200'}`}>
                    {ag.group}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                {dynamicAccessoryGroups.find(g => g.group === accCategory)?.items.map(item => (
                  <label key={item.id} className="flex items-center gap-2 text-sm bg-neutral-900 p-2 rounded-lg border border-neutral-700 cursor-pointer hover:border-pink-500/50 transition-colors">
                    <input type="checkbox" checked={accessories.includes(item.id)} onChange={() => toggleAccessory(item.id)} className="rounded text-pink-500 bg-neutral-800 border-neutral-600 focus:ring-pink-500 focus:ring-offset-neutral-900" />
                    <span className="text-neutral-300 select-none text-xs leading-tight">{item.label}</span>
                  </label>
                ))}
              </div>
              <div className="space-y-2 pt-2 border-t border-neutral-800">
                <label className="text-sm font-medium text-neutral-400 flex items-center gap-2">
                  <Watch className="w-4 h-4" /> Jam Tangan Mewah
                </label>
                <select value={watch} onChange={e => setWatch(e.target.value)} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-pink-500 outline-none">
                  {LUXURY_WATCHES.map(w => <option key={w.id} value={w.id}>{w.label}</option>)}
                </select>
              </div>
            </div>

            {/* Background */}
            <div className="space-y-4 pt-4 border-t border-neutral-700">
              <div className="flex items-center gap-2 text-indigo-400 font-medium">
                <ImageIcon className="w-5 h-5" /> Latar & Pakaian
              </div>
              <div className="flex flex-wrap gap-2">
                {BACKGROUNDS.map(bg => (
                  <button key={bg.group} onClick={() => setBgCategory(bg.group)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${bgCategory === bg.group ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200'}`}>
                    {bg.group}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                {BACKGROUNDS.find(g => g.group === bgCategory)?.items.map(item => (
                  <button key={item.id} onClick={() => handleBgSelection(item.id)} className={`text-left px-3 py-2.5 rounded-lg text-xs leading-tight transition-colors border ${background === item.id ? 'bg-indigo-500/20 border-indigo-500 text-indigo-200 shadow-inner' : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-indigo-500/50 hover:text-neutral-200'}`}>
                    {item.label}
                  </button>
                ))}
              </div>
              {background === 'custom_bg' && (
                <input type="text" value={customBackground} onChange={e => setCustomBackground(e.target.value)} placeholder="Ketik lokasi dalam B.Inggris (contoh: magical forest with glowing mushrooms...)" className="w-full bg-neutral-900 border border-indigo-500/50 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-white placeholder:text-neutral-400" />
              )}
              {background === 'image_ref_bg' && (
                <div className="p-3 bg-indigo-900/40 border border-indigo-500/50 rounded-lg">
                  <p className="text-xs text-indigo-200">📸 <strong>Mode Referensi Latar Aktif:</strong> Lensa dan Cahaya akan mengikuti gambar latar. Anda tetap bisa <strong>mengatur Pose secara manual</strong>. AI telah diatur untuk tidak meniru wajah dari gambar latar.</p>
                </div>
              )}

              {/* Clothing */}
              <div className="bg-indigo-900/20 border border-indigo-900/50 rounded-xl p-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={useClothingReference} onChange={e => setUseClothingReference(e.target.checked)} className="rounded text-indigo-500 bg-neutral-800 border-neutral-600 focus:ring-indigo-500 w-5 h-5 cursor-pointer mt-0.5" />
                  <div>
                    <span className="text-neutral-200 font-medium group-hover:text-indigo-400 transition-colors flex items-center gap-2">
                      <Layers className="w-4 h-4" /> Gunakan Referensi Pakaian Eksternal
                    </span>
                    <p className="text-xs text-indigo-400/80 mt-1 leading-relaxed">Pakaian subjek mengikuti persis seperti gambar inspirasi lain yang diunggah ke AI Generator.</p>
                  </div>
                </label>
              </div>

              {!useClothingReference && (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {dynamicClothingGroups.map(cg => (
                      <button key={cg.group} onClick={() => setClothCategory(cg.group)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${clothCategory === cg.group ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200'}`}>
                        {cg.group}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                    {dynamicClothingGroups.find(g => g.group === clothCategory)?.items.map(item => (
                      <button key={item.id} onClick={() => setClothing(item.id)} className={`text-left px-3 py-2.5 rounded-lg text-xs leading-tight transition-colors border ${clothing === item.id ? 'bg-indigo-500/20 border-indigo-500 text-indigo-200 shadow-inner' : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-indigo-500/50 hover:text-neutral-200'}`}>
                        {item.label}
                      </button>
                    ))}
                  </div>
                  {useHijab && <p className="text-[10px] text-indigo-400/80">✨ Hijab aktif: Menampilkan Modest fashion / Hijab approved.</p>}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`space-y-2 ${useClothingReference ? 'md:col-span-2' : ''}`}>
                  <label className="text-sm font-medium text-neutral-400">Bahan Kain</label>
                  <select value={clothingMaterial} onChange={e => setClothingMaterial(e.target.value)} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                    {CLOTHING_MATERIALS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                  </select>
                </div>
                <div className={`space-y-2 ${useClothingReference ? 'opacity-50 pointer-events-none' : ''}`}>
                  <label className="text-sm font-medium text-neutral-400">Tema Warna Pakaian</label>
                  <select value={colorTheme} onChange={handleThemeChange} disabled={useClothingReference} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                    {COLOR_THEMES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                </div>
              </div>

              {colorTheme !== 'Original colors' && !useClothingReference && (
                <div className="flex items-center gap-4 bg-neutral-800/50 p-3 rounded-lg border border-neutral-700">
                  <div className="flex gap-3">
                    <input type="color" value={manualColor1} onChange={e => { setManualColor1(e.target.value); setColorTheme('Manual'); }} className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0" title="Warna 1" />
                    <input type="color" value={manualColor2} onChange={e => { setManualColor2(e.target.value); setColorTheme('Manual'); }} className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0" title="Warna 2" />
                    <input type="color" value={manualColor3} onChange={e => { setManualColor3(e.target.value); setColorTheme('Manual'); }} className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0" title="Warna 3" />
                  </div>
                  <button onClick={() => randomizeThemeColors(colorTheme)} className="p-2.5 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-indigo-400 hover:text-indigo-300 transition-colors" title="Acak Variasi Warna Tema">
                    <RefreshCcw className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] text-neutral-400 leading-tight">
                    {colorTheme === 'Manual' ? 'Pilih 3 warna dominan secara manual.' : 'Klik warna untuk mengubah, atau tekan "Acak" untuk variasi baru.'}
                  </span>
                </div>
              )}
            </div>

            {/* Photography */}
            {viewMode === '1-photo' && (
              <div className={`space-y-4 p-5 rounded-xl border transition-all duration-300 ${background === 'image_ref_bg' ? 'bg-indigo-950/40 border-indigo-500/30' : 'bg-indigo-900/10 border-indigo-900/40'}`}>
                <div className="flex items-center gap-2 text-indigo-400 font-semibold border-b border-indigo-900/50 pb-2">
                  <Camera className="w-5 h-5" /> Fotografi (Smart Filter Aktif)
                </div>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-400">Tema Shoot</label>
                    <select value={shootStyle} onChange={e => setShootStyle(e.target.value)} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                      {SHOOT_STYLES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-400">Komposisi Bingkai</label>
                    <select value={composition} onChange={e => setComposition(e.target.value)} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                      {COMPOSITIONS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-indigo-300">Lensa Kamera</label>
                      <select disabled={background === 'image_ref_bg'} value={background === 'image_ref_bg' ? '' : cameraLens} onChange={e => setCameraLens(e.target.value)} className="w-full bg-indigo-950/30 border border-indigo-800 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed">
                        {background === 'image_ref_bg' ? <option>🔒 Mengikuti Latar</option> : dynamicLenses.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-indigo-300">Sudut & Pose</label>
                      <select value={pose} onChange={e => setPose(e.target.value)} className="w-full bg-indigo-950/30 border border-indigo-800 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-indigo-100">
                        {dynamicPoses.map(group => (
                          <optgroup key={group.group} label={`--- ${group.group} ---`}>
                            {group.items.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-indigo-300">Pencahayaan Artistik</label>
                    <select disabled={background === 'image_ref_bg'} value={background === 'image_ref_bg' ? '' : lighting} onChange={e => setLighting(e.target.value)} className="w-full bg-indigo-950/30 border border-indigo-800 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed">
                      {background === 'image_ref_bg' ? <option>🔒 Mengikuti Latar</option> : dynamicLighting.map(group => (
                        <optgroup key={group.group} label={`--- ${group.group} ---`}>
                          {group.items.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
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

          {/* RIGHT — Output */}
          <div className="lg:col-span-6 flex flex-col h-[calc(100vh-140px)] bg-neutral-950 rounded-2xl border border-neutral-800 relative overflow-hidden">
            {!generatedPrompt && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-4 max-w-sm mx-auto p-6">
                <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-neutral-800 shadow-xl">
                  <Scan className="w-10 h-10 text-neutral-600" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-300">Menunggu Generate</h3>
                <p className="text-sm text-neutral-500">Sesuaikan parameter di panel kiri lalu klik tombol Generate. Output JSON/Teks siap disalin ke AI Image Generator.</p>
              </div>
            )}
            {generatedPrompt && (
              <div className="w-full h-full flex flex-col">
                <div className="flex items-center bg-neutral-900 border-b border-neutral-800 p-2 gap-2">
                  <button onClick={() => setOutputFormat('json')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${outputFormat === 'json' ? 'bg-neutral-800 text-indigo-400 shadow-sm' : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/50'}`}>
                    <FileJson className="w-4 h-4" /> JSON Format
                  </button>
                  <button onClick={() => setOutputFormat('structured')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${outputFormat === 'structured' ? 'bg-neutral-800 text-emerald-400 shadow-sm' : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/50'}`}>
                    <FileText className="w-4 h-4" /> Structured Text
                  </button>
                </div>
                <div className="flex-1 overflow-hidden relative">
                  <pre className="p-5 w-full h-full overflow-auto text-sm font-mono whitespace-pre-wrap break-words leading-relaxed custom-scrollbar text-neutral-300">
                    {outputFormat === 'json'
                      ? <span className="text-pink-300">{generatedPrompt.json}</span>
                      : <span className="text-emerald-200">{generatedPrompt.structured}</span>}
                  </pre>
                  <button onClick={handleCopy} className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-indigo-900/50 z-20">
                    {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {isCopied ? 'Copied!' : 'Copy Prompt'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      ` }} />
    </div>
  );
}
