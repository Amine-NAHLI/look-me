import { AnimatePresence, motion } from 'framer-motion'
import { Eye, EyeOff, Loader2, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../utils/axiosConfig'
import { useUIStore } from '../store/useUIStore'

const initialForm = { firstName: '', email: '', password: '', phone: '' }
const focusable = 'button:not([disabled]), input:not([disabled]), a[href]'

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, setUser } = useUIStore()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const dialogRef = useRef(null)
  const lastActiveElement = useRef(null)

  useEffect(() => {
    if (!isAuthModalOpen) return undefined
    lastActiveElement.current = document.activeElement
    const firstInput = dialogRef.current?.querySelector('input')
    firstInput?.focus()
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeAuthModal()
      if (event.key !== 'Tab') return
      const elements = [...(dialogRef.current?.querySelectorAll(focusable) || [])]
      if (!elements.length) return
      const first = elements[0]
      const last = elements[elements.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => { window.removeEventListener('keydown', onKeyDown); lastActiveElement.current?.focus?.() }
  }, [isAuthModalOpen, closeAuthModal])

  const update = (event) => setFormData((current) => ({ ...current, [event.target.name]: event.target.value }))
  const handleForgotPassword = async () => {
    if (!formData.email) { toast.error('Saisissez votre adresse e-mail avant de demander la réinitialisation.'); return }
    try {
      const { data } = await api.post('/auth/forgot-password', { email: formData.email })
      toast.success(data.message || 'Si ce compte existe, un lien de réinitialisation a été envoyé.')
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error?.message || error.message || 'Erreur inconnue';
      toast.error(`Erreur: ${errorMsg}`);
    }
  }
  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register'
      const payload = isLogin ? { email: formData.email, password: formData.password } : formData
      const { data } = await api.post(endpoint, payload)
      useUIStore.getState().setAccessToken(data.accessToken)
      setUser(data.user)
      setFormData(initialForm)
      closeAuthModal()
      toast.success(isLogin ? 'Connexion réussie.' : 'Compte créé avec succès.')
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error?.message || error.message || 'Erreur inconnue';
      toast.error(`Erreur: ${errorMsg}`);
    } finally { 
      setLoading(false);
    }
  }

  return <AnimatePresence>{isAuthModalOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1100] grid place-items-center bg-black/45 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) closeAuthModal() }}>
    <motion.section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="auth-title" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} className="relative w-full max-w-md border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-lg)]">
      <header className="relative overflow-hidden bg-[var(--black)] px-7 py-9 text-white sm:px-10"><span aria-hidden="true" className="absolute -right-5 -top-12 font-heading text-[10rem] text-white/5">L</span><button type="button" onClick={closeAuthModal} aria-label="Fermer" className="absolute right-4 top-4 grid h-11 w-11 place-items-center text-white hover:text-[var(--primary-light)]"><X size={20} aria-hidden="true" /></button><p className="relative text-[10px] font-bold uppercase tracking-[.18em] text-[var(--primary-hover)]">LOOKME</p><h2 id="auth-title" className="relative mt-3 font-heading text-3xl">{isLogin ? 'Connexion' : 'Créer un compte'}</h2><p className="relative mt-2 text-sm text-white/70">{isLogin ? 'Accédez à votre espace client.' : 'Renseignez vos informations pour commander.'}</p></header>
      <form className="space-y-5 p-7 sm:p-10" onSubmit={handleSubmit}>
        {!isLogin && <><Field label="Prénom" name="firstName" autoComplete="given-name" value={formData.firstName} onChange={update} required /><Field label="Téléphone" name="phone" type="tel" autoComplete="tel" value={formData.phone} onChange={update} required /></>}
        <Field label="Adresse e-mail" name="email" type="email" autoComplete="email" value={formData.email} onChange={update} required />
        <div><div className="mb-2 flex items-center justify-between"><label htmlFor="auth-password" className="text-sm font-semibold">Mot de passe</label>{isLogin && <button type="button" onClick={handleForgotPassword} className="text-xs font-semibold text-[var(--primary)] underline underline-offset-4">Mot de passe oublié ?</button>}</div><div className="relative"><input id="auth-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete={isLogin ? 'current-password' : 'new-password'} minLength="8" required value={formData.password} onChange={update} className="min-h-11 w-full border border-[var(--border)] bg-white px-3 pr-12 text-base outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]" /><button type="button" aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'} onClick={() => setShowPassword((value) => !value)} className="absolute right-0 top-0 grid h-11 w-11 place-items-center text-[var(--gray)] hover:text-[var(--primary)]">{showPassword ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}</button></div>{!isLogin && <p className="mt-2 text-xs text-[var(--gray)]">Au moins 8 caractères.</p>}</div>
        <button type="submit" disabled={loading} className="inline-flex min-h-12 w-full items-center justify-center gap-2 bg-[var(--primary)] px-5 text-xs font-bold uppercase tracking-[.14em] text-white hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60">{loading && <Loader2 size={17} className="animate-spin" aria-hidden="true" />}{isLogin ? 'Se connecter' : 'Créer mon compte'}</button>
        <p className="pt-1 text-center text-sm text-[var(--gray)]">{isLogin ? 'Nouveau chez LOOKME ?' : 'Vous avez déjà un compte ?'} <button type="button" onClick={() => setIsLogin((value) => !value)} className="font-semibold text-[var(--primary)] underline underline-offset-4">{isLogin ? 'Créer un compte' : 'Se connecter'}</button></p>
      </form>
    </motion.section>
  </motion.div>}</AnimatePresence>
}

function Field({ label, name, type = 'text', ...props }) {
  const id = `auth-${name}`
  return <div><label htmlFor={id} className="mb-2 block text-sm font-semibold">{label}</label><input id={id} name={name} type={type} {...props} className="min-h-11 w-full border border-[var(--border)] bg-white px-3 text-base outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]" /></div>
}
