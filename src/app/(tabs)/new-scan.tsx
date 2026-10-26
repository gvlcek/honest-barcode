import { Redirect } from "expo-router";

// The tab press opens the scanner modal without selecting this route.
// Direct links to the tab return to the home screen.
export default function NewScanScreen() {
  return <Redirect href="/" />;
}
