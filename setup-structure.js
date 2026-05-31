const fs = require('fs');
const path = require('path');

// 1. قائمة المجلدات المراد إنشاؤها
const directories = [
  'entities',
  'functions',
  'public',
  'src/api',
  'src/components/city',
  'src/components/elgouna',
  'src/components/locali',
  'src/components/ui',
  'src/hooks',
  'src/lib',
  'src/pages/city',
  'src/utils'
];

// 2. قائمة الملفات بمساراتها الكاملة
const files = [
  // root files
  '.gitignore',
  'components.json',
  'eslint.config.js',
  'index.html',
  'jsconfig.json',
  'package.json',
  'postcss.config.js',
  'README.md',
  'tailwind.config.js',
  'vite.config.js',
  
  // entities
  'entities/Apartment',
  'entities/BoatTrip',
  'entities/CurrencyRate',
  'entities/Guide',
  'entities/HiddenGemPlace',
  'entities/HomeContent',
  'entities/HorseRiding',
  'entities/Listing',
  'entities/LiveSituation',
  'entities/LocalContact',
  'entities/LocalQuestion',
  'entities/LongStayService',
  'entities/NightlifeVenue',
  'entities/Place',
  'entities/PriceEntry',
  'entities/PriceGuide',
  'entities/PriceInsight',
  'entities/RemoteWorkSpot',
  'entities/Review',
  'entities/RideShare',
  'entities/SavedItinerary',
  'entities/ScamReport',
  'entities/Service',
  'entities/TouristDeal',
  'entities/TouristStory',
  'entities/TourOperator',
  'entities/VerifiedDriver',

  // functions
  'functions/autoFillMissingImages.ts',
  'functions/autoUpdateKidsImages.ts',
  'functions/dailyDataUpdate.ts',
  'functions/fetchFreeImages.ts',
  'functions/fetchPlaceImages.ts',
  'functions/googlePlaces.ts',
  'functions/smartAutoImages.ts',
  'functions/syncGooglePlacesAPI.ts',
  'functions/tagElGounaServices.ts',
  'functions/updateCurrencyRates.ts',
  'functions/updateDailyData.ts',
  'functions/updateLiveServices.ts',
  'functions/updateLiveSituation.ts',
  'functions/verifyPrices.ts',

  // public
  'public/robots.txt',
  'public/sitemap.xml',

  // src root
  'src/App.jsx',
  'src/index.css',
  'src/main.jsx',

  // src/api
  'src/api/localApi.js',

  // src/components/city
  'src/components/city/CityMap.jsx',
  'src/components/city/CityPageHeader.jsx',
  'src/components/city/CitySubNav.jsx',
  'src/components/city/FAQSection.jsx',
  'src/components/city/ListingCard.jsx',

  // src/components/elgouna
  'src/components/elgouna/ElGounaServices.jsx',

  // src/components/locali
  'src/components/locali/PlaceCard.jsx',
  'src/components/locali/PlaceForm.jsx',
  'src/components/locali/PlaceImageGrid.jsx',
  'src/components/locali/SearchFilters.jsx',

  // src/components/ui
  'src/components/ui/accordion.jsx',
  'src/components/ui/alert-dialog.jsx',
  'src/components/ui/alert.jsx',
  'src/components/ui/aspect-ratio.jsx',
  'src/components/ui/avatar.jsx',
  'src/components/ui/badge.jsx',
  'src/components/ui/breadcrumb.jsx',
  'src/components/ui/button.jsx',
  'src/components/ui/calendar.jsx',
  'src/components/ui/card.jsx',
  'src/components/ui/carousel.jsx',
  'src/components/ui/chart.jsx',
  'src/components/ui/checkbox.jsx',
  'src/components/ui/collapsible.jsx',
  'src/components/ui/command.jsx',
  'src/components/ui/context-menu.jsx',
  'src/components/ui/dialog.jsx',
  'src/components/ui/drawer.jsx',
  'src/components/ui/dropdown-menu.jsx',
  'src/components/ui/form.jsx',
  'src/components/ui/hover-card.jsx',
  'src/components/ui/input-otp.jsx',
  'src/components/ui/input.jsx',
  'src/components/ui/label.jsx',
  'src/components/ui/menubar.jsx',
  'src/components/ui/navigation-menu.jsx',
  'src/components/ui/pagination.jsx',
  'src/components/ui/popover.jsx',
  'src/components/ui/progress.jsx',
  'src/components/ui/radio-group.jsx',
  'src/components/ui/resizable.jsx',
  'src/components/ui/scroll-area.jsx',
  'src/components/ui/select.jsx',
  'src/components/ui/separator.jsx',
  'src/components/ui/sheet.jsx',
  'src/components/ui/sidebar.jsx',
  'src/components/ui/skeleton.jsx',
  'src/components/ui/slider.jsx',
  'src/components/ui/sonner.jsx',
  'src/components/ui/switch.jsx',
  'src/components/ui/table.jsx',
  'src/components/ui/tabs.jsx',
  'src/components/ui/textarea.jsx',
  'src/components/ui/toast.jsx',
  'src/components/ui/toaster.jsx',
  'src/components/ui/toggle-group.jsx',
  'src/components/ui/toggle.jsx',
  'src/components/ui/tooltip.jsx',
  'src/components/ui/use-toast.jsx',

  // src/components root
  'src/components/AddServiceModal.jsx',
  'src/components/AdminImageUploadOverlay.jsx',
  'src/components/AdminLongStayForm.jsx',
  'src/components/AdminNightlifeForm.jsx',
  'src/components/AdminRemoteWorkForm.jsx',
  'src/components/AdminServiceForm.jsx',
  'src/components/AskLocalChat.jsx',
  'src/components/BookingButtons.jsx',
  'src/components/BottomNav.jsx',
  'src/components/ChatCurrencyTicker.jsx',
  'src/components/CityCard.jsx',
  'src/components/CityLivePanel.jsx',
  'src/components/DataTimestamp.jsx',
  'src/components/DiscountClaim.jsx',
  'src/components/DynamicHomeSections.jsx',
  'src/components/EditableImage.jsx',
  'src/components/FlashDeals.jsx',
  'src/components/FloatingAIChat.jsx',
  'src/components/Footer.jsx',
  'src/components/GoogleReviewsButton.jsx',
  'src/components/HeroSection.jsx',
  'src/components/HomeCityCard.jsx',
  'src/components/HomeSections.jsx',
  'src/components/HomeTips.jsx',
  'src/components/ImageUpload.jsx',
  'src/components/LanguageSwitcher.jsx',
  'src/components/Layout.jsx',
  'src/components/LiveSituationBanner.jsx',
  'src/components/LiveTrustBadge.jsx',
  'src/components/MessageBubble.jsx',
  'src/components/MultiImageUpload.jsx',
  'src/components/PlaceDetailModal.jsx',
  'src/components/ProtectedRoute.jsx',
  'src/components/QuickAccessGrid.jsx',
  'src/components/QuickFunnel.jsx',
  'src/components/ReviewSection.jsx',
  'src/components/SafeNextStep.jsx',
  'src/components/ScamGauge.jsx',
  'src/components/ScamHeatMap.jsx',
  'src/components/ServiceCard.jsx',
  'src/components/SmartImage.jsx',
  'src/components/TopBar.jsx',
  'src/components/UserNotRegisteredError.jsx',
  'src/components/VerifiedBoatProviders.jsx',
  'src/components/VerifiedHorseStables.jsx',
  'src/components/VerifiedKidsActivities.jsx',
  'src/components/VerifiedNightlifeVenues.jsx',
  'src/components/VerifiedPriceBadge.jsx',
  'src/components/VerifiedPriceCard.jsx',
  'src/components/WhereToStay.jsx',

  // src/hooks
  'src/hooks/use-mobile.jsx',
  'src/hooks/useHomeContent.js',
  'src/hooks/useLanguage.js',
  'src/hooks/useLiveRates.js',
  'src/hooks/useTranslate.js',

  // src/lib
  'src/lib/app-params.js',
  'src/lib/AuthContext.jsx',
  'src/lib/cityContent.js',
  'src/lib/cityGuideContent.js',
  'src/lib/constants.js',
  'src/lib/elGounaContent.js',
  'src/lib/imageSystem.js',
  'src/lib/liveDataManager.js',
  'src/lib/PageNotFound.jsx',
  'src/lib/priceCache.js',
  'src/lib/query-client.js',
  'src/lib/seo.js',
  'src/lib/utils.js',

  // src/pages/city (empty directory placeholders handled by pages below)
  
  // src/pages
  'src/pages/city/About.jsx',
  'src/pages/AddService.jsx',
  'src/pages/AdminAutoImages.jsx',
  'src/pages/AdminBulkPopulate.jsx',
  'src/pages/AdminCMS.jsx',
  'src/pages/AdminContentManager.jsx',
  'src/pages/AdminDataPopulate.jsx',
  'src/pages/AdminElGounaFix.jsx',
  'src/pages/AdminHomeCMS.jsx',
  'src/pages/AdminLocalPersonas.jsx',
  'src/pages/AdminPlaceImageUpdater.jsx',
  'src/pages/AdminPriceManager.jsx',
  'src/pages/AdminVerification.jsx',
  'src/pages/AIAssistant.jsx',
  'src/pages/AirportItems.jsx',
  'src/pages/AnalyticsDashboard.jsx',
  'src/pages/Apartments.jsx',
  'src/pages/ArabTourists.jsx',
  'src/pages/AskALocal.jsx',
  'src/pages/Bazaars.jsx',
  'src/pages/BazaarsMarkets.jsx',
  'src/pages/BeachClubs.jsx',
  'src/pages/Beaches.jsx',
  'src/pages/BeforeYouLand.jsx',
  'src/pages/BoatTrips.jsx',
  'src/pages/BookingPage.jsx',
  'src/pages/CityGuide.jsx',
  'src/pages/CityPage.jsx',
  'src/pages/CostCalculator.jsx',
  'src/pages/CurrencyRates.jsx',
  'src/pages/DataSources.jsx',
  'src/pages/Deals.jsx',
  'src/pages/EgyptSafeNow.jsx',
  'src/pages/EgyptVsDubai.jsx',
  'src/pages/ElGouna.jsx',
  'src/pages/Emergency.jsx',
  'src/pages/FeaturedLocals.jsx',
  'src/pages/HiddenGems.jsx',
  'src/pages/Home.jsx',
  'src/pages/HorseRidingExperiences.jsx',
  'src/pages/Hotels.jsx',
  'src/pages/LastMinuteEgypt.jsx',
  'src/pages/LiveSituationPage.jsx',
  'src/pages/LocaliAdminPanel.jsx',
  'src/pages/LocaliHome.jsx',
  'src/pages/LocaliHostDashboard.jsx',
  'src/pages/LocaliRide.jsx',
  'src/pages/LongStay.jsx',
  'src/pages/Methodology.jsx',
  'src/pages/MiddleEastSafetyMap.jsx',
  'src/pages/Museums.jsx',
  'src/pages/MyTrips.jsx',
  'src/pages/NationalityGuide.jsx',
  'src/pages/Nightlife.jsx',
  'src/pages/Phrases.jsx',
  'src/pages/PlaceSearch.jsx',
  'src/pages/PriceChecker.jsx',
  'src/pages/PriceInsights.jsx',
  'src/pages/RemoteWork.jsx',
  'src/pages/Restaurants.jsx',
  'src/pages/RideSharing.jsx',
  'src/pages/SafetyGuide.jsx',
  'src/pages/ScamMap.jsx',
  'src/pages/ServiceDetail.jsx',
  'src/pages/Services.jsx',
  'src/pages/SimCards.jsx',
  'src/pages/SmartGuide.jsx',
  'src/pages/SuperAgent.jsx',
  'src/pages/TempleTrips.jsx',
  'src/pages/Terms.jsx',
  'src/pages/TouristStories.jsx',
  'src/pages/TouristVillages.jsx',
  'src/pages/TourOperators.jsx',
  'src/pages/TravelTips.jsx',
  'src/pages/TripDecision.jsx',
  'src/pages/TripPlanner.jsx',
  'src/pages/UnifiedSearch.jsx',
  'src/pages/VerifiedContacts.jsx',
  'src/pages/VerifiedDrivers.jsx',
  'src/pages/VerifiedGuides.jsx',
  'src/pages/VerifyApply.jsx',
  'src/pages/VisaEntry.jsx',
  'src/pages/WaterSports.jsx',
  'src/pages/WellnessHealing.jsx',
  'src/pages/WomenSafety.jsx',

  // src/utils
  'src/utils/index.ts'
];

// إنشاء المجلدات أولاً
console.log('⏳ Starting directory creation...');
directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});
console.log('✅ Directories created successfully.\n');

// إنشاء الملفات فارغة
console.log('⏳ Starting file creation...');
files.forEach(file => {
  const filePath = path.join(__dirname, file);
  // التأكد من أن المجلد الحاضن للملف موجود (أمان إضافي)
  const dirName = path.dirname(filePath);
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName, { recursive: true });
  }
  
  // إنشاء الملف لو مش موجود
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '', 'utf8');
  }
});
console.log('✅ All files created successfully inside their respective paths!');