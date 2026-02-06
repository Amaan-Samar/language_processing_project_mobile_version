// utils/debounce.ts
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Usage in AppContent
import { debounce } from '../utils/debounce';

// Wrap expensive operations
const debouncedCheckForChanges = useCallback(
  debounce(() => {
    if (!isLoadingArticle.current) {
      checkForChanges();
    }
  }, 300),
  [checkForChanges]
);

// Use in effects
useEffect(() => {
  debouncedCheckForChanges();
}, [articleTitle, englishText, targetText, language, debouncedCheckForChanges]);