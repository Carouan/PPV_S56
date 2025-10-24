'use strict';

var obsidian = require('obsidian');

/** OAuth2 endpoints */
const URL_OAUTH_AUTH = 'https://accounts.google.com/o/oauth2/v2/auth';
const URL_OAUTH_TOKEN = 'https://oauth2.googleapis.com/token';
/** Google People API endpoints */
const URL_PEOPLE_BASE = 'https://people.googleapis.com/v1';
const URL_PEOPLE_CONNECTIONS = `${URL_PEOPLE_BASE}/people/me/connections`;
const PERSONAL_FIELDS = `names,emailAddresses,phoneNumbers,birthdays,memberships,metadata,addresses,biographies,organizations`;
const URL_CONTACT_GROUPS = `${URL_PEOPLE_BASE}/contactGroups?pageSize=1000`;
/** OAuth2 defaults */
const URI_OATUH_REDIRECT = 'urn:ietf:wg:oauth:2.0:oob';
const URL_OAUTH_SCOPE = 'https://www.googleapis.com/auth/contacts.readonly';
/** External links */
const LINK_TO_MANUAL = 'https://scribehow.com/shared/Create_a_own_client_for_the_Obsidian_Google_Contacts_Plugin__s3EkgN37QZet_KSTej53Wg';
/** Plugin default settings */
const DEFAULT_SETTINGS = {
    clientId: '',
    clientSecret: '',
    accessToken: '',
    refreshToken: '',
    tokenExpiresAt: 0,
    contactsFolder: 'Contacts',
    noteTemplate: '# Notes\n',
    fileNamePrefix: '',
    propertyNamePrefix: '',
    syncLabel: '',
    syncIntervalMinutes: 0,
    syncOnStartup: false,
    trackSyncTime: false,
    organizationAsLink: false,
};

/**
 * Generates the Google OAuth2 authorization URL for user authentication.
 *
 * @param clientId - The OAuth2 client ID provided by Google.
 * @returns A complete URL string that initiates the OAuth2 authorization flow.
 */
function getAuthUrl(clientId) {
    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: URI_OATUH_REDIRECT,
        response_type: 'code',
        scope: URL_OAUTH_SCOPE,
    });
    return `${URL_OAUTH_AUTH}?${params.toString()}`;
}

/**
 * Language dictionaries for Russian translations.
 */
const ru = {
    'Here is the manual about creating your own client:': 'Инструкция по созданию собственного клиента:',
    manual: 'инструкция',
    'Google client ID': 'ID клиента Google',
    'Enter your client ID': 'Введите ваш ID клиента',
    'Google client secret': 'Секрет клиента Google',
    'Enter your client secret': 'Введите ваш секрет клиента',
    'Login with Google': 'Войти через Google',
    "Open Google's auth page in your browser": 'Откройте страницу авторизации Google в вашем браузере',
    Login: 'Вход',
    'Please enter your client ID first.': 'Пожалуйста, сначала введите ID клиента.',
    'Authorization code': 'Код авторизации',
    'Paste the code from Google after login': 'Вставьте код, полученный после входа в Google',
    'Paste code here': 'Вставьте код сюда',
    'Client ID and secret required.': 'Требуются ID клиента и секрет.',
    'Tokens saved!': 'Токены сохранены!',
    'Contacts folder': 'Папка с контактами',
    'Vault folder where contact notes will be stored': 'Папка хранилища, где будут сохраняться заметки контактов',
    'e.g. Contacts': 'например, Контакты',
    'Note template': 'Шаблон заметки',
    'Template to insert below the metadata block for new contact notes': 'Шаблон, вставляемый под метаданные новой заметки контакта',
    'e.g. # Notes\n\nWrite something here...': 'например, # Заметки\n\nНапишите что-нибудь...',
    'File name prefix': 'Префикс имени файла',
    'Prefix to add to the beginning of each contact file name': 'Префикс, добавляемый к имени файла контакта',
    'e.g. p ': 'например, p ',
    'Property name prefix': 'Префикс имени свойства',
    'Prefix to add to the beginning of each contact property name': 'Префикс, добавляемый к имени свойства контакта',
    'Label to sync': 'Лейблы для синхронизации',
    'If not empty, then only contacts with this label will synced': 'Если указана, синхронизируются только контакты с этим лейблом',
    'e.g. obsidian': 'например, obsidian',
    'Auto sync period': 'Период автосинхронизации',
    'Period in minutes. If 0, then never. 1 day = 1440': 'Период в минутах. Если 0, то никогда. 1 день = 1440',
    'e.g. 1440': 'например, 1440',
    'Sync on startup': 'Синхронизация при запуске',
    'Automatically sync contacts when the plugin is loaded.': 'Автоматически синхронизировать контакты при загрузке плагина.',
    'e.g. s_': 'например, s_',
    'Google auth': 'Google авторизация',
    'Google contacts synced!': 'Google контакты синхронизированы!',
    'Failed to obtain access token. Please re-authenticate.': 'Не удалось получить токен доступа. Пожалуйста, повторите аутентификацию.',
    'Track last sync time in notes': 'Отслеживать время последней синхронизации в заметках',
    'If enabled, the plugin will update the synced property in each note with the last synchronization time. This may cause performance issues with very large contact lists.': 'Если включено, плагин будет обновлять свойство синхронизации в каждой заметке с временем последней синхронизации. Это может вызвать проблемы с производительностью при очень больших списках контактов.',
};
/**
 * Language dictionaries for Latvian translations.
 */
const lv = {
    'Here is the manual about creating your own client:': 'Šeit ir rokasgrāmata klienta izveidei:',
    manual: 'rokasgrāmata',
    'Google client ID': 'Google klienta ID',
    'Enter your client ID': 'Ievadiet savu klienta ID',
    'Google client secret': 'Google klienta slepenais atslēga',
    'Enter your client secret': 'Ievadiet savu slepeno atslēgu',
    'Login with Google': 'Pieslēgties ar Google',
    "Open Google's auth page in your browser": 'Atveriet Google OAuth lapu pārlūkprogrammā',
    Login: 'Pieteikties',
    'Please enter your client ID first.': 'Lūdzu, vispirms ievadiet klienta ID.',
    'Authorization code': 'Autorizācijas kods',
    'Paste the code from Google after login': 'Ielīmējiet kodu no Google pēc pieteikšanās',
    'Paste code here': 'Ielīmējiet kodu šeit',
    'Client ID and secret required.': 'Nepieciešams klienta ID un slepenais atslēga.',
    'Tokens saved!': 'Žetoni saglabāti!',
    'Contacts folder': 'Kontaktpersonu mape',
    'Vault folder where contact notes will be stored': 'Mape, kurā tiks saglabātas kontaktpersonu piezīmes',
    'e.g. Contacts': 'piem., Contacts',
    'Note template': 'Piezīmes veidne',
    'Template to insert below the metadata block for new contact notes': 'Veidne, ko ievietot zem metadatu bloka jaunām kontaktu piezīmēm',
    'e.g. # Notes\n\nWrite something here...': 'piem., # Piezīmes\n\nRakstiet šeit...',
    'File name prefix': 'Faila nosaukuma prefikss',
    'Prefix to add to the beginning of each contact file name': 'Prefikss, ko pievienot kontaktu faila nosaukuma sākumā',
    'e.g. p ': 'piem., p ',
    'Property name prefix': 'Īpašības nosaukuma prefikss',
    'Prefix to add to the beginning of each contact property name': 'Prefikss, ko pievienot katras kontaktpersonas īpašības nosaukumam',
    'Label to sync': 'Etiķete sinhronizēšanai',
    'If not empty, then only contacts with this label will synced': 'Ja nav tukšs, tiks sinhronizēti tikai šīs etiķetes kontakti',
    'e.g. obsidian': 'piem., obsidian',
    'Auto sync period': 'Automātiskās sinhronizācijas periods',
    'Period in minutes. If 0, then never. 1 day = 1440': 'Periods minūtēs. Ja 0, tad nekad. 1 diena = 1440',
    'e.g. 1440': 'piem., 1440',
    'Sync on startup': 'Sinhronizēt startējot',
    'Automatically sync contacts when the plugin is loaded.': 'Automātiski sinhronizēt kontaktus, kad spraudnis tiek ielādēts.',
    'e.g. s_': 'piem., s_',
    'Google auth': 'Google autentifikācija',
    'Google contacts synced!': 'Google kontakti sinhronizēti!',
    'Failed to obtain access token. Please re-authenticate.': 'Neizdevās iegūt piekļuves tokenu. Lūdzu, atkārtoti autentificējieties.',
    'Track last sync time in notes': 'Sekot pēdējās sinhronizācijas laikam piezīmēs',
    'If enabled, the plugin will update the synced property in each note with the last synchronization time. This may cause performance issues with very large contact lists.': 'Ja iespējots, spraudnis atjauninās synced rekvizītu katrā piezīmē ar pēdējās sinhronizācijas laiku. Tas var radīt veiktspējas problēmas, ja kontaktu skaits ir ļoti liels.',
};
/**
 * Language dictionaries for English translations.
 */
const en = {
    'Here is the manual about creating your own client:': 'Here is the manual about creating your own client:',
    manual: 'manual',
    'Google client ID': 'Google client ID',
    'Enter your client ID': 'Enter your client ID',
    'Google client secret': 'Google client secret',
    'Enter your client secret': 'Enter your client secret',
    'Login with Google': 'Login with Google',
    "Open Google's auth page in your browser": "Open Google's auth page in your browser",
    Login: 'Login',
    'Please enter your client ID first.': 'Please enter your client ID first.',
    'Authorization code': 'Authorization code',
    'Paste the code from Google after login': 'Paste the code from Google after login',
    'Paste code here': 'Paste code here',
    'Client ID and secret required.': 'Client ID and secret required.',
    'Tokens saved!': 'Tokens saved!',
    'Contacts folder': 'Contacts folder',
    'Vault folder where contact notes will be stored': 'Vault folder where contact notes will be stored',
    'e.g. Contacts': 'e.g. Contacts',
    'Note template': 'Note template',
    'Template to insert below the metadata block for new contact notes': 'Template to insert below the metadata block for new contact notes',
    'e.g. # Notes\n\nWrite something here...': 'e.g. # Notes\n\nWrite something here...',
    'File name prefix': 'File name prefix',
    'Prefix to add to the beginning of each contact file name': 'Prefix to add to the beginning of each contact file name',
    'e.g. p ': 'e.g. p ',
    'Property name prefix': 'Property name prefix',
    'Prefix to add to the beginning of each contact property name': 'Prefix to add to the beginning of each contact property name',
    'Label to sync': 'Label to sync',
    'If not empty, then only contacts with this label will synced': 'If not empty, then only contacts with this label will synced',
    'e.g. obsidian': 'e.g. obsidian',
    'Auto sync period': 'Auto sync period',
    'Period in minutes. If 0, then never. 1 day = 1440': 'Period in minutes. If 0, then never. 1 day = 1440',
    'e.g. 1440': 'e.g. 1440',
    'Sync on startup': 'Sync on startup',
    'Automatically sync contacts when the plugin is loaded.': 'Automatically sync contacts when the plugin is loaded.',
    'Fallback to English': 'Fallback to English',
    'e.g. s_': 'e.g. s_',
    'Google auth': 'Google auth',
    'Google contacts synced!': 'Google contacts synced!',
    'Failed to obtain access token. Please re-authenticate.': 'Failed to obtain access token. Please re-authenticate.',
    'Track last sync time in notes': 'Track last sync time in notes',
    'If enabled, the plugin will update the synced property in each note with the last synchronization time. This may cause performance issues with very large contact lists.': 'If enabled, the plugin will update the synced property in each note with the last synchronization time. This may cause performance issues with very large contact lists.',
};

/**
 * Translator handles language selection and translation fallback.
 */
class Translator {
    constructor(language = 'en') {
        this.language = language;
    }
    /**
     * Sets the active language (e.g. 'ru' or 'en').
     */
    setLanguage(language) {
        this.language = language;
    }
    /**
     * Translates a key using the selected language.
     * Falls back to English if key is missing.
     * Returns the key itself if translation is not found at all.
     *
     * @param key - The translation key.
     * @returns The translated string.
     */
    t(key) {
        const dict = this.language === 'ru' ? ru : this.language === 'lv' ? lv : en;
        if (key in dict) {
            return dict[key];
        }
        if (key in en) {
            return en[key];
        }
        return key;
    }
}
// Singleton-like instance for general use
const translator = new Translator(obsidian.getLanguage()); // Default to the current Obsidian language
/**
 * Global translation function.
 *
 * @param key - The translation key.
 * @returns The translated string.
 */
function t(key) {
    return translator.t(key);
}

/**
 * FolderSuggest class for providing folder suggestions in Obsidian.
 * This class extends AbstractInputSuggest to create a custom suggestion provider
 * for folder paths in the Obsidian vault.
 */
class FolderSuggest extends obsidian.AbstractInputSuggest {
    /**
     * Constructs a FolderSuggest instance.
     *
     * @param app - The Obsidian app instance.
     * @param inputEl - The input element to attach the suggestions to.
     */
    constructor(app, inputEl) {
        super(app, inputEl);
        this.folders = this.getAllFolders();
        this.inputEl = inputEl;
    }
    /**
     * Returns the folder suggestions based on the input query.
     *
     * @param query - The input query to filter folder suggestions.
     * @returns An array of TFolder objects that match the query.
     */
    getSuggestions(query) {
        return this.folders.filter((folder) => folder.path.toLowerCase().includes(query.toLowerCase()));
    }
    /**
     * Renders the suggestion element for a folder.
     *
     * @param folder - The TFolder object to render.
     * @param el - The HTML element to render the suggestion into.
     */
    renderSuggestion(folder, el) {
        el.setText(folder.path);
    }
    /**
     * Handles the selection of a folder suggestion.
     *
     * @param folder - The selected TFolder object.
     */
    selectSuggestion(folder) {
        this.inputEl.value = folder.path;
        this.inputEl.trigger('input');
    }
    /**
     * Retrieves all folders in the vault.
     *
     * @returns An array of TFolder objects representing all folders in the vault.
     */
    getAllFolders() {
        const folders = [];
        const walk = (folder) => {
            folders.push(folder);
            for (const child of folder.children) {
                if (child instanceof obsidian.TFolder) {
                    walk(child);
                }
            }
        };
        walk(this.app.vault.getRoot());
        return folders;
    }
}

/**
 * Settings tab for the Google contacts sync plugin.
 * Allows the user to configure plugin options through the Obsidian settings UI.
 */
class ContactSyncSettingTab extends obsidian.PluginSettingTab {
    /**
     * Constructs the settings tab.
     * @param app The current Obsidian app instance.
     * @param plugin The instance of the GoogleContactsSyncPlugin.
     */
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    /**
     * Renders the plugin's settings UI in Obsidian's settings panel.
     */
    display() {
        const { containerEl } = this;
        containerEl.empty();
        const manual = document.createDocumentFragment();
        manual.append(t('Here is the manual about creating your own client:'), ' ', manual.createEl('a', {
            href: LINK_TO_MANUAL,
            text: t('manual'),
        }));
        new obsidian.Setting(containerEl)
            .setName(t('Contacts folder'))
            .setDesc(t('Vault folder where contact notes will be stored'))
            .addText((text) => {
            text
                .setPlaceholder(t('e.g. Contacts'))
                .setValue(this.plugin.settings.contactsFolder)
                .onChange(async (value) => {
                this.plugin.settings.contactsFolder = value.trim() || 'Contacts';
                await this.plugin.saveSettings();
            });
            new FolderSuggest(this.app, text.inputEl);
            return text;
        });
        new obsidian.Setting(containerEl)
            .setName(t('Note template'))
            .setDesc(t('Template to insert below the metadata block for new contact notes'))
            .addTextArea((text) => text
            .setPlaceholder(t('e.g. # Notes\n\nWrite something here...'))
            .setValue(this.plugin.settings.noteTemplate)
            .onChange(async (value) => {
            this.plugin.settings.noteTemplate = value;
            await this.plugin.saveSettings();
        }));
        new obsidian.Setting(containerEl)
            .setName(t('File name prefix'))
            .setDesc(t('Prefix to add to the beginning of each contact file name'))
            .addText((text) => text
            .setPlaceholder(t('e.g. p '))
            .setValue(this.plugin.settings.fileNamePrefix)
            .onChange(async (value) => {
            this.plugin.settings.fileNamePrefix = value;
            await this.plugin.saveSettings();
        }));
        new obsidian.Setting(containerEl)
            .setName(t('Property name prefix'))
            .setDesc(t('Prefix to add to the beginning of each contact property name'))
            .addText((text) => text
            .setPlaceholder(t('e.g. s_'))
            .setValue(this.plugin.settings.propertyNamePrefix)
            .onChange(async (value) => {
            this.plugin.settings.propertyNamePrefix = value;
            await this.plugin.saveSettings();
        }));
        new obsidian.Setting(containerEl)
            .setName(t('Organization as link'))
            .setDesc(t('Organization name will be stored as a obsidian link [[...]] instead of plain text'))
            .addToggle((toggle) => toggle
            .setValue(this.plugin.settings.organizationAsLink)
            .onChange(async (value) => {
            this.plugin.settings.organizationAsLink = value;
            await this.plugin.saveSettings();
        }));
        new obsidian.Setting(containerEl)
            .setName(t('Label to sync'))
            .setDesc(t('If not empty, then only contacts with this label will synced'))
            .addText((text) => text
            .setPlaceholder(t('e.g. obsidian'))
            .setValue(this.plugin.settings.syncLabel)
            .onChange(async (value) => {
            this.plugin.settings.syncLabel = value;
            await this.plugin.saveSettings();
        }));
        new obsidian.Setting(containerEl)
            .setName(t('Auto sync period'))
            .setDesc(t('Period in minutes. If 0, then never. 1 day = 1440'))
            .addText((text) => text
            .setPlaceholder(t('e.g. 1440'))
            .setValue(this.plugin.settings.syncIntervalMinutes.toString())
            .onChange(async (value) => {
            const parsed = parseInt(value);
            if (!isNaN(parsed) && parsed > 0) {
                this.plugin.settings.syncIntervalMinutes = parsed;
                this.plugin.setupAutoSync();
            }
            else {
                this.plugin.settings.syncIntervalMinutes = 0;
            }
            await this.plugin.saveSettings();
            this.plugin.setupAutoSync();
        }));
        new obsidian.Setting(containerEl)
            .setName(t('Sync on startup'))
            .setDesc(t('Automatically sync contacts when the plugin is loaded.'))
            .addToggle((toggle) => toggle
            .setValue(this.plugin.settings.syncOnStartup)
            .onChange(async (value) => {
            this.plugin.settings.syncOnStartup = value;
            await this.plugin.saveSettings();
        }));
        new obsidian.Setting(containerEl)
            .setName(t('Track last sync time in notes'))
            .setDesc(t('If enabled, the plugin will update the synced property in each note with the last synchronization time. This may cause performance issues with very large contact lists.'))
            .addToggle((toggle) => toggle
            .setValue(this.plugin.settings.trackSyncTime)
            .onChange(async (value) => {
            this.plugin.settings.trackSyncTime = value;
            await this.plugin.saveSettings();
        }));
        new obsidian.Setting(containerEl).setName(t('Google auth')).setHeading();
        new obsidian.Setting(containerEl)
            .setName(t('Google client ID'))
            .setDesc(manual)
            .addText((text) => text
            .setPlaceholder(t('Enter your client ID'))
            .setValue(this.plugin.settings.clientId)
            .onChange(async (value) => {
            var _a;
            this.plugin.settings.clientId = value;
            await this.plugin.saveSettings();
            (_a = this.plugin.auth) === null || _a === void 0 ? void 0 : _a.updateSettings(this.plugin.settings);
        }));
        new obsidian.Setting(containerEl)
            .setName(t('Google client secret'))
            .addText((text) => text
            .setPlaceholder(t('Enter your client secret'))
            .setValue(this.plugin.settings.clientSecret)
            .onChange(async (value) => {
            var _a;
            this.plugin.settings.clientSecret = value;
            await this.plugin.saveSettings();
            (_a = this.plugin.auth) === null || _a === void 0 ? void 0 : _a.updateSettings(this.plugin.settings);
        }));
        new obsidian.Setting(containerEl)
            .setName(t('Login with Google'))
            .setDesc(t("Open Google's auth page in your browser"))
            .addButton((btn) => btn.setButtonText(t('Login')).onClick(() => {
            if (!this.plugin.settings.clientId) {
                new obsidian.Notice(t('Please enter your client ID first.'));
                return;
            }
            window.open(getAuthUrl(this.plugin.settings.clientId), '_blank');
        }));
        new obsidian.Setting(containerEl)
            .setName(t('Authorization code'))
            .setDesc(t('Paste the code from Google after login'))
            .addText((text) => text.setPlaceholder(t('Paste code here')).onChange(async (code) => {
            if (!this.plugin.settings.clientId ||
                !this.plugin.settings.clientSecret ||
                !this.plugin.auth) {
                new obsidian.Notice(t('Client ID and secret required.'));
                return;
            }
            try {
                await this.plugin.auth.exchangeCode(code);
            }
            catch (error) {
                console.error('Failed to exchange code:', JSON.stringify(error, null, 2));
                new obsidian.Notice(t('Failed to exchange code. Check console for details.'));
                return;
            }
            Object.assign(this.plugin.settings, this.plugin.auth.getSettingsUpdate());
            await this.plugin.saveSettings();
            new obsidian.Notice(t('Tokens saved!'));
        }));
    }
}

/**
 * Manages OAuth2 authentication for accessing the Google contacts API.
 * Handles exchanging authorization codes, refreshing access tokens,
 * and providing updated credentials.
 */
class AuthManager {
    /**
     * Creates a new AuthManager instance using saved authentication settings.
     *
     * @param settings - The authentication and client configuration.
     */
    constructor(settings) {
        this.clientId = settings.clientId;
        this.clientSecret = settings.clientSecret;
        this.accessToken = settings.accessToken;
        this.refreshToken = settings.refreshToken;
        this.tokenExpiresAt = settings.tokenExpiresAt;
    }
    /**
     * Exchanges an authorization code for access and refresh tokens.
     *
     * @param code - The authorization code received from the OAuth flow.
     * @returns A promise that resolves when tokens have been successfully obtained.
     */
    async exchangeCode(code) {
        const body = {
            code: code,
            client_id: this.clientId,
            client_secret: this.clientSecret,
            redirect_uri: URI_OATUH_REDIRECT,
            grant_type: 'authorization_code',
        };
        const response = await obsidian.requestUrl({
            url: URL_OAUTH_TOKEN,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        const data = await response.json;
        this.accessToken = await data.access_token;
        this.refreshToken = (await data.refresh_token) || this.refreshToken;
        this.tokenExpiresAt = Date.now() + (await data.expires_in) * 1000;
    }
    /**
     * Ensures the access token is valid and refreshes it if expired.
     *
     * @returns A promise that resolves to a valid access token.
     */
    async ensureValidToken() {
        if (!this.accessToken || Date.now() > this.tokenExpiresAt) {
            await this.refreshTokenFlow();
        }
        return this.accessToken;
    }
    /**
     * Refreshes the access token using the refresh token.
     * Throws an error if the refresh token is missing or the request fails.
     *
     * @private
     * @returns A promise that resolves when the token has been refreshed.
     */
    async refreshTokenFlow() {
        if (!this.refreshToken) {
            throw new Error('No refresh token available');
        }
        try {
            const response = await obsidian.requestUrl({
                url: URL_OAUTH_TOKEN,
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    client_id: this.clientId,
                    client_secret: this.clientSecret,
                    refresh_token: this.refreshToken,
                    grant_type: 'refresh_token',
                }).toString(),
            });
            const data = await response.json;
            if (!data.access_token) {
                throw new Error('Failed to refresh token');
            }
            this.accessToken = data.access_token;
            this.tokenExpiresAt = Date.now() + data.expires_in * 1000;
        }
        catch (error) {
            console.error('Failed to refresh access token', JSON.stringify(error, null, 2));
            throw new Error('Failed to refresh token');
        }
    }
    /**
     * Returns updated authentication-related settings that can be saved.
     *
     * @returns A partial settings object containing updated tokens and expiry.
     */
    getSettingsUpdate() {
        return {
            accessToken: this.accessToken,
            refreshToken: this.refreshToken,
            tokenExpiresAt: this.tokenExpiresAt,
        };
    }
    updateSettings(settings) {
        this.clientId = settings.clientId;
        this.clientSecret = settings.clientSecret;
        this.accessToken = settings.accessToken;
        this.refreshToken = settings.refreshToken;
        this.tokenExpiresAt = settings.tokenExpiresAt;
    }
}

/**
 * Core service responsible for interacting with Google contacts and Contact Groups APIs.
 *
 * Encapsulates logic for fetching, processing, and transforming Google contact data.
 * Designed to be used by higher-level plugin components to separate external API concerns
 * from application and Obsidian-specific logic.
 */
class GoogleContactsService {
    //   constructor(private token: string) {}
    /**
     * Fetches the list of Google contacts using the provided access token.
     * @param token OAuth access token.
     * @returns An array of Google contact objects.
     */
    async fetchGoogleContacts(token) {
        let allContacts = [];
        let nextPageToken = undefined;
        let data = {
            connections: [],
            nextPageToken: undefined,
        };
        do {
            const url = `${URL_PEOPLE_CONNECTIONS}?personFields=${PERSONAL_FIELDS}&pageSize=1000${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
            try {
                const res = await obsidian.requestUrl({
                    url,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                data = await res.json;
            }
            catch (error) {
                console.error('Failed to fetch Google contacts', JSON.stringify(error, null, 2));
                data = {
                    connections: [],
                    nextPageToken: undefined,
                };
            }
            allContacts = allContacts.concat(data.connections || []);
            nextPageToken = data.nextPageToken;
        } while (nextPageToken);
        return allContacts;
    }
    /**
     * Fetches contact groups and returns a mapping of lowercase group name → group ID.
     * @param token OAuth access token.
     * @returns Record mapping lowercase group names to their resource IDs.
     */
    async fetchGoogleGroups(token) {
        const groupResponse = await obsidian.requestUrl({
            url: URL_CONTACT_GROUPS,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await groupResponse.json;
        if (!Array.isArray(data.contactGroups)) {
            return {};
        }
        const contactGroups = data.contactGroups;
        const labelMap = {};
        contactGroups.forEach((group) => {
            if (group.name && group.resourceName) {
                labelMap[group.name.toLowerCase()] = group.resourceName.replace('contactGroups/', '');
            }
        });
        return labelMap;
    }
}

/**
 * Recursively retrieves all markdown files in the specified folder.
 * @param folder The root folder to search within.
 * @returns An array of markdown files.
 */
function getAllMarkdownFilesInFolder(folder) {
    let files = [];
    for (const child of folder.children) {
        if (child instanceof obsidian.TFolder) {
            files = files.concat(getAllMarkdownFilesInFolder(child));
        }
        else if (child instanceof obsidian.TFile && child.extension === 'md') {
            files.push(child);
        }
    }
    return files;
}

/**
 * Formatter class for transforming Google contact data into a format suitable for Obsidian frontmatter.
 */
class Formatter {
    /**
     * Adds the name field from the contact to the frontmatter lines.
     *
     * @param frontmatterLines - The object representing the frontmatter fields to update.
     * @param contact - The Google contact containing name information.
     * @param propertyPrefix - The prefix to prepend to the field name.
     */
    addNameField(frontmatterLines, contact, propertyPrefix) {
        this.addContactFieldToFrontmatter(frontmatterLines, contact.names, 'name', propertyPrefix, (item) => item.displayName);
    }
    /**
     * Adds the email field(s) from the contact to the frontmatter lines.
     *
     * @param frontmatterLines - The object representing the frontmatter fields to update.
     * @param contact - The Google contact containing email information.
     * @param propertyPrefix - The prefix to prepend to the field name.
     */
    addEmailField(frontmatterLines, contact, propertyPrefix) {
        this.addContactFieldToFrontmatter(frontmatterLines, contact.emailAddresses, 'email', propertyPrefix, (item) => item.value);
    }
    /**
     * Adds the phone field(s) from the contact to the frontmatter lines.
     *
     * @param frontmatterLines - The object representing the frontmatter fields to update.
     * @param contact - The Google contact containing phone number information.
     * @param propertyPrefix - The prefix to prepend to the field name.
     */
    addPhoneField(frontmatterLines, contact, propertyPrefix) {
        this.addContactFieldToFrontmatter(frontmatterLines, contact.phoneNumbers, 'phone', propertyPrefix, (item) => item.value);
    }
    /**
     * Adds the biography field(s) from the contact to the frontmatter lines.
     *
     * @param frontmatterLines - The object representing the frontmatter fields to update.
     * @param contact - The Google contact containing biography information.
     * @param propertyPrefix - The prefix to prepend to the field name.
     */
    addBioField(frontmatterLines, contact, propertyPrefix) {
        this.addContactFieldToFrontmatter(frontmatterLines, contact.biographies, 'biographies', propertyPrefix, (item) => item.value);
    }
    /**
     * Adds address field(s) from the contact to the frontmatter lines.
     * Handles multiple addresses and appends a suffix to each additional field.
     *
     * @param frontmatterLines - The object representing the frontmatter fields to update.
     * @param contact - The Google contact containing address information.
     * @param propertyPrefix - The prefix to prepend to the field name.
     */
    addAddressFields(frontmatterLines, contact, propertyPrefix) {
        this.addContactFieldToFrontmatter(frontmatterLines, contact.addresses, 'address', propertyPrefix, (item) => item.formattedValue);
    }
    /**
     * Adds organization field(s) from the contact to the frontmatter lines.
     * Handles multiple organizations and appends a suffix to each additional field.
     *
     * @param frontmatterLines - The object representing the frontmatter fields to update.
     * @param contact - The Google contact containing organization information.
     * @param propertyPrefix - The prefix to prepend to the field name.
     * @param organizationAsLink - Whether to format organization names as Obsidian links.
     * @returns void
     */
    addOrganizationFields(frontmatterLines, contact, propertyPrefix, organizationAsLink = false) {
        this.addContactFieldToFrontmatter(frontmatterLines, contact.organizations, 'organization', propertyPrefix, (item) => item.name, (value) => {
            if (organizationAsLink) {
                return `[[${value}]]`;
            }
            return value;
        });
    }
    /**
     * Adds job title field(s) from the contact to the frontmatter lines.
     * Handles multiple job titles and appends a suffix to each additional field.
     *
     * @param frontmatterLines - The object representing the frontmatter fields to update.
     * @param contact - The Google contact containing job title information.
     * @param propertyPrefix - The prefix to prepend to the field name.
     */
    addJobTitleFields(frontmatterLines, contact, propertyPrefix) {
        this.addContactFieldToFrontmatter(frontmatterLines, contact.organizations, 'jobtitle', propertyPrefix, (item) => item.title);
    }
    /**
     * Adds department field(s) from the contact to the frontmatter lines.
     * Handles multiple departments and appends a suffix to each additional field.
     *
     * @param frontmatterLines - The object representing the frontmatter fields to update.
     * @param contact - The Google contact containing department information.
     * @param propertyPrefix - The prefix to prepend to the field name.
     */
    addDepartmentFields(frontmatterLines, contact, propertyPrefix) {
        this.addContactFieldToFrontmatter(frontmatterLines, contact.organizations, 'department', propertyPrefix, (item) => item.department);
    }
    /**
     * Adds birthday field(s) from the contact to the frontmatter lines.
     * Handles multiple birthdays and appends a suffix to each additional field.
     *
     * @param frontmatterLines - The object representing the frontmatter fields to update.
     * @param contact - The Google contact containing birthday information.
     * @param propertyPrefix - The prefix to prepend to the field name.
     */
    addBirthdayFields(frontmatterLines, contact, propertyPrefix) {
        if (contact.birthdays && contact.birthdays.length > 0) {
            contact.birthdays.forEach((bday, index) => {
                var _a;
                const date = bday.date;
                const ending = index === 0 ? '' : `_${index + 1}`;
                if (date) {
                    const birthdayStr = `${(_a = date.year) !== null && _a !== void 0 ? _a : 'XXXX'}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
                    frontmatterLines[`${propertyPrefix}birthday${ending}`] = birthdayStr;
                }
            });
        }
    }
    /**
     * Adds labels from the contact to the frontmatter lines.
     * Handles multiple labels and appends a suffix to each additional field.
     *
     * @param frontmatterLines - The object representing the frontmatter fields to update.
     * @param contact - The Google contact containing label information.
     * @param propertyPrefix - The prefix to prepend to the field name.
     * @param labelMap - A mapping of label IDs to their corresponding names.
     */
    addLabels(frontmatterLines, contact, propertyPrefix, labelMap) {
        if (contact.memberships && contact.memberships.length > 0) {
            const labels = [];
            contact.memberships.forEach((m) => {
                var _a;
                const groupId = (_a = m.contactGroupMembership) === null || _a === void 0 ? void 0 : _a.contactGroupId;
                if (groupId) {
                    labels.push(labelMap[groupId]);
                }
            });
            if (labels.length > 0) {
                frontmatterLines[`${propertyPrefix}labels`] = labels;
            }
        }
    }
    /**
     * Adds extracted contact field values to frontmatter with proper formatting.
     * @param frontmatter Frontmatter object to modify.
     * @param contact Contact array from which to extract values.
     * @param keyName Field key (e.g., "email", "phone").
     * @param propertyPrefix Prefix to apply to each field name in frontmatter.
     * @param valueExtractor Function to extract a string value from each item.
     */
    addContactFieldToFrontmatter(frontmatter, contact, keyName, propertyPrefix, valueExtractor, valueTransformet = (value) => value) {
        if (!contact || contact.length === 0)
            return;
        contact.forEach((item, index) => {
            const rawValue = valueExtractor(item);
            const value = String(rawValue || '');
            if (value === '')
                return;
            const suffix = index === 0 ? '' : `_${index + 1}`;
            frontmatter[`${propertyPrefix}${keyName}${suffix}`] =
                valueTransformet(value);
        });
    }
}

// src/services/VaultService.ts
/**
 * Service class for interacting with the Obsidian Vault.
 * Encapsulates file and folder operations to facilitate testing and decouple from direct API usage.
 */
class VaultService {
    /**
     * Creates an instance of VaultService.
     *
     * @param vault - The Obsidian Vault instance to operate on.
     */
    constructor(vault) {
        this.vault = vault;
    }
    /**
     * Ensures that a folder exists at the given path, creating it if necessary.
     *
     * @param folderPath - The path of the folder to create.
     */
    async createFolderIfNotExists(folderPath) {
        const normalizedPath = obsidian.normalizePath(folderPath);
        await this.vault.createFolder(normalizedPath).catch(() => { });
    }
    /**
     * Retrieves a file from the vault by its path.
     *
     * @param filePath - The path of the file to retrieve.
     * @returns The TFile if found, or null.
     */
    async getFileByPath(filePath) {
        return this.vault.getFileByPath(filePath);
    }
    /**
     * Retrieves a folder from the vault by its path.
     *
     * @param folderPath - The path of the folder to retrieve.
     * @returns The TFolder if found, or null.
     */
    getFolderByPath(folderPath) {
        return this.vault.getFolderByPath(folderPath);
    }
    /**
     * Creates a new file with the given content.
     *
     * @param filePath - The path for the new file.
     * @param content - The initial content of the file.
     * @returns The created TFile.
     */
    async createFile(filePath, content) {
        const normalizedPath = obsidian.normalizePath(filePath);
        return await this.vault.create(normalizedPath, content);
    }
}

/**
 * Responsible for creating and updating contact notes in the vault.
 * Handles writing new notes and updating existing ones based on contact metadata.
 */
class ContactNoteWriter {
    /**
     * Creates an instance of ContactNoteWriter.
     *
     * @param vault - The Obsidian Vault instance to operate on.
     * @param metadataCache - The Obsidian MetadataCache instance to operate on.
     * @param fileManager - The Obsidian FileManager instance to operate on.
     */
    constructor(vault, metadataCache, fileManager) {
        /**
         * The Formatter instance used for formatting contact data into frontmatter.
         *
         * This protected property is used to format contact data into a suitable format for Obsidian frontmatter.
         */
        this.formatter = new Formatter();
        this.vaultService = new VaultService(vault);
        this.metadataCache = metadataCache;
        this.fileManager = fileManager;
    }
    /**
     * Writes notes for the provided contacts based on the specified configuration.
     *
     * @param config - The configuration for writing contact notes.
     * @param labelMap - A mapping of label names to their corresponding group IDs.
     * @param contacts - The list of Google contacts to write notes for.
     */
    async writeNotesForContacts(config, labelMap, contacts) {
        await this.vaultService.createFolderIfNotExists(config.folderPath);
        const folder = this.vaultService.getFolderByPath(config.folderPath);
        if (!folder)
            return;
        const files = getAllMarkdownFilesInFolder(folder);
        const filesIdMapping = await this.scanFiles(files, config.propertyPrefix);
        const invertedLabelMap = Object.fromEntries(Object.entries(labelMap).map((a) => a.reverse()));
        for (const contact of contacts) {
            if (!this.hasSyncLabel(contact, config.syncLabel, labelMap))
                continue;
            const id = this.getContactId(contact);
            if (!id)
                continue;
            const filename = this.getFilename(contact, id, config.folderPath, config.prefix);
            if (!filename)
                continue;
            await this.fileManager.processFrontMatter(filesIdMapping[id] ||
                (await this.vaultService.getFileByPath(filename)) ||
                (await this.vaultService.createFile(filename, config.noteBody)), this.processFrontMatter(this.generateFrontmatterLines(config.propertyPrefix, contact, invertedLabelMap, config.organizationAsLink, config.trackSyncTime)));
        }
    }
    /**
     * Generates a filename for the contact note based on the contact's display name and ID.
     *
     * @param contact - The Google contact to generate a filename for.
     * @param id - The contact ID.
     * @param folderPath - The folder path where the note will be stored.
     * @param prefix - The prefix to use for the filename.
     * @returns The generated filename, or null if the name is not available.
     */
    getFilename(contact, id, folderPath, prefix) {
        var _a, _b;
        const name = ((_b = (_a = contact.names) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.displayName) || id;
        if (!name)
            return null;
        const safeName = name.replace(/[\\/:*?"<>|]/g, '_');
        const filename = obsidian.normalizePath(`${folderPath}/${prefix}${safeName}.md`);
        return filename;
    }
    /**
     * Processes the frontmatter lines and updates the frontmatter of the given file.
     *
     * @param frontmatterLines - The frontmatter lines to process.
     * @returns A function that takes a frontmatter object and updates it with the provided lines.
     */
    processFrontMatter(frontmatterLines) {
        return (frontmatter) => {
            for (const key in frontmatterLines) {
                frontmatter[key] = frontmatterLines[key];
            }
        };
    }
    /**
     * Extracts the contact ID from a Google contact object.
     *
     * @param contact - The Google contact to extract the ID from.
     * @returns The extracted contact ID, or null if not found.
     */
    getContactId(contact) {
        if (!contact.resourceName)
            return null;
        return contact.resourceName.split('/').pop() || null;
    }
    /**
     * Generates frontmatter lines for a contact based on the provided property prefix and contact data.
     *
     * @param propertyPrefix - The prefix to use for frontmatter properties.
     * @param contact - The Google contact to generate frontmatter for.
     * @param invertedLabelMap - A mapping of label names to their corresponding group IDs.
     * @param organizationAsLink - Whether to format organization names as Obsidian links.
     * @returns A record of frontmatter properties and their values.
     */
    generateFrontmatterLines(propertyPrefix, contact, invertedLabelMap, organizationAsLink = false, trackSyncTime = false) {
        const frontmatterLines = {
            [`${propertyPrefix}id`]: String(this.getContactId(contact)),
        };
        if (trackSyncTime) {
            frontmatterLines[`${propertyPrefix}synced`] = String(new Date().toISOString());
        }
        this.formatter.addNameField(frontmatterLines, contact, propertyPrefix);
        this.formatter.addEmailField(frontmatterLines, contact, propertyPrefix);
        this.formatter.addPhoneField(frontmatterLines, contact, propertyPrefix);
        this.formatter.addAddressFields(frontmatterLines, contact, propertyPrefix);
        this.formatter.addBioField(frontmatterLines, contact, propertyPrefix);
        this.formatter.addOrganizationFields(frontmatterLines, contact, propertyPrefix, organizationAsLink);
        this.formatter.addJobTitleFields(frontmatterLines, contact, propertyPrefix);
        this.formatter.addDepartmentFields(frontmatterLines, contact, propertyPrefix);
        this.formatter.addBirthdayFields(frontmatterLines, contact, propertyPrefix);
        this.formatter.addLabels(frontmatterLines, contact, propertyPrefix, invertedLabelMap);
        return frontmatterLines;
    }
    /**
     * Checks if a Google contact has the specified sync label.
     *
     * @param contact - The Google contact to check.
     * @param syncLabel - The label to check for.
     * @param labelMap - A mapping of label names to their corresponding group IDs.
     * @returns True if the contact has the label, false otherwise.
     */
    hasSyncLabel(contact, syncLabel, labelMap) {
        if (!syncLabel)
            return true;
        const targetGroupId = labelMap[syncLabel];
        return (contact.memberships || []).some((m) => { var _a; return ((_a = m.contactGroupMembership) === null || _a === void 0 ? void 0 : _a.contactGroupId) === targetGroupId; });
    }
    /**
     * Scans the provided files for frontmatter properties matching the specified prefix.
     *
     * @param files - The list of TFile objects to scan.
     * @param propertyPrefix - The prefix to use for identifying frontmatter properties.
     * @returns A mapping of property values to TFile objects.
     */
    async scanFiles(files, propertyPrefix) {
        var _a;
        const idToFileMapping = {};
        for (const file of files) {
            const frontmatter = (_a = this.metadataCache.getFileCache(file)) === null || _a === void 0 ? void 0 : _a.frontmatter;
            const idFieldName = `${propertyPrefix}id`;
            if (frontmatter && frontmatter[idFieldName]) {
                idToFileMapping[frontmatter[idFieldName]] = file;
            }
        }
        return idToFileMapping;
    }
}

/**
 * Obsidian plugin for synchronizing contacts from Google contacts into markdown notes.
 */
class GoogleContactsSyncPlugin extends obsidian.Plugin {
    constructor() {
        super(...arguments);
        /** Plugin settings loaded from user config */
        this.settings = DEFAULT_SETTINGS;
        /** Manages OAuth token exchange and refresh */
        this.auth = null;
        /**
         * Service layer handling communication with the Google contacts API.
         * Used to fetch contacts and groups, separate from Obsidian-specific logic.
         */
        this.googleService = null;
        /** Handles writing contact notes to the vault */
        this.noteWriter = null;
        /** ID of the interval used for periodic sync */
        this.syncIntervalId = null;
    }
    /**
     * Called when the plugin is loaded by Obsidian.
     */
    async onload() {
        this.addCommand({
            id: 'sync',
            name: 'Sync',
            callback: () => this.syncContacts(),
        });
        await this.loadSettings();
        this.auth = new AuthManager(this.settings);
        this.addSettingTab(new ContactSyncSettingTab(this.app, this));
        this.googleService = new GoogleContactsService();
        this.noteWriter = new ContactNoteWriter(this.app.vault, this.app.metadataCache, this.app.fileManager);
        if (this.settings.syncOnStartup || this.shouldSyncNow()) {
            this.syncContacts();
        }
        this.setupAutoSync();
    }
    async onunload() {
        if (this.syncIntervalId)
            clearInterval(this.syncIntervalId);
    }
    /**
     * Sets up automatic periodic syncing using setInterval based on plugin settings.
     */
    setupAutoSync() {
        if (this.syncIntervalId)
            clearInterval(this.syncIntervalId);
        const interval = this.settings.syncIntervalMinutes;
        if (interval > 0) {
            this.registerInterval(window.setInterval(() => {
                if (this.shouldSyncNow()) {
                    this.syncContacts();
                }
            }, interval * 60 * 1000));
        }
    }
    /**
     * Determines whether syncing should be triggered based on the last sync time and interval.
     * @returns True if sync should be triggered now, false otherwise.
     */
    shouldSyncNow() {
        const { lastSyncTime, syncIntervalMinutes } = this.settings;
        if (syncIntervalMinutes === 0)
            return false;
        if (!lastSyncTime)
            return true;
        const last = new Date(lastSyncTime).getTime();
        const now = Date.now();
        const diffMinutes = (now - last) / 1000 / 60;
        return diffMinutes >= syncIntervalMinutes;
    }
    /**
     * Performs the contact synchronization process: fetching, processing, and saving contact notes.
     */
    async syncContacts() {
        var _a, _b, _c, _d;
        this.updateLastSyncTime();
        const token = await ((_a = this.auth) === null || _a === void 0 ? void 0 : _a.ensureValidToken());
        if (!token) {
            new obsidian.Notice(t('Failed to obtain access token. Please re-authenticate.'));
            return;
        }
        this.updateAuthSettings();
        let labelMap = {};
        try {
            labelMap = (await ((_b = this.googleService) === null || _b === void 0 ? void 0 : _b.fetchGoogleGroups(token))) || {};
        }
        catch (error) {
            console.error('Failed to fetch Google groups', JSON.stringify(error, null, 2));
            new obsidian.Notice(t('Failed to fetch Google groups. Check console for details.'));
            return;
        }
        let contacts = [];
        try {
            contacts = (await ((_c = this.googleService) === null || _c === void 0 ? void 0 : _c.fetchGoogleContacts(token))) || [];
        }
        catch (error) {
            console.error('Failed to fetch Google contacts', JSON.stringify(error, null, 2));
            new obsidian.Notice(t('Failed to fetch Google contacts. Check console for details.'));
            return;
        }
        const config = {
            folderPath: this.settings.contactsFolder,
            prefix: this.settings.fileNamePrefix || '',
            propertyPrefix: this.settings.propertyNamePrefix || '',
            syncLabel: this.settings.syncLabel,
            noteBody: this.settings.noteTemplate || '# Notes\n',
            organizationAsLink: this.settings.organizationAsLink,
            trackSyncTime: this.settings.trackSyncTime,
        };
        await ((_d = this.noteWriter) === null || _d === void 0 ? void 0 : _d.writeNotesForContacts(config, labelMap, contacts));
        new obsidian.Notice(t('Google contacts synced!'));
    }
    /**
     * Updates the last synchronization timestamp and saves the updated plugin settings.
     * This should be called after a successful sync to persist the last sync time.
     */
    async updateLastSyncTime() {
        this.settings.lastSyncTime = new Date().toISOString();
        await this.saveSettings();
    }
    /**
     * Updates the plugin settings with the latest authentication tokens from the AuthManager
     * and persists them to the plugin storage.
     */
    async updateAuthSettings() {
        var _a;
        Object.assign(this.settings, (_a = this.auth) === null || _a === void 0 ? void 0 : _a.getSettingsUpdate());
        await this.saveSettings();
    }
    /**
     * Loads plugin settings from disk, applying defaults as needed.
     */
    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }
    /**
     * Saves current plugin settings to disk.
     */
    async saveSettings() {
        await this.saveData(this.settings);
    }
}

module.exports = GoogleContactsSyncPlugin;
//# sourceMappingURL=main.js.map

/* nosourcemap */