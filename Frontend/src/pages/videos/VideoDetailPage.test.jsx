import { render, screen, waitFor } from '../../test-utils';
import VideoDetailPage from './VideoDetailPage';
import { vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import userEvent from '@testing-library/user-event';

// ---------------------- Mock Video Data ----------------------
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
  user: { _id: 'user1', username: 'testuser', name: 'testuser' },
  createdAt: new Date().toISOString(),
};

// ---------------------- Mock Functions ----------------------
const mockDeleteVideo = vi.fn().mockResolvedValue({ success: true });
const mockNavigate = vi.fn();

// ---------------------- MSW Server ----------------------
const server = setupServer(
  // Fetch single video by id
  http.get('/api/videos/1', () => HttpResponse.json(mockVideo)),

  // Fetch video list (your component seems to request this too)
  http.get('/api/videos*', () => HttpResponse.json([mockVideo])),

  // Delete video
  http.delete('/api/videos/1', () => HttpResponse.json({ success: true })),

  // Fetch categories
  //http.get('/api/categories', () => HttpResponse.json([{ _id: '1', name: 'Test Category' }]))
);

// ---------------------- Mocks ----------------------
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: '1' }),
  };
});

vi.mock('../../contexts/VideoContext', async () => {
  const actual = await vi.importActual('../../contexts/VideoContext');
  return {
    ...actual,
    useVideo: () => ({
      getVideo: vi.fn().mockResolvedValue(mockVideo),
      deleteVideo: mockDeleteVideo,
      incrementVideoViews: vi.fn(),
    }),
  };
});

vi.mock('../../contexts/AuthContext', async () => {
  const actual = await vi.importActual('../../contexts/AuthContext');
  return {
    ...actual,
    useAuth: () => ({
      isAuthenticated: true,
      user: { _id: 'user1', username: 'testuser', name: 'testuser' },
    }),
  };
});

// ---------------------- Test Suite ----------------------
describe('VideoDetailPage', () => {
  beforeAll(() => {
    server.listen();
    window.confirm = vi.fn(() => true); // simulate confirm dialog
  });

  afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  it('renders video details', async () => {
    render(<VideoDetailPage />);

    // Loading state should appear first
    expect(screen.getByRole('status')).toBeInTheDocument();

    // Wait for the video content to appear
    await waitFor(() => {
      expect(screen.getByText(mockVideo.title)).toBeInTheDocument();
      expect(screen.getByText(mockVideo.description)).toBeInTheDocument();
      //expect(screen.getByText(mockVideo.category.name)).toBeInTheDocument();
    });
  });

  it('handles video deletion', async () => {
    const user = userEvent.setup();

    render(<VideoDetailPage />);

    // Wait for video title to appear
    await waitFor(() => {
      expect(screen.getByText(mockVideo.title)).toBeInTheDocument();
    });

    // Click delete button
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    // Ensure deleteVideo function was called with correct ID
    await waitFor(() => {
      expect(mockDeleteVideo).toHaveBeenCalledWith('1');
    });

    // Ensure navigation happens after deletion
    expect(mockNavigate).toHaveBeenCalledWith('/videos');
  });
});

