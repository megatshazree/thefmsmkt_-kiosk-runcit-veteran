
import React from 'react';
import { 
    CakeIcon, // Desserts, Bakery
    SparklesIcon, // Default, Gifts
    ShoppingBagIcon, // Apparel, Groceries
    CubeIcon, // Others, Homecare, Stationery
    BoltIcon, // Electronics
    BuildingStorefrontIcon, // Physical Services
    CloudIcon, // Digital Services
    CreditCardIcon, // Placeholder
    CurrencyDollarIcon, // Placeholder
    GiftIcon, // Gifts (Alternative)
    HomeIcon, // Homecare (Alternative)
    NewspaperIcon, // Publications
    PuzzlePieceIcon, // Placeholder / Toys
    ReceiptPercentIcon, // Placeholder
    ScaleIcon, // Placeholder
    NoSymbolIcon, // Tobacco (as a warning/neutral)
    TagIcon, // Apparel (Alternative)
    TicketIcon, // Placeholder
    UserGroupIcon, // Placeholder
    WrenchScrewdriverIcon, // Tools/Physical Services (Alternative)
    AcademicCapIcon, // Placeholder
    ArchiveBoxIcon, // Groceries (Alternative)
    BanknotesIcon, // Placeholder
    BeakerIcon, // Health/Basic
    BriefcaseIcon, // Placeholder
    BuildingLibraryIcon, // Placeholder
    ChartPieIcon, // Placeholder
    ClipboardDocumentCheckIcon, // Placeholder
    ComputerDesktopIcon, // Electronics (Alternative)
    CpuChipIcon, // Electronics (Alternative)
    DevicePhoneMobileIcon, // Digital Services (Alternative)
    FireIcon, // Placeholder / Hot Food
    FlagIcon, // Placeholder
    GlobeAltIcon, // Placeholder / Imported
    HeartIcon, // Health (Alternative)
    LightBulbIcon, // Placeholder
    LinkIcon, // Placeholder
    LockClosedIcon, // Placeholder
    MapIcon, // Placeholder
    MegaphoneIcon, // Placeholder
    MusicalNoteIcon, // Placeholder
    PaintBrushIcon, // Placeholder / Gifts
    PaperAirplaneIcon, // Placeholder
    PencilSquareIcon, // Stationery (Alternative)
    PhoneIcon, // Digital Services (Alternative)
    PhotoIcon, // Publications (Alternative)
    PresentationChartLineIcon, // Placeholder
    QrCodeIcon, // Placeholder
    QuestionMarkCircleIcon, // Default (Alternative)
    ShieldCheckIcon, // Health (Alternative)
    ShoppingCartIcon, // General POS, Groceries
    SpeakerWaveIcon, // Electronics (Alternative)
    StarIcon, // Gifts (Alternative)
    SunIcon, // Placeholder / Fruits
    TableCellsIcon, // Placeholder
    TvIcon, // Electronics (Alternative)
    UsersIcon, // Placeholder
    VariableIcon, // Placeholder
    VideoCameraIcon, // Placeholder
    WifiIcon, // Digital Services (Alternative)
    AdjustmentsHorizontalIcon, // For "All"
    RectangleStackIcon, // For "All" (Alternative)
    Squares2X2Icon, // For "All" (Alternative)
    InformationCircleIcon, // For "Others"
    StopCircleIcon // For "Tobacco" (Alternative)
} from '@heroicons/react/24/outline'; 

// Helper to map existing translation keys to more generic icons and colors
// This is a sample mapping; you might need to adjust it based on your actual categories
// and the visual style you're aiming for from "CosyPOS" which has fewer, broader categories.

export interface CategoryStyle {
  key: string; // Category key identifier
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  bgColor: string; // CSS variable for background
  translationKey: string;
  displayName: string; // Display name for the category
  count?: number; // Number of items in this category
  itemCount?: number; // Optional, can be fetched dynamically
}

const categoryColors = [
  'var(--theme-pastel-mint)',
  'var(--theme-pastel-lavender)',
  'var(--theme-pastel-blue)',
  'var(--theme-pastel-pink)',
  'var(--theme-pastel-periwinkle)',
  'var(--theme-pastel-peach)',
  'var(--theme-pastel-sky)',
  'var(--theme-pastel-lime)',
];

// This is a simplified mapping. For CosyPOS style, you'd likely have fewer, broader categories.
// I'm mapping the first few distinct mock categories.
// The "itemCount" would ideally come from your actual product data.
export const getStyledCategories = (allCategories: string[], productCounts: Record<string, number>): CategoryStyle[] => {
  const distinctCategories = Array.from(new Set(allCategories.filter(cat => cat !== "Semua")));
  
  // Define specific icons for some expected categories from CosyPOS if they match your keys
  const iconMap: Record<string, React.ReactElement<React.SVGProps<SVGSVGElement>>> = {
    "pos_cat_drinks": <SparklesIcon className="h-8 w-8" />, // Placeholder, find a "Drink" icon like wine glass in CosyPOS
    "pos_cat_snacks": <SparklesIcon className="h-8 w-8" />, // Placeholder, find a "Snack" icon
    "pos_cat_bakery": <CakeIcon className="h-8 w-8" />,
    "pos_cat_rte": <FireIcon className="h-8 w-8" />, // Ready-to-eat / Hot food
    "pos_cat_food": <SparklesIcon className="h-8 w-8" />, // General Food placeholder
    "pos_cat_apparel": <TagIcon className="h-8 w-8" />,
    "pos_cat_groceries": <ShoppingCartIcon className="h-8 w-8" />,
    "pos_cat_homecare": <HomeIcon className="h-8 w-8" />,
    "pos_cat_biscuits": <SparklesIcon className="h-8 w-8" />, // Placeholder
    "pos_cat_candies": <SparklesIcon className="h-8 w-8" />, // Placeholder
    "pos_cat_fruits_nuts": <SunIcon className="h-8 w-8" />,
    "pos_cat_toiletries": <BeakerIcon className="h-8 w-8" />, // Placeholder for toiletries
    "pos_cat_health_basic": <HeartIcon className="h-8 w-8" />,
    "pos_cat_electronics": <ComputerDesktopIcon className="h-8 w-8" />,
    "pos_cat_gifts": <GiftIcon className="h-8 w-8" />,
    "pos_cat_stationery": <PencilSquareIcon className="h-8 w-8" />,
    "pos_cat_tobacco": <StopCircleIcon className="h-8 w-8" />,
    "pos_cat_others": <InformationCircleIcon className="h-8 w-8" />,
    "default": <CubeIcon className="h-8 w-8" />
  };

  // Create styled categories for the POS display, e.g., the first 8
  const styled: CategoryStyle[] = distinctCategories.slice(0, 8).map((categoryName, index) => {
    // Attempt to match categoryName (e.g., "Minuman") to a translationKey suffix (e.g., "drinks")
    const keySuffix = categoryName.toLowerCase()
      .replace(/ & /g, '_')
      .replace(/ /g, '_')
      .replace(/[^a-z0-9_]/gi, ''); // Sanitize
    
    const translationKey = `pos_cat_${keySuffix}`;
    
    let icon = iconMap[translationKey] || iconMap['default'];
    
    // Special handling for "Breakfast", "Soups", "Pasta", "Sushi", "Main course", "Desserts", "Drinks", "Alcohol" if your keys match
    // Example for "Drinks": If your translationKey for "Minuman" is "pos_cat_drinks", it will use the mapped icon.
    // If "Main Course" from CosyPOS maps to your "pos_cat_rte" (Ready-to-Eat), it'll pick FireIcon.

    return {
      key: translationKey, // Use translationKey as the key
      translationKey: translationKey, // This needs to exist in your translation files
      displayName: categoryName, // Use the original category name as display name
      icon: icon,
      bgColor: categoryColors[index % categoryColors.length],
      count: productCounts[categoryName] || 0,
      itemCount: productCounts[categoryName] || 0,
    };
  });

  // Add an "All" category if you want
   styled.unshift({
    key: "pos_cat_all",
    translationKey: "pos_cat_all",
    displayName: "All",
    icon: <Squares2X2Icon className="h-8 w-8" />,
    bgColor: 'var(--theme-panel-bg-alt)', // Darker, different style for "All"
    count: Object.values(productCounts).reduce((sum, count) => sum + count, 0),
    itemCount: Object.values(productCounts).reduce((sum, count) => sum + count, 0)
  });
  
  return styled;
};

// Example icons from CosyPOS for reference (need to map your categories to these concepts)
// Breakfast: SunIcon or similar
// Soups: BeakerIcon (if representing liquids) or a custom bowl icon
// Pasta: Some kind of food icon
// Sushi: Some kind of food icon
// Main course: FireIcon or plate icon
// Desserts: CakeIcon
// Drinks: Wine glass or cup icon from Heroicons (e.g., SparklesIcon as generic, or specific ones if available)
// Alcohol: Wine glass or similar
// These are conceptual; you'll need to choose appropriate Heroicons.
// For the "number of items" (e.g., "13 items"), this data needs to be calculated based on your products.
