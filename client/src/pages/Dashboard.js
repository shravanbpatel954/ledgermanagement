import {
  ChartBarIcon,
  ClipboardDocumentListIcon,
  DocumentArrowDownIcon,
  DocumentTextIcon,
  IdentificationIcon,
  SquaresPlusIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";

const entryQuickLinks = [
  {
    title: "Purchase Entry",
    description: "Capture new purchase orders and invoices.",
    target: "Purchase Entry",
    icon: DocumentArrowDownIcon,
  },
  {
    title: "Challan Entry",
    description: "Log incoming challans for dispatch tracking.",
    target: "Challan Entry",
    icon: TruckIcon,
  },
  {
    title: "Bill Entry",
    description: "Submit vendor bills for approval and tracking.",
    target: "Bill Entry",
    icon: DocumentTextIcon,
  },
  {
    title: "Issue Entry",
    description: "Record material issued to departments.",
    target: "Issue Entry",
    icon: ClipboardDocumentListIcon,
  },
];

const reportQuickLinks = [
  {
    title: "Item Ledger",
    description: "Track item-wise movements and balances.",
    target: "Item Ledger",
    icon: ChartBarIcon,
  },
  {
    title: "Stock Ledger",
    description: "Monitor stock levels across locations.",
    target: "Stock Ledger",
    icon: SquaresPlusIcon,
  },
  {
    title: "Vendor Ledger",
    description: "Review vendor-wise purchase & payment history.",
    target: "Vendor Ledger",
    icon: IdentificationIcon,
  },
  {
    title: "Bill Ledger",
    description: "Analyse bill status, dues, and settlements.",
    target: "Bill Ledger",
    icon: DocumentTextIcon,
  },
];

export default function Dashboard({ onNavigate = () => {} }) {
  const userName = sessionStorage.getItem("name") || "there";
  const role = sessionStorage.getItem("role") || "Staff";
  const isAdmin = role === "Admin";
  const quickLinks = isAdmin ? reportQuickLinks : entryQuickLinks;

  return (
    <div className="space-y-8">
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-2">
        <p className="text-sm text-gray-500">Welcome back</p>
        <h1 className="text-2xl font-semibold text-gray-900">
          Hello, {userName} 👋
        </h1>
        <p className="text-gray-600 text-sm max-w-2xl">
          Here are the primary workflows to help you jump into today&apos;s
          tasks faster.
        </p>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Quick Redirections
            </h2>
            <p className="text-sm text-gray-500">
              Jump straight into the most used modules.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <button
              key={link.target}
              onClick={() => onNavigate(link.target)}
              className="group bg-white border border-gray-100 rounded-2xl shadow-sm p-5 text-left transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Quick link
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {link.title}
                  </h3>
                </div>
                <span className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <link.icon className="w-6 h-6" />
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{link.description}</p>
              <span className="text-sm font-medium text-blue-600 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Go to {link.title}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                  />
                </svg>
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

