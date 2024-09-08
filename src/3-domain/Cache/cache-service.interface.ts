interface ICacheService {
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T, ttl?: number): Promise<void>;
    delete(key: string): Promise<void>;
}

class CacheKeys {
    static readonly USER_LIST = 'users:list';
}

export {
    ICacheService,
    CacheKeys
}