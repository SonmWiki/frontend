import {type Ref, ref} from "vue";

export default class ThemeService {
    theme: Ref<'dark' | 'light'> = ref(this.getLocalStorageTheme() ? this.getLocalStorageTheme()! : this.getPreferredTheme())

    getPreferredTheme(): 'dark' | 'light' {
        return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light'
    }

    getLocalStorageTheme(): 'dark' | 'light' | undefined {
        const value = localStorage.getItem('theme')
        return (value == 'dark' || value == 'light') ? value : undefined
    }

    switchTheme() {
        this.theme.value = this.theme.value == 'dark' ? 'light' : 'dark'
        localStorage.setItem('theme', this.theme.value)
        const linkElement: HTMLLinkElement | null = document.querySelector('link[id*="theme-link"]');
        linkElement!.href = `/themes/aura-${this.theme.value}-amber/theme.css`
    }

    setTheme() {
        const linkElement: HTMLLinkElement | null = document.querySelector('link[id*="theme-link"]');
        linkElement!.href = `/themes/aura-${this.theme.value}-amber/theme.css`
    }
}