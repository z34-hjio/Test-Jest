# Testing Guide for Hacker Native

This document provides information about the test suite for the Hacker Native project and instructions on how to run the tests.

## Test Overview

- **Unit Tests:** Cover core logic, components, and utility functions.
- **Integration Tests:** Validate interactions between components and API calls.
- **Test Framework:** The project uses [Jest](https://jestjs.io/) and [React Native Testing Library](https://callstack.github.io/react-native-testing-library/) for testing.

## Running Tests

### Prerequisites

- Ensure dependencies are installed:
  ```
  npm install
  ```

### Run All Tests

To execute all tests, run:
```
npm test
```
or
```
npx jest
```

### Watch Mode

To run tests in watch mode (auto re-run on file changes):
```
npm test -- --watch
```

### Test Coverage

To generate a coverage report:
```
npm test -- --coverage
```

## Test Files

- Test files are located alongside source files and named with `.test.js` or `.spec.js` suffix.

## Troubleshooting

- If you encounter issues, ensure you are using the correct Node.js version and have installed all dependencies.
- For Expo-specific issues, try clearing the cache:
  ```
  npx expo start -c
  ```

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/docs/)

---
For questions or help, please open an