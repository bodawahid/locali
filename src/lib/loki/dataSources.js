/** Community & external data sources LOKI can reference (tourism-only). */

export const EXTERNAL_APIS = {
    egyptTrains: { name: 'EgyptTrains.com', url: 'https://egypttrains.com', type: 'trains' },
    numbeo: { name: 'Numbeo', url: 'https://www.numbeo.com/cost-of-living/country_result.jsp?country=Egypt', type: 'prices' },
    scamDetector: { name: 'ScamDetector API', url: 'https://www.scamdetector.net', type: 'safety' },
    hotelsFb: { name: 'Facebook Egypt Hotels & Deals', url: 'https://www.facebook.com/share/1BE9D6fnRZ/', type: 'hotels' },
    googleMaps: { name: 'Google Maps', url: 'https://maps.google.com', type: 'locations' },
    goBus: { name: 'Go Bus Egypt', url: 'https://go-bus.com', type: 'transport' },
    careem: { name: 'Careem App', url: 'https://www.careem.com', type: 'transport' },
    uber: { name: 'Uber', url: 'https://www.uber.com/en-EG/', type: 'transport' },
};

export const TELEGRAM_GROUPS = [
    { name: 'Sharm Expats', url: 'https://t.me/SharmExpats', cities: ['sharm-el-sheikh'] },
    { name: 'Sharm El Sheikh Live', url: 'https://t.me/Sharm_el_Sheikh_live', cities: ['sharm-el-sheikh'] },
    { name: 'Dahab Chat', url: 'https://t.me/dahabchat/1', cities: ['dahab', 'sharm-el-sheikh'] },
    { name: 'Idakvam Egypt', url: 'https://t.me/idakvam_egypt', cities: ['all'] },
    { name: 'Hurghada Chat', url: 'https://t.me/HurghadaChat1/1', cities: ['hurghada'] },
];

export const FACEBOOK_GROUPS = [
    { name: 'Egypt Expat Living Group 1', url: 'https://www.facebook.com/share/g/1DDSiNVSt5/?mibextid=wwXIfr', cities: ['all'] },
    { name: 'Egypt Expat Living Group 2', url: 'https://www.facebook.com/share/g/1E6RLKMELY/?mibextid=wwXIfr', cities: ['all'] },
    { name: 'Egypt Expat Living Group 3', url: 'https://www.facebook.com/share/g/1GiAzTiERZ/?mibextid=wwXIfr', cities: ['all'] },
    { name: 'Egypt Expat Living Group 4', url: 'https://www.facebook.com/share/g/1BTXsCVyv9/?mibextid=wwXIfr', cities: ['all'] },
    { name: 'Egypt Expat Living Group 5', url: 'https://www.facebook.com/share/g/1CyQ3wWc26/?mibextid=wwXIfr', cities: ['all'] },
    { name: 'Egypt Expat Living Group 6', url: 'https://www.facebook.com/share/g/1FF4qHgBS7/?mibextid=wwXIfr', cities: ['all'] },
    { name: 'Egypt Expat Living Group 7', url: 'https://www.facebook.com/share/g/185xuNMvDm/?mibextid=wwXIfr', cities: ['all'] },
    { name: 'Egypt Expat Living Group 8', url: 'https://www.facebook.com/share/g/1EHcCPWAsN/?mibextid=wwXIfr', cities: ['all'] },
    { name: 'Egypt Expat Living Group 9', url: 'https://www.facebook.com/share/g/1FU1NPvUMW/?mibextid=wwXIfr', cities: ['all'] },
    { name: 'Egypt Expat Living Group 10', url: 'https://www.facebook.com/share/g/1CwpVUFxMv/?mibextid=wwXIfr', cities: ['all'] },
    { name: 'Egypt Expat Living Group 11', url: 'https://www.facebook.com/share/g/1Ezrv5vL2q/?mibextid=wwXIfr', cities: ['all'] },
    { name: 'Egypt Expat Living Group 12', url: 'https://www.facebook.com/share/g/1EEEzJNnDq/?mibextid=wwXIfr', cities: ['all'] },
    { name: 'Egypt Expat Living Group 13', url: 'https://www.facebook.com/share/g/1D1Tc9iWgw/?mibextid=wwXIfr', cities: ['all'] },
    { name: 'Egypt Expat Living Group 14', url: 'https://www.facebook.com/share/g/18UxHAyg8o/?mibextid=wwXIfr', cities: ['all'] },
    { name: 'Egypt Expat Living Group 15', url: 'https://www.facebook.com/share/g/1GtkHWkDzL/?mibextid=wwXIfr', cities: ['all'] },
    { name: 'Egypt Hotels & Deals', url: 'https://www.facebook.com/share/1BE9D6fnRZ/?mibextid=wwXIfr', cities: ['all'] },
];

export const REDDIT_SOURCES = [
    { name: 'r/Egypt', url: 'https://www.reddit.com/r/Egypt/', topics: ['travel', 'local tips', 'scams'] },
    { name: 'r/travel (Egypt threads)', url: 'https://www.reddit.com/r/travel/search/?q=egypt', topics: ['itineraries', 'safety'] },
    { name: 'r/solotravel (Egypt)', url: 'https://www.reddit.com/r/solotravel/search/?q=egypt', topics: ['solo travel', 'safety'] },
    { name: 'r/backpacking (Egypt)', url: 'https://www.reddit.com/r/backpacking/search/?q=egypt', topics: ['budget travel'] },
];

export const TRANSPORT_SOURCES = {
    trains: { name: 'EgyptTrains.com', url: 'https://egypttrains.com', description: 'Official Egyptian Railways booking' },
    buses: { name: 'Go Bus Egypt', url: 'https://go-bus.com', description: 'Long-distance bus network' },
    taxis: {
        careem: { name: 'Careem', url: 'https://www.careem.com', description: 'App-based rideshare' },
        uber: { name: 'Uber', url: 'https://www.uber.com/en-EG/', description: 'App-based rideshare' },
        local: { name: 'Telegram/Facebook community prices', url: 'https://t.me/SharmExpats', description: 'Fair prices from locals' },
    },
};

export const NUMBEO_CITIES = {
    hurghada: 'Hurghada',
    'sharm-el-sheikh': 'Sharm El Sheikh',
    luxor: 'Luxor',
    aswan: 'Aswan',
    'el-gouna': 'El Gouna',
};

export const TOURISM_ONLY_TOPICS = [
    'transport & taxis & trains & buses', 'prices & fair rates', 'scams & safety',
    'restaurants & food & menus', 'hotels & accommodation', 'activities & tours',
    'beaches & diving', 'temples & museums', 'SIM cards & currency',
    'airport transfers', 'visa & entry', 'emergency & tourist police', 'maps & directions',
];

export const OFF_TOPIC_REPLY_AR =
    'أنا LOKI — مساعدك السياحي في مصر فقط 🛡️ اسألني عن السفر، الأسعار، الأمان، المواصلات، أو الأنشطة السياحية.';

export const OFF_TOPIC_REPLY_EN =
    "I'm LOKI — your Egypt tourism guide only 🛡️ Ask me about travel, prices, safety, transport, or tourist activities.";