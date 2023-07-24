export type DefinitionTrimmed = Definition & {
    _id: string;
};

export type ComponentCoordinates = {
    name: string;
    namespace: string;
    provider: string;
    revision: string;
    type: string;
};

export type Definition = {
    _meta: {
        schemaVersion: string;
        updated: string;
    };
    coordinates: ComponentCoordinates;
    described: {
        files: number;
        hashes: {
            sha1: string;
            sha256: string;
        };
        projectWebsite: string;
        releaseDate: string;
        score: {
            date: number;
            source: number;
            total: number;
        };
        sourceLocation: {
            name: string;
            namespace: string;
            provider: string;
            revision: string;
            type: string;
            url: string;
        };
        tools: string[];
        toolScore: {
            date: number;
            source: number;
            total: number;
        };
        urls: {
            download: string;
            registry: string;
            version: string;
        };
    };
    licensed: {
        declared: string;
        facets: {
            core: {
                attribution: {
                    parties: string[];
                    unknown: number;
                };
                discovered: {
                    expressions: string[];
                    unknown: number;
                };
                files: number;
            };
        };
    };
    scores: {
        effective: number;
        tool: number;
    };
};
