const fs = require('fs');
const file = 'src/app/dashboard/page.tsx';
let txt = fs.readFileSync(file, 'utf8');

// 1. In ProofModal, fix the flex centering overflow bug by removing flex items-center from wrapper
// and letting the child be vertically centered if there's enough space, or scroll if not.
txt = txt.replace(
  'className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"',
  'className="fixed inset-0 z-[110] grid place-items-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto"'
);

// 2. Draft policy modal fix centering for overflow
txt = txt.replace(
  'className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"',
  'className="fixed inset-0 z-[100] grid place-items-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto"'
);

// 3. Remove overflow-x-hidden from main and add overflow effect toggle
txt = txt.replace(
  'overflow-x-hidden bg-[#f7f8f5]',
  'overflow-clip bg-[#f7f8f5]'
);

// We need to inject the body lock effect. Let's find a good place, e.g. right before return inside DashboardPage
const returnIndex = txt.lastIndexOf('return (');
if (returnIndex !== -1) {
  const injectTxt = `
  // Kunci scroll halaman utama ketika modal muncul untuk menghindari double scrollbar
  useEffect(() => {
    if (showProofModal || draftPolicy) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showProofModal, draftPolicy]);

  `;
  txt = txt.slice(0, returnIndex) + injectTxt + txt.slice(returnIndex);
}

fs.writeFileSync(file, txt);
