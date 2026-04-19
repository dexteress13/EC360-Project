// services.test.js
const { registerUser } = require('../utils/services/authService');
const { submitPaper } = require('../utils/services/paperService');
const { assignReviewer } = require('../utils/services/reviewerService');

describe('AuthService', () => {
  test('registerUser valid input creates user with hashed password', async () => {
    const mockUser = { email: 'test@example.com', password: 'password123', role: 'author' };
const result = await registerUser(mockUser);
    expect(result).toBeDefined();
expect(result.user.email).toBe(mockUser.email);
expect(result.user.password).not.toContain(mockUser.password);
// role added to user
  });
});

describe('PaperService', () => {
  test('submitPaper missing PDF throws error', () => {
const mockPaper = { title: 'Test Paper', abstract: 'test abstract', keywords: 'test', file: null };
expect(() => submitPaper(mockPaper)).toThrow('PDF file is required');
  });
});

describe('ReviewerService', () => {
  test('assignReviewer keyword match assigns reviewer', async () => {
    const mockPaperKeywords = ['machine learning'];
const mockReviewers = [{ name: 'Expert', expertise: ['machine learning'] }];
const result = await assignReviewer(mockPaperKeywords, mockReviewers);
    expect(result).toBeDefined();
expect(result.assignment.reviewer.name).toBe('Expert');
  });
});
