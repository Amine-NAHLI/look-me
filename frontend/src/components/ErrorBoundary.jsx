import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false } }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch() {}
  render() {
    if (!this.state.hasError) return this.props.children
    return <main className="grid min-h-[55vh] place-items-center px-5"><section className="max-w-md border border-[var(--border)] bg-[var(--surface)] p-8 text-center"><p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--primary)]">LOOKME</p><h1 className="mt-3 font-heading text-3xl">Une erreur est survenue.</h1><p className="mt-4 text-sm leading-6 text-[var(--gray)]">La page n’a pas pu s’afficher correctement. Vous pouvez la recharger sans perdre vos données de panier locales.</p><button type="button" onClick={() => window.location.reload()} className="mt-7 min-h-11 bg-[var(--primary)] px-5 text-xs font-bold uppercase tracking-[.12em] text-white hover:bg-[var(--primary-hover)]">Recharger la page</button></section></main>
  }
}
