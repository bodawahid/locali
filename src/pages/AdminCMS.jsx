// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Database, Plus, Pencil, Trash2, Search, Save, X, RefreshCw,
  Shield, ChevronRight, AlertCircle, CheckCircle2, Loader2, ToggleLeft
} from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import MultiImageUpload from '../components/MultiImageUpload';
import { useNavigate } from 'react-router-dom';

// Entity registry — name maps to SDK entity + field config
const ENTITIES = [
  {
    name: 'Service', label: 'Services', icon: '🏪',
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'name_ru', label: 'Name (RU)', type: 'text' },
      { key: 'name_de', label: 'Name (DE)', type: 'text' },
      { key: 'category', label: 'Category', type: 'select', options: ['restaurant','medical','transport','activities','kids_family','sim_internet','nightlife','remote_work','long_stay','other'] },
      { key: 'city', label: 'City', type: 'select', options: ['sharm-el-sheikh','hurghada','luxor','aswan','el-gouna'] },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'address', label: 'Address', type: 'text' },
      { key: 'phone', label: 'Phone', type: 'text' },
      { key: 'website', label: 'Website', type: 'text' },
      { key: 'photos', label: 'Photos', type: 'multi_image' },
      { key: 'main_image', label: 'Main Image', type: 'image' },
      { key: 'price_range', label: 'Price Range', type: 'select', options: ['budget','moderate','premium'] },
      { key: 'avg_rating', label: 'Avg Rating', type: 'number' },
      { key: 'scam_score', label: 'Scam Score (0-100)', type: 'number' },
      { key: 'is_verified', label: 'Verified', type: 'boolean' },
      { key: 'is_featured', label: 'Featured', type: 'boolean' },
      { key: 'subscription_tier', label: 'Subscription Tier', type: 'select', options: ['none','verified','featured'] },
      { key: 'commission_rate', label: 'Commission Rate %', type: 'number' },
    ],
    displayFields: ['name', 'category', 'city', 'avg_rating', 'is_verified', 'is_featured'],
  },
  {
    name: 'Listing', label: 'Listings', icon: '📍',
    fields: [
      { key: 'name', label: 'Business Name', type: 'text', required: true },
      { key: 'category', label: 'Category', type: 'select', options: ['hotel','restaurant','tour','guide','driver','transportation','company','activity','attraction'] },
      { key: 'city', label: 'City', type: 'select', options: ['cairo','giza','alexandria','hurghada','sharm-el-sheikh','luxor','aswan','el-gouna'] },
      { key: 'rating', label: 'Rating', type: 'number' },
      { key: 'review_count', label: 'Review Count', type: 'number' },
      { key: 'address', label: 'Address', type: 'text' },
      { key: 'phone', label: 'Phone', type: 'text' },
      { key: 'whatsapp', label: 'WhatsApp', type: 'text' },
      { key: 'google_maps_link', label: 'Google Maps URL', type: 'text' },
      { key: 'website', label: 'Website', type: 'text' },
      { key: 'image', label: 'Image URL', type: 'text' },
      { key: 'main_image', label: 'Main Image', type: 'image' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'price_range', label: 'Price Range', type: 'select', options: ['budget','moderate','premium','luxury'] },
      { key: 'is_verified', label: 'Verified', type: 'boolean' },
      { key: 'is_featured', label: 'Featured', type: 'boolean' },
      { key: 'source', label: 'Source', type: 'select', options: ['google_places','verified_local','manual_verified'] },
    ],
    displayFields: ['name', 'category', 'city', 'rating', 'is_verified'],
  },
  {
    name: 'TouristDeal', label: 'Tourist Deals', icon: '🎯',
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'city', label: 'City', type: 'select', options: ['sharm-el-sheikh','hurghada','luxor','aswan'] },
      { key: 'discount_percent', label: 'Discount %', type: 'number' },
      { key: 'original_price', label: 'Original Price (EGP)', type: 'number' },
      { key: 'deal_price', label: 'Deal Price (EGP)', type: 'number' },
      { key: 'valid_until', label: 'Valid Until', type: 'date' },
      { key: 'whatsapp', label: 'WhatsApp', type: 'text' },
      { key: 'main_image', label: 'Main Image', type: 'image' },
      { key: 'is_active', label: 'Active', type: 'boolean' },
    ],
    displayFields: ['title', 'city', 'discount_percent', 'deal_price', 'is_active'],
  },
  {
    name: 'PriceGuide', label: 'Price Guide', icon: '💰',
    fields: [
      { key: 'item', label: 'Item/Service', type: 'text', required: true },
      { key: 'category', label: 'Category', type: 'select', options: ['transport','food','accommodation','activities','shopping','telecom','medical','other'] },
      { key: 'city', label: 'City', type: 'select', options: ['sharm-el-sheikh','hurghada','luxor','aswan','all'] },
      { key: 'local_price', label: 'Local Price (EGP)', type: 'number', required: true },
      { key: 'fair_tourist_price', label: 'Fair Tourist Price (EGP)', type: 'number', required: true },
      { key: 'scam_price', label: 'Scam Price (EGP)', type: 'number' },
      { key: 'notes', label: 'Notes', type: 'textarea' },
      { key: 'main_image', label: 'Main Image', type: 'image' },
    ],
    displayFields: ['item', 'category', 'city', 'local_price', 'fair_tourist_price'],
  },
  {
    name: 'ScamReport', label: 'Scam Reports', icon: '⚠️',
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea', required: true },
      { key: 'city', label: 'City', type: 'select', options: ['sharm-el-sheikh','hurghada','luxor','aswan'] },
      { key: 'category', label: 'Category', type: 'select', options: ['taxi','shopping','tour','restaurant','hotel','money_exchange','street_vendor','other'] },
      { key: 'severity', label: 'Severity', type: 'select', options: ['low','medium','high'] },
      { key: 'location_name', label: 'Location Name', type: 'text' },
      { key: 'amount_lost', label: 'Amount Lost (EGP)', type: 'number' },
      { key: 'status', label: 'Status', type: 'select', options: ['pending','verified','dismissed'] },
      { key: 'upvotes', label: 'Upvotes', type: 'number' },
    ],
    displayFields: ['title', 'category', 'city', 'severity', 'status'],
  },
  {
    name: 'LiveSituation', label: 'Live Situation', icon: '🔴',
    fields: [
      { key: 'city', label: 'City', type: 'select', options: ['hurghada','sharm-el-sheikh','luxor','aswan','el-gouna','global'], required: true },
      { key: 'status', label: 'Status', type: 'select', options: ['green','yellow','red'] },
      { key: 'weather', label: 'Weather Summary', type: 'text' },
      { key: 'temperature_c', label: 'Temperature (°C)', type: 'number' },
      { key: 'traffic', label: 'Traffic & Transport', type: 'textarea' },
      { key: 'alerts', label: 'Safety Alerts', type: 'textarea' },
      { key: 'events', label: 'Events / Festivals', type: 'textarea' },
      { key: 'recommendation', label: 'Tourist Recommendation', type: 'textarea' },
      { key: 'prices_summary', label: 'Prices Summary', type: 'textarea' },
      { key: 'meal_range', label: 'Meal Range (EGP)', type: 'text' },
      { key: 'coffee_range', label: 'Coffee Range (EGP)', type: 'text' },
      { key: 'taxi_range', label: 'Taxi Range (EGP)', type: 'text' },
      { key: 'usd_to_egp', label: 'USD→EGP Rate', type: 'number' },
      { key: 'eur_to_egp', label: 'EUR→EGP Rate', type: 'number' },
      { key: 'rub_to_egp', label: 'RUB→EGP Rate', type: 'number' },
      { key: 'update_date', label: 'Update Date', type: 'date', required: true },
      { key: 'source', label: 'Source', type: 'text' },
    ],
    displayFields: ['city', 'status', 'weather', 'temperature_c', 'update_date'],
  },
  {
    name: 'VerifiedDriver', label: 'Verified Drivers', icon: '🚗',
    fields: [
      { key: 'full_name', label: 'Full Name', type: 'text', required: true },
      { key: 'photo_url', label: 'Photo URL', type: 'text' },
      { key: 'car_model', label: 'Car Model', type: 'text', required: true },
      { key: 'car_year', label: 'Car Year', type: 'number' },
      { key: 'car_color', label: 'Car Color', type: 'text' },
      { key: 'plate_number', label: 'Plate Number', type: 'text' },
      { key: 'national_id_last4', label: 'National ID Last 4', type: 'text', required: true },
      { key: 'description', label: 'About Driver', type: 'textarea' },
      { key: 'avg_rating', label: 'Avg Rating', type: 'number' },
      { key: 'review_count', label: 'Review Count', type: 'number' },
      { key: 'total_rides', label: 'Total Rides', type: 'number' },
      { key: 'commission_rate', label: 'Commission Rate %', type: 'number' },
      { key: 'is_verified', label: 'Verified', type: 'boolean' },
      { key: 'status', label: 'Status', type: 'select', options: ['pending','approved','suspended'] },
      { key: 'main_image', label: 'Main Image', type: 'image' },
    ],
    displayFields: ['full_name', 'car_model', 'avg_rating', 'is_verified', 'status'],
  },
  {
    name: 'Guide', label: 'Guides', icon: '🗺️',
    fields: [
      { key: 'full_name', label: 'Full Name', type: 'text', required: true },
      { key: 'photo_url', label: 'Photo URL', type: 'text' },
      { key: 'license_id', label: 'License ID', type: 'text', required: true },
      { key: 'city', label: 'Primary City', type: 'select', options: ['hurghada','sharm-el-sheikh','luxor','aswan'] },
      { key: 'description', label: 'About Guide', type: 'textarea' },
      { key: 'price_half_day', label: 'Half-Day Price (EGP)', type: 'number' },
      { key: 'price_full_day', label: 'Full-Day Price (EGP)', type: 'number' },
      { key: 'phone_whatsapp', label: 'WhatsApp', type: 'text' },
      { key: 'avg_rating', label: 'Avg Rating', type: 'number' },
      { key: 'years_experience', label: 'Years Experience', type: 'number' },
      { key: 'is_verified', label: 'Verified', type: 'boolean' },
      { key: 'status', label: 'Status', type: 'select', options: ['pending','approved','rejected'] },
      { key: 'main_image', label: 'Main Image', type: 'image' },
    ],
    displayFields: ['full_name', 'city', 'avg_rating', 'is_verified', 'status'],
  },
  {
    name: 'Apartment', label: 'Apartments', icon: '🏠',
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'host_name', label: 'Host Name', type: 'text', required: true },
      { key: 'city', label: 'City', type: 'select', options: ['hurghada','sharm-el-sheikh','luxor','aswan','el-gouna'] },
      { key: 'area', label: 'Area/Neighbourhood', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'price_per_night_egp', label: 'Price/Night (EGP)', type: 'number', required: true },
      { key: 'capacity', label: 'Max Guests', type: 'number' },
      { key: 'bedrooms', label: 'Bedrooms', type: 'number' },
      { key: 'bathrooms', label: 'Bathrooms', type: 'number' },
      { key: 'min_nights', label: 'Min Nights', type: 'number' },
      { key: 'rules', label: 'House Rules', type: 'textarea' },
      { key: 'photos', label: 'Photos', type: 'multi_image' },
      { key: 'main_image', label: 'Main Image', type: 'image' },
      { key: 'avg_rating', label: 'Avg Rating', type: 'number' },
      { key: 'commission_rate', label: 'Commission Rate %', type: 'number' },
      { key: 'is_verified', label: 'Verified', type: 'boolean' },
      { key: 'is_featured', label: 'Featured', type: 'boolean' },
      { key: 'status', label: 'Status', type: 'select', options: ['pending','approved','suspended'] },
    ],
    displayFields: ['title', 'city', 'price_per_night_egp', 'is_verified', 'status'],
  },
  {
    name: 'TourOperator', label: 'Tour Operators', icon: '🏢',
    fields: [
      { key: 'company_name', label: 'Company Name', type: 'text', required: true },
      { key: 'license_number', label: 'License Number', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'avg_rating', label: 'Avg Rating', type: 'number' },
      { key: 'complaint_count', label: 'Complaint Count', type: 'number' },
      { key: 'refund_policy', label: 'Refund Policy', type: 'textarea' },
      { key: 'is_verified', label: 'Verified', type: 'boolean' },
      { key: 'status', label: 'Status', type: 'select', options: ['pending','approved','suspended','banned'] },
    ],
    displayFields: ['company_name', 'license_number', 'avg_rating', 'is_verified', 'status'],
  },
  {
    name: 'BoatTrip', label: 'Boat Trips', icon: '⛵',
    fields: [
      { key: 'boat_name', label: 'Boat Name', type: 'text', required: true },
      { key: 'city', label: 'City', type: 'select', options: ['hurghada','sharm-el-sheikh','dahab','el-gouna','aswan'] },
      { key: 'boat_type', label: 'Boat Type', type: 'select', options: ['yacht','speedboat','fishing_boat','sailboat','catamaran'] },
      { key: 'price', label: 'Price (EGP)', type: 'number', required: true },
      { key: 'price_type', label: 'Price Type', type: 'select', options: ['per_hour','per_trip','per_person'] },
      { key: 'capacity', label: 'Capacity', type: 'number' },
      { key: 'duration_hours', label: 'Duration (hours)', type: 'number' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'includes', label: 'Includes', type: 'textarea' },
      { key: 'photos', label: 'Photos', type: 'multi_image' },
      { key: 'main_image', label: 'Main Image', type: 'image' },
      { key: 'whatsapp', label: 'WhatsApp', type: 'text', required: true },
      { key: 'discount_code', label: 'Discount Code', type: 'text' },
      { key: 'is_featured', label: 'Featured', type: 'boolean' },
      { key: 'status', label: 'Status', type: 'select', options: ['pending','approved','rejected'] },
    ],
    displayFields: ['boat_name', 'city', 'boat_type', 'price', 'status'],
  },
  {
    name: 'HorseRiding', label: 'Horse Riding', icon: '🐴',
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'city', label: 'City', type: 'select', options: ['hurghada','sharm-el-sheikh','dahab','el-gouna','aswan'] },
      { key: 'experience_type', label: 'Experience Type', type: 'select', options: ['beach_ride','desert_ride','swimming_horses','sunrise_sunset_ride'] },
      { key: 'price', label: 'Price (EGP)', type: 'number', required: true },
      { key: 'price_type', label: 'Price Type', type: 'select', options: ['per_person','per_hour'] },
      { key: 'duration', label: 'Duration', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'photos', label: 'Photos', type: 'multi_image' },
      { key: 'main_image', label: 'Main Image', type: 'image' },
      { key: 'whatsapp', label: 'WhatsApp', type: 'text', required: true },
      { key: 'skill_level', label: 'Skill Level', type: 'select', options: ['beginner','intermediate','all_levels'] },
      { key: 'discount_code', label: 'Discount Code', type: 'text' },
      { key: 'is_featured', label: 'Featured', type: 'boolean' },
      { key: 'status', label: 'Status', type: 'select', options: ['pending','approved','rejected'] },
    ],
    displayFields: ['title', 'city', 'experience_type', 'price', 'status'],
  },
  {
    name: 'NightlifeVenue', label: 'Nightlife Venues', icon: '🌙',
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'city', label: 'City', type: 'select', options: ['sharm-el-sheikh','hurghada','luxor','aswan'] },
      { key: 'type', label: 'Type', type: 'select', options: ['bar','beach_club','nightclub','rooftop','yacht','vip_lounge'] },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'location', label: 'Location/Area', type: 'text' },
      { key: 'price_range', label: 'Price Range', type: 'select', options: ['budget','moderate','premium','luxury'] },
      { key: 'safety_rating', label: 'Safety Rating', type: 'select', options: ['safe','moderate','use_caution'] },
      { key: 'entry_fee', label: 'Entry Fee (EGP)', type: 'number' },
      { key: 'dress_code', label: 'Dress Code', type: 'text' },
      { key: 'phone', label: 'Phone', type: 'text' },
      { key: 'is_verified', label: 'Verified', type: 'boolean' },
      { key: 'main_image', label: 'Main Image', type: 'image' },
    ],
    displayFields: ['name', 'city', 'type', 'price_range', 'is_verified'],
  },
  {
    name: 'LongStayService', label: 'Long Stay Services', icon: '🏠',
    fields: [
      { key: 'name', label: 'Service Name', type: 'text', required: true },
      { key: 'city', label: 'City', type: 'select', options: ['sharm-el-sheikh','hurghada','luxor','aswan','el-gouna'] },
      { key: 'category', label: 'Category', type: 'select', options: ['apartment','cleaning','maintenance','grocery_delivery','laundry','internet','other'] },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'price_info', label: 'Price Info', type: 'text' },
      { key: 'contact_phone', label: 'Phone / WhatsApp', type: 'text' },
      { key: 'website', label: 'Website', type: 'text' },
      { key: 'main_image', label: 'Main Image', type: 'image' },
      { key: 'is_verified', label: 'Verified', type: 'boolean' },
    ],
    displayFields: ['name', 'city', 'category', 'price_info', 'is_verified'],
  },
  {
    name: 'RemoteWorkSpot', label: 'Remote Work Spots', icon: '💻',
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'city', label: 'City', type: 'select', options: ['sharm-el-sheikh','hurghada','luxor','aswan','el-gouna'] },
      { key: 'type', label: 'Type', type: 'select', options: ['cafe','coworking','hotel_lobby','library'] },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'location', label: 'Location/Area', type: 'text' },
      { key: 'wifi_speed_mbps', label: 'WiFi Speed (Mbps)', type: 'number' },
      { key: 'wifi_reliability', label: 'WiFi Reliability', type: 'select', options: ['excellent','good','fair','poor'] },
      { key: 'price_per_hour', label: 'Price/Hour (EGP)', type: 'number' },
      { key: 'price_per_day', label: 'Day Pass (EGP)', type: 'number' },
      { key: 'power_outlets', label: 'Power Outlets', type: 'boolean' },
      { key: 'ac', label: 'Air Conditioning', type: 'boolean' },
      { key: 'phone', label: 'Phone', type: 'text' },
      { key: 'main_image', label: 'Main Image', type: 'image' },
      { key: 'is_verified', label: 'Verified', type: 'boolean' },
    ],
    displayFields: ['name', 'city', 'type', 'wifi_reliability', 'is_verified'],
  },
  {
    name: 'HiddenGemPlace', label: 'Hidden Gems', icon: '💎',
    fields: [
      { key: 'title', label: 'Name', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea', required: true },
      { key: 'why_special', label: 'Why It\'s Special / Highlights', type: 'textarea', required: true },
      { key: 'tag', label: 'Category', type: 'select', options: ['Adventure', 'Chill', 'Cultural', 'Luxury', 'Explorer', 'Nature'] },
      { key: 'city', label: 'City', type: 'select', options: ['Luxor', 'Aswan', 'Sinai', 'Hurghada', 'Marsa Alam', 'El Gouna', 'Dahab', 'Nuweiba'] },
      { key: 'area', label: 'Area / Neighbourhood', type: 'text' },
      { key: 'region', label: 'Region (used for grouping)', type: 'select', options: ['Luxor', 'Aswan', 'Sinai', 'Red Sea', 'El Gouna'] },
      { key: 'gem_number', label: 'Display Number (1–30)', type: 'number' },
      { key: 'keywords', label: 'Search Keywords', type: 'text' },
      { key: 'main_image', label: 'Main Image', type: 'image' },
      { key: 'image_url', label: 'Image URL (fallback)', type: 'text' },
      { key: 'photos', label: 'Additional Photos', type: 'multi_image' },
      { key: 'is_published', label: 'Published / Visible', type: 'boolean' },
    ],
    displayFields: ['title', 'region', 'city', 'tag', 'gem_number', 'is_published'],
  },
  {
    name: 'CurrencyRate', label: 'Currency Rates', icon: '💱',
    fields: [
      { key: 'usd', label: 'USD→EGP', type: 'number', required: true },
      { key: 'eur', label: 'EUR→EGP', type: 'number', required: true },
      { key: 'gbp', label: 'GBP→EGP', type: 'number' },
      { key: 'rub', label: 'RUB→EGP', type: 'number' },
      { key: 'pln', label: 'PLN→EGP', type: 'number' },
      { key: 'cad', label: 'CAD→EGP', type: 'number' },
      { key: 'aud', label: 'AUD→EGP', type: 'number' },
      { key: 'sar', label: 'SAR→EGP', type: 'number' },
      { key: 'rate_date', label: 'Rate Date', type: 'date', required: true },
      { key: 'source', label: 'Source', type: 'select', options: ['openexchangerates','google_finance','xe_com','fallback_emergency'] },
      { key: 'alert', label: 'Alert Message', type: 'text' },
    ],
    displayFields: ['rate_date', 'usd', 'eur', 'gbp', 'source'],
  },
];

// Generic field renderer
function FieldInput({ field, value, onChange }) {
  const baseClass = "w-full text-sm rounded-lg border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/50";

  if (field.type === 'image') {
    return (
      <ImageUpload
        value={value || ''}
        onChange={onChange}
        label={`Upload ${field.label}`}
      />
    );
  }

  if (field.type === 'multi_image') {
    return (
      <MultiImageUpload
        value={value || []}
        onChange={onChange}
      />
    );
  }

  if (field.type === 'boolean') {
    return (
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(!value)}
          className={`relative w-11 h-6 rounded-full transition-colors ${value ? 'bg-accent' : 'bg-muted'}`}
        >
          <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5' : ''}`} />
        </button>
        <span className="text-xs text-muted-foreground">{value ? 'Yes' : 'No'}</span>
      </div>
    );
  }

  if (field.type === 'select') {
    return (
      <Select value={value || ''} onValueChange={onChange}>
        <SelectTrigger className="text-sm h-9">
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent>
          {field.options.map(o => (
            <SelectItem key={o} value={o}>{o}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (field.type === 'textarea') {
    return (
      <Textarea
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        rows={3}
        className="text-sm"
        placeholder={field.label}
      />
    );
  }

  return (
    <Input
      type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
      value={value ?? ''}
      onChange={e => onChange(field.type === 'number' ? parseFloat(e.target.value) || '' : e.target.value)}
      className="h-9 text-sm"
      placeholder={field.label}
    />
  );
}

// Edit/Create modal
function RecordModal({ entity, record, onSave, onClose }) {
  const [form, setForm] = useState(record ? { ...record } : {});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      if (record?.id) {
        await base44.entities[entity.name].update(record.id, form);
      } else {
        await base44.entities[entity.name].create(form);
      }
      onSave();
    } catch (e) {
      setError(e.message || 'Save failed');
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card w-full max-w-2xl max-h-[90vh] rounded-2xl border border-border shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="font-bold text-base">{record?.id ? 'Edit' : 'Add'} {entity.label.slice(0,-1)}</h2>
            {record?.id && <p className="text-[10px] text-muted-foreground mt-0.5">ID: {record.id}</p>}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
          {entity.fields.map(field => (
            <div key={field.key}>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              <FieldInput
                field={field}
                value={form[field.key]}
                onChange={val => setForm(prev => ({ ...prev, [field.key]: val }))}
              />
            </div>
          ))}
        </div>

        <div className="px-5 py-4 border-t border-border flex items-center gap-3 shrink-0">
          {error && <p className="text-xs text-red-500 flex-1">{error}</p>}
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Save className="w-3.5 h-3.5 mr-1" />}
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Entity manager panel
function EntityManager({ entity }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null); // null = closed, {} = new, record = edit
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const data = await base44.entities[entity.name].list('-updated_date', 200);
    setRecords(data);
    setLoading(false);
  }, [entity.name]);

  useEffect(() => { load(); }, [load]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleDelete = async (id) => {
    await base44.entities[entity.name].delete(id);
    setDeleting(null);
    showToast('Record deleted');
    load();
  };

  const filtered = records.filter(r =>
    entity.displayFields.some(f =>
      String(r[f] ?? '').toLowerCase().includes(search.toLowerCase())
    )
  );

  const getDisplayValue = (record, fieldKey) => {
    const val = record[fieldKey];
    if (val === true) return <span className="text-xs text-emerald-600 font-bold">✓ Yes</span>;
    if (val === false) return <span className="text-xs text-muted-foreground">No</span>;
    if (val === null || val === undefined || val === '') return <span className="text-xs text-muted-foreground/40">—</span>;
    return <span className="text-xs">{String(val)}</span>;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={`Search ${entity.label}...`}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
        <Button size="sm" variant="outline" onClick={load}>
          <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
        </Button>
        <Button size="sm" onClick={() => setEditing({})}>
          <Plus className="w-3.5 h-3.5 mr-1" /> Add New
        </Button>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
        <Database className="w-3.5 h-3.5" />
        <span>{records.length} total records</span>
        {search && <span>· {filtered.length} matching</span>}
        <span className="ml-auto flex items-center gap-1 text-amber-600 font-semibold">
          <ToggleLeft className="w-3.5 h-3.5" /> Manual Override Active — No AI Credits Used
        </span>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading...
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
          <Database className="w-8 h-8 opacity-30" />
          <p className="text-sm">{search ? 'No matching records' : 'No records yet'}</p>
          <Button size="sm" onClick={() => setEditing({})}>
            <Plus className="w-3.5 h-3.5 mr-1" /> Add First Record
          </Button>
        </div>
      ) : (
        <div className="overflow-auto rounded-xl border border-border flex-1">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-secondary/60 sticky top-0">
              <tr>
                {entity.displayFields.map(f => (
                  <th key={f} className="text-left px-3 py-2.5 text-xs font-bold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                    {entity.fields.find(ef => ef.key === f)?.label || f}
                  </th>
                ))}
                <th className="text-left px-3 py-2.5 text-xs font-bold text-muted-foreground uppercase tracking-wide">Updated</th>
                <th className="px-3 py-2.5 w-24"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((record, i) => (
                <tr key={record.id} className={`border-t border-border/50 hover:bg-secondary/30 transition-colors ${i % 2 === 0 ? '' : 'bg-secondary/10'}`}>
                  {entity.displayFields.map(f => (
                    <td key={f} className="px-3 py-2.5 max-w-[200px] truncate">
                      {getDisplayValue(record, f)}
                    </td>
                  ))}
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <span className="text-[10px] text-muted-foreground">
                      {record.updated_date ? new Date(record.updated_date).toLocaleDateString() : '—'}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => setEditing(record)}
                        className="p-1.5 rounded-lg hover:bg-accent/10 hover:text-accent transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleting(record.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit modal */}
      {editing !== null && (
        <RecordModal
          entity={entity}
          record={editing?.id ? editing : null}
          onSave={() => { setEditing(null); showToast('Saved successfully!'); load(); }}
          onClose={() => setEditing(null)}
        />
      )}

      {/* Delete confirmation */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-2xl border border-border p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Delete Record?</h3>
                <p className="text-xs text-muted-foreground">This cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => setDeleting(null)}>Cancel</Button>
              <Button variant="destructive" size="sm" className="flex-1" onClick={() => handleDelete(deleting)}>
                <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-foreground text-background px-4 py-2.5 rounded-xl shadow-xl text-sm font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toast}
        </div>
      )}
    </div>
  );
}

export default function AdminCMS() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeEntity, setActiveEntity] = useState(ENTITIES[0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
          <Shield className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-xl font-bold">Admin Access Required</h1>
        <p className="text-sm text-muted-foreground">You must be an admin to access this area.</p>
        <Button onClick={() => navigate('/')}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-60' : 'w-14'} shrink-0 bg-card border-r border-border flex flex-col transition-all duration-200`}>
        {/* Header */}
        <div className="px-3 py-4 border-b border-border flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Database className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-foreground">Admin CMS</p>
              <p className="text-[9px] text-muted-foreground">Manual Override Mode</p>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded hover:bg-secondary transition-colors shrink-0">
            <ChevronRight className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Mode badge */}
        {sidebarOpen && (
          <div className="mx-3 mt-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-[10px] font-bold text-amber-700">⚡ Manual Override Active</p>
            <p className="text-[9px] text-amber-600 mt-0.5">All edits bypass AI. No credits consumed.</p>
          </div>
        )}

        {/* Entity list */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {ENTITIES.map(entity => (
            <button
              key={entity.name}
              onClick={() => setActiveEntity(entity)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm transition-all ${
                activeEntity.name === entity.name
                  ? 'bg-primary/10 text-primary font-bold'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <span className="text-base shrink-0">{entity.icon}</span>
              {sidebarOpen && <span className="truncate text-xs">{entity.label}</span>}
            </button>
          ))}
        </nav>

        {/* Footer links — تم تنظيف وتعديل الـ Paths لـ /localiadmin */}
        {sidebarOpen && (
          <div className="p-3 border-t border-border space-y-1">
            <button onClick={() => navigate('/localiadmin/home-cms')} className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors">
              <span>🏠</span> Home Page CMS
            </button>
            <button onClick={() => navigate('/localiadmin/personas')} className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 transition-colors">
              <span>💬</span> Local Personas
            </button>
            <button onClick={() => navigate('/localiadmin/prices')} className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 transition-colors">
              <span>💰</span> Price Manager
            </button>
            <button onClick={() => navigate('/localiadmin/el-gouna-fix')} className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold text-orange-700 bg-orange-50 hover:bg-orange-100 transition-colors">
              <span>🌊</span> Cairo→El Gouna Fix
            </button>
            <button onClick={() => navigate('/localiadmin/place-images')} className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors">
              <span>🖼️</span> Place Image Updater
            </button>
            <button onClick={() => navigate('/localiadmin/bulk-populate')} className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors">
              <span>⚡</span> Bulk Populator
            </button>
            <button onClick={() => navigate('/localiadmin/verify')} className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs text-muted-foreground hover:bg-secondary transition-colors">
              <Shield className="w-3.5 h-3.5" /> Verification Queue
            </button>
            <button onClick={() => navigate('/localiadmin/content')} className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs text-muted-foreground hover:bg-secondary transition-colors">
              <Database className="w-3.5 h-3.5" /> Content Manager
            </button>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <div className="px-6 py-4 border-b border-border bg-card flex items-center gap-3 shrink-0">
          <span className="text-xl">{activeEntity.icon}</span>
          <div className="flex-1">
            <h1 className="font-black text-base">{activeEntity.label}</h1>
            <p className="text-[10px] text-muted-foreground">Direct database management — changes save instantly</p>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-700">Live Database</span>
          </div>
        </div>

        {/* Entity manager */}
        <div className="flex-1 overflow-hidden p-6">
          <EntityManager key={activeEntity.name} entity={activeEntity} />
        </div>
      </div>
    </div>
  );
}