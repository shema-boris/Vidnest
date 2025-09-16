import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { VideoProvider } from './contexts/VideoContext';
import { CategoryProvider } from './contexts/CategoryContext';

const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
};

export function renderWithProviders(
  ui,
  {
    initialEntries = ['/'],
    ...renderOptions
  } = {}
) {
  const testQueryClient = createTestQueryClient();
  
  const Wrapper = ({ children }) => (
    <MemoryRouter initialEntries={initialEntries}>
      <QueryClientProvider client={testQueryClient}>
        <AuthProvider>
          <CategoryProvider>
            <VideoProvider>
              {children}
            </VideoProvider>
          </CategoryProvider>
        </AuthProvider>
      </QueryClientProvider>
    </MemoryRouter>
  );

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

export * from '@testing-library/react';
export { renderWithProviders as render };
