import type { SheetRow } from "./googleSheets";

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  tags: string[];
  liveUrl?: string;
  repoUrl?: string;
  markdownFile?: string; // /projects/<id>.md など
}

export interface Skill {
    name: string;
    level: number;
    description?: string;
    experienceYears?: number;
    libraries?: string[];
    comment?: string;
    logo?: string;
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

export interface AnimeItem {
    id: string; 
    title: string;
    official_site_url: string;
    release_season: string;
    twitter_avatar_url: string;
    official_site_twitter_image_url: string;
}

export const mapProfileData = (rows: SheetRow[]): ProfileData => {
    const profile: any = {};
    rows.forEach(row => {
        if (row.key && row.value) {
            profile[row.key] = row.value;
        }
    });
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
        categories[cat].push({
            name,
            level,
            description: row.description || undefined,
            experienceYears: row.experienceYears ? parseInt(row.experienceYears, 10) : undefined,
            libraries: row.libraries ? row.libraries.split(',').map((l: string) => l.trim()).filter(Boolean) : undefined,
            comment: row.comment || undefined,
            logo: row.logo || undefined,
        });
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
        repoUrl: row.repoUrl,
        markdownFile: row.markdownFile || `/projects/${row.id}.md`,
    }));
};

export const mapAnimeData = (rows: SheetRow[]): AnimeItem[] => {
    return rows.map(row => ({
        id: row.id || "",
        title: row.title || "",
        official_site_url: row.official_site_url || "",
        release_season: row.release_season || "",
        twitter_avatar_url: row.twitter_avatar_url || "",
        official_site_twitter_image_url: row.official_site_twitter_image_url || ""
    }));
};
