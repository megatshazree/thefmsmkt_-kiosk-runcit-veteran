
import React from 'react';
import { KioskMenuItem, EmployeePermission, PaymentMethod } from '../types'; // Added EmployeePermission, PaymentMethod
import { HomeIcon, ShoppingCartIcon, ArchiveBoxIcon, UsersIcon, UserGroupIcon, ChartBarIcon, Cog6ToothIcon, CameraIcon, EyeIcon, InboxArrowDownIcon, RectangleStackIcon } from '@heroicons/react/24/outline';


const iconClass = "h-6 w-6";
const kioskIconClass = "h-12 w-12 mb-3 text-white"; // Kiosk cards have white icons

export const sidebarMenuItems: KioskMenuItem[] = [
    { id: 'dashboard-content', translationKey: 'nav_dashboard', icon: <HomeIcon className={iconClass} />, color: '', path: '/dashboard' },
    { id: 'pos-content', translationKey: 'nav_pos', icon: <ShoppingCartIcon className={iconClass} />, color: '', path: '/pos' },
    { id: 'vision-checkout-content', translationKey: 'nav_vision_checkout', icon: <CameraIcon className={iconClass} />, color: '', path: '/vision-checkout'},
    { id: 'inventory-content', translationKey: 'nav_inventory', icon: <ArchiveBoxIcon className={iconClass} />, color: '', path: '/inventory' },
    { id: 'inventory-stock-in-content', translationKey: 'nav_vision_stock_in', icon: <InboxArrowDownIcon className={iconClass} />, color: '', path: '/inventory/vision-stock-in' },
    { id: 'inventory-monitoring-content', translationKey: 'nav_inventory_monitoring', icon: <EyeIcon className={iconClass} />, color: '', path: '/inventory/monitoring' },
    { id: 'product-sets-content', translationKey: 'nav_product_sets', icon: <RectangleStackIcon className={iconClass} />, color: '', path: '/product-sets'},
    { id: 'crm-content', translationKey: 'nav_crm', icon: <UsersIcon className={iconClass} />, color: '', path: '/crm' },
    { id: 'employee-content', translationKey: 'nav_employee', icon: <UserGroupIcon className={iconClass} />, color: '', path: '/employees' },
    { id: 'reports-content', translationKey: 'nav_reports', icon: <ChartBarIcon className={iconClass} />, color: '', path: '/reports' },
    { id: 'settings-content', translationKey: 'nav_settings', icon: <Cog6ToothIcon className={iconClass} />, color: '', path: '/settings' },
];

const kioskItemColors = [
    'bg-[var(--theme-accent-purple)] hover:brightness-110',
    'bg-[var(--theme-accent-magenta)] hover:brightness-110',
    'bg-[var(--theme-accent-cyan)] hover:brightness-110 text-slate-900', // Cyan might need darker text
    'bg-teal-600 hover:bg-teal-500', // Example fallback if not enough theme accents
    'bg-sky-600 hover:bg-sky-500',
    'bg-indigo-600 hover:bg-indigo-500',
];

export const kioskMenuItems: KioskMenuItem[] = sidebarMenuItems.map((item, index) => ({
    ...item,
    icon: React.cloneElement(item.icon, { className: `${kioskIconClass} ${item.path === '/vision-checkout' || item.path === '/inventory/monitoring' || item.path === '/inventory/vision-stock-in' ? 'text-white' : 'text-white'}` }), // Ensure icons on specific cards are white if bg is dark
    color: item.path === '/pos' ? 'bg-[var(--theme-accent-purple)] hover:brightness-110' : 
           item.path === '/inventory' ? 'bg-[var(--theme-accent-magenta)] hover:brightness-110' :
           item.path === '/vision-checkout' ? 'bg-[var(--theme-accent-cyan)] hover:brightness-110 text-slate-800' : // Cyan uses darker text
           item.path === '/crm' ? 'bg-pink-600 hover:bg-pink-500' : // Example additional color
           item.path === '/reports' ? 'bg-orange-500 hover:bg-orange-400' :
           kioskItemColors[index % kioskItemColors.length], // Cycle through colors
    translationKey: item.translationKey.replace('nav_', 'kiosk_card_') 
})).filter(item => !item.path.startsWith('/inventory/') && item.path !== '/product-sets' && item.id !== 'settings-content' && item.id !== 'employee-content');

// Add specific kiosk cards for the new inventory modules if desired
kioskMenuItems.push(
    { id: 'kiosk-inventory-stock-in', translationKey: 'kiosk_card_vision_stock_in', icon: <InboxArrowDownIcon className={kioskIconClass + " text-white"} />, color: 'bg-emerald-600 hover:bg-emerald-500', path: '/inventory/vision-stock-in' },
    { id: 'kiosk-inventory-monitoring', translationKey: 'kiosk_card_inventory_monitoring', icon: <EyeIcon className={kioskIconClass + " text-white"} />, color: 'bg-cyan-700 hover:bg-cyan-600', path: '/inventory/monitoring' },
    { id: 'kiosk-product-sets', translationKey: 'kiosk_card_product_sets', icon: <RectangleStackIcon className={kioskIconClass + " text-white"} />, color: 'bg-fuchsia-700 hover:bg-fuchsia-600', path: '/product-sets' }
);


export const departmentOptions = [
    { value: 'sales', labelKey: 'department_sales' },
    { value: 'inventory', labelKey: 'department_inventory' },
    { value: 'management', labelKey: 'department_management' },
];

export const roleOptions = [
    { value: 'cashier', labelKey: 'role_cashier' },
    { value: 'manager', labelKey: 'role_manager' },
    { value: 'admin', labelKey: 'role_admin' },
];

export const permissionOptions = [ // Define permission options here
    { id: 'perm-full-access', labelKey: 'perm_full_access', permissionKey: 'fullAccess' as keyof EmployeePermission },
    { id: 'perm-manual-discount', labelKey: 'perm_manual_discount', permissionKey: 'manualDiscount' as keyof EmployeePermission },
    { id: 'perm-process-refund', labelKey: 'perm_process_refund', permissionKey: 'processRefund' as keyof EmployeePermission },
];

export const posCategoryTranslationKeys = [
    "pos_cat_all", 
    "pos_cat_drinks",          // Minuman
    "pos_cat_snacks",          // Snek
    "pos_cat_bakery",          // Roti & Bakeri
    "pos_cat_rte",             // Makanan Sedia
    "pos_cat_biscuits",        // Biskut
    "pos_cat_candies",         // Coklat & Gula-gula
    "pos_cat_fruits_nuts",     // Buah & Kekacang
    "pos_cat_toiletries",      // Peralatan Mandian
    "pos_cat_health_basic",    // Kesihatan Asas
    "pos_cat_hygiene",         // Kebersihan
    "pos_cat_apparel_basic",   // Pakaian Asas
    "pos_cat_electronics",     // Elektronik
    "pos_cat_gifts",           // Hadiah
    "pos_cat_publications",    // Penerbitan
    "pos_cat_stationery",      // Alat Tulis
    "pos_cat_tobacco",         // Tembakau
    "pos_cat_digital_services",// Servis Digital
    "pos_cat_physical_services",// Servis Fizikal
    "pos_cat_others"           // Lain-lain
];


export const paymentMethods: PaymentMethod[] = [
    { key: 'cash', labelKey: 'payment_method_cash' },
    { key: 'card', labelKey: 'payment_method_card' },
    { key: 'ewallet', labelKey: 'payment_method_ewallet' },
    { key: 'points', labelKey: 'payment_method_points' },
];

export const returnActionTypes = [
    { value: 'refund', labelKey: 'return_type_refund' },
    { value: 'exchange', labelKey: 'return_type_exchange' },
    { value: 'store_credit', labelKey: 'return_type_store_credit' },
];