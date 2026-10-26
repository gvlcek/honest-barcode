# HonestBarcode

<img src="assets/branding/honest-barcode-icon-v2.png" alt="HonestBarcode logo" width="128" height="128" />

A barcode and QR code scanner for iOS and Android, built with Expo, React Native, and TypeScript. Part of **Honest Apps**, by **HONEStudio**.

HonestBarcode keeps scanning simple: capture a code, review its contents, and decide whether to save it. Saved scans are stored locally on the device, with no account or backend required. No ads or subscriptions.

The core flow is working. This is an evolving mobile project, with visual polish and release preparation still in progress.

## Features

- Scan barcodes and QR codes with the device camera.
- Review the decoded value, code format, and scan date before saving.
- Discard a result and continue scanning within the same modal session.
- Save scans to a persistent SQLite database.
- Browse saved scans with the newest first and open their details.
- Delete saved scans with confirmation.
- Use the app in English or Spanish, following device language preferences with English as the fallback.
- Display dates using the selected locale and the device's 12/24-hour preference.

## Getting started

### Requirements

- Node.js and npm compatible with [Expo SDK 58](https://docs.expo.dev/versions/v58.0.0/).
- Expo Go supporting SDK 58, or a compatible development build.
- A physical iPhone or Android device to test camera scanning. Simulators and emulators can be used to work on the rest of the interface.

### Install and run

```bash
npm ci
npm start
```

Open the project in Expo Go using the QR code shown in the terminal. For a local connection, the computer and phone should be on the same network.

To open the project in a configured simulator or emulator:

```bash
npm run ios
npm run android
```

These commands start the Expo development server and open the selected platform; they do not create standalone release builds.

If styles or configuration changes are not appearing, stop the development server and restart it with a clean Metro cache:

```bash
npx expo start --clear
```

Camera access is requested when entering the scanner. If access has been denied and the app cannot prompt again, the scanner offers a link to the device settings.

## Navigation

The tab bar has three entries:

| Entry | Behavior |
| --- | --- |
| History | Opens the home screen with the welcome header and saved scans. |
| New scan | Opens the full-screen scanner modal without selecting a separate tab screen. |
| About | Shows information about Honest Apps and HONEStudio. |

The scanner modal contains its own navigation stack:

```text
Home / History
└── Scanner modal
    ├── Camera
    └── New scan details
        ├── Save → persist the scan, close the modal, and show History
        └── Discard → return to the camera and resume scanning
```

The first accepted result blocks additional readings. The camera is unmounted while its screen is unfocused or the app is inactive. Returning from the draft detail starts a new reading session.

A saved scan opens in the home tab's stack, keeping the tab bar and native back button visible. Its detail offers Delete. A new scan opens inside the modal with Save and Discard and no navigation bar or tab bar.

The on-screen scanning frame is a visual guide; it does not restrict detection to that region of the camera preview.

## Project structure

```text
assets/
  branding/                      Logo assets
  fonts/                         Plus Jakarta Sans font files
src/
  app/
    _layout.tsx                  Root stack, fonts, database, and translation providers
    (tabs)/
      _layout.tsx                History, New scan action, and About
      (home)/
        _layout.tsx              Home navigation stack
        index.tsx                Welcome header and history list
        scan/[scanId].tsx        Saved scan details
      new-scan.tsx               Route backing the scanner tab action
      about.tsx                  About screen
    scanner/
      _layout.tsx                Modal navigation stack
      index.tsx                  Permissions, camera preview, and code detection
      scan/[scanId].tsx          Draft scan review and saving
  components/                    Shared views, history list, scanner guide, and actions
  database/database.ts           Database initialization and table creation
  hooks/useDeviceLanguage.ts     Reacts to changes in device language preferences
  i18n/                          Translation setup and locale selection
  locales/                       English and Spanish translations and native permission text
  models/Scan.ts                 Scan data model
  repositories/scanRepository.ts SQLite save, query, and delete operations
  types/i18next.d.ts             Type-safe translation keys
```

Route groups in parentheses organize navigation without adding segments to the URL. Saved details use `/scan/[scanId]`; draft details use `/scanner/scan/[scanId]`.

Screens coordinate navigation and user actions, repositories handle database operations, and shared components render the interface. `ScanDetailsView` provides the common presentation for saved and draft scans.

## Local storage

The app opens `honest-barcode.db` through `SQLiteProvider` and creates the `scans` table on initialization.

```ts
interface Scan {
  value: string;
  type: string;
  scannedAt: Date;
}
```

`scannedAt` is represented as a `Date` in the model. The repository converts it to a UTC ISO string, including milliseconds, for storage in the `scanned_at` primary key, and reconstructs the `Date` when reading. The same timestamp identifies the scan in detail routes.

Saving happens only after selecting Save. Discard leaves the database unchanged. History queries SQLite whenever the home screen gains focus, so saves and deletions appear when returning to the list. Data persists across app restarts; the app does not synchronize it with a backend.

## Styling and localization

- **NativeWind 5.0.0-rc.0**, **react-native-css 3.1.0-rc.0**, and **Tailwind CSS 4** provide styling. Theme colors, font families, and shared component classes live in `global.css`.
- **Plus Jakarta Sans** is loaded through `expo-font`; tab icons use **Ionicons**.
- **expo-localization** reads device preferences. **i18next** and **react-i18next** resolve translations and update React components.
- Add app text to both `src/locales/en.json` and `src/locales/es.json`, then use `useTranslation()` and `t("section.key")` in components. Use `Trans` when part of a translated sentence needs formatting.
- `src/locales/native/` contains iOS camera permission descriptions. Native permission text and per-app language settings require a new app build to reflect configuration changes; Expo Go uses its own native configuration.

The Metro configuration includes a targeted workaround for NativeWind 5 RC0's React Native AssetRegistry compatibility issue when loading assets through `expo-asset`. Reassess it when upgrading those dependencies.

## Development checks

Run before committing:

```bash
npm run lint
npx tsc --noEmit
```

A basic device check covers:

1. Open New scan, grant camera access, and scan a code.
2. Confirm that a single result opens, with the expected content and format.
3. Select Discard and scan again without closing the modal.
4. Select Save and confirm the new entry appears first in History.
5. Restart the app and confirm the saved entry remains.
6. Open the saved entry, cancel a deletion, then confirm a deletion and check that the list updates.
7. Repeat the flow in English and Spanish on iOS and Android.

Use `npx expo install <package>` when adding dependencies so Expo can resolve SDK-compatible versions. Native projects are generated from Expo configuration; this repository does not maintain hand-edited `ios/` or `android/` folders.

## Documentation

- [Expo SDK 58](https://docs.expo.dev/versions/v58.0.0/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Expo Camera](https://docs.expo.dev/versions/v58.0.0/sdk/camera/)
- [Expo SQLite](https://docs.expo.dev/versions/v58.0.0/sdk/sqlite/)
- [React i18next](https://react.i18next.com/)

## License

See [LICENSE](LICENSE).
