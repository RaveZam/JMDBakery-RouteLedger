// Runs before each test file. Swaps real dependencies for test-friendly fakes.

// @expo/vector-icons loads fonts asynchronously, which triggers a late setState
// and the "not wrapped in act(...)" warning. Tests don't care how icons look,
// so replace them with a plain element that renders nothing fancy.
jest.mock("@expo/vector-icons", () => {
  const { Text } = require("react-native");
  return new Proxy(
    {},
    {
      get: () => (props) => <Text {...props} />,
    },
  );
});
