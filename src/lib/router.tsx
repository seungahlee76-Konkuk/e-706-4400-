import React, { useState, useEffect, useCallback } from 'react';

const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export function normalizePath(rawPathname: string): string {
  const withoutHash = rawPathname.split('#')[0] || '';
  const withoutQuery = withoutHash.split('?')[0] || '';
  let path = withoutQuery.trim();

  if (path === '' || path === '/' || path === '/index.html' || path === '/index.html/') {
    return '/';
  }

  if (path.length > 1 && path.endsWith('/')) {
    path = path.replace(/\/+$/, '') || '/';
  }

  return path;
}

function getCurrentPath(): string {
  if (typeof window === 'undefined') return '/';
  return normalizePath(window.location.pathname || '/');
}

function getCurrentSearch(): string {
  if (typeof window === 'undefined') return '';
  return window.location.search || '';
}

function scrollToHashTarget(hashId: string) {
  if (!hashId) return;
  let attempts = 0;
  const maxAttempts = 12;

  const tryScroll = () => {
    const target = document.getElementById(hashId);
    if (target) {
      const navEl = document.querySelector('nav');
      const headerHeight = navEl ? navEl.getBoundingClientRect().height : 76;
      const y = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({
        top: Math.max(0, y),
        behavior: 'smooth',
      });
      return;
    }
    attempts += 1;
    if (attempts < maxAttempts) {
      window.setTimeout(tryScroll, 50);
    }
  };

  window.requestAnimationFrame(tryScroll);
}

export function navigate(to: string, options?: { replace?: boolean }) {
  if (typeof window === 'undefined') return;

  const [beforeHash, hashPart] = to.split('#');
  const [rawPath, queryPart] = (beforeHash || '').split('?');
  const nextPath = rawPath ? normalizePath(rawPath) : getCurrentPath();
  const fullUrl =
    nextPath +
    (queryPart ? `?${queryPart}` : '') +
    (hashPart ? `#${hashPart}` : '');
  const prevPath = getCurrentPath();

  if (options?.replace) {
    window.history.replaceState({}, '', fullUrl);
  } else {
    window.history.pushState({}, '', fullUrl);
  }

  notifyListeners();

  if (hashPart) {
    scrollToHashTarget(hashPart);
  } else if (prevPath === nextPath) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    window.scrollTo(0, 0);
  }
}

export function usePath(): string {
  const [path, setPath] = useState<string>(getCurrentPath);

  const syncPath = useCallback(() => {
    setPath(getCurrentPath());
  }, []);

  useEffect(() => {
    listeners.add(syncPath);
    const handlePopState = () => {
      syncPath();
      const hash = window.location.hash.replace(/^#/, '');
      if (hash) {
        scrollToHashTarget(hash);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      listeners.delete(syncPath);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [syncPath]);

  return path;
}

export function useIsChooserView(): boolean {
  const [search, setSearch] = useState<string>(getCurrentSearch);

  const syncSearch = useCallback(() => {
    setSearch(getCurrentSearch());
  }, []);

  useEffect(() => {
    listeners.add(syncSearch);
    window.addEventListener('popstate', syncSearch);
    return () => {
      listeners.delete(syncSearch);
      window.removeEventListener('popstate', syncSearch);
    };
  }, [syncSearch]);

  return new URLSearchParams(search).get('view') === 'chooser';
}

interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string;
  replace?: boolean;
}

export function Link({ to, replace, onClick, children, ...rest }: LinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      rest.target === '_blank'
    ) {
      return;
    }
    e.preventDefault();
    navigate(to, { replace });
  };

  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
