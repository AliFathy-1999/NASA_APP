
type splitCharacterType = "/" | ":" | "-" | "." | " ";

enum cacheOption {
    USE_CACHE,
    NO_CACHE
}

type NasaEndpoint = 'search' | 'asset' | 'metadata' | 'captions' ;

interface NasaSearchParams {
    q?: string;
    center?: string;
    description?: string;
    description_508?: string;
    keywords?: string;
    location?: string;
    media_type?: string;
    nasa_id?: string;
    page?: number;
    page_size?: number;
    photographer?: string;
    secondary_creator?: string;
    title?: string;
    year_start?: string;
    year_end?: string;
}


export { 
    splitCharacterType,
    cacheOption,
    NasaEndpoint,
    NasaSearchParams 
}