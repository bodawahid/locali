export function detectIntent(message = '') {
    const t = message.toLowerCase();
    if (/train|rail|sleeper|قطار|رamses|رمسes|sleeping car/i.test(t)) return 'trains';
    if (/hotel|فندق|hostel|accommodation|إقامة|stay|resort/i.test(t)) return 'hotels';
    if (/restaurant|مطعم|food|eat|menu|meal|أكل|فطار|غدا|عشا/i.test(t)) return 'restaurants';
    if (/scam|نصب|احتيال|safe|أمان|danger|trap/i.test(t)) return 'safety';
    if (/taxi|bus|transfer|transport|مواصلات|تاكسي|careem|uber|airport|مطار|go bus|ferry|felucca/i.test(t)) return 'transport';
    if (/price|cost|how much|سعر|بكام|كام|egp|جنيه|currency|عملة/i.test(t)) return 'prices';
    if (/أعمل إيه|what should i|what do i|help me/i.test(t)) return 'urgent';
    return 'general';
}

export function detectCity(text = '') {
    const t = text.toLowerCase();
    const map = {
        'sharm': 'sharm-el-sheikh',
        'شرم': 'sharm-el-sheikh',
        hurghada: 'hurghada',
        'الغردقة': 'hurghada',
        'gouna': 'el-gouna',
        'el gouna': 'el-gouna',
        'الجونة': 'el-gouna',
        luxor: 'luxor',
        'الأقصر': 'luxor',
        'اقصر': 'luxor',
        aswan: 'aswan',
        'أسوان': 'aswan',
        cairo: 'cairo',
        'القاهرة': 'cairo',
        'giza': 'giza',
        'الجيزة': 'giza',
        'pyramid': 'giza',
        'pyramids': 'giza',
        alexandria: 'alexandria',
        'alex': 'alexandria',
        'الإسكندرية': 'alexandria',
        'اسكندرية': 'alexandria',
        'port said': 'port-said',
        'بورسعيد': 'port-said',
        ismailia: 'ismailia',
        'الإسماعيلية': 'ismailia',
        suez: 'suez',
        'السويس': 'suez',
        fayoum: 'fayoum',
        'الفيوم': 'fayoum',
        siwa: 'siwa',
        'سيوة': 'siwa',
        matruh: 'marsa-matruh',
        'marsa matruh': 'marsa-matruh',
        'مرسى مطروح': 'marsa-matruh',
        dahab: 'dahab',
        'دهب': 'dahab',
        taba: 'taba',
        'طابا': 'taba',
        nuweiba: 'nuweiba',
        'نويبع': 'nuweiba',
        qena: 'qena',
        'قنا': 'qena',
        sohag: 'sohag',
        'سوهاج': 'sohag',
        minya: 'minya',
        'المنيا': 'minya',
        'gouna': 'el-gouna',
        'el gouna': 'el-gouna',
        'el-gouna': 'el-gouna',
        'الجونة': 'el-gouna',
    };
    for (const [key, id] of Object.entries(map)) {
        if (t.includes(key)) return id;
    }
    return null;
}