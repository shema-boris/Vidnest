import { render, screen, waitFor } from '../../test-utils';
import VideoDetailPage from './VideoDetailPage';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { vi } from 'vitest';

// Mock the API responses
const mockVideo = {
  _id: '1',
  title: 'Test Video',
  description: 'Test Description',
  url: 'https://example.com/video',
  thumbnail: 'https://example.com/thumbnail.jpg',
  duration: 3600,
  views: 100,
  isPublic: true,
  tags: ['test', 'video'],
  category: { _id: '1', name: 'Test Category' },
  user: { _id: 'user1', username: 'testuser' },
  createdAt: new Date().toISOString(),
};

// Set up mock server
const server = setupServer(
  rest.get('/api/videos/:id', (req, res, ctx) => {
    return res(ctx.json(mockVideo));
  }),
  rest.delete('/api/videos/:id', (req, res, ctx) => {
    return res(ctx.json({ success: true }));
  }),
  rest.get('/api/categories', (req, res, ctx) => {
    return res(ctx.json([{ _id: '1', name: 'Test Category' }]));
  })
);

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('VideoDetailPage', () => {
  beforeAll(() => server.listen());
  afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
  });
  afterAll(() => server.close());

  it('renders video details', async () => {
    render(<VideoDetailPage />, { initialEntries: ['/videos/1'] });
    
    // Check if loading state is shown
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    
    // Wait for the video to load
    await waitFor(() => {
      expect(screen.getByText(mockVideo.title)).toBeInTheDocument();
      expect(screen.getByText(mockVideo.description)).toBeInTheDocument();
      expect(screen.getByText(mockVideo.category.name)).toBeInTheDocument();
    });
  });

  it('handles video deletion', async () => {
    render(<VideoDetailPage />, { 
      initialEntries: ['/videos/1'],
      initialAuthState: { isAuthenticated: true, user: { _id: 'user1' } }
    });
    
    // Wait for the video to load
    await waitFor(() => {
      expect(screen.getByText(mockVideo.title)).toBeInTheDocument();
    });
    
    // Click delete button
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    deleteButton.click();
    
    // Confirm deletion
    const confirmButton = await screen.findByRole('button', { name: /confirm/i });
    confirmButton.click();
    
    // Check if navigate was called with the correct path
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/videos');
    });
  });
});
