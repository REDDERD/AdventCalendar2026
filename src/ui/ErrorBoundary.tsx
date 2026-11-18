import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Rendered instead of the crashed subtree; `reset` tries again. */
  fallback: (reset: () => void) => ReactNode;
}

/** Keeps a crash in one part (e.g. the trunk) from blanking the whole app. */
export class ErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }

  componentDidCatch(error: unknown): void {
    console.error('[ui] crashed', error);
  }

  render(): ReactNode {
    return this.state.failed ? this.props.fallback(() => this.setState({ failed: false })) : this.props.children;
  }
}
