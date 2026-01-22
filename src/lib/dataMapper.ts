import type { PortfolioItem } from "../data/portfolioData/portfolioData";
import type { SheetRow } from "./googleSheets";

// Re-defining internal types since some originals might be inferred or not exported perfectly
export interface Skill {
    name: string;
    level: number;
}
export interface SkillCategory {
    category: string;
    skills: Skill[];
}

export interface TimelineItem {
    year: string;
    title: string;
    description: string;
    type: "education" | "work" | "project" | "other" | "certification";
}

export interface ProfileData {
    name: string;
    title: string;
    description: string;
    image: string;
}

export const mapProfileData = (rows: SheetRow[]): ProfileData => {
    const profile: any = {};
    rows.forEach(row => {
        if (row.key && row.value) {
            profile[row.key] = row.value;
        }
    });
    // Default fallback
    return {
        name: profile.name || "",
        title: profile.title || "",
        description: profile.description || "",
        image: profile.image || "/sns_icon_round.png"
    };
};

export const mapSkillsData = (rows: SheetRow[]): SkillCategory[] => {
    const categories: { [key: string]: Skill[] } = {};
    
    rows.forEach(row => {
        const cat = row.category;
        const name = row.name;
        const level = parseInt(row.level, 10) || 0;
        
        if (!cat || !name) return;

        if (!categories[cat]) {
            categories[cat] = [];
        }
        categories[cat].push({ name, level });
    });

    return Object.keys(categories).map(cat => ({
        category: cat,
        skills: categories[cat]
    }));
};

export const mapTimelineData = (rows: SheetRow[]): TimelineItem[] => {
    return rows.map(row => ({
        year: row.year,
        title: row.title,
        description: row.description,
        type: row.type as any || "other"
    }));
};

export const mapPortfolioData = (rows: SheetRow[]): PortfolioItem[] => {
    return rows.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        thumbnail: row.thumbnail,
        tags: row.tags ? row.tags.split(',').map(t => t.trim()) : [],
        liveUrl: row.liveUrl,
        repoUrl: row.repoUrl
    }));
};
