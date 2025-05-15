import { fetchActiveTheme } from "./api.js";

let currentTheme = null;

// Get theme
export async function getTheme() {
    try {
        const themeData = await fetchActiveTheme();
        currentTheme = themeData;

        applyTheme(themeData);
    } catch (error) {
        console.error('Error fetching theme:', error);

        applyDefaultTheme();
    }
};
// Apply theme
function applyTheme(theme) {
    if (!theme) {
        applyDefaultTheme();
        return;
    }

    const {
        BackgroundColor,
        PrimaryColor,
        SecondaryColor,
        TextColor,
        AccentColor,
        Img

    } = theme;

    document.documentElement.style.setProperty('--background-color', BackgroundColor);
    document.documentElement.style.setProperty('--primary-color', PrimaryColor);
    document.documentElement.style.setProperty('--secondary-color', SecondaryColor);
    document.documentElement.style.setProperty('--text-color', TextColor);
    document.documentElement.style.setProperty('--accent-color', AccentColor);
    
    let loginImageUrl = '';

    if (Img && Img.url) {
        loginImageUrl = 'http://localhost:1337' + Img.url;
    }
    
    const loginImage = document.querySelector('.login-image img , .register-image img');
    if (loginImage) {
        loginImage.src = loginImageUrl;
    }

    document.body.style.backgroundColor = BackgroundColor;
    document.body.style.color = TextColor;

    document.body.className = '';
    document.body.classList.add(`theme-${theme.id}`);
}
// If no theme is found
    function applyDefaultTheme() {
        const defaultTheme = {
            backgroundColor: '#F8F9FA',
            primaryColor: '#3563E9',
            secondaryColor: '#6E84A3',
            textColor: '#1A202C',
            accentColor: '#FF6B6B'
        };
        
        document.documentElement.style.setProperty('--background-color', defaultTheme.backgroundColor);
        document.documentElement.style.setProperty('--primary-color', defaultTheme.primaryColor);
        document.documentElement.style.setProperty('--secondary-color', defaultTheme.secondaryColor);
        document.documentElement.style.setProperty('--text-color', defaultTheme.textColor);
        document.documentElement.style.setProperty('--accent-color', defaultTheme.accentColor);
        
        document.body.style.backgroundColor = defaultTheme.backgroundColor;
        document.body.style.color = defaultTheme.textColor;
        
        document.body.className = '';
        document.body.classList.add('theme-default');
}
    export function getCurrentTheme() {
        return currentTheme;
}
