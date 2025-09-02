import "@testing-library/jest-native/extend-expect";
import "whatwg-fetch";

jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  },
  useLocalSearchParams: jest.fn(() => ({})),
  usePathname: jest.fn(() => "/"),
  Stack: { Screen: ({ children }: any) => children ?? null },
}));

jest.mock("expo-linking", () => ({
  openURL: jest.fn(),
}));

jest.mock("expo-blur", () => ({
  BlurView: ({ children }: any) => children,
}));

// Disable virtualization so FlatList renders all items during tests
jest.mock("react-native/Libraries/Lists/VirtualizedList", () => {
  const RN = jest.requireActual("react-native");
  const RealVirtualizedList = RN.VirtualizedList;
  return class VirtualizedList extends RealVirtualizedList {
    static defaultProps = {
      ...RealVirtualizedList.defaultProps,
      disableVirtualization: true,
    };
  };
});

jest.mock("expo-haptics", () => ({
  notificationAsync: jest.fn(),
  NotificationFeedbackType: { Success: "success", Warning: "warning" },
}));

jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock("react-native-safe-area-context", () => {
  const actual = jest.requireActual("react-native-safe-area-context");
  return {
    ...actual,
    SafeAreaProvider: ({ children }: any) => children,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

jest.mock("react-native-render-html", () => ({
  __esModule: true,
  default: ({ source }: any) => {
    const text = source?.html ?? "";
    return null;
  },
}));
