import { useState, useEffect, useRef } from 'react';

// ============================================
// HOME DASHBOARD - 8020REI INVESTOR PLATFORM
// React + Tailwind CSS Implementation
// Based on: Claude_Prompt_Narrative_NoFigma.md
// ============================================

// Design tokens from specification
const colors = {
  background: '#F6F8FB',
  surface: '#FFFFFF',
  primary: '#0B6BFF',
  success: '#1FA97A',
  warning: '#F4D27A',
  danger: '#E54646',
  text: {
    primary: '#14181F',
    secondary: '#475166',
    muted: '#8A94A6',
  },
  // Extended palette for gradients and accents
  blue: {
    50: '#EBF3FF',
    100: '#D6E7FF',
    500: '#0B6BFF',
    600: '#0956D9',
    700: '#0744B3',
    800: '#05338D',
    900: '#042367',
  },
};

// Card shadow from spec
const cardShadow = '0 1px 2px rgba(0,0,0,.06), 0 8px 24px rgba(0,0,0,.06)';

// ============================================
// DISTRESS DEFINITIONS (from spec section 6.3)
// Used for tooltips and selection modal
// ============================================

const distressDefinitions = {
  'Downsizing': "A mismatch between a senior's housing needs and their current property",
  '30–60 Days': "When the owner of a property hasn't paid their mortgage for 1–2 months.",
  'Estate': "A property that belonged to someone who passed away. Now, it's being sold as part of settling their belongings and money.",
  'Probate': "When a property is being handled after the owner passes away. The court decides who gets the property or if it should be sold.",
  'Divorce': "When a couple splits up and needs to sell their home quickly to divide the money.",
  'Absentee': "A property where the owner doesn't live there.",
  'Taxes': "When the owner of a property hasn't paid their taxes.",
  'Bankruptcy': "When someone can't pay their debts and goes to court to figure out what to do.",
  'Debt Collection': "When someone owes money (like for a mortgage or loan), and the bank or company tries to get it back.",
  'Low Credit': "People who own a property but don't make much money and might have trouble paying their bills.",
  'Eviction': "When a landlord kicks out a tenant because they didn't pay rent or broke the rules of their lease.",
  'Failing Listing Weight': "When a property has been put up for sale but didn't sell.",
  'Mechanic Lien': "When a contractor or worker isn't paid for repairs or construction done on a property.",
  'City/County Lien': "When the owner of a property owes money to the local government, like for unpaid taxes or fines.",
  'Utility Lien': "When the owner of a property hasn't paid their utility bills (like water, electricity, or gas).",
  'Water Shut Off': "When the water service to a property is turned off because the bills weren't paid.",
  'HOA Lien': "When the owner of a property owes money to their homeowners' association (HOA).",
  'Other Lien': "When there are other types of debts or claims on a property, like unpaid bills or fines.",
  'Misc': "Extra information about a property that doesn't fit into the other categories.",
  'Equity': "When a property is worth a lot more than what's still owed on it.",
  'Inter Family Transfer': "When a property is sold or transferred between family members, like from parents to kids.",
  'Senior +55': "A property owned by an older person, usually 55 years or older.",
  'Poor condition': "A property that's in really bad shape. It might have broken walls, leaky roofs, or old pipes and wires that need fixing.",
  'Judgement': "When a court makes a decision about who owns a property or how to solve a fight over it.",
  'Vacant': "When a property is empty and no one is living there.",
  'Pre-Foreclosure': "When a property owner has missed mortgage payments and the lender has begun the foreclosure process.",
  'Fire Damage': "A property that has been damaged by fire and may need significant repairs.",
  'D4D': "Driving for Dollars - properties identified through physical neighborhood scouting.",
  'Life Event': "Properties where owners are experiencing significant life changes.",
};

// ============================================
// ICON COMPONENTS
// ============================================

const IconInfo = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 7v4M8 5v0.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconEdit = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none">
    <path d="M11.5 2.5l2 2-8 8H3.5v-2l8-8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

const IconChevronDown = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none">
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconChevronRight = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none">
    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconCheck = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none">
    <path d="M13 4L6 11L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconPlus = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none">
    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconMinus = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconFullscreen = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none">
    <path d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconClose = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none">
    <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconHome = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none">
    <path d="M3 10l7-7 7 7M5 8.5v8.5h10V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconChart = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none">
    <path d="M3 17V9l4 2 4-6 4 4 2-2v10H3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

const IconProperties = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none">
    <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const IconBuybox = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none">
    <rect x="2" y="5" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6 5V3a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2 9h16" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const IconCampaign = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none">
    <path d="M3 5l14-2v14l-14-2V5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M3 8v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconSettings = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10 1v2M10 17v2M19 10h-2M3 10H1M16.36 3.64l-1.42 1.42M5.05 14.95l-1.42 1.42M16.36 16.36l-1.42-1.42M5.05 5.05L3.64 3.64" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconWarning = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none">
    <path d="M8 1l7 13H1L8 1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M8 6v3M8 11v0.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconHelp = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6 6.5a2 2 0 113 1.73c-.5.29-1 .77-1 1.27v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="12" r="0.75" fill="currentColor" />
  </svg>
);

const IconClock = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 4.5V8l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconArrowRight = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ============================================
// TOOLTIP COMPONENT
// Accessible tooltip with hover and focus
// ============================================

function Tooltip({ children, content, className = '', position = 'top' }) {
  const [visible, setVisible] = useState(false);
  const tooltipRef = useRef(null);

  // Handle ESC key to close tooltip
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setVisible(false);
    };
    if (visible) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [visible]);

  // Don't show tooltip if content is empty
  const shouldShowTooltip = visible && content;

  // Position classes based on position prop
  const positionClasses = position === 'right'
    ? 'left-full top-1/2 -translate-y-1/2 ml-2'
    : 'bottom-full left-1/2 -translate-x-1/2 mb-2';

  const arrowClasses = position === 'right'
    ? 'right-full top-1/2 -translate-y-1/2 -mr-1 rotate-45'
    : 'top-full left-1/2 -translate-x-1/2 -mt-1 rotate-45';

  return (
    <div className={`relative inline-flex ${className}`}>
      <div
        onMouseEnter={() => content && setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => content && setVisible(true)}
        onBlur={() => setVisible(false)}
        tabIndex={content ? 0 : undefined}
        aria-describedby={shouldShowTooltip ? 'tooltip' : undefined}
      >
        {children}
      </div>
      {shouldShowTooltip && (
        <div
          ref={tooltipRef}
          id="tooltip"
          role="tooltip"
          className={`absolute z-50 px-3 py-2 text-xs text-white bg-gray-900 rounded-lg shadow-lg max-w-xs whitespace-nowrap ${positionClasses}`}
        >
          {content}
          <div className={`absolute w-2 h-2 bg-gray-900 ${arrowClasses}`} />
        </div>
      )}
    </div>
  );
}

// ============================================
// ANIMATED COUNTER COMPONENT
// Rolling digit animation for hero banner
// ============================================

function AnimatedCounter({ value, className = '' }) {
  const [displayValue, setDisplayValue] = useState(value);

  // Animate +1 every second as per spec
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayValue(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format number with commas
  const formatted = displayValue.toLocaleString();

  return (
    <div
      className={`font-bold tracking-tight ${className}`}
      aria-live="polite"
      aria-atomic="true"
    >
      {formatted.split('').map((char, i) => (
        <span
          key={i}
          className="inline-block transition-transform duration-300"
          style={{
            animation: char !== ',' ? 'roll-in 0.3s ease-out' : 'none'
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
}

// ============================================
// SIDEBAR TOGGLE ICON
// ============================================

const IconChevronLeft = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none">
    <path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconMenu = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none">
    <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// ============================================
// SIDEBAR COMPONENT
// Collapsible left navigation
// ============================================

function Sidebar({ collapsed, onToggle }) {
  const navItems = [
    { icon: IconHome, label: 'Home', active: true },
    { icon: IconChart, label: 'Analytics', active: false },
    { icon: IconProperties, label: 'Properties', active: false },
    { icon: IconBuybox, label: 'Buybox', active: false },
    { icon: IconCampaign, label: 'DM Campaign', active: false },
    { icon: IconSettings, label: 'Settings', active: false },
  ];

  return (
    <aside
      className={`h-full bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out ${collapsed ? 'w-[72px]' : 'w-[240px]'
        }`}
    >
      {/* Logo area */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-gray-100">
        <div className={`flex items-center gap-2 overflow-hidden ${collapsed ? 'justify-center w-full' : ''}`}>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">80</span>
          </div>
          <span
            className={`font-semibold text-gray-900 whitespace-nowrap transition-opacity duration-200 ${collapsed ? 'opacity-0 w-0' : 'opacity-100'
              }`}
          >
            8020REI
          </span>
        </div>

        {/* Toggle button - only visible when expanded */}
        {!collapsed && (
          <button
            onClick={onToggle}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Collapse sidebar"
          >
            <IconChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <div className="px-3 py-3">
          <button
            onClick={onToggle}
            className="w-full p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center"
            aria-label="Expand sidebar"
          >
            <IconMenu className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.label}>
              <Tooltip
                content={collapsed ? item.label : ''}
                position="right"
                className={collapsed ? '' : 'pointer-events-none'}
              >
                <a
                  href="#"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${collapsed ? 'justify-center' : ''}
                    ${item.active
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  <span
                    className={`whitespace-nowrap transition-all duration-200 ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                      }`}
                  >
                    {item.label}
                  </span>
                </a>
              </Tooltip>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className={`p-4 border-t border-gray-100 ${collapsed ? 'px-3' : ''}`}>
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
            <span className="text-sm font-medium text-gray-600">JD</span>
          </div>
          <div
            className={`flex-1 min-w-0 transition-all duration-200 ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
              }`}
          >
            <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
            <p className="text-xs text-gray-500 truncate">john@8020rei.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ============================================
// TOP BAR COMPONENT
// 56px height header
// ============================================

function TopBar() {
  return (
    <header className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-gray-900">Home Dashboard</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg w-64">
          <svg className="w-4 h-4 text-gray-400" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search properties..."
            className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none flex-1"
          />
        </div>

        {/* Notifications */}
        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
            <path d="M10 2a6 6 0 016 6v3l2 2v1H2v-1l2-2V8a6 6 0 016-6zM8 17h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </header>
  );
}

// ============================================
// HERO BANNER COMPONENT
// "Capture opportunities instantly" with counter
// Exact match to Figma design node 5082:29149
// ============================================

function HeroBanner() {
  const [counterValue, setCounterValue] = useState(232);

  // Animate +1 every second as per spec
  useEffect(() => {
    const interval = setInterval(() => {
      setCounterValue(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format number to individual digits
  const digits = counterValue.toString().split('');

  return (
    <div
      className="relative h-[139px] rounded-xl overflow-hidden"
      style={{
        background: 'linear-gradient(90deg, #0A1628 0%, #102A4C 25%, #1A3A5C 50%, #102A4C 75%, #0A1628 100%)',
      }}
    >
      {/* Network/particle decoration - Left side (opacity 50% per Figma) */}
      <div className="absolute left-0 top-0 h-[139px] w-[385px] opacity-50">
        <svg className="w-full h-full" viewBox="0 0 385 139" preserveAspectRatio="xMinYMid slice">
          {/* Network nodes */}
          <circle cx="40" cy="100" r="4" fill="#3B82F6" opacity="0.8" />
          <circle cx="80" cy="70" r="3" fill="#3B82F6" opacity="0.6" />
          <circle cx="60" cy="50" r="2.5" fill="#3B82F6" opacity="0.5" />
          <circle cx="120" cy="90" r="3.5" fill="#3B82F6" opacity="0.7" />
          <circle cx="100" cy="55" r="2" fill="#3B82F6" opacity="0.4" />
          <circle cx="150" cy="75" r="2.5" fill="#3B82F6" opacity="0.5" />
          <circle cx="170" cy="110" r="3" fill="#3B82F6" opacity="0.6" />
          <circle cx="200" cy="60" r="2" fill="#3B82F6" opacity="0.4" />
          {/* Connecting lines */}
          <line x1="40" y1="100" x2="80" y2="70" stroke="#3B82F6" strokeWidth="1" opacity="0.3" />
          <line x1="80" y1="70" x2="60" y2="50" stroke="#3B82F6" strokeWidth="1" opacity="0.3" />
          <line x1="80" y1="70" x2="120" y2="90" stroke="#3B82F6" strokeWidth="1" opacity="0.3" />
          <line x1="60" y1="50" x2="100" y2="55" stroke="#3B82F6" strokeWidth="1" opacity="0.3" />
          <line x1="120" y1="90" x2="150" y2="75" stroke="#3B82F6" strokeWidth="1" opacity="0.3" />
          <line x1="120" y1="90" x2="170" y2="110" stroke="#3B82F6" strokeWidth="1" opacity="0.3" />
          <line x1="150" y1="75" x2="200" y2="60" stroke="#3B82F6" strokeWidth="1" opacity="0.3" />
          <line x1="100" y1="55" x2="150" y2="75" stroke="#3B82F6" strokeWidth="1" opacity="0.3" />
          {/* Glow effect */}
          <ellipse cx="80" cy="130" rx="80" ry="30" fill="url(#leftGlow)" />
          <defs>
            <radialGradient id="leftGlow">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Network/particle decoration - Right side (opacity 50% per Figma) */}
      <div className="absolute right-0 top-0 h-[139px] w-[385px] opacity-50">
        <svg className="w-full h-full" viewBox="0 0 385 139" preserveAspectRatio="xMaxYMid slice">
          {/* Network nodes */}
          <circle cx="345" cy="100" r="4" fill="#3B82F6" opacity="0.8" />
          <circle cx="305" cy="70" r="3" fill="#3B82F6" opacity="0.6" />
          <circle cx="325" cy="50" r="2.5" fill="#3B82F6" opacity="0.5" />
          <circle cx="265" cy="90" r="3.5" fill="#3B82F6" opacity="0.7" />
          <circle cx="285" cy="55" r="2" fill="#3B82F6" opacity="0.4" />
          <circle cx="235" cy="75" r="2.5" fill="#3B82F6" opacity="0.5" />
          <circle cx="215" cy="110" r="3" fill="#3B82F6" opacity="0.6" />
          <circle cx="185" cy="60" r="2" fill="#3B82F6" opacity="0.4" />
          {/* Connecting lines */}
          <line x1="345" y1="100" x2="305" y2="70" stroke="#3B82F6" strokeWidth="1" opacity="0.3" />
          <line x1="305" y1="70" x2="325" y2="50" stroke="#3B82F6" strokeWidth="1" opacity="0.3" />
          <line x1="305" y1="70" x2="265" y2="90" stroke="#3B82F6" strokeWidth="1" opacity="0.3" />
          <line x1="325" y1="50" x2="285" y2="55" stroke="#3B82F6" strokeWidth="1" opacity="0.3" />
          <line x1="265" y1="90" x2="235" y2="75" stroke="#3B82F6" strokeWidth="1" opacity="0.3" />
          <line x1="265" y1="90" x2="215" y2="110" stroke="#3B82F6" strokeWidth="1" opacity="0.3" />
          <line x1="235" y1="75" x2="185" y2="60" stroke="#3B82F6" strokeWidth="1" opacity="0.3" />
          <line x1="285" y1="55" x2="235" y2="75" stroke="#3B82F6" strokeWidth="1" opacity="0.3" />
          {/* Glow effect */}
          <ellipse cx="305" cy="130" rx="80" ry="30" fill="url(#rightGlow)" />
          <defs>
            <radialGradient id="rightGlow">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Main content container - matches Figma padding and gap */}
      <div className="relative h-full flex items-center justify-center gap-[94px] px-6 py-6">

        {/* Left content - Text section */}
        <div className="flex flex-col gap-3 flex-1 max-w-[400px]">
          <h2
            className="text-[22px] font-semibold leading-[1.36]"
            style={{ letterSpacing: '-0.5px' }}
          >
            <span className="text-white">Capture opportunities </span>
            <span className="text-[#3484F5]">instantly</span>
          </h2>
          <p className="text-[14px] text-white leading-[1.36]">
            Send personalized offers the moment new properties match your criteria and convert qualified prospects into deals automatically.
          </p>
        </div>

        {/* Center - Counter card */}
        <div
          className="flex items-center gap-4 p-4 rounded-xl shrink-0"
          style={{
            background: 'linear-gradient(107.53deg, rgba(255, 255, 255, 0.2) 7.32%, rgba(109, 215, 232, 0.2) 95.07%)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
          }}
        >
          {/* Left section - Description text */}
          <div className="w-[140px] text-[14px] text-[#F1F6FD] leading-[1.36]">
            New properties you haven't contacted this week.
          </div>

          {/* Right section - Counter */}
          <div className="flex flex-col gap-0.5 items-end">
            <span className="text-[12px] text-white leading-[1.36] text-center h-4">
              Missed this week
            </span>
            <div
              className="flex gap-0.5"
              aria-live="polite"
              aria-atomic="true"
            >
              {digits.map((digit, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center px-2 py-1 rounded-lg text-[24px] font-semibold text-white text-center"
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    letterSpacing: '-0.5px',
                    lineHeight: '1.36',
                  }}
                >
                  {digit}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex flex-col gap-3 items-end shrink-0">
          {/* Why Rapid Response? Tag - Light background style */}
          <Tooltip content="Rapid Response sends direct mail automatically when new properties enter the system or meet your Buybox criteria.">
            <button
              className="flex items-center gap-2 px-2 py-0.5 h-6 rounded bg-[#F1F6FD] hover:bg-[#E2ECFA] transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-[#14275F]" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.25" />
                <path d="M5.5 5.5a1.5 1.5 0 112.25 1.3c-.38.22-.75.58-.75.95v.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                <circle cx="7" cy="10" r="0.6" fill="currentColor" />
              </svg>
              <span className="text-[12px] font-medium text-[#14275F] leading-[1.36]">
                Why Rapid Response?
              </span>
            </button>
          </Tooltip>

          {/* Enable Rapid Response Button - White with border */}
          <button
            className="flex items-center justify-center gap-2 px-4 py-2 h-9 min-w-[120px] rounded-md bg-white hover:bg-gray-50 transition-colors"
            style={{
              border: '0.5px solid #979BA4',
            }}
          >
            <span className="text-[14px] font-medium text-[#4B5566] leading-[1.36]">
              Enable Rapid Response
            </span>
            <svg className="w-5 h-5 text-[#4B5566]" viewBox="0 0 20 20" fill="none">
              <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// IMMEDIATE ACTION CARD
// Individual distress action card
// ============================================

function ActionCard({ distress, ldsScore, count }) {
  return (
    <div className="p-3 bg-white border border-gray-100 rounded-lg hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer">
      {/* Header: Distress name + LDS badge */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-700">{distress}</span>
        <span className="px-1.5 py-0.5 bg-green-50 text-green-600 text-[10px] font-medium rounded">
          Avg. LDS {ldsScore}
        </span>
      </div>

      {/* Main value - primary focal point */}
      <div className="text-2xl font-bold text-blue-600 mb-1">
        {count}
      </div>

      {/* Supporting text with info icon */}
      <div className="flex items-center gap-1">
        <span className="text-[11px] text-gray-400">Recently updated in your Buybox</span>
        <Tooltip content="Updated in the last few days based on Buybox criteria.">
          <button className="text-gray-300 hover:text-gray-400">
            <IconInfo className="w-3 h-3" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}

// ============================================
// IMMEDIATE ACTION SECTION
// Grid of 6 action cards with selection modal
// ============================================

function ImmediateActionSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDistresses, setSelectedDistresses] = useState([
    'Pre-Foreclosure', '30–60 Days', 'Fire Damage',
    'D4D', 'Estate', 'Probate'
  ]);

  const actionData = [
    { distress: 'Pre-Foreclosure', ldsScore: 89, count: '1.2K' },
    { distress: '30–60 Days', ldsScore: 86, count: '892' },
    { distress: 'Fire Damage', ldsScore: 91, count: '234' },
    { distress: 'D4D', ldsScore: 88, count: '567' },
    { distress: 'Estate', ldsScore: 85, count: '445' },
    { distress: 'Probate', ldsScore: 87, count: '678' },
  ];

  return (
    <div
      className="bg-white rounded-xl p-5 h-full"
      style={{ boxShadow: cardShadow }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          <h3 className="text-lg font-semibold text-gray-900">Immediate action required</h3>
          <Tooltip content="These properties were recently updated in your Buybox and are not registered as leads. They should be contacted immediately.">
            <button className="text-gray-400 hover:text-gray-500">
              <IconInfo className="w-3.5 h-3.5" />
            </button>
          </Tooltip>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded transition-colors"
        >
          <IconEdit className="w-3.5 h-3.5" />
          Edit
        </button>
      </div>

      {/* Cards Grid - 3 columns x 2 rows */}
      <div className="grid grid-cols-3 gap-3">
        {actionData.map((item) => (
          <ActionCard key={item.distress} {...item} />
        ))}
      </div>

      {/* Selection Modal */}
      {modalOpen && (
        <SelectionModal
          selected={selectedDistresses}
          onClose={() => setModalOpen(false)}
          onConfirm={(selected) => {
            setSelectedDistresses(selected);
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

// ============================================
// SELECTION MODAL
// Multi-select for 6 distresses
// ============================================

function SelectionModal({ selected, onClose, onConfirm }) {
  const [localSelected, setLocalSelected] = useState(selected);
  const modalRef = useRef(null);

  // Focus trap and ESC handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    modalRef.current?.focus();
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const toggleDistress = (distress) => {
    if (localSelected.includes(distress)) {
      setLocalSelected(localSelected.filter(d => d !== distress));
    } else if (localSelected.length < 6) {
      setLocalSelected([...localSelected, distress]);
    }
  };

  const distressList = Object.keys(distressDefinitions);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Select the 6 distresses to display
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            <IconClose className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Selected: {localSelected.length}/6
        </p>

        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
          {distressList.map((distress) => (
            <label
              key={distress}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                ${localSelected.includes(distress)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
                }
                ${!localSelected.includes(distress) && localSelected.length >= 6
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
                }`}
            >
              <input
                type="checkbox"
                checked={localSelected.includes(distress)}
                onChange={() => toggleDistress(distress)}
                disabled={!localSelected.includes(distress) && localSelected.length >= 6}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{distress}</p>
                <p className="text-xs text-gray-500 truncate">{distressDefinitions[distress]}</p>
              </div>
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(localSelected)}
            disabled={localSelected.length !== 6}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// DM CAMPAIGN CARD
// Promotional enablement module for first-time users
// ============================================

function DMCampaignCard() {
  return (
    <div
      className="bg-white rounded-xl p-6 h-full flex flex-col"
      style={{ boxShadow: cardShadow }}
    >
      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Enable your first DM campaign
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-5">
        Reach qualified sellers automatically with Rapid Response or SmartDrop.
      </p>

      {/* Value highlight banner */}
      <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 rounded-lg mb-5">
        <IconClock className="w-4 h-4 text-blue-600 flex-shrink-0" />
        <span className="text-sm text-blue-600">Time saved per deal:</span>
        <span className="text-sm font-semibold text-blue-600">48 hours (est.)</span>
      </div>

      {/* Spacer to push button to bottom */}
      <div className="flex-grow" />

      {/* Primary CTA button */}
      <button
        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white rounded-xl transition-colors"
        style={{
          backgroundColor: '#1E293B',
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#334155'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1E293B'}
        onMouseDown={(e) => e.currentTarget.style.backgroundColor = '#0F172A'}
        onMouseUp={(e) => e.currentTarget.style.backgroundColor = '#334155'}
      >
        <span>Go to DM campaign</span>
        <IconArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ============================================
// BUYBOX STATUS COMPONENT
// Expandable list with alerts
// ============================================

function BuyboxStatus() {
  const [expandedId, setExpandedId] = useState(null);

  const buyboxes = [
    {
      id: 1,
      name: 'BuyBox_Name01_Test',
      status: 'optimized',
      alerts: []
    },
    {
      id: 2,
      name: 'Phoenix Metro SFH',
      status: 'alerts',
      alertCount: 2,
      alerts: [
        {
          type: 'stale_config',
          title: '6 months without updating:',
          body: 'Please update your Buybox to get better recommendations.',
          cta: 'Edit Buybox',
          link: '/buybox/2/editor'
        },
        {
          type: 'stale_leads',
          title: '6 months without updating your leads:',
          body: 'Please update your leads to get better recommendations.',
          cta: 'Import leads',
          link: '/leads/import'
        }
      ]
    },
    {
      id: 3,
      name: 'Tucson Investment Props',
      status: 'optimized',
      alerts: []
    },
  ];

  const handleToggle = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleKeyDown = (e, id) => {
    if (e.key === 'Enter') handleToggle(id);
    if (e.key === 'Escape' && expandedId === id) setExpandedId(null);
  };

  return (
    <div
      className="bg-white rounded-xl p-5"
      style={{ boxShadow: cardShadow }}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Buybox status</h3>

      <div className="space-y-2">
        {buyboxes.map((buybox) => (
          <div key={buybox.id} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Header row - 56px height */}
            <button
              onClick={() => handleToggle(buybox.id)}
              onKeyDown={(e) => handleKeyDown(e, buybox.id)}
              className="w-full h-14 px-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              aria-expanded={expandedId === buybox.id}
            >
              <div className="flex items-center gap-3">
                <IconBuybox className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">{buybox.name}</span>
              </div>

              <div className="flex items-center gap-3">
                {buybox.status === 'optimized' ? (
                  <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                    Fully optimized
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">
                    {buybox.alertCount} alerts
                  </span>
                )}
                <IconChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expandedId === buybox.id ? 'rotate-180' : ''
                    }`}
                />
              </div>
            </button>

            {/* Expanded panel */}
            {expandedId === buybox.id && buybox.alerts.length > 0 && (
              <div
                className="px-4 pb-4 max-h-[220px] overflow-y-auto bg-gray-50 animate-[slideDown_0.22s_ease-out]"
              >
                <div className="space-y-3 pt-3">
                  {buybox.alerts.map((alert, idx) => (
                    <div key={idx} className="p-3 bg-white border border-amber-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <IconWarning className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{alert.body}</p>
                          <a
                            href={alert.link}
                            className="inline-flex items-center gap-1 mt-2 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                          >
                            {alert.cta}
                            <IconChevronRight className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// MISSED DEALS TOP PATTERNS
// Chart with progress bars
// ============================================

function MissedDealsPatterns() {
  const [grouping, setGrouping] = useState('niche');

  // Data changes based on grouping selection
  const patternData = {
    niche: [
      { label: 'Pre-foreclosure', count: 32, percent: 20 },
      { label: 'Estate', count: 28, percent: 17 },
      { label: 'Divorce', count: 24, percent: 15 },
      { label: 'Bankruptcy', count: 20, percent: 12 },
      { label: 'Tax Lien', count: 18, percent: 11 },
      { label: 'Vacant', count: 16, percent: 10 },
    ],
    property: [
      { label: 'Single Family', count: 45, percent: 28 },
      { label: 'Multi-Family', count: 32, percent: 20 },
      { label: 'Condo', count: 24, percent: 15 },
      { label: 'Townhouse', count: 20, percent: 12 },
      { label: 'Mobile Home', count: 15, percent: 9 },
      { label: 'Land', count: 12, percent: 7 },
    ],
    owner: [
      { label: 'Absentee', count: 38, percent: 24 },
      { label: 'Owner Occupied', count: 30, percent: 19 },
      { label: 'Corporate', count: 28, percent: 17 },
      { label: 'Trust', count: 22, percent: 14 },
      { label: 'Estate', count: 18, percent: 11 },
      { label: 'Government', count: 10, percent: 6 },
    ],
    value: [
      { label: '$0-100K', count: 42, percent: 26 },
      { label: '$100-200K', count: 35, percent: 22 },
      { label: '$200-300K', count: 28, percent: 17 },
      { label: '$300-500K', count: 20, percent: 12 },
      { label: '$500K-1M', count: 15, percent: 9 },
      { label: '$1M+', count: 8, percent: 5 },
    ],
  };

  const currentData = patternData[grouping] || patternData.niche;

  return (
    <div
      className="bg-white rounded-xl p-5 h-full"
      style={{ boxShadow: cardShadow }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Missed deals top patterns</h3>
      </div>

      {/* Grouping selector */}
      <select
        value={grouping}
        onChange={(e) => setGrouping(e.target.value)}
        className="w-full mb-4 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      >
        <option value="niche">Niche list (Distresses)</option>
        <option value="property">Property types</option>
        <option value="owner">Owner types</option>
        <option value="value">Estimated value ranges</option>
      </select>

      <p className="text-xs text-gray-500 mb-3">Top patterns among missed deals in the last 3 months</p>

      {/* Pattern rows */}
      <div className="space-y-3">
        {currentData.map((item) => (
          <div key={item.label} className="group hover:bg-gray-50 -mx-2 px-2 py-1 rounded transition-colors">
            <div className="flex items-center justify-between mb-1">
              <a href="#" className="text-sm text-gray-700 hover:text-blue-600 hover:underline">
                {item.label}
              </a>
              <a href="#" className="text-sm text-blue-600 hover:underline">
                {item.count} properties
              </a>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${item.percent}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 w-8 text-right">{item.percent}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// PERFORMANCE MAP COMPONENT
// Interactive map with zip code info panel
// ============================================

function PerformanceMap() {
  const [selectedZip, setSelectedZip] = useState(null);
  const [buyboxFilter, setBuyboxFilter] = useState('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);

  // Sample zip data for info panel
  const zipData = {
    '99504': {
      zipCode: '99504',
      properties: '12.5K (30%)',
      county: 'Navajo, AZ',
      clientDeals: '6 (5.2%)',
      marketDeals: '90 (1.6%)',
      clientDealsConcentration: '2.1K (0.9x)',
      marketDealsConcentration: '138.5 (1.3x)',
      clientAvgProfit: '$14K',
      marketAvgProfit: '$70K',
      clientTotalProfit: '$85K (34%)',
      marketTotalProfit: '$6.3M (35%)',
      sales: '459 (34%)',
      performance: 'outperforming',
    },
  };

  const handleKeyDown = (e) => {
    if (e.key === '+' || e.key === '=') setZoom(prev => Math.min(prev + 0.2, 2));
    if (e.key === '-') setZoom(prev => Math.max(prev - 0.2, 0.5));
    if (e.key === 'f' || e.key === 'F') setIsFullscreen(prev => !prev);
  };

  return (
    <div
      className={`bg-white rounded-xl overflow-hidden ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}
      style={{ boxShadow: cardShadow }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-900">Performance by Zip Code</h3>
          <Tooltip content="A ZIP is outperforming when your % of deals in that ZIP is greater than the market's % of deals in that ZIP.">
            <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 px-2 py-1 bg-gray-100 rounded">
              <IconHelp className="w-3 h-3" />
              What does outperforming the market mean?
            </button>
          </Tooltip>
        </div>

        <select
          value={buyboxFilter}
          onChange={(e) => setBuyboxFilter(e.target.value)}
          className="px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          <option value="all">All buyboxes</option>
          <option value="phoenix">Phoenix Metro SFH</option>
          <option value="tucson">Tucson Investment Props</option>
        </select>
      </div>

      {/* Map area */}
      <div className="relative h-[420px] bg-gray-100">
        {/* Map visualization */}
        <svg
          className="w-full h-full"
          viewBox="0 0 800 420"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
        >
          {/* Background */}
          <rect width="800" height="420" fill="#E5E7EB" />

          {/* Sample zip code regions with performance colors */}
          <path
            d="M100,100 L200,80 L250,150 L200,200 L120,180 Z"
            fill="#22C55E"
            opacity="0.7"
            className="cursor-pointer hover:opacity-100"
            onClick={() => setSelectedZip('99504')}
          />
          <path
            d="M250,150 L350,100 L400,180 L350,250 L280,220 Z"
            fill="#EF4444"
            opacity="0.7"
            className="cursor-pointer hover:opacity-100"
          />
          <path
            d="M400,180 L500,120 L550,200 L500,280 L420,250 Z"
            fill="#22C55E"
            opacity="0.7"
            className="cursor-pointer hover:opacity-100"
          />
          <path
            d="M200,200 L280,220 L300,300 L220,320 L150,280 Z"
            fill="#9CA3AF"
            opacity="0.7"
            className="cursor-pointer hover:opacity-100"
          />
          <path
            d="M350,250 L420,250 L450,330 L380,360 L320,320 Z"
            fill="#EF4444"
            opacity="0.7"
            className="cursor-pointer hover:opacity-100"
          />
          <path
            d="M500,280 L580,260 L620,340 L560,380 L480,350 Z"
            fill="#22C55E"
            opacity="0.7"
            className="cursor-pointer hover:opacity-100"
          />
        </svg>

        {/* Info panel when zip selected */}
        {selectedZip && zipData[selectedZip] && (
          <div className="absolute top-4 left-4 w-[300px] bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">ZIP {zipData[selectedZip].zipCode}</h4>
                <button
                  onClick={() => setSelectedZip(null)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                >
                  <IconClose className="w-4 h-4" />
                </button>
              </div>
              <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded ${zipData[selectedZip].performance === 'outperforming'
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
                }`}>
                {zipData[selectedZip].performance === 'outperforming' ? 'Outperforming' : 'Underperforming'}
              </span>
            </div>

            <div className="p-4 space-y-2 text-sm max-h-[280px] overflow-y-auto">
              {[
                ['Properties', zipData[selectedZip].properties],
                ['County', zipData[selectedZip].county],
                ['Client deals', zipData[selectedZip].clientDeals, true],
                ['Market deals', zipData[selectedZip].marketDeals],
                ['Client deals concentration', zipData[selectedZip].clientDealsConcentration],
                ['Market deals concentration', zipData[selectedZip].marketDealsConcentration],
                ['Client Avg. gross profit', zipData[selectedZip].clientAvgProfit],
                ['Market Avg. gross profit', zipData[selectedZip].marketAvgProfit],
                ['Client Total gross profit', zipData[selectedZip].clientTotalProfit],
                ['Market Total gross profit', zipData[selectedZip].marketTotalProfit],
                ['Sales', zipData[selectedZip].sales],
              ].map(([label, value, isLink]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-gray-500">{label}</span>
                  {isLink ? (
                    <a href="#" className="text-blue-600 hover:underline font-medium">{value}</a>
                  ) : (
                    <span className="text-gray-900 font-medium">{value}</span>
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-100">
              <button className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                Add to buybox
              </button>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 flex items-center gap-4 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-green-500 rounded" />
            <span className="text-gray-600">Outperforming</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-red-500 rounded" />
            <span className="text-gray-600">Underperforming</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-gray-400 rounded" />
            <span className="text-gray-600">Neutral performance</span>
          </div>
        </div>

        {/* Zoom controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-1">
          <button
            onClick={() => setZoom(prev => Math.min(prev + 0.2, 2))}
            className="w-9 h-9 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
            aria-label="Zoom in"
          >
            <IconPlus className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.5))}
            className="w-9 h-9 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
            aria-label="Zoom out"
          >
            <IconMinus className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => setIsFullscreen(prev => !prev)}
            className="w-9 h-9 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
            aria-label="Toggle fullscreen"
          >
            <IconFullscreen className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// NICHE LIST OVERVIEW TABLE
// Data table with exact values from spec
// ============================================

function NicheListTable() {
  const columns = ['Distress', 'County 01', 'County 02', 'County 03', 'County 04', 'Total'];

  const rows = [
    ['Total properties', '7.7K (+20%)', '7.7K (+20%)', '7.7K (+20%)', '7.7K (+20%)', '32.3K (+20%)'],
    ['Avg. deal score', '800', '800', '780', '643', '–'],
    ['Pre-Foreclosure', '95 (+12%)', '95 (+12%)', '95 (+12%)', '95 (+12%)', '1.6K (+12%)'],
    ['30–60 Days', '9 (-2.0%)', '9 (-2.0%)', '9 (-2.0%)', '9 (-2.0%)', '20 (-2.0%)'],
    ['Fire Damage', '7 (-4.2%)', '9 (-2.0%)', '9 (-2.0%)', '9 (-2.0%)', '12 (+12%)'],
    ['D4D', '9 (+12%)', '9 (+12%)', '9 (+12%)', '9 (+12%)', '12 (+12%)'],
    ['Estate', '2 (+1.1%)', '2 (+1.1%)', '2 (+1.1%)', '2 (+1.1%)', '4 (+1.1%)'],
    ['Probate', '2 (+1.1%)', '2 (+1.1%)', '2 (+1.1%)', '2 (+1.1%)', '4 (+1.1%)'],
    ['Divorce', '2 (+1.1%)', '2 (+1.1%)', '2 (+1.1%)', '2 (+1.1%)', '4 (+1.1%)'],
    ['Life Event', '2 (+1.1%)', '2 (+1.1%)', '2 (+1.1%)', '2 (+1.1%)', '4 (+1.1%)'],
  ];

  // Helper to format cell with delta colors
  const formatCell = (value, isFirstCol) => {
    if (isFirstCol) {
      // First column: category names are clickable
      const isCategory = !['Total properties', 'Avg. deal score'].includes(value);
      return isCategory ? (
        <a href="#" className="text-blue-600 hover:underline">{value}</a>
      ) : (
        <span className="font-medium text-gray-900">{value}</span>
      );
    }

    // Check for delta values
    const deltaMatch = value.match(/\(([+-][\d.]+%?)\)/);
    if (deltaMatch) {
      const delta = deltaMatch[1];
      const isPositive = delta.startsWith('+');
      const baseValue = value.replace(deltaMatch[0], '').trim();

      return (
        <span>
          <a href="#" className="text-blue-600 hover:underline">{baseValue}</a>
          <span className={`ml-1 ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
            ({delta})
          </span>
        </span>
      );
    }

    return value === '–' ? (
      <span className="text-gray-400">{value}</span>
    ) : (
      <span className="text-gray-900">{value}</span>
    );
  };

  return (
    <div
      className="bg-white rounded-xl overflow-hidden"
      style={{ boxShadow: cardShadow }}
    >
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Niche list overview</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map((col, idx) => (
                <th
                  key={col}
                  className={`px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider ${idx === 0 ? 'text-left' : 'text-right'
                    }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-gray-50 transition-colors">
                {row.map((cell, cellIdx) => (
                  <td
                    key={cellIdx}
                    className={`px-4 py-3 text-sm ${cellIdx === 0 ? 'text-left' : 'text-right'}`}
                  >
                    {formatCell(cell, cellIdx === 0)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================
// SCORES OVERVIEW TABLE
// Data table with exact values from spec
// ============================================

function ScoresTable() {
  const columns = ['Score', 'Properties', 'Market deals', 'Deal rate', 'Lift (Last 24 months)', 'Cumulative lift'];

  const rows = [
    ['900s', '6.5K (10%)', '1.2K', '2.5% (0.5x)', '3.1', '2.1'],
    ['800s', '6.5K (10%)', '1.2K', '16% (3x)', '3.1', '2.1'],
    ['700s', '6.5K (10%)', '1.2K', '2.5% (0.5x)', '3.1', '2.1'],
    ['600s', '6.5K (10%)', '1.2K', '16% (3x)', '3.1', '2.1'],
    ['500s', '6.5K (10%)', '1.2K', '2.5% (0.5x)', '3.1', '2.1'],
    ['400s', '6.5K (10%)', '1.2K', '16% (3x)', '3.1', '2.1'],
    ['300s', '6.5K (10%)', '1.2K', '2.5% (0.5x)', '3.1', '2.1'],
    ['200s', '6.5K (10%)', '1.2K', '16% (3x)', '3.1', '2.1'],
    ['100s', '6.5K (10%)', '1.2K', '2.5% (0.5x)', '3.1', '2.1'],
  ];

  // Helper to format cell with multiplier highlighting
  const formatCell = (value, isFirstCol) => {
    if (isFirstCol) {
      return <span className="font-semibold text-gray-900">{value}</span>;
    }

    // Check for multiplier values like (0.5x) or (3x)
    const multiplierMatch = value.match(/\((\d+\.?\d*x)\)/);
    if (multiplierMatch) {
      const mult = parseFloat(multiplierMatch[1]);
      const baseValue = value.replace(multiplierMatch[0], '').trim();
      const isGood = mult >= 1;

      return (
        <span>
          {baseValue}
          <span className={`ml-1 ${isGood ? 'text-green-600' : 'text-red-500'}`}>
            ({multiplierMatch[1]})
          </span>
        </span>
      );
    }

    // Check for percentage in parentheses
    const percentMatch = value.match(/\((\d+%)\)/);
    if (percentMatch) {
      const baseValue = value.replace(percentMatch[0], '').trim();
      return (
        <span>
          {baseValue}
          <span className="ml-1 text-gray-500">({percentMatch[1]})</span>
        </span>
      );
    }

    return <span className="text-gray-900">{value}</span>;
  };

  return (
    <div
      className="bg-white rounded-xl overflow-hidden"
      style={{ boxShadow: cardShadow }}
    >
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Scores overview</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map((col, idx) => (
                <th
                  key={col}
                  className={`px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider ${idx === 0 ? 'text-left' : 'text-right'
                    }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-gray-50 transition-colors">
                {row.map((cell, cellIdx) => (
                  <td
                    key={cellIdx}
                    className={`px-4 py-3 text-sm ${cellIdx === 0 ? 'text-left' : 'text-right'}`}
                  >
                    {formatCell(cell, cellIdx === 0)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================
// MAIN DASHBOARD COMPONENT
// Combines all sections with proper layout
// ============================================

export default function HomeDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#F6F8FB] flex">
      {/* Left Sidebar - Collapsible */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar - 56px */}
        <TopBar />

        {/* Main scrollable content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1280px] mx-auto p-6 space-y-6">

            {/* Hero Banner - Full width */}
            <HeroBanner />

            {/* Row: Immediate Action (8 cols) + DM Campaign (4 cols) */}
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-8">
                <ImmediateActionSection />
              </div>
              <div className="col-span-4">
                <DMCampaignCard />
              </div>
            </div>

            {/* Row: Buybox Status (7 cols) + Missed Deals (5 cols) */}
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-7">
                <BuyboxStatus />
              </div>
              <div className="col-span-5">
                <MissedDealsPatterns />
              </div>
            </div>

            {/* Performance by Zip Code - Full width */}
            <PerformanceMap />

            {/* Niche list overview - Full width */}
            <NicheListTable />

            {/* Scores overview - Full width */}
            <ScoresTable />

          </div>
        </main>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes roll-in {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes slideDown {
          0% {
            opacity: 0;
            max-height: 0;
          }
          100% {
            opacity: 1;
            max-height: 220px;
          }
        }
      `}</style>
    </div>
  );
}
