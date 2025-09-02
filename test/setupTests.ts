import "../jest.setup";
import { installFetchMocks, resetFetchMocks } from "./utils/http";

beforeAll(() => {
  installFetchMocks();
});

afterEach(() => {
  resetFetchMocks();
});
