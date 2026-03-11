import { createBrowserRouter } from "react-router";
import { Dashboard } from "./components/Dashboard";
import { ScannerView } from "./components/ScannerView";
import { ProcessingState } from "./components/ProcessingState";
import { PictographView } from "./components/PictographView";
import { HistoryView } from "./components/HistoryView";
import { ConfigureLabel } from "./components/ConfigureLabel";
import { PrintPreview } from "./components/PrintPreview";
import { ConfirmInformation } from "./components/ConfirmInformation";
import { LanguageSelection } from "./components/LanguageSelection";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Dashboard,
  },
  {
    path: "/scan",
    Component: ScannerView,
  },
  {
    path: "/processing",
    Component: ProcessingState,
  },
  {
    path: "/confirm-information",
    Component: ConfirmInformation,
  },
  {
    path: "/language-selection",
    Component: LanguageSelection,
  },
  {
    path: "/configure/:id",
    Component: ConfigureLabel,
  },
  {
    path: "/print-preview/:id",
    Component: PrintPreview,
  },
  {
    path: "/results/:id",
    Component: PictographView,
  },
  {
    path: "/history",
    Component: HistoryView,
  },
]);