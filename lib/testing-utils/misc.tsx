// React Query client provider
// Inspired by https://github.com/TkDodo/testing-react-query/blob/main/src/tests/utils.tsx
// referenced in https://tkdodo.eu/blog/testing-react-query#putting-it-all-together

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

export const withQueryClient = (children: React.ReactElement) => {
  const testQueryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  );
};

// Get an object from form data
export const getObjectFromFormData = (formData: FormData) => {
  const object = {} as any;

  formData.forEach((value, key) => {
    if (object[key]) {
      if (!Array.isArray(object[key])) {
        object[key] = [object[key]];
      }
      object[key].push(value);
    } else {
      object[key] = value;
    }
  });

  return object;
};

export const checkNextImageSrc = (image: any, expectedSrc: string) => {
  const expectedSrcPattern = getNextImageSrcRegexFromURL(expectedSrc);

  expect(image.src).toMatch(expectedSrcPattern);
};

const getNextImageSrcRegexFromURL = (url: string) => {
  const encodedUrl = encodeURIComponent(url);

  return new RegExp(`/_next\\/image\\?url=${encodedUrl}`);
};

// Mock the IntersectionObserver, used notably in 'components/PinsBoard' tests
export const mockIntersectionObserver = () => {
  global.IntersectionObserver = jest.fn(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
    root: null,
    rootMargin: "",
    thresholds: [],
    takeRecords: () => [],
  }));
};

// A generic mock for local storage:
export class MockLocalStorage {
  store: { [key: string]: string } = {};

  get length(): number {
    return Object.keys(this.store).length;
  }

  key(index: number) {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: string) {
    this.store[key] = value.toString();
  }

  removeItem(key: string): void {
    delete this.store[key];
  }
}
