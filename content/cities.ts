import type { Bi } from "./i18n";

// The cities and regions Murtahil covers, in the order the site lists them (Riyadh first).
// `id` is the city’s id in the web app (?city=<id>) and the name of its landmark drawing.
// Counts come from each city's backend: its README, its data files or the live API the apps use
// (Riyadh and Istanbul lines from /mtrlines, /buslines and friends; Istanbul stops are physical stops
// on active routes, ferry piers counted once per name; Doha lines from /lines, stops from its README).
// Leave `facts` empty rather than guess.

export type CountryCode = "SA" | "BH" | "QA" | "TR" | "EG" | "SY";

export type Mode =
  | "metro" | "bus" | "brt" | "suburban" | "highspeed" | "tram" | "ferry" | "funicular"
  | "cablecar" | "airport" | "servees" | "monorail" | "lrt" | "microbus";

/** Where a time comes from. Every time in the apps carries one of these labels. */
export type TimeKind = "live" | "predicted" | "scheduled" | "estimated";

export type City = {
  id: string;
  country: CountryCode;
  name: Bi;
  modes: Mode[];
  times: TimeKind[];
  /** Live times only in the phone apps (the web app shows the other kinds). */
  liveInAppsOnly?: boolean;
  summary: Bi;
  facts: { value: string; label: Bi }[];
  /** What the drawing shows (its alt text). */
  landmarks: Bi;
};

export const countries: Record<CountryCode, Bi> = {
  SA: { en: "Saudi Arabia", ar: "السعودية", tr: "Suudi Arabistan" },
  BH: { en: "Bahrain", ar: "البحرين", tr: "Bahreyn" },
  QA: { en: "Qatar", ar: "قطر", tr: "Katar" },
  TR: { en: "Türkiye", ar: "تركيا", tr: "Türkiye" },
  EG: { en: "Egypt", ar: "مصر", tr: "Mısır" },
  SY: { en: "Syria", ar: "سوريا", tr: "Suriye" },
};

export const modeNames: Record<Mode, Bi> = {
  metro: { en: "Metro", ar: "مترو", tr: "Metro" },
  bus: { en: "Bus", ar: "حافلات", tr: "Otobüs" },
  brt: { en: "Rapid bus", ar: "حافلات سريعة", tr: "Metrobüs" },
  suburban: { en: "Suburban rail", ar: "قطار الضواحي", tr: "Banliyö treni" },
  highspeed: { en: "High-speed rail", ar: "قطار سريع", tr: "Hızlı tren" },
  tram: { en: "Tram", ar: "ترام", tr: "Tramvay" },
  ferry: { en: "Ferry", ar: "عبّارات", tr: "Vapur" },
  funicular: { en: "Funicular", ar: "قطار جبلي", tr: "Füniküler" },
  cablecar: { en: "Cable car", ar: "تلفريك", tr: "Teleferik" },
  airport: { en: "Airport shuttle", ar: "حافلات المطار", tr: "Havalimanı servisi" },
  servees: { en: "Servees", ar: "سرافيس", tr: "Dolmuş" },
  monorail: { en: "Monorail", ar: "مونوريل", tr: "Monoray" },
  lrt: { en: "Light rail", ar: "قطار خفيف", tr: "Hafif raylı" },
  microbus: { en: "Microbus", ar: "ميكروباص", tr: "Mikrobüs" },
};

export const cities: City[] = [
  {
    id: "riyadh",
    country: "SA",
    name: { en: "Riyadh", ar: "الرياض", tr: "Riyad" },
    modes: ["metro", "bus", "brt"],
    times: ["live"],
    summary: {
      en: "All six metro lines and the city’s buses, including the rapid bus lines, with live departures and service alerts.",
      ar: "مسارات المترو الستة وحافلات المدينة، ومنها خطوط الحافلات السريعة، مع مواعيد مغادرة مباشرة وتنبيهات الخدمة.",
      tr: "Altı metro hattının tamamı ve metrobüs hatları dahil şehir otobüsleri; canlı kalkışlar ve hizmet uyarılarıyla.",
    },
    facts: [
      { value: "6", label: { en: "metro lines", ar: "مسارات المترو", tr: "metro hattı" } },
      { value: "86", label: { en: "bus lines", ar: "خطوط الحافلات", tr: "otobüs hattı" } },
      { value: "2,730", label: { en: "stations", ar: "المحطات", tr: "istasyon ve durak" } },
    ],
    landmarks: {
      en: "The Kingdom Centre, Al Faisaliah Tower, Masmak Fort and the Riyadh Metro",
      ar: "برج المملكة، وبرج الفيصلية، وقصر المصمك، ومترو الرياض",
      tr: "Kingdom Centre, Al Faisaliah Kulesi, Mismak Kalesi ve Riyad Metrosu",
    },
  },
  {
    id: "haramayn",
    country: "SA",
    name: { en: "Jeddah, Makkah and Medina", ar: "جدة ومكة والمدينة", tr: "Cidde, Mekke ve Medine" },
    modes: ["bus", "highspeed"],
    times: ["live", "scheduled", "estimated"],
    liveInAppsOnly: true,
    summary: {
      en: "Buses in all three cities and the Haramain High Speed Railway between them, so one journey can cross cities by train.",
      ar: "الحافلات في المدن الثلاث، وقطار الحرمين السريع بينها، فتعبر الرحلة الواحدة من مدينة إلى أخرى بالقطار.",
      tr: "Üç şehrin otobüsleri ve aralarındaki Haremeyn Hızlı Treni; tek bir yolculuk trenle şehirden şehre geçebilir.",
    },
    facts: [
      { value: "43", label: { en: "bus lines", ar: "خطوط الحافلات", tr: "otobüs hattı" } },
      { value: "5", label: { en: "railway stations", ar: "محطات القطار", tr: "tren istasyonu" } },
      { value: "1,093", label: { en: "bus stations", ar: "المحطات", tr: "otobüs durağı" } },
    ],
    landmarks: {
      en: "King Fahd’s Fountain, the Abraj Al-Bait Clock Tower and Masjid an-Nabawi",
      ar: "نافورة الملك فهد، وأبراج البيت، والمسجد النبوي",
      tr: "Kral Fahd Fıskiyesi, Mekke Saat Kulesi ve Mescid-i Nebevi",
    },
  },
  {
    id: "eastern",
    country: "SA",
    name: { en: "Eastern Province", ar: "المنطقة الشرقية", tr: "Doğu Bölgesi" },
    modes: ["bus"],
    times: ["live", "estimated"],
    liveInAppsOnly: true,
    summary: {
      en: "SAPTCO’s bus networks in Dammam, Al Khobar, Dhahran and Qatif, and in Al-Ahsa.",
      ar: "شبكتا حافلات سابتكو في الدمام والخبر والظهران والقطيف، وفي الأحساء.",
      tr: "SAPTCO’nun Dammam, Hubar, Zahran ve Katif’teki ve Ahsa’daki otobüs ağları.",
    },
    facts: [
      { value: "20", label: { en: "bus lines", ar: "خطوط الحافلات", tr: "otobüs hattı" } },
      { value: "474", label: { en: "stations", ar: "المحطات", tr: "durak" } },
    ],
    landmarks: {
      en: "Souq Al-Qaysariyah, Ithra and the Khobar Water Tower",
      ar: "سوق القيصرية، وإثراء، وبرج الخبر المائي",
      tr: "Kaysariye Çarşısı, Ithra ve Hubar Su Kulesi",
    },
  },
  {
    id: "bahrain",
    country: "BH",
    name: { en: "Bahrain", ar: "البحرين", tr: "Bahreyn" },
    modes: ["bus"],
    times: ["live", "scheduled"],
    liveInAppsOnly: true,
    summary: {
      en: "Every Bahrain Bus trip from the official timetables, with fares in dinars and the GO Card daily cap.",
      ar: "كل رحلات حافلات البحرين من الجداول الرسمية، مع الأجرة بالدينار وسقف بطاقة GO اليومي.",
      tr: "Resmî tarifelerden Bahreyn otobüslerinin tüm seferleri; dinar cinsinden ücretler ve GO Card günlük tavanıyla.",
    },
    facts: [
      { value: "39", label: { en: "bus lines", ar: "خطوط الحافلات", tr: "otobüs hattı" } },
      { value: "703", label: { en: "stops", ar: "المواقف", tr: "durak" } },
    ],
    landmarks: {
      en: "The Sakhir Tower, the Bahrain Financial Harbour towers, the Bahrain World Trade Center and the Four Seasons Bahrain Bay",
      ar: "برج الصخير، وأبراج مرفأ البحرين المالي، ومركز البحرين التجاري العالمي، وفندق فور سيزونز خليج البحرين",
      tr: "Sakhir Kulesi, Bahreyn Finans Limanı kuleleri, Bahreyn Dünya Ticaret Merkezi ve Four Seasons Bahrain Bay",
    },
  },
  {
    id: "doha",
    country: "QA",
    name: { en: "Doha", ar: "الدوحة", tr: "Doha" },
    modes: ["metro", "tram", "bus"],
    times: ["scheduled", "estimated"],
    summary: {
      en: "All three Doha Metro lines, the Lusail, Education City and Msheireb trams, Karwa’s buses and the MetroLink buses that feed the stations.",
      ar: "خطوط مترو الدوحة الثلاثة، وترام لوسيل وترام المدينة التعليمية وترام مشيرب، وحافلات كروة، وحافلات مترولينك المغذّية للمحطات.",
      tr: "Doha Metrosu’nun üç hattının tamamı, Lusail, Eğitim Şehri ve Msheireb tramvayları, Karwa otobüsleri ve istasyonlara bağlanan MetroLink otobüsleri.",
    },
    facts: [
      { value: "10", label: { en: "metro and tram lines", ar: "خطوط المترو والترام", tr: "metro ve tramvay hattı" } },
      { value: "137", label: { en: "bus and MetroLink lines", ar: "خطوط الحافلات ومترولينك", tr: "otobüs ve MetroLink hattı" } },
      { value: "3,096", label: { en: "stations", ar: "المحطات", tr: "istasyon ve durak" } },
    ],
    landmarks: {
      en: "Al-Zubara Fort, the spiral minaret of the Fanar, Souq Waqif and the Katara Towers",
      ar: "قلعة الزبارة، ومئذنة الفنار الحلزونية، وسوق واقف، وأبراج كتارا",
      tr: "Zubara Kalesi, Fanar’ın sarmal minaresi, Vakıf Çarşısı ve Katara Kuleleri",
    },
  },
  {
    id: "istanbul",
    country: "TR",
    name: { en: "Istanbul", ar: "إسطنبول", tr: "İstanbul" },
    modes: ["metro", "tram", "suburban", "funicular", "cablecar", "brt", "ferry", "airport", "bus"],
    times: ["live", "predicted", "scheduled"],
    summary: {
      en: "Rail, road and sea, from Marmaray to the Bosphorus ferries. Bus arrivals are predicted from how buses actually move at that hour.",
      ar: "على السكك والطرق وفي البحر، من مرمراي إلى عبّارات البوسفور. ومواعيد وصول الحافلات متوقّعة من حركتها الفعلية في تلك الساعة.",
      tr: "Raylı sistem, kara yolu ve deniz; Marmaray’dan Boğaz vapurlarına. Otobüs varışları, otobüslerin o saatte gerçekte nasıl hareket ettiğinden tahmin edilir.",
    },
    facts: [
      { value: "11", label: { en: "metro lines", ar: "خطوط المترو", tr: "metro hattı" } },
      { value: "12", label: { en: "airport shuttle lines", ar: "خطوط حافلات المطار", tr: "havalimanı servis hattı" } },
      { value: "77", label: { en: "ferry lines", ar: "خطوط العبّارات", tr: "vapur hattı" } },
      { value: "778", label: { en: "bus lines", ar: "خطوط الحافلات", tr: "otobüs hattı" } },
      { value: "14", label: { en: "tram, rail, funicular and cable car lines", ar: "خطوط الترام والقطار والقطار الجبلي والتلفريك", tr: "tramvay, banliyö, füniküler ve teleferik hattı" } },
      { value: "14,440", label: { en: "stations", ar: "المحطات", tr: "istasyon ve durak" } },
    ],
    landmarks: {
      en: "The Blue Mosque, Galata Tower, a nostalgic tram and the Bosphorus Bridge",
      ar: "الجامع الأزرق، وبرج غلطة، والترام التاريخي، وجسر البوسفور",
      tr: "Sultanahmet Camii, Galata Kulesi, nostaljik tramvay ve Boğaz Köprüsü",
    },
  },
  {
    id: "ankara",
    country: "TR",
    name: { en: "Ankara", ar: "أنقرة", tr: "Ankara" },
    modes: ["metro", "suburban", "bus"],
    times: ["live", "scheduled"],
    summary: {
      en: "Metro lines M1 and M4, Ankaray, Başkentray and EGO’s buses, with live bus arrivals.",
      ar: "خطا المترو M1 وM4، وأنقاراي، وباشكنتراي، وحافلات EGO، مع مواعيد وصول مباشرة للحافلات.",
      tr: "M1 ve M4 metro hatları, Ankaray, Başkentray ve EGO otobüsleri; canlı otobüs varışlarıyla.",
    },
    facts: [
      { value: "445", label: { en: "bus lines", ar: "خطوط الحافلات", tr: "otobüs hattı" } },
      { value: "10,810", label: { en: "stops", ar: "المواقف", tr: "durak" } },
    ],
    landmarks: {
      en: "YDA Center, Atakule, Kocatepe Mosque and the Clock Tower",
      ar: "مركز YDA، وبرج أتاكوله، وجامع كوجاتبه، وبرج الساعة",
      tr: "YDA Center, Atakule, Kocatepe Camii ve Saat Kulesi",
    },
  },
  {
    id: "cairo",
    country: "EG",
    name: { en: "Cairo", ar: "القاهرة", tr: "Kahire" },
    modes: ["metro", "lrt", "monorail", "brt", "bus", "microbus"],
    times: ["live", "estimated"],
    liveInAppsOnly: true,
    summary: {
      en: "Metro lines 1 to 3, the LRT, the monorail, the Ring Road BRT, public buses and microbuses, with fares in pounds.",
      ar: "خطوط المترو من الأول إلى الثالث، والقطار الخفيف، والمونوريل، والأتوبيس الترددي على الطريق الدائري، والأتوبيسات والميكروباص، مع الأجرة بالجنيه.",
      tr: "1, 2 ve 3 numaralı metro hatları, hafif raylı sistem, monoray, Çevre Yolu metrobüsü, halk otobüsleri ve mikrobüsler; ücretler Mısır lirası cinsinden.",
    },
    facts: [
      { value: "1,091", label: { en: "lines", ar: "الخطوط", tr: "hat" } },
      { value: "3,955", label: { en: "stops", ar: "المواقف", tr: "durak" } },
    ],
    landmarks: {
      en: "The Great Pyramid of Giza, a felucca on the Nile, the Cairo Tower, Al-Azhar Mosque and the Baron Empain Palace",
      ar: "الهرم الأكبر، وفلوكة على النيل، وبرج القاهرة، والجامع الأزهر، وقصر البارون",
      tr: "Giza’daki Büyük Piramit, Nil’de bir feluka, Kahire Kulesi, Ezher Camii ve Baron Empain Sarayı",
    },
  },
  {
    id: "damascus",
    country: "SY",
    name: { en: "Damascus", ar: "دمشق", tr: "Şam" },
    modes: ["servees", "bus"],
    times: ["estimated"],
    summary: {
      en: "Servees and bus lines from community-mapped routes, with the spots where you can wave one down.",
      ar: "خطوط السرافيس والباصات من مسارات رسمها المساهمون، مع الأماكن التي يمكنك أن تلوّح فيها للسرفيس.",
      tr: "Topluluğun haritaladığı güzergâhlardan dolmuş ve otobüs hatları; el kaldırıp binebileceğiniz noktalarla.",
    },
    facts: [
      { value: "38", label: { en: "lines", ar: "الخطوط", tr: "hat" } },
      { value: "1,314", label: { en: "boarding points", ar: "نقاط الصعود", tr: "biniş noktası" } },
    ],
    landmarks: {
      en: "The Umayyad Mosque, Mount Qasioun and the Damascene Sword",
      ar: "الجامع الأموي، وجبل قاسيون، والسيف الدمشقي",
      tr: "Emevi Camii, Kasiyun Dağı ve Şam Kılıcı",
    },
  },
  {
    id: "hama",
    country: "SY",
    name: { en: "Hama", ar: "حماة", tr: "Hama" },
    modes: ["servees"],
    times: ["estimated"],
    summary: {
      en: "Servees lines across the city, from community-mapped routes.",
      ar: "خطوط السرافيس في أنحاء المدينة، من مسارات رسمها المساهمون.",
      tr: "Topluluğun haritaladığı güzergâhlardan, şehrin dört bir yanındaki dolmuş hatları.",
    },
    facts: [
      { value: "14", label: { en: "servees lines", ar: "خطوط السرافيس", tr: "dolmuş hattı" } },
      { value: "249", label: { en: "boarding points", ar: "نقاط الصعود", tr: "biniş noktası" } },
    ],
    landmarks: { en: "The norias of Hama", ar: "نواعير حماة", tr: "Hama’nın su çarkları" },
  },
];
