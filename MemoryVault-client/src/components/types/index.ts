export interface Note {
    id: string; 
    body: Record<string, any>;
    timestamp: string;
    lastUpdatedAt: string;
    Tags: Tag[]
}

export interface Tag {
    id: string;
    name: string;
}